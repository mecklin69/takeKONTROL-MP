import { RATE_LIMIT } from '../config.js';

/**
 * Crude but effective fixed-window limiter, per IP, in memory.
 *
 * Behind a reverse proxy call `app.set('trust proxy', 1)`, or req.ip is
 * the proxy's address and every visitor shares a single bucket.
 *
 * The version this replaces never removed expired buckets, so the Map
 * grew for the lifetime of the process. The sweep below fixes that; the
 * timer is unref'd so it cannot keep the process alive on shutdown.
 */
export function createRateLimiter({
  windowMs = RATE_LIMIT.WINDOW_MS,
  max = RATE_LIMIT.MAX_REQUESTS
} = {}) {
  const buckets = new Map();

  const sweep = setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of buckets) {
      if (now > bucket.resetAt) buckets.delete(key);
    }
  }, windowMs);
  if (typeof sweep.unref === 'function') sweep.unref();

  const middleware = (req, res, next) => {
    const key = req.ip || 'unknown';
    const now = Date.now();

    let bucket = buckets.get(key);
    if (!bucket || now > bucket.resetAt) {
      bucket = { count: 0, resetAt: now + windowMs };
      buckets.set(key, bucket);
    }

    bucket.count += 1;
    if (bucket.count > max) {
      res.setHeader('Retry-After', String(Math.ceil((bucket.resetAt - now) / 1000)));
      return res.status(429).json({ error: 'RATE_LIMITED' });
    }
    return next();
  };

  middleware.stop = () => clearInterval(sweep);
  return middleware;
}
