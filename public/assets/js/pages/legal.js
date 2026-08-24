/**
 * takeKONTROL — product safety and legal page
 * Chrome plus the two scroll flourishes this page owns.
 */

import { initSite } from '../core/site.js';
import { dictionary } from '../i18n/legal.js';
import { $$, byId, onReady } from '../core/dom.js';
import { readSession, writeSession } from '../core/storage.js';
import * as cart from '../cart/engine.js';

const SCROLLED_KEY = 'ps_read_scrolled';

/**
 * Section titles fill with colour as they cross the viewport: empty at
 * 85 % of the screen height, full by 40 %.
 */
function initTitleFills() {
  const titles = $$('.title-fill-text');
  if (titles.length === 0) return;

  const update = () => {
    const viewportHeight = window.innerHeight;
    const start = viewportHeight * 0.85;
    const end = viewportHeight * 0.40;

    for (const title of titles) {
      const raw = (start - title.getBoundingClientRect().top) / (start - end);
      const progress = Math.max(0, Math.min(1, raw));
      title.style.setProperty('--fill-width', `${progress * 100}%`);
    }
  };

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();   // catch headers already in view on load
}

/** The scroll hint goes away for the rest of the session on first scroll. */
function initScrollHint() {
  const hint = byId('scrollHint');
  if (!hint) return;

  if (readSession(SCROLLED_KEY) === 'true') {
    hint.style.display = 'none';
    return;
  }

  window.addEventListener('scroll', function hide() {
    if (window.scrollY <= 100) return;
    hint.classList.add('hidden');
    writeSession(SCROLLED_KEY, 'true');
    window.removeEventListener('scroll', hide);
  }, { passive: true });
}

initSite({ dictionary });

onReady(() => {
  initTitleFills();
  initScrollHint();
  cart.refreshBadge();
});
