/**
 * takeKONTROL — User API routes
 * All routes are user-scoped — email is verified against the request.
 *
 * GET  /api/user/orders          — order history from DynamoDB
 * GET  /api/user/orders/:id      — single order detail
 * GET  /api/user/orders/:id/invoice — PDF invoice
 * GET  /api/user/addresses       — saved addresses
 * POST /api/user/addresses       — save/update address
 * DELETE /api/user/addresses/:id — delete address
 * GET  /api/user/returns         — return requests
 * POST /api/user/returns         — submit return request
 */

import { Router }  from 'express';
import crypto      from 'node:crypto';
import { asyncHandler } from '../middleware/async-handler.js';
import { EMAIL_PATTERN } from '../validate.js';
import * as dynamo from '../dynamo.js';

export const userRouter = Router();

/* ── Simple auth: email in query/body must match a valid format.
   In production you would verify a Firebase ID token here.
   For now we trust the client-supplied email (fine for sandbox/dev). ── */
function requireEmail(req) {
  const email = String(req.query.email || req.body?.email || '').trim().toLowerCase();
  if (!email || !EMAIL_PATTERN.test(email)) throw Object.assign(new Error('INVALID_EMAIL'), { status: 400 });
  return email;
}

function requireUID(req) {
  const uid = String(req.query.uid || req.body?.uid || '').trim();
  if (!uid) throw Object.assign(new Error('INVALID_UID'), { status: 400 });
  return uid;
}

/* ── Orders ─────────────────────────────────────────────────────── */

/**
 * Orders the customer should see. `CREATED` is written the instant
 * checkout starts — before PayPal is even opened — purely so an
 * interrupted session can be recovered (see server/store.js). It is
 * not something the customer did or paid for, so it never belongs in
 * their order history: an abandoned or unstarted checkout must not
 * look like a real order. Every other status reflects an actual
 * outcome of a payment attempt and is shown as-is.
 */
const CUSTOMER_VISIBLE = (order) => order.status !== 'CREATED';

userRouter.get('/user/orders', asyncHandler(async (req, res) => {
  const email = requireEmail(req);
  const orders = await dynamo.getOrdersByEmail(email);

  return res.json({
    orders: orders.filter(CUSTOMER_VISIBLE).map(formatOrder)
  });
}));

userRouter.get('/user/orders/:id', asyncHandler(async (req, res) => {
  const email = requireEmail(req);
  const order = await dynamo.getOrderById(req.params.id);

  if (!order) return res.status(404).json({ error: 'ORDER_NOT_FOUND' });
  if (order.email?.toLowerCase() !== email) return res.status(403).json({ error: 'FORBIDDEN' });
  // A still-CREATED order isn't a real order yet from the customer's
  // side — a stale bookmark or link to it should 404, same as if it
  // never existed, rather than reveal an unpaid draft.
  if (!CUSTOMER_VISIBLE(order)) return res.status(404).json({ error: 'ORDER_NOT_FOUND' });

  return res.json({ order: formatOrder(order, true) });
}));

function formatOrder(o, detail = false) {
  const q = safeJson(o.rawQuote) || {};
  const base = {
    orderId:       o.orderID || o.orderId,
    orderNumber:   o.orderNumber,
    status:        o.status,
    createdAt:     o.createdAt,
    updatedAt:     o.updatedAt,
    grandTotal:    o.grandTotal,
    currency:      o.currency || 'EUR',
    captureId:     o.captureId   || null,
    paidAt:        o.paidAt      || null,
    items:         q.lines || [],
    shippingGross: q.shippingGross || '0.00',
    itemTotalGross: q.itemTotalGrossBeforeDiscount || q.itemTotalGross || '0.00',
    discount:      q.discount || '0.00',
    couponCode:    o.couponCode || null,
    vat:           q.vat || '0.00',
    vatRate:       q.vatRate ?? 0.19,
  };

  if (detail) {
    base.shipping  = safeJson(o.rawShipping) || {};
    base.payerEmail = o.payerEmail || null;
    base.settledVia = o.settledVia || null;
  }

  return base;
}

/* ── Invoice ─────────────────────────────────────────────────────── */

