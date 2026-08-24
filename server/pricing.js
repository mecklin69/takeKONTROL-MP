/**
 * takeKONTROL — Server pricing
 * =================================================================
 * THE AUTHORITY. The browser sends SKUs and quantities and nothing
 * else; every price, tax and shipping figure is computed here.
 *
 * Anyone can open devtools and rewrite localStorage.tk_cart to say a
 * Premium Backpack costs €0.01. If the server took the client's price,
 * that is exactly what they would be charged. It does not.
 *
 * The maths itself lives in the shared catalogue module so the shop,
 * the cart page and this file are literally the same code path.
 * =================================================================
 */

import {
  PRICING,
  PricingError,
  centsToString,
  priceCart
} from '../public/assets/js/shared/catalog.js';

export { PRICING, PricingError };

/**
 * Turn an untrusted [{ sku, qty }] list into a priced, tax-broken-down
 * quote. Throws PricingError on anything it does not recognise.
 *
 * @param {Array<{sku: string, qty: number}>} rawLines
 * @param {'de'|'en'} lang
 */
export function quote(rawLines, lang = 'de') {
  const priced = priceCart(rawLines, { lang, strict: true });

  return {
    currency: priced.currency,
    lines: priced.lines.map((l) => ({
      sku: l.sku,
      name: l.name,
      qty: l.qty,
      unitNet: centsToString(l.unitCents),
      lineNet: centsToString(l.lineCents)
    })),
    itemTotalNet: centsToString(priced.itemTotalCents),
    shippingNet: centsToString(priced.shippingCents),
    vatRate: priced.vatRate,
    vat: centsToString(priced.vatCents),
    grandTotal: centsToString(priced.grandTotalCents),
    grandTotalCents: priced.grandTotalCents,
    smallBusiness: priced.smallBusiness,
    quotedAt: Date.now()
  };
}

/** Did the catalogue move under an in-flight order? */
export function quotesMatch(a, b) {
  return Boolean(a && b && a.grandTotalCents === b.grandTotalCents);
}
