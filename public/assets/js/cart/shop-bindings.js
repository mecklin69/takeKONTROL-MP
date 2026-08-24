/**
 * takeKONTROL — shop bindings
 * =================================================================
 * Upgrades the markup's .add-to-cart-btn and "View Included Items"
 * buttons into real controls: icon, label, live quantity, keyboard
 * support, and labels that survive a language switch.
 *
 * These buttons own their own labels. The i18n sweep is told to leave
 * them alone (their data-i18n attribute is removed on upgrade) because
 * the two used to fight and the sweep won, wiping out the chevron.
 * =================================================================
 */

import { CATALOG } from '../shared/catalog.js';
import { $$ } from '../core/dom.js';
import { currentLang, t as translate } from '../core/i18n.js';
import * as cart from './engine.js';

const LABELS = {
  en: {
    add: 'Add to Cart',
    addShort: 'Add',
    inCart: 'In Cart',
    added: 'Added',
    view: 'View Included Items',
    hide: 'Hide Included Items',
    toastAdd: 'Added to cart'
  },
  de: {
    add: 'In den Warenkorb',
    addShort: 'Hinzufügen',
    inCart: 'Im Warenkorb',
    added: 'Hinzugefügt',
    view: 'Enthaltene Artikel ansehen',
    hide: 'Artikel ausblenden',
    toastAdd: 'Zum Warenkorb hinzugefügt'
  }
};

const label = (key) => LABELS[currentLang()][key];
const productName = (sku) => (currentLang() === 'en' ? CATALOG[sku].name : CATALOG[sku].name_de);

const CART_ICON =
  '<svg class="atc-icon" width="17" height="17" viewBox="0 0 24 24" fill="none" ' +
  'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle>' +
  '<path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>';

const CHECK_ICON =
  '<svg class="atc-check" width="17" height="17" viewBox="0 0 24 24" fill="none" ' +
  'stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<polyline points="20 6 9 17 4 12"></polyline></svg>';

const CHEVRON_ICON =
  '<svg class="vi-chevron" width="13" height="13" viewBox="0 0 24 24" fill="none" ' +
  'stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<polyline points="6 9 12 15 18 9"></polyline></svg>';

/* ── Add to cart ────────────────────────────────────────────────── */

function paintButton(btn) {
  const labelEl = btn.querySelector('.atc-label');
  if (!labelEl) return;
  if (btn.dataset.state === 'added') return; // transient flash, leave it

  const qty = cart.qtyOf(btn.dataset.sku);
  const countEl = btn.querySelector('.atc-count');
  const compact = btn.dataset.cartStyle === 'compact';

  if (qty > 0) {
    btn.classList.add('in-cart');
    labelEl.textContent = label('inCart');
    if (countEl) { countEl.textContent = String(qty); countEl.hidden = false; }
    btn.setAttribute('aria-label', `${label('inCart')} — ${qty}`);
  } else {
    btn.classList.remove('in-cart');
    labelEl.textContent = compact ? label('addShort') : label('add');
    if (countEl) countEl.hidden = true;
    btn.setAttribute('aria-label', `${label('add')} — ${productName(btn.dataset.sku)}`);
  }
}

const paintAll = () => $$('.add-to-cart-btn').forEach(paintButton);

function upgradeAddButton(btn) {
  // Resolve the SKU: explicit data-sku wins, otherwise match on the name.
  if (!btn.dataset.sku) {
    const name = (btn.dataset.name || '').toLowerCase();
    const found = Object.keys(CATALOG).find((sku) => CATALOG[sku].name.toLowerCase() === name);
    if (found) btn.dataset.sku = found;
  }

  const sku = btn.dataset.sku;
  if (!sku || !CATALOG[sku]) {
    console.warn('[tk-cart] add-to-cart button has no resolvable SKU:', btn);
    return;
  }

  // Keep the catalogue price authoritative on the markup too.
  btn.dataset.price = String(CATALOG[sku].price);

  if (!btn.querySelector('.atc-label')) {
    const compact = btn.dataset.cartStyle === 'compact';
    btn.innerHTML =
      CART_ICON + CHECK_ICON +
      `<span class="atc-label">${compact ? label('addShort') : label('add')}</span>` +
      '<span class="atc-count" hidden></span>';
  }

  btn.classList.add('btn-cart');
  btn.setAttribute('role', 'button');
  btn.setAttribute('tabindex', '0');
  btn.removeAttribute('data-i18n');
  btn.removeAttribute('data-localize');

  paintButton(btn);
}

