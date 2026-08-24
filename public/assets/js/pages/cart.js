/**
 * takeKONTROL — cart page
 * Chrome plus the cart renderer. All arithmetic lives in the engine.
 */

import { initSite } from '../core/site.js';
import { dictionary } from '../i18n/cart.js';
import { onReady } from '../core/dom.js';
import { initCartPage, proceedToCheckout } from '../cart/cart-page.js';
import * as cart from '../cart/engine.js';

initSite({ dictionary });

onReady(() => {
  initCartPage();
  cart.refreshBadge();
});

// Published for the inline onclick still in cart.html.
window.proceedToCheckout = proceedToCheckout;
