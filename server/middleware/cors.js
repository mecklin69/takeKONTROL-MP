import { ALLOWED_ORIGINS } from '../config.js';

/**
 * CORS for a payment API: an explicit allow-list, never '*'.
 * A request from an unlisted origin gets no CORS headers, so the
 * browser blocks it. Same-origin requests carry no Origin header and
 * pass through untouched.
 */
export function cors(req, res, next) {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Idempotency-Key');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  }
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  return next();
}
