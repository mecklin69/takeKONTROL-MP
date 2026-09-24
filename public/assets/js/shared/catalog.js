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
 * move together. The same is true of coupons: FIRST10 is defined once,
 * below, and applying it changes the browser, the server quote and the
 * amount PayPal is asked to collect together, because all three call
 * priceCart().
 *
 * Keep this file free of browser globals (window, document, localStorage)
 * and of Node built-ins (fs, process). It must stay runnable in both.
 * =================================================================
 */

/**
 * CATALOG prices are the shop's LIST prices, NET (excluding VAT), in EUR.
 * They stay net internally — that is the number a merchant actually
 * negotiates and books — but every price shown to a shopper (shop,
 * cart, checkout, invoice) is the GROSS, VAT-inclusive figure computed
 * from this by priceCart() / grossUnitPrice() below. Nothing outside
 * this file should do that arithmetic itself.
 */
export const CATALOG = {
  'TK-HOME-7D':    { name: '7-Day Home Preparedness Kit', name_de: '7-Tage Haushalts-Vorsorgeset',  price: 549.99 },
  'TK-BP-ESS':     { name: 'Essential Backpack',          name_de: 'Essential Rucksack',            price: 49.99 },
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

  /** Shipping within Germany, net (converted to gross alongside everything else). */
  SHIPPING_NET: 5.90,
  FREE_SHIPPING_THRESHOLD_NET: 150.00,

  MAX_QTY_PER_LINE: 99,
  MAX_LINES: 20,

  /** How long a server quote stays valid before the client must re-quote. */
  QUOTE_TTL_MS: 15 * 60 * 1000
};

/**
 * Coupon codes. One place, like everything else here — matched
 * case-insensitively. Add a code by adding an entry; nothing else
 * needs to change for it to work in the browser, the quote endpoint,
 * order creation and the PayPal amount.
 */
export const COUPONS = {
  FIRST10: { code: 'FIRST10', percentOff: 10 }
};

/**
 * Look up and normalise a coupon code. Returns null for no code, an
 * unrecognised code, or anything that doesn't resolve — callers that
 * need to tell "no code" apart from "bad code" check the raw input
 * themselves (priceCart does, via couponError below).
 */
export function resolveCoupon(rawCode) {
  const code = String(rawCode || '').trim().toUpperCase();
  if (!code) return null;
  const coupon = COUPONS[code];
  return coupon ? { code: coupon.code, percentOff: coupon.percentOff } : null;
}

