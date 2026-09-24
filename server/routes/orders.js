import { Router } from 'express';
import crypto from 'node:crypto';

import { PUBLIC_ORIGIN } from '../config.js';
import { quote, quotesMatch } from '../pricing.js';
import { validateShipping } from '../validate.js';
import * as paypal from '../paypal.js';
import * as store from '../store.js';
import { EMAIL_PATTERN } from '../validate.js';
import { asyncHandler } from '../middleware/async-handler.js';

export const ordersRouter = Router();

/* ── Create ─────────────────────────────────────────────────────── */
ordersRouter.post('/orders', asyncHandler(async (req, res) => {
  // Throws PricingError on a cart we cannot price, or on a coupon code
  // that does not exist; the error middleware turns that into a 400
  // naming the exact problem. The coupon is re-resolved here from the
  // code alone — never trust a discounted total the browser sends.
  const priced = quote(req.body.lines, req.body.lang, req.body.couponCode);

  const shipping = validateShipping(req.body.shipping);
  if (shipping.error) {
    return res.status(400).json({ error: 'INVALID_ADDRESS', field: shipping.error });
  }

  const referenceId = crypto.randomUUID();

  let ppOrder;
  try {
    ppOrder = await paypal.createOrder(priced, {
      referenceId,
      shipping: shipping.value,
      returnUrl: `${PUBLIC_ORIGIN}/checkout.html?paypal=return`,
      cancelUrl: `${PUBLIC_ORIGIN}/checkout.html?paypal=cancel`
    });
  } catch (err) {
    // Only PayPal failures are reported as PayPal failures. A bug in our
    // own code below would otherwise have been mislabelled as an
    // upstream outage, which is how you spend a day debugging the wrong
    // system.
    console.error('[create-order]', err.status, err.issue, err.message);
    return res.status(502).json({ error: 'PAYPAL_UNAVAILABLE', issue: err.issue || null });
  }

  // Persisted BEFORE the customer can pay. If everything downstream
  // fails, there is still a record tying a PayPal order to a cart.
  // couponCode is stored on the order (not just inside quote.coupon)
  // so capture-time re-pricing below can reapply exactly the same
  // discount without having to dig it out of the priced lines.
  const order = store.createOrder({
    referenceId,
    paypalOrderId: ppOrder.id,
    quote: priced,
    couponCode: priced.coupon?.code || null,
    shipping: shipping.value,
    email: shipping.value.email,
    captureIdempotencyKey: crypto.randomUUID(),
    status: 'CREATED'
  });

  return res.json({
    orderId: order.orderId,
    orderNumber: order.orderNumber,
    paypalOrderId: ppOrder.id,
    quote: priced
  });
}));

