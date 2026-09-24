/**
 * takeKONTROL — cart engine
 * =================================================================
 * The single source of truth for cart state in the browser.
 *
 * Storage key: tk_cart
 * Line schema: { sku, qty }
 *
 * Note what is NOT stored: the price. The old schema saved a price
 * alongside each line, which meant a cart left open over a price change
 * displayed a figure the server would refuse. Prices are now looked up
 * from the shared catalogue on every read, and the server re-prices
 * everything again before a cent moves.
 *
 * Totals come from priceCart() in shared/catalog.js — the same function
 * the server uses — so the number in the cart badge and the number on
 * the PayPal button cannot drift apart.
 * =================================================================
 */

import {
  CATALOG,
  PRICING,
  STORAGE_KEYS,
  fromCents,
  grossUnitPrice,
  priceCart
} from '../shared/catalog.js';
import { byId } from '../core/dom.js';
import { currentLang } from '../core/i18n.js';
import { readLocalJson, writeLocalJson } from '../core/storage.js';

/* Legacy carts were saved as { name, price, quantity } with no SKU.
   This maps those names back onto SKUs so an old cart survives. */
const NAME_TO_SKU = {};
for (const [sku, product] of Object.entries(CATALOG)) {
  NAME_TO_SKU[product.name.toLowerCase()] = sku;
  NAME_TO_SKU[product.name_de.toLowerCase()] = sku;
}

function emit(lines) {
  document.dispatchEvent(new CustomEvent('tk:cart-changed', { detail: { lines } }));
}

/**
 * Read, migrate and clean the stored cart. Unknown SKUs and unusable
 * quantities are dropped rather than thrown, because a corrupt cart
 * must not be able to break the shop.
 */
export function getLines() {
  const raw = readLocalJson(STORAGE_KEYS.CART, []);
  if (!Array.isArray(raw)) return [];

  const out = [];
  let migrated = false;

  for (const item of raw) {
    if (!item || typeof item !== 'object') { migrated = true; continue; }

    let sku = item.sku;
    if (!sku && item.name) {
      sku = NAME_TO_SKU[String(item.name).toLowerCase()];
      migrated = true;
    }
    if (!sku || !CATALOG[sku]) { migrated = true; continue; }

    const qty = Number.parseInt(item.qty != null ? item.qty : item.quantity, 10);
    if (!Number.isFinite(qty) || qty < 1) { migrated = true; continue; }

    if (item.price !== undefined || item.quantity !== undefined || item.name !== undefined) {
      migrated = true; // old schema carried fields we no longer store
    }

    const existing = out.find((line) => line.sku === sku);
    if (existing) {
      existing.qty = Math.min(existing.qty + qty, PRICING.MAX_QTY_PER_LINE);
      migrated = true;
    } else {
      out.push({ sku, qty: Math.min(qty, PRICING.MAX_QTY_PER_LINE) });
    }
  }

  if (migrated) writeLocalJson(STORAGE_KEYS.CART, out);
  return out;
}

function save(lines) {
  writeLocalJson(STORAGE_KEYS.CART, lines);
  emit(lines);
  return lines;
}

/** A display view of the cart: catalogue name and gross price joined in. */
export function getDetailedLines(lang = currentLang()) {
  return getLines().map((line) => {
    const product = CATALOG[line.sku];
    return {
      sku: line.sku,
      qty: line.qty,
      name: lang === 'en' ? product.name : product.name_de,
      price: grossUnitPrice(line.sku)
    };
  });
}

/**
 * Full VAT-inclusive breakdown, in euros, for rendering. Every amount
 * is gross. Pass a coupon code (e.g. from the checkout page) to see
 * the cart discounted; leave it out for the plain, undiscounted view
 * the cart page and shop badges use.
 */
