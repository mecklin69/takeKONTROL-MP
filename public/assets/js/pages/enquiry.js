/**
 * takeKONTROL — enquiry page
 * =================================================================
 * The original enquiry.js put AWS credentials directly in the browser:
 *
 *   accessKeyId: "AKIA6GBMBKXGGNAOVBHA"
 *   secretAccessKey: "KMuC8JVZkg0+..."
 *
 * Those are now compromised. Rotate them in the AWS IAM console before
 * running this in production. The new approach: the browser POSTs to
 * our own server (/api/enquiry), which writes to DynamoDB using
 * server-held credentials that never appear in a response.
 *
 * Behaviour and UI are identical to the original.
 * =================================================================
 */

import { initSite } from '../core/site.js';
import { dictionary } from '../i18n/enquiry.js';
import { $$, byId, onReady } from '../core/dom.js';
import { currentLang } from '../core/i18n.js';
import * as cart from '../cart/engine.js';

const API_BASE = String(window.TK_API_BASE || '').replace(/\/$/, '');

const MESSAGES = {
  de: {
    nameRequired: 'Bitte geben Sie Ihren Namen ein.',
    emailRequired: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
    messageRequired: 'Bitte schreiben Sie eine Nachricht.',
    consentRequired: 'Bitte stimmen Sie der Datenverarbeitung zu.',
    sending: 'Wird gespeichert…',
    idle: 'Anfrage senden →',
    serverError: 'Beim Speichern Ihrer Anfrage ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder schreiben Sie uns an info@takekontrol.de.'
  },
  en: {
    nameRequired: 'Please enter your name.',
    emailRequired: 'Please enter a valid email address.',
    messageRequired: 'Please write a message.',
    consentRequired: 'Please accept the data policy to proceed.',
    sending: 'Saving…',
    idle: 'Send Enquiry →',
    serverError: 'There was an error saving your enquiry. Please try again or email us at info@takekontrol.de.'
  }
};

const t = (key) => MESSAGES[currentLang()][key];

/* ── Type selector ── */
export function selectType(el) {
  for (const o of $$('.type-option')) o.classList.remove('selected');
  el.classList.add('selected');

  const val = el.dataset.val;
  const bizFields = byId('business-fields');
  const personalLabel = byId('personal-section-label');

  if (val === 'business' || val === 'municipality' || val === 'wholesale') {
    if (bizFields) bizFields.style.display = 'block';
    if (personalLabel) personalLabel.textContent = currentLang() === 'en' ? '04 — Your enquiry' : '04 — Ihre Anfrage';
  } else {
    if (bizFields) bizFields.style.display = 'none';
    if (personalLabel) personalLabel.textContent = currentLang() === 'en' ? '03 — Your enquiry' : '03 — Ihre Anfrage';
  }
}

/* ── Form submit ── */
export async function submitForm() {
  const val = (id) => byId(id)?.value.trim() || '';
  const selected = document.querySelector('.type-option.selected');

  const first   = val('f-first');
  const last    = val('f-last');
  const email   = val('f-email');
  const message = val('f-message');
  const consent = byId('f-consent')?.checked;

  if (!first || !last) { alert(t('nameRequired')); return; }
  if (!email || !email.includes('@')) { alert(t('emailRequired')); return; }
  if (!message) { alert(t('messageRequired')); return; }
  if (!consent) { alert(t('consentRequired')); return; }

  const btn = byId('submit-label');
  if (btn) btn.textContent = t('sending');

  const payload = {
    type: selected?.dataset.val || 'personal',
    firstName: first,
    lastName: last,
    email,
    phone: val('f-phone'),
    company: val('f-company'),
    role: val('f-role'),
    size: byId('f-size')?.value || '',
    industry: byId('f-industry')?.value || '',
    product: byId('f-product')?.value || '',
    budget: byId('f-budget')?.value || '',
    message,
    consent: true,
    lang: currentLang()
  };

  try {
    const res = await fetch(`${API_BASE}/api/enquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    // Success — same behaviour as the original
    byId('form-fields')?.style.setProperty('display', 'none');
    byId('form-success')?.classList.add('visible');
  } catch (err) {
    console.error('[enquiry] submit failed:', err.message);
    alert(t('serverError'));
    if (btn) btn.textContent = t('idle');
  }
}

/* ── Scroll reveal (from original enquiry.js) ── */
function initReveal() {
  const els = $$('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      setTimeout(() => entry.target.classList.add('in'), i * 80);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.06 });
  els.forEach((el) => io.observe(el));
}

/* ── Boot ── */
initSite({ dictionary });

onReady(() => {
  cart.refreshBadge();
  initReveal();
  for (const option of $$('#type-selector .type-option')) {
    option.addEventListener('click', () => selectType(option));
  }
});

window.selectType = selectType;
window.submitForm = submitForm;