/** localStorage / sessionStorage keys used anywhere in the front end. */
export const STORAGE_KEYS = {
  CART: 'tk_cart',
  COUPON: 'tk_coupon',
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

/** The VAT rate actually in effect right now (0 under §19 UStG). */
export const effectiveVatRate = () =>
  PRICING.SMALL_BUSINESS_19_USTG ? 0 : PRICING.VAT_RATE;

/** Net cents → gross cents at the given (or current) VAT rate. */
export const toGrossCents = (netCents, vatRate = effectiveVatRate()) =>
  Math.round(netCents * (1 + vatRate));

/**
 * A single product's shop-shelf price: gross, in euros, no cart or
 * coupon involved. This is what the shop page shows next to "Add to
 * Cart" — VAT-inclusive, exactly like the checkout total.
 */
export function grossUnitPrice(sku) {
  const product = CATALOG[sku];
  if (!product) return 0;
  return fromCents(toGrossCents(toCents(product.price)));
}

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
 * server quote are formatted from this result, so they cannot disagree
 * — and neither can a coupon: apply FIRST10 here and the browser
 * total, the server quote, the capture-time price check and the
 * PayPal amount all move together, because they all call this.
 *
 * Every money figure this returns is GROSS (VAT-inclusive) — unit
 * prices, line totals, the item subtotal, shipping, the grand total.
 * vatCents is the VAT portion *contained within* those figures, shown
 * for the legally-required "of which VAT" line, not added on top of
 * them.
 *
 * @param {Array<{sku: string, qty: number}>} rawLines
 * @param {{ lang?: 'de'|'en', strict?: boolean, couponCode?: string|null }} [options]
 * @returns {{lines: Array, itemTotalCents: number, itemTotalCentsBeforeDiscount: number,
 *            discountCents: number, shippingCents: number, vatRate: number,
 *            vatCents: number, grandTotalCents: number, count: number,
 *            freeShipping: boolean, shippingGapCents: number,
 *            smallBusiness: boolean, currency: string,
 *            coupon: {code: string, percentOff: number} | null,
 *            couponError: 'INVALID_COUPON' | null}}
 */
export function priceCart(rawLines, { lang = 'de', strict = true, couponCode = null } = {}) {
  const merged = normaliseLines(rawLines, { strict });

  const coupon = resolveCoupon(couponCode);
  // A code was typed but did not resolve to anything real — tell the
  // caller so the UI can say "invalid code" rather than silently
  // charging full price. strict (server) callers treat this as a hard
  // error so a stale/garbled code never slips past an order.
  const trimmedInput = String(couponCode || '').trim();
  const couponError = (trimmedInput && !coupon) ? 'INVALID_COUPON' : null;
  if (couponError && strict) {
    throw new PricingError('INVALID_COUPON', `Unknown coupon code: ${trimmedInput}`);
  }

  const vatRate = effectiveVatRate();

  const lines = [];
  let itemTotalCents = 0;
  let itemTotalCentsBeforeDiscount = 0;
  let count = 0;

  for (const [sku, qty] of merged) {
    const product = CATALOG[sku];
    const unitGrossFull = toGrossCents(toCents(product.price), vatRate);
    const unitGross = coupon
      ? Math.round(unitGrossFull * (100 - coupon.percentOff) / 100)
      : unitGrossFull;

    const lineGross = unitGross * qty;
    const lineGrossFull = unitGrossFull * qty;

    itemTotalCents += lineGross;
    itemTotalCentsBeforeDiscount += lineGrossFull;
    count += qty;

    lines.push({
      sku,
      name: lang === 'en' ? product.name : product.name_de,
      qty,
      unitCents: unitGross,               // gross, post-discount — the price charged
      lineCents: lineGross,                // gross, post-discount
      unitCentsBeforeDiscount: unitGrossFull,
      lineCentsBeforeDiscount: lineGrossFull,
      discounted: Boolean(coupon)
    });
  }

  const discountCents = itemTotalCentsBeforeDiscount - itemTotalCents;

  // The free-shipping threshold and the shipping fee are configured
  // net (that's the business rule); converted to gross here so the
  // comparison is apples-to-apples with the now-gross item total, and
  // so a coupon that drops the order under the threshold correctly
  // switches shipping back on.
  const thresholdGrossCents = toGrossCents(toCents(PRICING.FREE_SHIPPING_THRESHOLD_NET), vatRate);
  const shippingGrossFull = toGrossCents(toCents(PRICING.SHIPPING_NET), vatRate);
  const shippingCents = (merged.size === 0 || itemTotalCents >= thresholdGrossCents)
    ? 0
    : shippingGrossFull;

  const grandTotalCents = itemTotalCents + shippingCents;

  // Back out the VAT contained in the (already gross) grand total, for
  // the statutory "enthaltene MwSt." disclosure. Zero under §19 UStG.
  const vatCents = vatRate === 0
    ? 0
    : grandTotalCents - Math.round(grandTotalCents / (1 + vatRate));

  return {
    currency: PRICING.CURRENCY,
    lines,
    count,
    itemTotalCents,
    itemTotalCentsBeforeDiscount,
    discountCents,
    shippingCents,
    freeShipping: merged.size > 0 && shippingCents === 0,
    shippingGapCents: Math.max(0, thresholdGrossCents - itemTotalCents),
    vatRate,
    vatCents,
    grandTotalCents,
    smallBusiness: PRICING.SMALL_BUSINESS_19_USTG,
    coupon,
    couponError
  };
}
