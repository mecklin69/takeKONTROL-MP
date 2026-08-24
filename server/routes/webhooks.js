import { Router } from 'express';
import express from 'express';

import * as paypal from '../paypal.js';
import * as store from '../store.js';

export const webhookRouter = Router();

/**
 * PayPal's own word on what happened, and the safety net for every
 * capture whose HTTP response we lost.
 *
 * The raw body is required to verify the signature, so this route
 * registers its own express.raw parser and must be mounted BEFORE the
 * global express.json() parser rewrites req.body.
 */
webhookRouter.post(
  '/webhooks/paypal',
  express.raw({ type: 'application/json', limit: '1mb' }),
  async (req, res) => {
    const raw = req.body.toString('utf8');

    let verified = false;
    try {
      verified = await paypal.verifyWebhook(req.headers, raw);
    } catch (err) {
      console.error('[webhook] verification error', err.message);
    }

    if (!verified) {
      console.warn('[webhook] REJECTED unverified delivery');
      return res.sendStatus(401);
    }

    let event;
    try {
      event = JSON.parse(raw);
    } catch {
      return res.sendStatus(400);
    }

    // 200 immediately. PayPal retries on slow responses, which turns one
    // event into a storm.
    res.sendStatus(200);

    if (!store.markEventSeen(event.id)) return;

    try {
      applyWebhookEvent(event);
    } catch (err) {
      console.error('[webhook] handler error', err);
    }
    return undefined;
  }
);

function applyWebhookEvent(event) {
  const resource = event.resource || {};
  const paypalOrderId = resource.supplementary_data?.related_ids?.order_id || resource.id;
  const order = store.getOrderByPaypalId(paypalOrderId);

  if (!order) {
    console.warn('[webhook] no local order for', paypalOrderId);
    return;
  }

  switch (event.event_type) {
    case 'PAYMENT.CAPTURE.COMPLETED':
      if (order.status !== 'PAID') {
        store.updateOrder(order.orderId, {
          status: 'PAID',
          captureId: resource.id,
          paidAmount: resource.amount?.value,
          paidAt: new Date().toISOString(),
          settledVia: 'webhook'
        });
        console.log('[webhook] recovered payment for', order.orderNumber);
      }
      break;

    case 'PAYMENT.CAPTURE.DENIED':
      store.updateOrder(order.orderId, { status: 'DENIED' });
      break;

    case 'PAYMENT.CAPTURE.REFUNDED':
      store.updateOrder(order.orderId, { status: 'REFUNDED' });
      break;

    default:
      break;
  }
}