export function totals(lang = currentLang(), couponCode = null) {
  const priced = priceCart(getLines(), { lang, strict: false, couponCode });
  return {
    count: priced.count,
    lines: priced.lines.map((line) => ({
      sku: line.sku,
      name: line.name,
      qty: line.qty,
      unitGross: fromCents(line.unitCents),
      lineGross: fromCents(line.lineCents),
      unitGrossBeforeDiscount: fromCents(line.unitCentsBeforeDiscount),
      lineGrossBeforeDiscount: fromCents(line.lineCentsBeforeDiscount),
      discounted: line.discounted
    })),
    subtotalGross: fromCents(priced.itemTotalCents),
    subtotalGrossBeforeDiscount: fromCents(priced.itemTotalCentsBeforeDiscount),
    discount: fromCents(priced.discountCents),
    shippingGross: fromCents(priced.shippingCents),
    freeShipping: priced.freeShipping,
    shippingGap: fromCents(priced.shippingGapCents),
    vatRate: priced.vatRate,
    vat: fromCents(priced.vatCents),
    total: fromCents(priced.grandTotalCents),
    smallBusiness: priced.smallBusiness,
    coupon: priced.coupon,
    couponError: priced.couponError
  };
}

/** What the checkout API wants: SKUs and quantities, nothing else. */
export const toApiLines = () => getLines().map((line) => ({ sku: line.sku, qty: line.qty }));

/* ── Mutations ──────────────────────────────────────────────────── */

export function add(sku, qty = 1) {
  if (!CATALOG[sku]) {
    console.warn('[tk-cart] unknown SKU:', sku);
    return getLines();
  }
  const amount = Number.parseInt(qty, 10) || 1;
  const lines = getLines();
  const line = lines.find((l) => l.sku === sku);

  if (line) line.qty = Math.min(line.qty + amount, PRICING.MAX_QTY_PER_LINE);
  else lines.push({ sku, qty: Math.min(amount, PRICING.MAX_QTY_PER_LINE) });

  return save(lines);
}

export function setQty(sku, qty) {
  const lines = getLines();
  const index = lines.findIndex((l) => l.sku === sku);
  if (index === -1) return lines;

  const amount = Number.parseInt(qty, 10);
  if (!Number.isFinite(amount) || amount < 1) lines.splice(index, 1);
  else lines[index].qty = Math.min(amount, PRICING.MAX_QTY_PER_LINE);

  return save(lines);
}

export function changeQty(sku, delta) {
  const line = getLines().find((l) => l.sku === sku);
  return setQty(sku, (line ? line.qty : 0) + (Number.parseInt(delta, 10) || 0));
}

export function remove(sku) {
  return save(getLines().filter((line) => line.sku !== sku));
}

export function clear() {
  return save([]);
}

export function qtyOf(sku) {
  const line = getLines().find((l) => l.sku === sku);
  return line ? line.qty : 0;
}

/* ── Presentation helpers ───────────────────────────────────────── */

export function formatEUR(amount) {
  try {
    return new Intl.NumberFormat(currentLang() === 'en' ? 'en-IE' : 'de-DE', {
      style: 'currency',
      currency: PRICING.CURRENCY
    }).format(Number(amount) || 0);
  } catch {
    return `€${(Number(amount) || 0).toFixed(2)}`;
  }
}

export function refreshBadge() {
  const badge = byId('cartBadge');
  if (!badge) return;
  const count = totals().count;
  badge.textContent = count > 99 ? '99+' : String(count);
  badge.classList.toggle('active', count > 0);
  badge.setAttribute('aria-label', `${count} item(s) in cart`);
}

export function toast(message) {
  const host = byId('toastContainer');
  if (!host) return;

  const el = document.createElement('div');
  el.className = 'toast';
  el.setAttribute('role', 'status');
  el.innerHTML =
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-red)" ' +
    'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<polyline points="20 6 9 17 4 12"></polyline></svg><span></span>';
  el.querySelector('span').textContent = message;

  host.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.remove(), 400);
  }, 2600);
}

/* ── Wiring ─────────────────────────────────────────────────────── */

/** Another tab changed the cart: re-render this one. */
window.addEventListener('storage', (event) => {
  if (event.key === STORAGE_KEYS.CART) emit(getLines());
});

document.addEventListener('tk:cart-changed', refreshBadge);
document.addEventListener('tk:lang-changed', refreshBadge);
