/**
 * takeKONTROL — account page
 * Chrome plus Firebase authentication.
 */

import { initSite } from '../core/site.js';
import { dictionary } from '../i18n/login.js';
import { onReady } from '../core/dom.js';
import {
  googleSignIn,
  handleAuth,
  handleLogout,
  initAuth,
  resendVerification,
  switchView,
  togglePassword
} from '../auth/auth.js';

initSite({ dictionary });

onReady(() => {
  initAuth().catch((error) => console.error('[tk-auth] boot failed', error));
});

/* Published for the inline onclick / onsubmit attributes in login.html.
   Module scope is not global scope, so without this the markup's
   handlers would silently do nothing. */
Object.assign(window, {
  switchView,
  handleAuth,
  handleLogout,
  togglePassword,
  resendVerification,
  signInWithGoogle: (event) => googleSignIn(event && event.currentTarget),
  simulateGoogleLogin: (event) => googleSignIn(event && event.currentTarget)
});
