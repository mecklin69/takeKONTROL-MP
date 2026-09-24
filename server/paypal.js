/**
 * takeKONTROL — PayPal REST client (Orders v2)
 * =================================================================
 * Everything here runs server-side because the secret key must never
 * reach a browser.
 *
 * Failure handling built in:
 *   - access token cached until 60 s before expiry
 *   - every call has a hard timeout (a hung socket must not hang your
 *     checkout)
 *   - transient failures (429, 5xx, network) retry with backoff
 *   - 4xx never retries: a rejected card does not get better by asking
 *     again
 * =================================================================
 */

import { PAYPAL, PAYPAL_BASE } from './config.js';

export const paypalEnvironment = PAYPAL.ENV;
export { PAYPAL_BASE };

export class PayPalError extends Error {
  constructor(status, body, message) {
    super(message || `PayPal ${status}`);
    this.name = 'PayPalError';
    this.status = status;
    this.body = body;
  }

  /** PayPal's machine-readable issue, e.g. INSTRUMENT_DECLINED. */
  get issue() {
    const detail = this.body && this.body.details && this.body.details[0];
    return (detail && detail.issue) || (this.body && this.body.name) || null;
  }
}

export function isConfigured() {
  return Boolean(PAYPAL.CLIENT_ID && PAYPAL.CLIENT_SECRET);
}

export function assertConfigured() {
  if (!isConfigured()) {
    throw new Error(
      'PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET are not set. ' +
      'Copy .env.example to .env and fill them in.'
    );
  }
}

/* ── Token cache ────────────────────────────────────────────────── */
let tokenCache = { value: null, expiresAt: 0 };
let tokenInFlight = null;

