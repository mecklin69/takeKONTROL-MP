/**
 * takeKONTROL — Q&A / FAQ page
 * =================================================================
 * Renders the 13 question/answer pairs from i18n/faq.js as click-to-
 * expand rows, same accordion mechanics as the shop's checklist items:
 * a <button> head toggling a sibling body via hidden + aria-expanded.
 * =================================================================
 */

import { initSite } from '../core/site.js';
import { dictionary } from '../i18n/faq.js';
import { byId, onReady } from '../core/dom.js';
import { currentLang, t } from '../core/i18n.js';
import * as cart from '../cart/engine.js';

const FAQ_COUNT = 13;

function renderFaqList() {
  const host = byId('faqList');
  if (!host) return;

  host.innerHTML = Array.from({ length: FAQ_COUNT }, (_, i) => {
    const n = i + 1;
    return `<div class="faq-item">
      <button class="faq-item__head" type="button" aria-expanded="false">
        <span class="faq-item__q" data-i18n="faq_q${n}">${t(`faq_q${n}`)}</span>
        <span class="chev" aria-hidden="true"><i class="fa-solid fa-chevron-down"></i></span>
      </button>
      <div class="faq-item__body" hidden>
        <p data-i18n="faq_a${n}">${t(`faq_a${n}`)}</p>
      </div>
    </div>`;
  }).join('');
}

function toggleFaqItem(head) {
  const row = head.closest('.faq-item');
  const body = head.nextElementSibling;
  if (!row || !body) return;
  const open = body.hidden;
  body.hidden = !open;
  head.setAttribute('aria-expanded', String(open));
  row.classList.toggle('is-open', open);
}

initSite({ dictionary });

onReady(() => {
  renderFaqList();
  cart.refreshBadge();

  document.addEventListener('click', (event) => {
    const head = event.target.closest('.faq-item__head');
    if (head) { event.preventDefault(); toggleFaqItem(head); }
  });

  document.addEventListener('tk:lang-changed', renderFaqList);
});
