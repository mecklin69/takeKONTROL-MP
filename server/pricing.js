/**
 * takeKONTROL — Server pricing
 * =================================================================
 * THE AUTHORITY. The browser sends SKUs, quantities and (optionally) a
 * coupon code and nothing else; every price, discount, tax and
 * shipping figure is computed here.
 *
 * Anyone can open devtools and rewrite localStorage.tk_cart to say a
 * Premium Backpack costs €0.01, or to claim a coupon applied when it
 * did not. If the server took the client's numbers, that is exactly
 * what they would be charged. It does not — quote() below is the only
 * thing that decides what a cart costs, coupon included.
 *
 * The maths itself lives in the shared catalogue module so the shop,
 * the cart page and this file are literally the same code path. Every
 * amount coming out of here is GROSS (VAT-inclusive) — what the
 * customer sees is what PayPal is asked to collect.
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
 * Turn an untrusted [{ sku, qty }] list, plus an optional coupon code,
 * into a priced, VAT-inclusive quote. Throws PricingError on a cart it
 * cannot price or a coupon code it does not recognise; the error
 * middleware turns that into a 400 naming the exact problem.
 *
 * @param {Array<{sku: string, qty: number}>} rawLines
 * @param {'de'|'en'} lang
 * @param {string|null} [couponCode]
 */
export function quote(rawLines, lang = 'de', couponCode = null) {
  const priced = priceCart(rawLines, { lang, strict: true, couponCode });

  return {
    currency: priced.currency,
    lines: priced.lines.map((l) => ({
      sku: l.sku,
      name: l.name,
      qty: l.qty,
      unitGross: centsToString(l.unitCents),
      lineGross: centsToString(l.lineCents),
      unitGrossBeforeDiscount: centsToString(l.unitCentsBeforeDiscount),
      lineGrossBeforeDiscount: centsToString(l.lineCentsBeforeDiscount),
      discounted: l.discounted
    })),
    itemTotalGross: centsToString(priced.itemTotalCents),
    itemTotalGrossBeforeDiscount: centsToString(priced.itemTotalCentsBeforeDiscount),
    discount: centsToString(priced.discountCents),
    discountCents: priced.discountCents,
    shippingGross: centsToString(priced.shippingCents),
    vatRate: priced.vatRate,
    vat: centsToString(priced.vatCents),
    grandTotal: centsToString(priced.grandTotalCents),
    grandTotalCents: priced.grandTotalCents,
    smallBusiness: priced.smallBusiness,
    coupon: priced.coupon,
    lang,
    quotedAt: Date.now()
  };
}

/** Did the catalogue (or the coupon) move under an in-flight order? */
export function quotesMatch(a, b) {
  return Boolean(a && b && a.grandTotalCents === b.grandTotalCents);
}
