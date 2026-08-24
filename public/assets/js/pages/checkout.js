/**
 * takeKONTROL — checkout page
 * Chrome plus the three-step payment flow.
 *
 * Google Translate is deliberately off here, as it always was: a
 * machine-translation layer rewriting a legally binding order summary
 * while a payment is in flight is not a risk worth taking.
 */

import { initSite } from '../core/site.js';
import { dictionary } from '../i18n/checkout.js';
import { onReady } from '../core/dom.js';
import { initCheckout } from '../checkout/flow.js';
import { proceedToCheckout } from '../cart/cart-page.js';
import * as cart from '../cart/engine.js';

initSite({ dictionary, googleTranslate: false });

onReady(() => {
  cart.refreshBadge();
  initCheckout();
});

window.proceedToCheckout = proceedToCheckout;