/* ── Capture ────────────────────────────────────────────────────── */
ordersRouter.post('/orders/:id/capture', asyncHandler(async (req, res) => {
  const order = store.getOrder(req.params.id);
  if (!order) return res.status(404).json({ error: 'ORDER_NOT_FOUND' });

  // Already done: return the same answer instead of charging again.
  if (order.status === 'PAID') {
    return res.json({ status: 'PAID', orderNumber: order.orderNumber, captureId: order.captureId });
  }

  // The catalogue — or the coupon — may have changed between create
  // and capture. Re-quote with the exact same lines and the exact
  // same coupon code the order was created with.
  let current;
  try {
    current = quote(
      order.quote.lines.map((l) => ({ sku: l.sku, qty: l.qty })),
      order.quote.lang,
      order.couponCode
    );
  } catch {
    current = null;
  }
  if (!current || !quotesMatch(current, order.quote)) {
    store.updateOrder(order.orderId, { status: 'PRICE_CHANGED' });
    return res.status(409).json({ error: 'PRICE_CHANGED', newQuote: current });
  }

  try {
    const result = await paypal.captureOrder(order.paypalOrderId, order.captureIdempotencyKey);
    const capture = result.purchase_units?.[0]?.payments?.captures?.[0];

    if (result.status === 'COMPLETED' && capture?.status === 'COMPLETED') {
      const updated = store.updateOrder(order.orderId, {
        status: 'PAID',
        captureId: capture.id,
        paidAmount: capture.amount?.value,
        payerEmail: result.payer?.email_address || null,
        paidAt: new Date().toISOString()
      });
      // Fulfilment goes here (invoice mail, warehouse). Do it after the
      // status is on disk, and make it retryable — a failed email must
      // never roll back a successful payment.
      return res.json({ status: 'PAID', orderNumber: updated.orderNumber, captureId: capture.id });
    }

    if (capture?.status === 'PENDING') {
      store.updateOrder(order.orderId, { status: 'PENDING', captureId: capture.id });
      return res.json({ status: 'PENDING', orderNumber: order.orderNumber });
    }

    store.updateOrder(order.orderId, { status: 'CAPTURE_UNCLEAR', raw: result.status });
    return res.status(502).json({ error: 'CAPTURE_UNCLEAR' });
  } catch (err) {
    const issue = err.issue;

    // The buyer's funding source bounced. PayPal wants the buyer to pick
    // another one — the SDK restarts the flow on this signal.
    if (issue === 'INSTRUMENT_DECLINED') {
      return res.status(422).json({ error: 'INSTRUMENT_DECLINED' });
    }

    // Someone (a retry, a webhook race) already captured it. Reconcile
    // against PayPal rather than guessing.
    if (issue === 'ORDER_ALREADY_CAPTURED' || err.status === 409) {
      try {
        const remote = await paypal.getOrder(order.paypalOrderId);
        const cap = remote.purchase_units?.[0]?.payments?.captures?.[0];
        if (cap?.status === 'COMPLETED') {
          const updated = store.updateOrder(order.orderId, {
            status: 'PAID',
            captureId: cap.id,
            paidAmount: cap.amount?.value,
            paidAt: new Date().toISOString()
          });
          return res.json({ status: 'PAID', orderNumber: updated.orderNumber, captureId: cap.id });
        }
      } catch { /* fall through to CAPTURE_UNKNOWN */ }
    }

    // Timeouts land here. We genuinely do not know whether the money
    // moved, so we say so, and the webhook or the status poll resolves
    // it. Never tell the customer "failed" when we are not sure.
    console.error('[capture]', err.status, issue, err.message);
    store.updateOrder(order.orderId, { status: 'CAPTURE_UNKNOWN', lastError: issue || err.message });
    return res.status(504).json({ error: 'CAPTURE_UNKNOWN', orderNumber: order.orderNumber });
  }
}));

/* ── Status poll (browser crash recovery) ───────────────────────── */
ordersRouter.get('/orders/:id', (req, res) => {
  const order = store.getOrder(req.params.id);
  if (!order) return res.status(404).json({ error: 'ORDER_NOT_FOUND' });
  return res.json({
    orderId: order.orderId,
    orderNumber: order.orderNumber,
    status: order.status,
    grandTotal: order.quote?.grandTotal,
    currency: order.quote?.currency
  });
});

/* ── Manual fallback (bank transfer) ────────────────────────────── */
ordersRouter.post('/orders/:id/manual', (req, res) => {
  const order = store.getOrder(req.params.id);
  if (!order) return res.status(404).json({ error: 'ORDER_NOT_FOUND' });
  if (order.status === 'PAID') {
    return res.json({ status: 'PAID', orderNumber: order.orderNumber });
  }
  const updated = store.updateOrder(order.orderId, { status: 'AWAITING_TRANSFER' });
  return res.json({ status: 'AWAITING_TRANSFER', orderNumber: updated.orderNumber });
});

/* ── Orders by email (account dashboard) ───────────────────────── */
ordersRouter.get('/my-orders', (req, res) => {
  const email = String(req.query.email || '').trim().toLowerCase();
  if (!email || !EMAIL_PATTERN.test(email)) {
    return res.status(400).json({ error: 'INVALID_EMAIL' });
  }
  const orders = store.getOrdersByEmail(email).map(o => ({
    orderId:     o.orderId,
    orderNumber: o.orderNumber,
    status:      o.status,
    createdAt:   o.createdAt,
    grandTotal:  o.quote?.grandTotal,
    currency:    o.quote?.currency || 'EUR',
    lines:       (o.quote?.lines || []).map(l => ({ name: l.name, qty: l.qty })),
    captureId:   o.captureId || null,
    paidAt:      o.paidAt    || null
  }));
  return res.json({ orders });
});
