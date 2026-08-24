/**
 * takeKONTROL — Server configuration
 * =================================================================
 * Every environment variable the server reads is parsed here, once,
 * with its default next to it. Nothing else in server/ touches
 * process.env, so `grep -r process.env server/` returning one file is
 * the invariant to keep.
 * =================================================================
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const ROOT_DIR = path.resolve(here, '..');

const num = (value, fallback) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

export const PORT = num(process.env.PORT, 3000);
export const PUBLIC_ORIGIN = process.env.PUBLIC_ORIGIN || `http://localhost:${PORT}`;

/** CORS allow-list. Never '*' on a payment endpoint. */
export const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || PUBLIC_ORIGIN)
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

export const STATIC_DIR = process.env.STATIC_DIR
  ? path.resolve(process.env.STATIC_DIR)
  : path.join(ROOT_DIR, 'public');

export const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(ROOT_DIR, 'data');

export const RATE_LIMIT = {
  WINDOW_MS: num(process.env.RATE_LIMIT_WINDOW_MS, 60_000),
  MAX_REQUESTS: num(process.env.RATE_LIMIT_MAX, 60)
};

export const PAYPAL = {
  ENV: (process.env.PAYPAL_ENV || 'sandbox').toLowerCase(),
  CLIENT_ID: process.env.PAYPAL_CLIENT_ID || '',
  CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET || '',
  WEBHOOK_ID: process.env.PAYPAL_WEBHOOK_ID || '',
  TIMEOUT_MS: num(process.env.PAYPAL_TIMEOUT_MS, 15_000),
  MAX_RETRIES: num(process.env.PAYPAL_MAX_RETRIES, 2)
};

export const PAYPAL_BASE = PAYPAL.ENV === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';