function handleAdd(btn) {
  const sku = btn.dataset.sku;
  if (!sku) return;

  cart.add(sku, 1);
  cart.toast(`${label('toastAdd')}: ${productName(sku)}`);

  btn.dataset.state = 'added';
  btn.classList.add('is-added');
  btn.querySelector('.atc-label').textContent = label('added');

  const countEl = btn.querySelector('.atc-count');
  if (countEl) { countEl.textContent = String(cart.qtyOf(sku)); countEl.hidden = false; }

  clearTimeout(btn._tkTimer);
  btn._tkTimer = setTimeout(() => {
    btn.classList.remove('is-added');
    delete btn.dataset.state;
    paintButton(btn);
  }, 1200);
}

/* ── "View Included Items" ──────────────────────────────────────── */

function panelFor(btn) {
  if (btn.dataset.target) return document.getElementById(btn.dataset.target);
  const scope = btn.closest('.product-card-bottom')
    || btn.closest('.shelf-info')
    || btn.closest('.product-card');
  return scope ? scope.querySelector('.expandable .content') : null;
}

/* Prefer the page's own wording ("View Complete Checklist") over the
   generic fallback, so a bespoke label is not flattened on a language
   switch. */
function resolveViewLabel(btn) {
  const key = btn.dataset.i18nKey;
  if (key) {
    const value = translate(key);
    if (value !== key) return value;
  }
  return btn.dataset.labelShow || (btn.textContent || '').trim() || label('view');
}

function upgradeViewButton(btn) {
  const panel = panelFor(btn);
  if (!panel) return;

  if (!panel.id) panel.id = `tk-items-${Math.random().toString(36).slice(2, 9)}`;
  btn.dataset.target = panel.id;
  btn.classList.add('view-items-btn');
  btn.setAttribute('aria-expanded', panel.classList.contains('open') ? 'true' : 'false');
  btn.setAttribute('aria-controls', panel.id);
  btn.setAttribute('role', 'button');

  if (!btn.querySelector('.vi-label')) {
    for (const attribute of ['data-i18n', 'data-localize']) {
      if (btn.hasAttribute(attribute)) {
        btn.dataset.i18nKey = btn.getAttribute(attribute);
        btn.removeAttribute(attribute);
      }
    }
    btn.dataset.labelShow = resolveViewLabel(btn);
    btn.dataset.labelHide = label('hide');
    btn.innerHTML = `<span class="vi-label"></span>${CHEVRON_ICON}`;
    btn.querySelector('.vi-label').textContent = btn.dataset.labelShow;
  }
}

function toggleView(btn) {
  const panel = document.getElementById(btn.dataset.target);
  if (!panel) return;

  const open = panel.classList.toggle('open');
  btn.classList.toggle('is-open', open);
  btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  btn.querySelector('.vi-label').textContent = open
    ? (btn.dataset.labelHide || label('hide'))
    : (btn.dataset.labelShow || label('view'));
  if (open) panel.scrollTop = 0;
}

/* ── Boot ───────────────────────────────────────────────────────── */

export function initShopBindings() {
  const addButtons = $$('.add-to-cart-btn');
  const viewButtons = $$('.view-items-btn, [data-view-items]');
  if (addButtons.length === 0 && viewButtons.length === 0) return;

  addButtons.forEach(upgradeAddButton);
  viewButtons.forEach(upgradeViewButton);

  // The old chevron row inside .expandable is retired. Neutralised here
  // as well as hidden in CSS, belt and braces.
  for (const el of $$('.expandable > .toggle')) {
    el.removeAttribute('onclick');
    el.setAttribute('aria-hidden', 'true');
    el.style.display = 'none';
    el.style.pointerEvents = 'none';
  }

  document.addEventListener('click', (event) => {
    const addBtn = event.target.closest('.add-to-cart-btn');
    if (addBtn) { event.preventDefault(); handleAdd(addBtn); return; }

    const viewBtn = event.target.closest('.view-items-btn, [data-view-items]');
    if (viewBtn) { event.preventDefault(); toggleView(viewBtn); }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const el = event.target.closest('.add-to-cart-btn, .view-items-btn, [data-view-items]');
    if (!el) return;
    event.preventDefault();
    el.click();
  });

  document.addEventListener('tk:cart-changed', paintAll);
  document.addEventListener('tk:lang-changed', () => {
    paintAll();
    for (const btn of $$('.view-items-btn')) {
      const panel = document.getElementById(btn.dataset.target);
      const open = panel && panel.classList.contains('open');
      btn.dataset.labelShow = resolveViewLabel(btn);
      btn.dataset.labelHide = label('hide');
      const labelEl = btn.querySelector('.vi-label');
      if (labelEl) labelEl.textContent = open ? btn.dataset.labelHide : btn.dataset.labelShow;
    }
  });

  cart.refreshBadge();
}
