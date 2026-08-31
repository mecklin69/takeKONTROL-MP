/**
 * takeKONTROL — Checkout API
 * =================================================================
 *   GET  /api/config              public client id + shop constants
 *   POST /api/quote               price a cart (SKUs + quantities)
 *   POST /api/orders              create a PayPal order
 *   POST /api/orders/:id/capture  capture, idempotently
 *   GET  /api/orders/:id          poll status (browser crash recovery)
 *   POST /api/orders/:id/manual   fall back to bank transfer
 *   POST /api/webhooks/paypal     PayPal's own word on what happened
 *
 * This module only assembles the app. Starting a listener is index.js's
 * job, which keeps the app importable from a test without opening a
 * port.
 * =================================================================
 */

import express from 'express';

import { STATIC_DIR } from './config.js';
import { cors } from './middleware/cors.js';
import { createRateLimiter } from './middleware/rate-limit.js';
import { apiNotFound, errorHandler } from './middleware/errors.js';
import { quoteRouter } from './routes/quote.js';
import { enquiryRouter } from './routes/enquiry.js';
import { userRouter } from './routes/user.js';
import { ordersRouter } from './routes/orders.js';
import { webhookRouter } from './routes/webhooks.js';

export function createApp({ rateLimit = true } = {}) {
  const app = express();

  // The webhook verifies a signature over the raw body, so it must be
  // mounted before the JSON parser replaces req.body with an object.
  app.use('/api', webhookRouter);

  app.use(express.json({ limit: '100kb' }));
  app.use(cors);

  if (rateLimit) {
    const limiter = createRateLimiter();
    app.use('/api/', limiter);
    app.locals.rateLimiter = limiter;
  }

  app.use('/api', quoteRouter);
  app.use('/api', enquiryRouter);
  app.use('/api', userRouter);
  app.use('/api', ordersRouter);

  app.use('/api', apiNotFound);

app.get('/', (req, res) => res.redirect(301, '/takekontrol-revamp.html'));
app.use(express.static(STATIC_DIR, {
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      // HTML — never cache, always fresh
      res.setHeader('Cache-Control', 'no-store');
    } else if (filePath.endsWith('.css') || filePath.endsWith('.js')) {
      // CSS/JS — revalidate on every request
      res.setHeader('Cache-Control', 'no-cache, must-revalidate');
    } else if (/\.(png|jpg|jpeg|webp|gif|svg|ico|mp4)$/i.test(filePath)) {
      // Images/media — cache for 7 days (they rarely change)
      res.setHeader('Cache-Control', 'no-cache, must-revalidate');
    }
  }
}));

app.use(errorHandler);

  return app;
}

