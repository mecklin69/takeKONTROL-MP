/**
 * takeKONTROL — Catalogue and pricing rules (SINGLE SOURCE OF TRUTH)
 * =================================================================
 * This file is imported by BOTH sides:
 *
 *   browser  public/assets/js/cart/engine.js
 *   server   server/pricing.js  (relative import, no build step)
 *
 * Before this refactor the SKU table and the VAT/shipping constants
 * existed twice — once in cart.js and once in server/catalog.js — and
 * the two were already drifting. Change a price here and both sides
 * move together.
 *
 * Keep this file free of browser globals (window, document, localStorage)
 * and of Node built-ins (fs, process). It must stay runnable in both.
 * =================================================================
 */

/** Prices are NET (excluding VAT) in EUR, matching the "excl. VAT" labels in the shop. */
export const CATALOG = {
  'TK-HOME-7D':    { name: '7-Day Home Preparedness Kit', name_de: '7-Tage Haushalts-Vorsorgeset',  price: 549.99 },
  'TK-BP-ESS':     { name: 'Essential Backpack',          name_de: 'Essential Rucksack',            price: 89.99 },
  'TK-BP-STD':     { name: 'Standard Backpack',           name_de: 'Standard Rucksack',             price: 199.99 },
  'TK-BP-PRM':     { name: 'Premium Backpack',            name_de: 'Premium Rucksack',              price: 549.99 },
  'TK-ACC-DOCBAG': { name: 'Waterproof Document Bag',     name_de: 'Wasserdichte Dokumententasche', price: 29.99 },
  'TK-ACC-WPBP':   { name: 'Waterproof Backpack',         name_de: 'Wasserdichter Rucksack',        price: 34.99 }
};

export const PRICING = {
  CURRENCY: 'EUR',

  /** Germany, Regelsteuersatz §12 UStG. Kits and backpacks are standard-rated. */
  VAT_RATE: 0.19,

  /** Kleinunternehmer §19 UStG: set true to charge 0 % VAT and show the §19 notice. */
  SMALL_BUSINESS_19_USTG: false,

  /** Shipping within Germany, net. Free at or above the threshold. */
  SHIPPING_NET: 5.90,
  FREE_SHIPPING_THRESHOLD_NET: 150.00,

  MAX_QTY_PER_LINE: 99,
  MAX_LINES: 20,

  /** How long a server quote stays valid before the client must re-quote. */
  QUOTE_TTL_MS: 15 * 60 * 1000
};

/** localStorage / sessionStorage keys used anywhere in the front end. */
export const STORAGE_KEYS = {
  CART: 'tk_cart',
  LANG: 'tk_lang',
  THEME: 'tk_theme',
  PENDING_ORDER: 'tk_pending_order',
  CHECKOUT_DRAFT: 'tk_checkout_draft',
  LOGGED_IN: 'tk_logged_in',
  USER_EMAIL: 'tk_user_email',
  USER_UID: 'tk_user_uid',
  USER_NAME: 'tk_user_name',
  REDIRECT_AFTER_LOGIN: 'tk_redirect_after_login'
};

/* ── Money helpers ───────────────────────────────────────────────
   Integer cents everywhere. Floating-point money is how you end up
   one cent off and get UNPROCESSABLE_ENTITY back from PayPal.      */

export const toCents = (v) => Math.round((Number(v) || 0) * 100);
export const fromCents = (c) => c / 100;
export const centsToString = (c) => (c / 100).toFixed(2);

export class PricingError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'PricingError';
    this.code = code;
  }
}

/**
 * Normalise an untrusted [{ sku, qty }] list: drop nothing silently on
 * the server (throw instead), merge duplicate SKUs, clamp quantities.
 *
 * @param {Array<{sku: string, qty: number|string}>} rawLines
 * @param {{ strict?: boolean }} [options]  strict (server) throws on bad
 *        input; non-strict (browser) skips the offending line.
 * @returns {Map<string, number>} sku -> quantity
 */
export function normaliseLines(rawLines, { strict = true } = {}) {
  if (!Array.isArray(rawLines) || rawLines.length === 0) {
    if (strict) throw new PricingError('CART_EMPTY', 'Cart is empty.');
    return new Map();
  }
  if (rawLines.length > PRICING.MAX_LINES) {
    if (strict) throw new PricingError('CART_TOO_LARGE', 'Too many distinct items.');
    rawLines = rawLines.slice(0, PRICING.MAX_LINES);
  }

  const merged = new Map();
  for (const raw of rawLines) {
    const sku = String((raw && raw.sku) || '');
    if (!CATALOG[sku]) {
      if (strict) throw new PricingError('UNKNOWN_SKU', `Unknown SKU: ${sku}`);
      continue;
    }
    const qty = Number.parseInt(raw.qty, 10);
    if (!Number.isFinite(qty) || qty < 1) {
      if (strict) throw new PricingError('BAD_QUANTITY', `Invalid quantity for ${sku}`);
      continue;
    }
    merged.set(sku, Math.min((merged.get(sku) || 0) + qty, PRICING.MAX_QTY_PER_LINE));
  }
  return merged;
}

/**
 * The one place cart maths happens. Both the browser summary and the
 * server quote are formatted from this result, so they cannot disagree.
 *
 * @returns {{lines: Array, itemTotalCents: number, shippingCents: number,
 *            vatRate: number, vatCents: number, grandTotalCents: number,
 *            count: number, freeShipping: boolean, shippingGapCents: number,
 *            smallBusiness: boolean, currency: string}}
 */
export function priceCart(rawLines, { lang = 'de', strict = true } = {}) {
  const merged = normaliseLines(rawLines, { strict });

  const lines = [];
  let itemTotalCents = 0;
  let count = 0;

  for (const [sku, qty] of merged) {
    const product = CATALOG[sku];
    const unitCents = toCents(product.price);
    const lineCents = unitCents * qty;
    itemTotalCents += lineCents;
    count += qty;
    lines.push({
      sku,
      name: lang === 'en' ? product.name : product.name_de,
      qty,
      unitCents,
      lineCents
    });
  }

  const thresholdCents = toCents(PRICING.FREE_SHIPPING_THRESHOLD_NET);
  const shippingCents = (merged.size === 0 || itemTotalCents >= thresholdCents)
    ? 0
    : toCents(PRICING.SHIPPING_NET);

  const vatRate = PRICING.SMALL_BUSINESS_19_USTG ? 0 : PRICING.VAT_RATE;
  const taxableCents = itemTotalCents + shippingCents;
  const vatCents = Math.round(taxableCents * vatRate);

  return {
    currency: PRICING.CURRENCY,
    lines,
    count,
    itemTotalCents,
    shippingCents,
    freeShipping: merged.size > 0 && shippingCents === 0,
    shippingGapCents: Math.max(0, thresholdCents - itemTotalCents),
    vatRate,
    vatCents,
    grandTotalCents: taxableCents + vatCents,
    smallBusiness: PRICING.SMALL_BUSINESS_19_USTG
  };
}