userRouter.get('/user/orders/:id/invoice', asyncHandler(async (req, res) => {
  const email = requireEmail(req);
  const order = await dynamo.getOrderById(req.params.id);

  if (!order) return res.status(404).json({ error: 'ORDER_NOT_FOUND' });
  if (order.email?.toLowerCase() !== email) return res.status(403).json({ error: 'FORBIDDEN' });
  // An invoice is a record of a payment that happened. Anything short
  // of PAID (including a still-CREATED draft) has nothing to invoice.
  if (order.status !== 'PAID') return res.status(404).json({ error: 'ORDER_NOT_PAID' });

  const q        = safeJson(order.rawQuote)  || {};
  const shipping = safeJson(order.rawShipping) || {};
  const date     = order.paidAt || order.createdAt;
  const dateStr  = new Date(date).toLocaleDateString('de-DE');
  const invoiceNo = `INV-${order.orderNumber}`;

  const lines = (q.lines || []).map(l =>
    `<tr>
      <td>${esc(l.name)}${l.discounted ? ` <span style="color:#b32020;font-size:10px;">(FIRST10)</span>` : ''}</td>
      <td style="text-align:center">${l.qty}</td>
      <td style="text-align:right">€${l.unitGross}</td>
      <td style="text-align:right">€${l.lineGross}</td>
    </tr>`
  ).join('');

  const discountRow = Number(q.discount) > 0
    ? `<tr><td>Rabatt${q.coupon ? ` (${esc(q.coupon.code)})` : ''}</td><td style="text-align:right">−€${q.discount}</td></tr>`
    : '';

  const html = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<title>Rechnung ${invoiceNo}</title>
<style>
  body { font-family: Arial, sans-serif; font-size: 12px; color: #222; margin: 40px; }
  h1 { font-size: 22px; color: #b32020; margin-bottom: 4px; }
  .meta { color: #666; font-size: 11px; margin-bottom: 30px; }
  .two-col { display: flex; justify-content: space-between; margin-bottom: 30px; }
  .company { font-size: 11px; line-height: 1.6; color: #444; }
  .customer { font-size: 11px; line-height: 1.6; }
  table { width: 100%; border-collapse: collapse; margin-top: 20px; }
  th { background: #f5f5f5; padding: 8px; text-align: left; font-size: 11px; border-bottom: 2px solid #ddd; }
  td { padding: 8px; border-bottom: 1px solid #eee; font-size: 11px; }
  .totals { margin-top: 20px; margin-left: auto; width: 280px; }
  .totals tr td { border: none; padding: 4px 8px; }
  .totals tr.grand td { font-weight: bold; font-size: 13px; border-top: 2px solid #222; padding-top: 8px; }
  .totals tr.grand td:last-child { color: #b32020; }
  .footer { margin-top: 40px; font-size: 10px; color: #999; border-top: 1px solid #eee; padding-top: 12px; }
  .status-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 10px; font-weight: bold;
    background: ${order.status === 'PAID' ? '#dcfce7' : '#fef9c3'}; color: ${order.status === 'PAID' ? '#166534' : '#854d0e'}; }
</style>
</head>
<body>
  <h1>takeKONTROL</h1>
  <div class="meta">T-KONTROL Resilience Solutions UG (haftungsbeschränkt) · Mittelstraße 1B, 13055 Berlin</div>

  <div class="two-col">
    <div class="customer">
      <strong>${esc(shipping.firstName || '')} ${esc(shipping.lastName || '')}</strong><br>
      ${esc(shipping.street || '')} ${esc(shipping.houseNumber || '')}<br>
      ${esc(shipping.postalCode || '')} ${esc(shipping.city || '')}<br>
      ${esc(shipping.country || '')}<br>
      ${shipping.email ? `<br>${esc(shipping.email)}` : ''}
    </div>
    <div class="company" style="text-align:right">
      <strong>Rechnung / Invoice</strong><br>
      Rechnungsnr.: <strong>${invoiceNo}</strong><br>
      Bestellnr.: ${esc(order.orderNumber)}<br>
      Datum: ${dateStr}<br>
      Status: <span class="status-badge">${order.status}</span><br>
      ${order.captureId ? `Transaction-ID: ${esc(order.captureId)}` : ''}
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Artikel / Item</th>
        <th style="text-align:center">Menge</th>
        <th style="text-align:right">Einzelpreis (inkl. MwSt.)</th>
        <th style="text-align:right">Gesamt (inkl. MwSt.)</th>
      </tr>
    </thead>
    <tbody>${lines}</tbody>
  </table>

  <table class="totals">
    <tr><td>Zwischensumme (inkl. MwSt.)</td><td style="text-align:right">€${q.itemTotalGrossBeforeDiscount || q.itemTotalGross || '0.00'}</td></tr>
    ${discountRow}
    <tr><td>Versand (inkl. MwSt.)</td><td style="text-align:right">${Number(q.shippingGross) === 0 ? 'Kostenlos' : '€' + q.shippingGross}</td></tr>
    <tr><td>davon MwSt. ${Math.round((q.vatRate ?? 0.19) * 100)} % (§12 UStG)</td><td style="text-align:right">€${q.vat || '0.00'}</td></tr>
    <tr class="grand"><td>Gesamtbetrag (inkl. MwSt.)</td><td style="text-align:right">€${order.grandTotal || '0.00'}</td></tr>
  </table>

  <div class="footer">
    T-KONTROL Resilience Solutions UG (haftungsbeschränkt) · Mittelstraße 1B, 13055 Berlin ·
    info@takekontrol.de · +49 176 73249880 ·
    Steuernummer: [Ihre Steuernummer] · USt-IdNr.: [Ihre USt-ID]<br>
    Zahlungsart: ${order.settledVia === 'webhook' ? 'PayPal (webhook)' : 'PayPal'} ·
    ${order.captureId ? `Capture-ID: ${order.captureId}` : ''}
  </div>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Content-Disposition', `inline; filename="${invoiceNo}.html"`);
  return res.send(html);
}));

/* ── Addresses ──────────────────────────────────────────────────── */

userRouter.get('/user/addresses', asyncHandler(async (req, res) => {
  const uid = requireUID(req);
  const addresses = await dynamo.getAddresses(uid);
  return res.json({ addresses });
}));

userRouter.post('/user/addresses', asyncHandler(async (req, res) => {
  const uid = requireUID(req);
  const body = req.body || {};

  const required = ['firstName', 'lastName', 'street', 'houseNumber', 'postalCode', 'city', 'country'];
  for (const field of required) {
    if (!String(body[field] || '').trim()) {
      return res.status(400).json({ error: 'MISSING_FIELD', field });
    }
  }

  const address = {
    addressId:   body.addressId || `addr_${crypto.randomUUID()}`,
    firstName:   String(body.firstName).trim().slice(0, 100),
    lastName:    String(body.lastName).trim().slice(0, 100),
    street:      String(body.street).trim().slice(0, 200),
    houseNumber: String(body.houseNumber).trim().slice(0, 20),
    postalCode:  String(body.postalCode).trim().slice(0, 20),
    city:        String(body.city).trim().slice(0, 100),
    country:     String(body.country).trim().slice(0, 5),
    phone:       String(body.phone || '').trim().slice(0, 40),
    label:       String(body.label || '').trim().slice(0, 50),
    isDefault:   Boolean(body.isDefault)
  };

  const addressId = await dynamo.saveAddress(uid, address);
  if (!addressId) return res.status(502).json({ error: 'SAVE_FAILED' });

  return res.json({ addressId, address });
}));

userRouter.delete('/user/addresses/:id', asyncHandler(async (req, res) => {
  const uid = requireUID(req);
  const ok = await dynamo.deleteAddress(uid, req.params.id);
  if (!ok) return res.status(502).json({ error: 'DELETE_FAILED' });
  return res.json({ deleted: true });
}));

/* ── Returns ─────────────────────────────────────────────────────── */

userRouter.get('/user/returns', asyncHandler(async (req, res) => {
  const email = requireEmail(req);
  const returns = await dynamo.getReturnsByEmail(email);
  return res.json({ returns });
}));

userRouter.post('/user/returns', asyncHandler(async (req, res) => {
  const email = requireEmail(req);
  const body  = req.body || {};

  if (!body.orderNumber) return res.status(400).json({ error: 'MISSING_ORDER_NUMBER' });
  if (!body.reason)      return res.status(400).json({ error: 'MISSING_REASON' });

  const returnRequest = {
    email,
    orderNumber: String(body.orderNumber).trim(),
    orderId:     String(body.orderId || '').trim(),
    reason:      String(body.reason).trim().slice(0, 500),
    items:       String(body.items || '').trim().slice(0, 500),
    message:     String(body.message || '').trim().slice(0, 1000)
  };

  const returnId = await dynamo.submitReturn(returnRequest);
  if (!returnId) return res.status(502).json({ error: 'SUBMIT_FAILED' });

  return res.json({ returnId, status: 'REQUESTED' });
}));

/* ── helpers ─────────────────────────────────────────────────────── */
function safeJson(str) {
  try { return JSON.parse(str); } catch { return null; }
}

function esc(str) {
  return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
