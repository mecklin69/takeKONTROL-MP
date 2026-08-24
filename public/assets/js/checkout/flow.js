/**
 * takeKONTROL — checkout flow
 * =================================================================
 * Three steps: address → review → pay. The client never computes a
 * price it sends anywhere; it asks the server to quote the cart and
 * displays what comes back.
 *
 * Everything that can hang has a deadline, and every unclear outcome
 * resolves to "we are checking" rather than a guess in either
 * direction. Telling someone their payment failed when it succeeded is
 * worse than making them wait ten seconds.
 * =================================================================
 */

import { PRICING, STORAGE_KEYS } from '../shared/catalog.js';
import { $$, byId, escapeHtml, setText } from '../core/dom.js';
import { currentLang } from '../core/i18n.js';
import { readLocalJson, removeLocal, writeLocalJson } from '../core/storage.js';
import * as cart from '../cart/engine.js';

const API_BASE = String(window.TK_API_BASE || '').replace(/\/$/, '');

const TIMEOUTS = {
  SDK_LOAD: 12_000,        // PayPal script blocked or slow → manual fallback
  API: 20_000,             // any call to our own server
  QUOTE_TTL: PRICING.QUOTE_TTL_MS,
  RECOVERY_POLL: 3_000,
  RECOVERY_MAX: 40_000     // ~13 polls before we hand over to support
};

const STEPS = ['address', 'review', 'pay', 'done'];

const FIELDS = [
  'firstName', 'lastName', 'email', 'phone', 'street',
  'houseNumber', 'addressExtra', 'postalCode', 'city', 'country'
];

const REQUIRED_FIELDS = ['firstName', 'lastName', 'email', 'street', 'houseNumber', 'postalCode', 'city'];

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;

const state = {
  step: 'address',
  quote: null,
  order: null,
  quotedAt: 0,
  paying: false,
  serverOk: false
};

/* ── Runtime messages ─────────────────────────────────────────────
   These never appear in the markup, so they live here rather than in
   the page dictionary.                                              */
const MESSAGES = {
  de: {
    empty: 'Ihr Warenkorb ist leer.',
    toShop: 'Zum Shop',
    priceChanged: 'Die Preise haben sich geändert. Bitte prüfen Sie die neue Summe.',
    quoteExpired: 'Ihre Preisangabe ist abgelaufen. Wir haben sie aktualisiert.',
    required: 'Bitte füllen Sie dieses Feld aus.',
    badEmail: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
    badPlz: 'Eine deutsche PLZ besteht aus 5 Ziffern.',
    needTerms: 'Bitte bestätigen Sie AGB und Widerrufsbelehrung.',
    sdkFailed: 'PayPal konnte nicht geladen werden. Sie können stattdessen per Überweisung bezahlen.',
    offline: 'Keine Internetverbindung. Ihre Eingaben bleiben gespeichert.',
    declined: 'Diese Zahlungsquelle wurde abgelehnt. Bitte wählen Sie eine andere.',
    cancelled: 'Zahlung abgebrochen. Ihr Warenkorb ist unverändert.',
    unclear: 'Wir prüfen Ihre Zahlung. Bitte schließen Sie dieses Fenster nicht.',
    unclearLong: 'Die Prüfung dauert länger als erwartet. Ihre Bestellnummer ist {n} – bitte notieren Sie sie und wenden Sie sich an support@takekontrol.de, falls Sie in 15 Minuten keine E-Mail erhalten.',
    paid: 'Zahlung erhalten.',
    pending: 'Zahlung wird von PayPal geprüft. Sie erhalten eine E-Mail, sobald sie bestätigt ist.',
    serverDown: 'Der Bezahldienst ist nicht erreichbar. Ihre Artikel werden unten angezeigt, die Endsumme können wir gerade nicht bestätigen.',
    retry: 'Erneut versuchen',
    provisional: 'Vorläufige Summe – wird vor der Zahlung bestätigt.',
    cannotPay: 'Zahlung ist erst möglich, wenn die Preise bestätigt sind. Bitte versuchen Sie es erneut.',
    transferOk: 'Bestellung vorgemerkt. Überweisungsdetails erhalten Sie per E-Mail.',
    free: 'Kostenlos',
    vatLabel: 'zzgl. {r} % MwSt.',
    vatLabelPlain: 'MwSt.'
  },
  en: {
    empty: 'Your cart is empty.',
    toShop: 'Back to shop',
    priceChanged: 'Prices have changed. Please check the new total.',
    quoteExpired: 'Your quote expired. We have refreshed it.',
    required: 'Please fill in this field.',
    badEmail: 'Please enter a valid email address.',
    badPlz: 'A German postcode has 5 digits.',
    needTerms: 'Please accept the terms and the right of withdrawal.',
    sdkFailed: 'PayPal could not be loaded. You can pay by bank transfer instead.',
    offline: 'No internet connection. Your details are saved.',
    declined: 'That payment method was declined. Please choose another.',
    cancelled: 'Payment cancelled. Your cart is unchanged.',
    unclear: 'We are checking your payment. Please do not close this window.',
    unclearLong: 'This is taking longer than expected. Your order number is {n} — please note it and contact support@takekontrol.de if you receive no email within 15 minutes.',
    paid: 'Payment received.',
    pending: 'PayPal is reviewing the payment. You will get an email once it clears.',
    serverDown: 'The payment service is unreachable. Your items are shown below, but we cannot confirm the final total right now.',
    retry: 'Try again',
    provisional: 'Provisional total — confirmed before you pay.',
    cannotPay: 'Payment stays locked until prices are confirmed. Please try again.',
    transferOk: 'Order reserved. Transfer details are on their way by email.',
    free: 'Free',
    vatLabel: 'VAT {r} %',
    vatLabelPlain: 'VAT'
  }
};