async function accessToken() {
  assertConfigured();
  if (tokenCache.value && Date.now() < tokenCache.expiresAt) return tokenCache.value;
  // Collapse concurrent refreshes into one request.
  if (tokenInFlight) return tokenInFlight;

  tokenInFlight = (async () => {
    const basic = Buffer.from(`${PAYPAL.CLIENT_ID}:${PAYPAL.CLIENT_SECRET}`).toString('base64');
    const res = await fetchWithTimeout(`${PAYPAL_BASE}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new PayPalError(res.status, json, 'Could not obtain PayPal access token');

    tokenCache = {
      value: json.access_token,
      expiresAt: Date.now() + (json.expires_in - 60) * 1000
    };
    return tokenCache.value;
  })().finally(() => { tokenInFlight = null; });

  return tokenInFlight;
}

/** Exposed for tests and for a clean shutdown; never needed in normal use. */
export function resetTokenCache() {
  tokenCache = { value: null, expiresAt: 0 };
  tokenInFlight = null;
}

/* ── Transport ──────────────────────────────────────────────────── */
async function fetchWithTimeout(url, options) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PAYPAL.TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function safeParse(text) {
  try { return JSON.parse(text); } catch { return { raw: text }; }
}

async function call(path, { method = 'GET', body, headers = {}, retries = PAYPAL.MAX_RETRIES } = {}) {
  const token = await accessToken();

  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    if (attempt > 0) {
      // 400 ms, 1200 ms — enough to ride out a blip, short enough that
      // the shopper does not think the page has died.
      await new Promise((r) => setTimeout(r, 400 * Math.pow(3, attempt - 1)));
    }

    try {
      const res = await fetchWithTimeout(`${PAYPAL_BASE}${path}`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...headers
        },
        body: body ? JSON.stringify(body) : undefined
      });

      const text = await res.text();
      const json = text ? safeParse(text) : {};

      if (res.ok) return json;

      // 409 on capture usually means "already captured" — the caller
      // decides, because for us that is success, not failure.
      const retryable = res.status === 429 || res.status >= 500;
      lastError = new PayPalError(res.status, json);
      if (!retryable) throw lastError;
    } catch (err) {
      if (err instanceof PayPalError && err.status < 500 && err.status !== 429) throw err;
      lastError = err.name === 'AbortError'
        ? new PayPalError(504, null, 'PayPal request timed out')
        : err;
    }
  }
  throw lastError;
}

/* ── Orders v2 ──────────────────────────────────────────────────── */

/**
 * Create an order from a server-computed quote.
 *
 * Our prices are shown to the shopper VAT-inclusive, so PayPal is told
 * the same way: item unit_amount is the full (pre-coupon) gross price,
 * amount.breakdown.discount carries any coupon reduction as its own
 * line, and tax_total is 0 because the tax is already folded into the
 * item/shipping amounts rather than added on top of them. The
 * breakdown must still add up to the cent or PayPal rejects it:
 *   item_total - discount + shipping + tax_total === value
 * which holds here because item_total is built from the same
 * pre-discount unit prices quote.discountCents was computed from.
 */
export async function createOrder(quote, { referenceId, returnUrl, cancelUrl, shipping }) {
  const purchaseUnit = {
    reference_id: referenceId,
    custom_id: referenceId,
    description: 'takeKONTROL Vorsorge-Ausrüstung',
    amount: {
      currency_code: quote.currency,
      value: quote.grandTotal,
      breakdown: {
        item_total: { currency_code: quote.currency, value: quote.itemTotalGrossBeforeDiscount },
        discount: { currency_code: quote.currency, value: quote.discount },
        shipping: { currency_code: quote.currency, value: quote.shippingGross },
        tax_total: { currency_code: quote.currency, value: '0.00' }
      }
    },
    items: quote.lines.map((l) => ({
      name: l.name.slice(0, 127),
      sku: l.sku,
      quantity: String(l.qty),
      unit_amount: { currency_code: quote.currency, value: l.unitGrossBeforeDiscount },
      category: 'PHYSICAL_GOODS'
    }))
  };

  if (shipping) {
    purchaseUnit.shipping = {
      name: { full_name: `${shipping.firstName} ${shipping.lastName}`.slice(0, 300) },
      address: {
        address_line_1: `${shipping.street} ${shipping.houseNumber}`.slice(0, 300),
        address_line_2: (shipping.addressExtra || '').slice(0, 300) || undefined,
        admin_area_2: String(shipping.city || '').slice(0, 120),
        postal_code: shipping.postalCode,
        country_code: shipping.country
      }
    };
  }

  return call('/v2/checkout/orders', {
    method: 'POST',
    body: {
      intent: 'CAPTURE',
      purchase_units: [purchaseUnit],
      payment_source: {
        paypal: {
          experience_context: {
            brand_name: 'takeKONTROL',
            locale: 'de-DE',
            landing_page: 'LOGIN',
            shipping_preference: shipping ? 'SET_PROVIDED_ADDRESS' : 'GET_FROM_FILE',
            user_action: 'PAY_NOW',
            return_url: returnUrl,
            cancel_url: cancelUrl
          }
        }
      }
    },
    headers: { 'PayPal-Request-Id': `create-${referenceId}` }
  });
}

/**
 * Capture. `idempotencyKey` is the whole safety story: if the network
 * drops after PayPal took the money but before we saw the response,
 * retrying with the same key returns the original capture instead of
 * charging the customer twice.
 */
export async function captureOrder(paypalOrderId, idempotencyKey) {
  return call(`/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}/capture`, {
    method: 'POST',
    body: {},
    headers: { 'PayPal-Request-Id': idempotencyKey },
    retries: 1
  });
}

export async function getOrder(paypalOrderId) {
  return call(`/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}`);
}

/** Verify a webhook actually came from PayPal. Never skip this. */
export async function verifyWebhook(headers, rawBody) {
  if (!PAYPAL.WEBHOOK_ID) throw new Error('PAYPAL_WEBHOOK_ID is not set');

  const result = await call('/v1/notifications/verify-webhook-signature', {
    method: 'POST',
    body: {
      auth_algo: headers['paypal-auth-algo'],
      cert_url: headers['paypal-cert-url'],
      transmission_id: headers['paypal-transmission-id'],
      transmission_sig: headers['paypal-transmission-sig'],
      transmission_time: headers['paypal-transmission-time'],
      webhook_id: PAYPAL.WEBHOOK_ID,
      webhook_event: JSON.parse(rawBody)
    }
  });
  return result.verification_status === 'SUCCESS';
}
