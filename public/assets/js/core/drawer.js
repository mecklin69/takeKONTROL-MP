/**
 * takeKONTROL — mobile navigation drawer
 * =================================================================
 * Opens on #openDrawer, closes on #closeDrawer, on the overlay, on any
 * link inside it, and on Escape. Focus moves into the drawer when it
 * opens and returns to the button when it closes, which the seven
 * hand-rolled copies this replaces never did.
 * =================================================================
 */

import { $$, byId } from './dom.js';

export function initDrawer() {
  const drawer = byId('mobileDrawer');
  const overlay = byId('drawerOverlay');
  const openBtn = byId('openDrawer');
  const closeBtn = byId('closeDrawer');
  if (!drawer) return;

  let lastFocused = null;

  const isOpen = () => drawer.classList.contains('active');

  const open = () => {
    lastFocused = document.activeElement;
    drawer.classList.add('active');
    if (overlay) overlay.classList.add('active');
    drawer.setAttribute('aria-hidden', 'false');
    if (openBtn) openBtn.setAttribute('aria-expanded', 'true');
    const first = drawer.querySelector('a, button');
    if (first) first.focus({ preventScroll: true });
  };

  const close = () => {
    if (!isOpen()) return;
    drawer.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    drawer.setAttribute('aria-hidden', 'true');
    if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus({ preventScroll: true });
    }
  };

  drawer.setAttribute('aria-hidden', 'true');
  if (openBtn) {
    openBtn.setAttribute('aria-expanded', 'false');
    openBtn.addEventListener('click', open);
  }
  if (closeBtn) closeBtn.addEventListener('click', close);
  if (overlay) overlay.addEventListener('click', close);

  for (const link of $$('.drawer-link, .drawer-nav a', drawer)) {
    link.addEventListener('click', close);
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close();
  });
}