const t = (key) => MESSAGES[currentLang()][key] || key;

/* ── Transport with a deadline ────────────────────────────────────── */
async function api(path, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeout || TIMEOUTS.API);
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(body.error || `HTTP ${res.status}`);
      err.status = res.status;
      err.payload = body;
      throw err;
    }
    return body;
  } catch (err) {
    if (err.name === 'AbortError') {
      const timeout = new Error('TIMEOUT');
      timeout.status = 504;
      throw timeout;
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

/* ── Banner ───────────────────────────────────────────────────────── */
function banner(message, kind = 'error', onRetry) {
  const el = byId('checkoutBanner');
  if (!el) return;

  el.textContent = '';
  el.className = `checkout-banner ${kind}`;
  el.hidden = !message;
  if (!message) return;

  el.appendChild(document.createTextNode(message));
  if (onRetry) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'banner-retry';
    button.textContent = t('retry');
    button.addEventListener('click', onRetry);
    el.appendChild(button);
  }
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ── Steps ────────────────────────────────────────────────────────── */
function goToStep(step) {
  state.step = step;

  for (const el of $$('.checkout-step')) {
    el.classList.toggle('active', el.dataset.step === step);
  }
  for (const el of $$('.progress-node')) {
    const index = STEPS.indexOf(el.dataset.step);
    const now = STEPS.indexOf(step);
    el.classList.toggle('current', index === now);
    el.classList.toggle('complete', index < now);
  }

  // Clearing per-step validation messages is right, but the
  // server-unreachable warning must survive — it is still true.
  if (state.serverOk) banner('');
  else banner(t('serverDown'), 'warn', () => refreshQuote());

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── Address form ─────────────────────────────────────────────────── */
function readForm() {
  const out = {};
  for (const field of FIELDS) {
    const el = byId(`ship-${field}`);
    if (el) out[field] = el.value.trim();
  }
  return out;
}

const saveDraft = () => writeLocalJson(STORAGE_KEYS.CHECKOUT_DRAFT, readForm());

function restoreDraft() {
  const draft = readLocalJson(STORAGE_KEYS.CHECKOUT_DRAFT);
  if (!draft) return;
  for (const [key, value] of Object.entries(draft)) {
    const el = byId(`ship-${key}`);
    if (el && value) el.value = value;
  }
}

function fieldError(name, message) {
  const el = byId(`ship-${name}`);
  const slot = byId(`err-${name}`);
  if (el) el.setAttribute('aria-invalid', message ? 'true' : 'false');
  if (slot) {
    slot.textContent = message || '';
    slot.hidden = !message;
  }
  return !message;
}

function validateAddress() {
  const values = readForm();
  let ok = true;

  for (const field of REQUIRED_FIELDS) {
    ok = fieldError(field, values[field] ? '' : t('required')) && ok;
  }
  if (values.email && !EMAIL_PATTERN.test(values.email)) {
    ok = fieldError('email', t('badEmail')) && ok;
  }
  if (values.country === 'DE' && values.postalCode && !/^\d{5}$/.test(values.postalCode)) {
    ok = fieldError('postalCode', t('badPlz')) && ok;
  }

  const terms = byId('accept-terms');
  if (terms && !terms.checked) {
    banner(t('needTerms'));
    ok = false;
  }

  if (!ok) {
    const first = document.querySelector('[aria-invalid="true"]');
    if (first) first.focus();
  }
  return ok;
}

/* ── Quote ────────────────────────────────────────────────────────── */
async function refreshQuote({ quiet = false } = {}) {
  const lines = cart.toApiLines();
  if (lines.length === 0) {
    renderEmpty();
    return null;
  }

  try {
    const quote = await api('/api/quote', {
      method: 'POST',
      body: JSON.stringify({ lines, lang: currentLang() })
    });
    state.quote = quote;
    state.quotedAt = Date.now();
    state.serverOk = true;
    renderSummary(quote);
    setPayLocked(false);
    if (!quiet) banner('');
    return quote;
  } catch (err) {
    // The server is the price authority, but a shopper staring at a
    // panel of em-dashes has no idea whether their cart survived. Show
    // what we know locally, mark it provisional, and keep the pay step
    // locked until the server confirms.
    state.serverOk = false;
    renderLocalSummary();
    setPayLocked(true);
    banner(t('serverDown'), 'warn', () => refreshQuote());
    console.warn('[checkout] quote failed:', err.message,
      '— is the checkout server running, and is TK_API_BASE correct?');
    return null;
  }
}

const quoteStale = () => !state.quote || (Date.now() - state.quotedAt) > TIMEOUTS.QUOTE_TTL;

/** Lock everything that would take money while prices are unconfirmed. */
function setPayLocked(locked) {
  for (const id of ['toPay', 'manualBtn']) {
    const el = byId(id);
    if (el) el.disabled = locked;
  }
  const note = byId('provisionalNote');
  if (note && !locked) note.hidden = true;
}

/* ── Rendering ────────────────────────────────────────────────────── */
function money(value) {
  const currency = (state.quote && state.quote.currency) || PRICING.CURRENCY;
  try {
    return new Intl.NumberFormat(currentLang() === 'en' ? 'en-IE' : 'de-DE', {
      style: 'currency',
      currency
    }).format(Number(value));
  } catch {
    return `€${Number(value).toFixed(2)}`;
  }
}

function renderEmpty() {
  const host = byId('checkoutRoot');
  if (!host) return;
  host.innerHTML =
    `<div class="checkout-empty"><p>${escapeHtml(t('empty'))}</p>` +
    `<a class="btn btn-primary" href="takekontrol-revamp.html">${escapeHtml(t('toShop'))} →</a></div>`;
}

function renderLineList(lines, formatLine) {
  const host = byId('summaryLines');
  if (!host) return;
  host.innerHTML = lines.map((line) =>
    '<div class="sum-line">' +
      `<span class="sum-qty">${line.qty}×</span>` +
      `<span class="sum-name">${escapeHtml(line.name)}</span>` +
      `<span class="sum-val">${formatLine(line)}</span>` +
    '</div>').join('');
}

function renderSummary(quote) {
  renderLineList(quote.lines, (line) => money(line.lineNet));

  setText('sumItems', money(quote.itemTotalNet));
  setText('sumShipping', Number(quote.shippingNet) === 0 ? t('free') : money(quote.shippingNet));
  setText('sumVat', money(quote.vat));
  setText('sumVatLabel', quote.smallBusiness
    ? t('vatLabelPlain')
    : t('vatLabel').replace('{r}', String(Math.round(quote.vatRate * 100))));
  setText('sumTotal', money(quote.grandTotal));

  const vatRow = byId('sumVatRow');
  if (vatRow) vatRow.hidden = quote.smallBusiness;

  const note = byId('provisionalNote');
  if (note) note.hidden = true;
}

/**
 * Client-side mirror of the cart, used ONLY when the server cannot be
 * reached. Nothing computed here is ever sent anywhere or charged; the
 * server re-prices the order before a cent moves.
 */
function renderLocalSummary() {
  const sums = cart.totals();
  renderLineList(sums.lines, (line) => cart.formatEUR(line.lineNet));

  setText('sumItems', cart.formatEUR(sums.subtotalNet));
  setText('sumShipping', sums.shippingNet === 0 ? t('free') : cart.formatEUR(sums.shippingNet));
  setText('sumVat', cart.formatEUR(sums.vat));
  setText('sumTotal', cart.formatEUR(sums.total));

  const note = byId('provisionalNote');
  if (note) {
    note.textContent = t('provisional');
    note.hidden = false;
  }
}

function renderReview() {
  const values = readForm();
  const country = byId('ship-country');
  const countryName = country ? country.options[country.selectedIndex].text : values.country;

  setText('reviewAddress',
    `${values.firstName} ${values.lastName}\n` +
    `${values.street} ${values.houseNumber}${values.addressExtra ? `, ${values.addressExtra}` : ''}\n` +
    `${values.postalCode} ${values.city}\n${countryName}`);
  setText('reviewContact', values.email + (values.phone ? ` · ${values.phone}` : ''));

  const address = byId('reviewAddress');
  if (address) address.style.whiteSpace = 'pre-line';
}

/* ── PayPal SDK, guarded by a deadline ────────────────────────────── */
function loadPayPalSdk(clientId, currency) {
  return new Promise((resolve, reject) => {
    if (window.paypal) {
      resolve(window.paypal);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?${new URLSearchParams({
      'client-id': clientId,
      currency: currency || PRICING.CURRENCY,
      intent: 'capture',
      locale: currentLang() === 'en' ? 'en_US' : 'de_DE',
      components: 'buttons',
      'disable-funding': 'credit'
    })}`;
    script.async = true;

    // An ad blocker or a corporate proxy can swallow this script and
    // never fire onerror, so the timer is the real guard.
    const timer = setTimeout(() => reject(new Error('SDK_TIMEOUT')), TIMEOUTS.SDK_LOAD);
    script.onload = () => {
      clearTimeout(timer);
      if (window.paypal) resolve(window.paypal);
      else reject(new Error('SDK_EMPTY'));
    };
    script.onerror = () => {
      clearTimeout(timer);
      reject(new Error('SDK_ERROR'));
    };
    document.head.appendChild(script);
  });
}

async function mountPayPal() {
  const host = byId('paypal-buttons');
  if (!host) return;
  host.innerHTML = '';

  let config;
  try {
    config = await api('/api/config');
  } catch {
    // Our own API is unreachable, so the bank-transfer route (which also
    // needs it) would fail too. Offer a retry, not a dead button.
    byId('paypalLoading')?.setAttribute('hidden', '');
    setPayLocked(true);
    banner(t('serverDown'), 'error', () => mountPayPal());
    return;
  }

  if (!config.clientId) {
    showManualFallback(t('sdkFailed'));
    return;
  }

  let sdk;
  try {
    sdk = await loadPayPalSdk(config.clientId, config.currency);
  } catch {
    showManualFallback(t('sdkFailed'));
    return;
  }

  byId('paypalLoading')?.setAttribute('hidden', '');

  sdk.Buttons({
    style: { layout: 'vertical', shape: 'pill', label: 'paypal', height: 48 },

    createOrder: async () => {
      banner('');
      if (quoteStale()) {
        await refreshQuote();
        banner(t('quoteExpired'), 'info');
      }

      const order = await api('/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          lines: cart.toApiLines(),
          lang: currentLang(),
          shipping: readForm()
        })
      });

      state.order = order;
      // Remembered so a browser crash mid-payment is recoverable.
      writeLocalJson(STORAGE_KEYS.PENDING_ORDER, { orderId: order.orderId, at: Date.now() });

      if (order.quote.grandTotal !== state.quote?.grandTotal) {
        state.quote = order.quote;
        renderSummary(order.quote);
        banner(t('priceChanged'), 'info');
      }
      return order.paypalOrderId;
    },

    onApprove: async () => {
      state.paying = true;
      setPaying(true);
      try {
        const result = await api(`/api/orders/${state.order.orderId}/capture`, { method: 'POST' });
        if (result.status === 'PAID') return finish(result.orderNumber, 'paid');
        if (result.status === 'PENDING') return finish(result.orderNumber, 'pending');
        return startRecovery();
      } catch (err) {
        if (err.payload?.error === 'INSTRUMENT_DECLINED') {
          // The SDK re-renders and lets the buyer pick another source.
          banner(t('declined'));
          setPaying(false);
          return undefined;
        }
        if (err.payload?.error === 'PRICE_CHANGED') {
          state.quote = err.payload.newQuote;
          if (err.payload.newQuote) renderSummary(err.payload.newQuote);
          banner(t('priceChanged'));
          setPaying(false);
          return undefined;
        }
        // Timeout or 5xx: we do not know. Poll, never assume failure.
        return startRecovery();
      }
    },

    onCancel: () => {
      setPaying(false);
      banner(t('cancelled'), 'info');
    },

    onError: (err) => {
      console.error('[paypal]', err);
      setPaying(false);
      if (state.order) startRecovery();
      else banner(t('serverDown'));
    }
  }).render('#paypal-buttons').catch(() => showManualFallback(t('sdkFailed')));
}

function setPaying(on) {
  state.paying = on;
  byId('payingOverlay')?.toggleAttribute('hidden', !on);
  for (const button of $$('.checkout-back')) button.disabled = on;
}

/* ── Recovery: capture outcome unknown ────────────────────────────── */
async function startRecovery() {
  banner(t('unclear'), 'info');
  setPaying(true);
  const started = Date.now();

  while (Date.now() - started < TIMEOUTS.RECOVERY_MAX) {
    await new Promise((resolve) => setTimeout(resolve, TIMEOUTS.RECOVERY_POLL));
    try {
      const status = await api(`/api/orders/${state.order.orderId}`, { timeout: 8_000 });
      if (status.status === 'PAID') return finish(status.orderNumber, 'paid');
      if (status.status === 'PENDING') return finish(status.orderNumber, 'pending');
      if (status.status === 'DENIED') {
        setPaying(false);
        banner(t('declined'));
        return undefined;
      }
    } catch { /* keep polling */ }
  }

  // Out of patience, still unresolved. Give them the order number and a
  // route to a human rather than a spinner forever.
  setPaying(false);
  banner(t('unclearLong').replace('{n}', state.order?.orderNumber || '—'));
  return undefined;
}

/**
 * @param {'paid'|'pending'|'transfer'} kind — 'transfer' used to fall
 * through to the "Payment received" message, telling a bank-transfer
 * customer they had already paid. It has its own message now.
 */
function finish(orderNumber, kind) {
  setPaying(false);
  removeLocal(STORAGE_KEYS.PENDING_ORDER);
  removeLocal(STORAGE_KEYS.CHECKOUT_DRAFT);
  cart.clear();

  const message = kind === 'pending' ? t('pending')
    : kind === 'transfer' ? t('transferOk')
      : t('paid');

  setText('doneOrderNumber', orderNumber);
  setText('doneMessage', message);
  byId('doneIcon')?.classList.toggle('pending', kind !== 'paid');
  goToStep('done');
  return undefined;
}

/* ── Manual fallback ──────────────────────────────────────────────── */
function showManualFallback(reason) {
  byId('paypalLoading')?.setAttribute('hidden', '');
  const box = byId('manualFallback');
  if (box) box.hidden = false;
  banner(reason, 'warn');
}

async function submitManual() {
  if (!validateAddress()) {
    goToStep('address');
    return;
  }

  const button = byId('manualBtn');
  if (button) button.disabled = true;

  try {
    let order = state.order;
    if (!order) {
      order = await api('/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          lines: cart.toApiLines(),
          lang: currentLang(),
          shipping: readForm()
        })
      });
      state.order = order;
    }
    const result = await api(`/api/orders/${order.orderId}/manual`, { method: 'POST' });
    finish(result.orderNumber, 'transfer');
  } catch {
    banner(t('serverDown'));
    if (button) button.disabled = false;
  }
}

/* ── Interrupted session recovery on load ─────────────────────────── */
async function resumeIfInterrupted() {
  const pending = readLocalJson(STORAGE_KEYS.PENDING_ORDER);
  if (!pending || Date.now() - pending.at > 60 * 60 * 1000) {
    removeLocal(STORAGE_KEYS.PENDING_ORDER);
    return false;
  }

  try {
    const status = await api(`/api/orders/${pending.orderId}`, { timeout: 8_000 });
    if (status.status === 'PAID' || status.status === 'PENDING') {
      state.order = { orderId: pending.orderId, orderNumber: status.orderNumber };
      finish(status.orderNumber, status.status === 'PENDING' ? 'pending' : 'paid');
      return true;
    }
  } catch { /* server unreachable; carry on normally */ }
  return false;
}

/* ── Boot ─────────────────────────────────────────────────────────── */
export async function initCheckout() {
  if (await resumeIfInterrupted()) return;

  if (cart.toApiLines().length === 0) {
    renderEmpty();
    return;
  }

  restoreDraft();
  for (const field of FIELDS) {
    byId(`ship-${field}`)?.addEventListener('input', () => {
      fieldError(field, '');
      saveDraft();
    });
  }

  byId('toReview')?.addEventListener('click', async () => {
    if (!validateAddress()) return;
    saveDraft();
    if (quoteStale() || !state.serverOk) {
      const quote = await refreshQuote();
      if (!quote) {
        banner(t('cannotPay'), 'error', () => refreshQuote());
        return;
      }
    }
    renderReview();
    goToStep('review');
  });

  byId('toPay')?.addEventListener('click', async () => {
    if (quoteStale() || !state.serverOk) {
      const quote = await refreshQuote();
      if (!quote) {
        banner(t('cannotPay'), 'error', () => refreshQuote());
        return;
      }
    }
    goToStep('pay');
    mountPayPal();
  });

  for (const button of $$('.checkout-back')) {
    button.addEventListener('click', () => goToStep(button.dataset.target));
  }

  byId('manualBtn')?.addEventListener('click', submitManual);

  window.addEventListener('offline', () => banner(t('offline'), 'warn'));
  window.addEventListener('online', () => refreshQuote());

  // Guard against a stray back-button or reload mid-payment.
  window.addEventListener('beforeunload', (event) => {
    if (!state.paying) return;
    event.preventDefault();
    event.returnValue = '';
  });

  document.addEventListener('tk:lang-changed', () => {
    if (state.quote) renderSummary(state.quote);
    else renderLocalSummary();
  });

  goToStep('address');
  await refreshQuote();
}
