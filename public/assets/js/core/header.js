/**
 * takeKONTROL — sticky header behaviour
 * =================================================================
 * Adds .scrolled to #navbar past a threshold, drives the optional
 * scroll-progress bar, and swaps the logo for the dark-on-light variant
 * once the header background turns solid.
 *
 * Every page had its own copy of this with a different threshold (10 px
 * on checkout, 50 px elsewhere, 60 px in the unused main.js). One
 * threshold now, defined here.
 * =================================================================
 */

import { byId } from './dom.js';

export const SCROLL_THRESHOLD = 50;

const LOGO_DEFAULT = 'assets/img/TakeKONTROL Logo.png';
const LOGO_ON_LIGHT = 'assets/img/take-kontrol-black-logo.png';

export function initHeader() {
  const navbar = byId('navbar');
  const progressBar = byId('scrollProgressBar');
  const logo = byId('navLogo');
  if (!navbar && !progressBar) return;

  let ticking = false;

  const update = () => {
    ticking = false;
    const scrolled = window.scrollY > SCROLL_THRESHOLD;

    if (navbar) navbar.classList.toggle('scrolled', scrolled);

    if (logo) {
      const light = (document.documentElement.getAttribute('data-theme') || 'light') === 'light';
      const target = scrolled && light ? LOGO_ON_LIGHT : LOGO_DEFAULT;
      if (!logo.getAttribute('src').endsWith(target.split('/').pop())) {
        logo.setAttribute('src', target);
      }
    }

    if (progressBar) {
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = height > 0 ? (window.scrollY / height) * 100 : 0;
      progressBar.style.width = `${progress}%`;
    }
  };

  const schedule = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  };

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  document.addEventListener('tk:theme-changed', update);
  update();
}
