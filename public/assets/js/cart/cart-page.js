/**
 * takeKONTROL — cart page
 * =================================================================
 * Renders the line items and the VAT summary on cart.html. All state
 * and all arithmetic come from the cart engine, which shares its
 * pricing function with the server.
 * =================================================================
 */

import { byId, escapeHtml, setText } from '../core/dom.js';
import { currentLang } from '../core/i18n.js';
import * as cart from './engine.js';

const TXT = {
  de: {
    empty: 'Ihr Warenkorb ist derzeit leer.',
    emptyCta: 'Zum Shop',
    remove: 'Entfernen',
    each: 'je Stück, zzgl. MwSt.',
    subtotal: 'Zwischensumme (netto)',
    shipping: 'Versand (netto)',
    free: 'Kostenlos',
    vat: 'zzgl. 19 % MwSt.',
    total: 'Gesamtsumme (inkl. MwSt.)',
    freeHint: 'Noch {amt} bis zum kostenlosen Versand.',
    freeGot: 'Versandkostenfrei.',
    note: 'Alle Preise inkl. gesetzlicher MwSt. (19 %, §12 UStG). Versand innerhalb Deutschlands.',
    smallBiz: 'Gemäß §19 UStG wird keine Umsatzsteuer berechnet (Kleinunternehmerregelung).',
    emptyAlert: 'Ihr Warenkorb ist leer.',
    qtyLabel: 'Menge'
  },
  en: {
    empty: 'Your cart is currently empty.',
    emptyCta: 'Browse the shop',
    remove: 'Remove',
    each: 'each, excl. VAT',
    subtotal: 'Subtotal (net)',
    shipping: 'Shipping (net)',
    free: 'Free',
    vat: 'VAT 19 %',
    total: 'Total (incl. VAT)',
    freeHint: 'Add {amt} more for free shipping.',
    freeGot: 'You qualify for free shipping.',
    note: 'Prices include statutory German VAT (19 %, §12 UStG). Shipping within Germany.',
    smallBiz: 'No VAT charged in accordance with §19 UStG (small business regulation).',
    emptyAlert: 'Your cart is empty.',
    qtyLabel: 'Quantity'
  }
};

const t = (key) => TXT[currentLang()][key];

function renderLines(container, lines) {
  if (lines.length === 0) {
    container.innerHTML =
      '<div class="empty-cart-msg">' +
        `<div>${escapeHtml(t('empty'))}</div>` +
        '<a href="takekontrol-revamp.html" class="btn btn-primary" style="margin-top:22px;">' +
          `${escapeHtml(t('emptyCta'))} →</a>` +
      '</div>';
    return;
  }

  container.innerHTML = lines.map((line) => `
    <div class="cart-item" data-sku="${escapeHtml(line.sku)}">
      <div class="cart-item-info">
        <div class="cart-item-title">${escapeHtml(line.name)}</div>
        <div class="cart-item-price">${cart.formatEUR(line.unitNet)} ${escapeHtml(t('each'))}</div>
        <div class="cart-item-sku">${escapeHtml(line.sku)}</div>
      </div>
      <div class="cart-item-actions">
        <div class="qty-controls" role="group" aria-label="${escapeHtml(t('qtyLabel'))}">
          <button class="qty-btn" type="button" data-act="dec" aria-label="−">−</button>
          <input class="qty-val" type="text" inputmode="numeric" value="${line.qty}"
                 aria-label="${escapeHtml(t('qtyLabel'))}" data-act="set">
          <button class="qty-btn" type="button" data-act="inc" aria-label="+">+</button>
        </div>
        <div class="item-total">${cart.formatEUR(line.lineNet)}</div>
        <button class="remove-btn" type="button" data-act="remove">${escapeHtml(t('remove'))}</button>
      </div>
    </div>`).join('');
}

export function renderCart() {
  const container = byId('cartItemsContainer');
  if (!container) return;

  const sums = cart.totals();
  renderLines(container, sums.lines);

  setText('cartSubtotalLabel', t('subtotal'));
  setText('cartSubtotal', cart.formatEUR(sums.subtotalNet));

  setText('cartShippingLabel', t('shipping'));
  setText('cartShipping', sums.lines.length === 0
    ? cart.formatEUR(0)
    : (sums.shippingNet === 0 ? t('free') : cart.formatEUR(sums.shippingNet)));

  const vatRow = byId('cartVatRow');
  if (vatRow) vatRow.hidden = sums.smallBusiness;
  setText('cartVatLabel', t('vat'));
  setText('cartVat', cart.formatEUR(sums.vat));

  setText('cartTotalLabel', t('total'));
  setText('cartTotal', cart.formatEUR(sums.total));

  const hint = byId('cartShippingHint');
  if (hint) {
    if (sums.lines.length === 0) {
      hint.hidden = true;
    } else if (sums.freeShipping) {
      hint.hidden = false;
      hint.textContent = t('freeGot');
      hint.className = 'shipping-hint good';
    } else {
      hint.hidden = false;
      hint.textContent = t('freeHint').replace('{amt}', cart.formatEUR(sums.shippingGap));
      hint.className = 'shipping-hint';
    }
  }

  setText('cartVatNote', sums.smallBusiness ? t('smallBiz') : t('note'));

  const checkout = byId('checkoutBtn');
  if (checkout) checkout.disabled = sums.lines.length === 0;
}

export function proceedToCheckout() {
  if (cart.getLines().length === 0) {
    window.alert(t('emptyAlert'));
    return;
  }
  window.location.href = 'checkout.html';
}

export function initCartPage() {
  const container = byId('cartItemsContainer');
  if (!container) return;

  container.addEventListener('click', (event) => {
    const button = event.target.closest('[data-act]');
    if (!button || button.tagName === 'INPUT') return;
    const sku = button.closest('.cart-item').dataset.sku;

    if (button.dataset.act === 'inc') cart.changeQty(sku, 1);
    else if (button.dataset.act === 'dec') cart.changeQty(sku, -1);
    else if (button.dataset.act === 'remove') cart.remove(sku);
  });

  container.addEventListener('change', (event) => {
    const input = event.target.closest('input[data-act="set"]');
    if (!input) return;
    cart.setQty(input.closest('.cart-item').dataset.sku, input.value);
  });

  container.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && event.target.matches('input[data-act="set"]')) {
      event.preventDefault();
      event.target.blur();
    }
  });

  const checkoutBtn = byId('checkoutBtn');
  if (checkoutBtn) checkoutBtn.addEventListener('click', proceedToCheckout);

  document.addEventListener('tk:cart-changed', renderCart);
  document.addEventListener('tk:lang-changed', renderCart);
  renderCart();
}
