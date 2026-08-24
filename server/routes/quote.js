import { Router } from 'express';

import { PAYPAL } from '../config.js';
import { PRICING, quote } from '../pricing.js';
import { paypalEnvironment } from '../paypal.js';

export const quoteRouter = Router();

/**
 * GET /api/config — everything the browser is allowed to know.
 * The client id is public by design; the secret never leaves the server.
 */
quoteRouter.get('/config', (req, res) => {
  res.json({
    clientId: PAYPAL.CLIENT_ID || null,
    environment: paypalEnvironment,
    currency: PRICING.CURRENCY,
    vatRate: PRICING.VAT_RATE,
    shippingNet: PRICING.SHIPPING_NET,
    freeShippingThresholdNet: PRICING.FREE_SHIPPING_THRESHOLD_NET,
    quoteTtlMs: PRICING.QUOTE_TTL_MS
  });
});

/**
 * POST /api/quote — price a cart. A PricingError thrown here becomes a
 * 400 with its code in the error middleware.
 */
quoteRouter.post('/quote', (req, res) => {
  res.json(quote(req.body.lines, req.body.lang));
});
