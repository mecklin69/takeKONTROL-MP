import { PricingError } from '../pricing.js';

/** Anything that falls past the API routers answers in JSON, not HTML. */
export function apiNotFound(req, res) {
  res.status(404).json({ error: 'NOT_FOUND' });
}

/**
 * One place decides what a thrown error looks like on the wire.
 * A PricingError means the client sent something we cannot price (400).
 * Everything else is our fault (500), and the detail stays in the log
 * rather than going out to the browser.
 */
export function errorHandler(err, req, res, _next) {
  if (err instanceof PricingError) {
    return res.status(400).json({ error: err.code, message: err.message });
  }
  console.error('[unhandled]', req.method, req.originalUrl, err);
  return res.status(500).json({ error: 'SERVER_ERROR' });
}
