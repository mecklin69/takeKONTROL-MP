/**
 * takeKONTROL — site chrome
 * =================================================================
 * Everything every page needs and nothing any single page owns:
 * language, theme, sticky header, mobile drawer, the optional Google
 * Translate layer, and the right-click deterrent.
 *
 * A page entry module is expected to be two lines:
 *
 *     import { initSite } from '../core/site.js';
 *     import { dictionary } from '../i18n/cart.js';
 *     initSite({ dictionary });
 *
 * Anything more than that belongs in that page's own module.
 * =================================================================
 */

import { initI18n } from './i18n.js';
import { initTheme } from './theme.js';
import { initHeader } from './header.js';
import { initDrawer } from './drawer.js';
import { mountGoogleTranslate, syncGoogleTranslate } from './translate.js';
import { initProtect } from '../vendor/protect.js';
import { onReady } from './dom.js';

export function initSite({ dictionary = null, googleTranslate = true, protect = true } = {}) {
  onReady(() => {
    initTheme();
    initI18n(dictionary);
    initHeader();
    initDrawer();

    if (protect) initProtect();

    if (googleTranslate) {
      mountGoogleTranslate();
      document.addEventListener('tk:lang-changed', (event) => {
        syncGoogleTranslate(event.detail.lang);
      });
    }
  });
}
