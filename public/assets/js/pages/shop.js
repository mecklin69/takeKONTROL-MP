/**
 * takeKONTROL — shop page
 * Site chrome, the product carousels, the add-to-cart bindings and the
 * placeholder for product photos that have not been uploaded yet.
 */

import { initSite } from '../core/site.js';
import { dictionary } from '../i18n/shop.js';
import { STORAGE_KEYS } from '../shared/catalog.js';
import { $$, byId, onReady } from '../core/dom.js';
import { readLocal, writeSession } from '../core/storage.js';
import { initShopBindings } from '../cart/shop-bindings.js';
import { initTicker } from '../features/ticker.js';
import { initShopMobile } from '../features/shop-mobile.js';
import { initLightbox } from '../features/lightbox.js';
import * as cart from '../cart/engine.js';

/* ── Image fallback ─────────────────────────────────────────────── */
const PLACEHOLDER = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">' +
  '<rect width="100%" height="100%" fill="#f5f5f7"/>' +
  '<g fill="none" stroke="#b32020" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" opacity="0.55">' +
  '<rect x="60" y="70" width="280" height="180" rx="10"/>' +
  '<circle cx="130" cy="130" r="18"/>' +
  '<path d="M60 210l70-60 55 45 55-55 60 70"/>' +
  '</g></svg>'
)}`;

export function tkImgFallback(img) {
  img.onerror = null;
  img.src = PLACEHOLDER;
}

/**
 * The markup carries onerror="tkImgFallback(this)". Attaching a
 * delegated listener as well would be pointless — error events do not
 * bubble — so the global export is what makes this work.
 */
window.tkImgFallback = tkImgFallback;

/* ── Login gate ─────────────────────────────────────────────────── */
export function requireLogin(event, destination) {
  if (event) event.preventDefault();
  if (readLocal(STORAGE_KEYS.LOGGED_IN) === 'true') {
    window.location.href = destination;
    return;
  }
  writeSession(STORAGE_KEYS.REDIRECT_AFTER_LOGIN, destination);
  window.location.href = 'login.html';
}

window.requireLogin = requireLogin;

/* Retired: the chevron row inside .expandable is no longer a control.
   The "View Included Items" button owns that now. Kept as a no-op so a
   stray inline handler in the markup stays inert. */
window.toggleExpand = () => false;

/* ── Product carousels ──────────────────────────────────────────── */
const SWIPE_THRESHOLD = 50;

function initCarousel(trackId) {
  const track = byId(trackId);
  if (!track) return;

  const container = track.closest('.product-image-container');
  if (!container) return;

  const slides = Array.from(track.children);
  const dots = $$('.dot', container);
  const nextButton = container.querySelector('.next-btn');
  const prevButton = container.querySelector('.prev-btn');
  const swipeHint = container.querySelector('.swipe-hint');
  if (slides.length === 0) return;

  let index = 0;
  let touchStartX = 0;

  const show = (next, { fromUser = true } = {}) => {
    index = (next + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    // The hint says "swipe for more photos"; once they have interacted
    // at all, it has served its purpose.
    if (fromUser && swipeHint) swipeHint.classList.add('hidden');
  };

  nextButton?.addEventListener('click', () => show(index + 1));
  prevButton?.addEventListener('click', () => show(index - 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => show(i)));

  track.addEventListener('touchstart', (event) => {
    touchStartX = event.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', (event) => {
    const delta = event.changedTouches[0].screenX - touchStartX;
    if (Math.abs(delta) < SWIPE_THRESHOLD) return;
    show(delta < 0 ? index + 1 : index - 1);
  }, { passive: true });

  show(0, { fromUser: false });
}

/* ── Boot ───────────────────────────────────────────────────────── */
initSite({ dictionary, googleTranslate: false });

onReady(() => {
  initShopBindings();
  initTicker();
  cart.refreshBadge();
  ['carouselHomeKit', 'carouselEssential', 'carouselStandard', 'carouselPremium'].forEach(initCarousel);
  initShopMobile();
  initLightbox();
});
