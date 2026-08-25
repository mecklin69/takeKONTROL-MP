/**
 * takeKONTROL — authentication
 * =================================================================
 * Google Sign-In (popup with automatic redirect fallback), email and
 * password sign-in/registration, password reset, email verification,
 * account linking, and a dashboard gated on real Firebase state.
 *
 * The source of truth for "is this person signed in" is
 * onAuthStateChanged — never localStorage. localStorage is written only
 * as a mirror so the rest of the site (the cart gate, the header) can
 * read it synchronously without waiting for the SDK.
 *
 * Language, theme, header and drawer used to be handled at the bottom
 * of this file. They are site chrome now and live in core/.
 * =================================================================
 */

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  linkWithCredential,
  fetchSignInMethodsForEmail,
  updateProfile,
  GoogleAuthProvider,
  signOut
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

import { auth, googleProvider, authReady, FIREBASE_MODE, bypassSignIn, bypassSignOut } from './firebase-config.js';
import { initDashboard, setDashboardUser } from './dashboard.js';
import { STORAGE_KEYS } from '../shared/catalog.js';
import { byId } from '../core/dom.js';
import { currentLang, t } from '../core/i18n.js';
import { readLocal, readSession, removeLocal, removeSession, writeLocal, writeSession } from '../core/storage.js';

const MIN_PASSWORD = 8;

const AUTH_VIEWS = ['loading', 'login', 'register', 'forgot', 'dashboard'];

/** Only ever redirect to a page we own. Blocks open-redirect abuse. */
const SAFE_REDIRECTS = ['cart.html', 'enquiry.html', 'takekontrol-revamp.html', 'index.html'];

let currentUser = null;

/* ═══ Firebase error codes → human sentences ══════════════════════
   Never surface error.message: it leaks internals and tells an
   attacker whether an email exists.                                */
const ERROR_MAP = {
  'auth/invalid-credential': 'err_invalid_credential',
  'auth/wrong-password': 'err_invalid_credential',
  'auth/user-not-found': 'err_invalid_credential',
  'auth/invalid-email': 'err_invalid_email',
  'auth/email-already-in-use': 'err_email_in_use',
  'auth/weak-password': 'err_weak_password',
  'auth/too-many-requests': 'err_too_many',
  'auth/network-request-failed': 'err_network',
  'auth/popup-closed-by-user': 'err_popup_closed',
  'auth/cancelled-popup-request': null,          // silent: the user retried
  'auth/user-disabled': 'err_user_disabled',
  'auth/unauthorized-domain': 'err_unauthorized_domain',
  'auth/account-exists-with-different-credential': 'err_link_prompt'
};

function messageFor(error) {
  const key = ERROR_MAP[error && error.code];
  if (key === null) return null;               // deliberately silent
  return t(key || 'err_generic');
}

/* ═══ UI helpers ══════════════════════════════════════════════════ */
function toastHost() {
  let host = byId('toastContainer');
  if (host) return host;
  host = document.createElement('div');
  host.id = 'toastContainer';
  host.className = 'toast-container';
  host.setAttribute('role', 'status');
  host.setAttribute('aria-live', 'polite');
  document.body.appendChild(host);
  return host;
}

export function showToast(message, isError = false) {
  if (!message) return;

  const toast = document.createElement('div');
  toast.className = `auth-toast${isError ? ' is-error' : ''}`;
  toast.textContent = message;                 // textContent, not innerHTML
  toastHost().appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, isError ? 5200 : 3500);
}

/** Inline error under a form — survives longer than a toast. */
function setFormError(viewName, message) {
  const box = byId(`error-${viewName}`);
  if (!box) return;
  box.textContent = message || '';
  box.hidden = !message;
}

const clearFormErrors = () => ['login', 'register', 'forgot'].forEach((v) => setFormError(v, ''));

function setBusy(button, busy) {
  if (!button) return;
  if (busy) {
    if (button.dataset.idleHtml === undefined) button.dataset.idleHtml = button.innerHTML;
    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
    button.textContent = t('toast_wait');
  } else {
    button.disabled = false;
    button.removeAttribute('aria-busy');
    if (button.dataset.idleHtml !== undefined) {
      button.innerHTML = button.dataset.idleHtml;
      delete button.dataset.idleHtml;
    }
  }
}

const isTouchDevice = () => Boolean(window.matchMedia && window.matchMedia('(hover: none)').matches);

export function switchView(viewName) {
  clearFormErrors();
  for (const view of document.querySelectorAll('.auth-view')) view.classList.remove('active');

  const target = byId(`view-${viewName}`);
  if (target) {
    target.classList.add('active');
    const focusable = target.querySelector('input, button, a');
    if (viewName !== 'loading' && focusable && !isTouchDevice()) {
      setTimeout(() => focusable.focus({ preventScroll: true }), 60);
    }
  }
  if (AUTH_VIEWS.includes(viewName) && viewName !== 'loading') {
    window.history.replaceState(null, '', `#${viewName}`);
  }
}

/* ═══ Session mirror + redirect routing ═══════════════════════════ */
function mirrorSession(user) {
  if (user) {
    writeLocal(STORAGE_KEYS.LOGGED_IN, 'true');
    writeLocal(STORAGE_KEYS.USER_EMAIL, user.email || '');
    writeLocal(STORAGE_KEYS.USER_UID, user.uid);
    const first = (user.displayName || '').trim().split(/\s+/)[0];
    if (first) writeLocal(STORAGE_KEYS.USER_NAME, first);
    return;
  }
  for (const key of [
    STORAGE_KEYS.LOGGED_IN,
    STORAGE_KEYS.USER_EMAIL,
    STORAGE_KEYS.USER_UID,
    STORAGE_KEYS.USER_NAME
  ]) removeLocal(key);
}

function pendingRedirect() {
  const target = readSession(STORAGE_KEYS.REDIRECT_AFTER_LOGIN);
  if (!target) return null;
  removeSession(STORAGE_KEYS.REDIRECT_AFTER_LOGIN);
  const file = target.split(/[?#]/)[0].replace(/^.*\//, '');
  return SAFE_REDIRECTS.includes(file) ? file : null;
}

function afterSignIn(user, successKey) {
  mirrorSession(user);
  showToast(t(successKey));
  const target = pendingRedirect();
  setTimeout(() => {
    if (target) window.location.href = target;
    else {
      switchView('dashboard');
      renderDashboard(user);
    }
  }, 1100);
}

function reportAuthError(error, viewName) {
  console.error('[tk-auth]', error && error.code, error && error.message);
  const message = messageFor(error);
  if (!message) return;
  setFormError(viewName, message);
  showToast(message, true);

  if (error && error.code === 'auth/unauthorized-domain') {
    console.error(
      `[tk-auth] Add "${window.location.hostname}" under Firebase Console → ` +
      'Authentication → Settings → Authorised domains.'
    );
  }
}

/* ═══ Google sign-in ══════════════════════════════════════════════
   Popup first (it keeps the page state), redirect when the popup is
   blocked or unsupported — which is the norm inside the Instagram,
   Facebook and LinkedIn in-app browsers, and on older iOS Safari.   */
const POPUP_UNSUPPORTED = new Set([
  'auth/popup-blocked',
  'auth/operation-not-supported-in-this-environment',
  'auth/web-storage-unsupported',
  'auth/popup-closed-by-user'   // some in-app browsers report this instantly
]);

let googleInFlight = false;

export async function googleSignIn(triggerButton) {
  if (googleInFlight) return;
  googleInFlight = true;
  clearFormErrors();
  setBusy(triggerButton, true);

  try {
    await authReady;
    const result = await signInWithPopup(auth, googleProvider);
    await onGoogleSuccess(result.user);
  } catch (error) {
    // The password account already owns this email → link the two.
    if (error.code === 'auth/account-exists-with-different-credential') {
      await stashPendingLink(error);
      return;
    }

    if (POPUP_UNSUPPORTED.has(error.code) && error.code !== 'auth/popup-closed-by-user') {
      showToast(t('toast_popup_fallback'));
      try {
        await signInWithRedirect(auth, googleProvider);
        return;                                  // the page navigates away
      } catch (redirectError) {
        reportAuthError(redirectError, 'login');
      }
    } else if (error.code === 'auth/popup-closed-by-user') {
      // The popup opened and the user closed it: no fallback, no scary error.
      const message = messageFor(error);
      if (message) showToast(message, true);
    } else {
      reportAuthError(error, 'login');
    }
  } finally {
    setBusy(triggerButton, false);
    googleInFlight = false;
  }
}

async function onGoogleSuccess(user) {
  // Google addresses are verified by Google, so nothing else to do.
  if (user.displayName) writeLocal(STORAGE_KEYS.USER_NAME, user.displayName.split(' ')[0]);
  await completePendingLink(user);
  afterSignIn(user, 'toast_login_success');
}

/**
 * Account linking, part 1. Google returned "this email already has a
 * password account". Keep the Google credential in sessionStorage, drop
 * the user on the login form, and explain what to do.
 */
async function stashPendingLink(error) {
  const credential = GoogleAuthProvider.credentialFromError(error);
  const email = (error.customData && error.customData.email) || '';

  if (credential && email) {
    writeSession('tk_pending_cred', JSON.stringify(credential.toJSON()));
    writeSession('tk_pending_email', email);
  }

  let methods = [];
  try {
    methods = await fetchSignInMethodsForEmail(auth, email);
  } catch { /* not important enough to interrupt the flow */ }

  switchView('login');
  const emailInput = byId('login-email');
  if (emailInput && email) {
    emailInput.value = email;
    byId('login-pass')?.focus();
  }

  setFormError('login', t('err_link_prompt'));
  showToast(t('err_link_prompt'), true);
  console.info('[tk-auth] existing sign-in methods for that email:', methods);
}

/**
 * Account linking, part 2. Runs after ANY successful sign-in: if a
 * Google credential is waiting and the emails match, attach it so the
 * Google button works from now on.
 */
async function completePendingLink(user) {
  const raw = readSession('tk_pending_cred');
  const email = readSession('tk_pending_email');
  if (!raw || !email) return;

  removeSession('tk_pending_cred');
  removeSession('tk_pending_email');
  if (!user.email || user.email.toLowerCase() !== email.toLowerCase()) return;

  try {
    const credential = GoogleAuthProvider.credentialFromJSON(JSON.parse(raw));
    if (credential) {
      await linkWithCredential(user, credential);
      showToast(t('err_linked'));
    }
  } catch (error) {
    console.warn('[tk-auth] linking failed:', error && error.code);
  }
}

/* ═══ Email and password ══════════════════════════════════════════ */
export async function handleAuth(event, type) {
  event.preventDefault();
  const form = event.currentTarget || event.target;
  const button = form.querySelector('button[type="submit"]');
  clearFormErrors();
  setBusy(button, true);

  try {
    await authReady;

    if (type === 'login') {
      const email = form.querySelector('#login-email').value.trim().toLowerCase();
      const password = form.querySelector('#login-pass').value;

      if (!FIREBASE_MODE) {
        // Local bypass: check test credentials, no Firebase call
        const result = await bypassSignIn(email, password);
        afterSignIn(result.user, 'toast_login_success');
        return;
      }

      const credential = await signInWithEmailAndPassword(auth, email, password);
      await completePendingLink(credential.user);
      afterSignIn(credential.user, 'toast_login_success');
    } else if (type === 'register') {
      const first = form.querySelector('#reg-first').value.trim();
      const last = form.querySelector('#reg-last').value.trim();
      const email = form.querySelector('#reg-email').value.trim().toLowerCase();
      const password = form.querySelector('#reg-pass').value;
      const confirm = form.querySelector('#reg-pass-confirm').value;

      if (password.length < MIN_PASSWORD) throw { code: 'auth/weak-password' };
      if (password !== confirm) {
        setFormError('register', t('err_pass_mismatch'));
        return;
      }

      const credential = await createUserWithEmailAndPassword(auth, email, password);
      const fullName = [first, last].filter(Boolean).join(' ');
      if (fullName) await updateProfile(credential.user, { displayName: fullName });
      if (first) writeLocal(STORAGE_KEYS.USER_NAME, first);

      sendEmailVerification(credential.user).catch(() => { /* non-blocking */ });
      afterSignIn(credential.user, 'toast_reg_success');
    } else if (type === 'forgot') {
      const email = form.querySelector('#forgot-email').value.trim().toLowerCase();
      try {
        await sendPasswordResetEmail(auth, email);
      } catch (error) {
        // Deliberately swallow user-not-found: confirming which emails
        // are registered is an account-enumeration leak.
        if (error.code !== 'auth/user-not-found') throw error;
      }
      showToast(t('toast_reset_success'));
      switchView('login');
    }
  } catch (error) {
    reportAuthError(error, type);
  } finally {
    setBusy(button, false);
  }
}

export async function handleLogout() {
  try {
    if (FIREBASE_MODE) await signOut(auth);
    else bypassSignOut();
    mirrorSession(null);
    for (const id of ['login-email', 'login-pass']) {
      const el = byId(id);
      if (el) el.value = '';
    }
    showToast(t('toast_logout'));
    switchView('login');
  } catch (error) {
    reportAuthError(error, 'login');
  }
}

/* ═══ Dashboard ═══════════════════════════════════════════════════ */
function renderDashboard(user) {
  currentUser = user;
  setDashboardUser(user);
  initDashboard(user);
  greetUser();

  const email = byId('dash-email');
  if (email) email.textContent = user ? (user.email || '') : '';

  const avatar = byId('dash-avatar');
  if (avatar) {
    if (user && user.photoURL) {
      avatar.referrerPolicy = 'no-referrer';   // Google blocks hot-linking without this
      avatar.src = user.photoURL;
      avatar.hidden = false;
    } else {
      avatar.hidden = true;
    }
  }

  const initials = byId('dash-initials');
  if (initials) {
    const source = (user && (user.displayName || user.email)) || '';
    initials.textContent = source.trim().charAt(0).toUpperCase() || '?';
    initials.hidden = Boolean(user && user.photoURL);
  }

  // Verification banner — only for password accounts.
  const banner = byId('verify-banner');
  if (banner) {
    const usesPassword = Boolean(user && user.providerData.some((p) => p.providerId === 'password'));
    banner.hidden = !(user && usesPassword && !user.emailVerified);
  }
}

function greetUser() {
  const el = byId('user-greeting');
  if (!el) return;

  let name = currentUser ? (currentUser.displayName || '').trim().split(/\s+/)[0] : '';
  if (!name) name = readLocal(STORAGE_KEYS.USER_NAME, '') || '';

  if (currentLang() === 'en') el.textContent = name ? `Welcome back, ${name}!` : 'Welcome back!';
  else el.textContent = name ? `Willkommen zurück, ${name}!` : 'Willkommen zurück!';
}

export async function resendVerification(event) {
  const button = event && event.currentTarget;
  if (!auth.currentUser) return;
  setBusy(button, true);
  try {
    await sendEmailVerification(auth.currentUser);
    showToast(t('verify_sent'));
  } catch (error) {
    reportAuthError(error, 'login');
  } finally {
    setBusy(button, false);
  }
}

/* ═══ Password visibility ═════════════════════════════════════════ */
export function togglePassword(event, inputId) {
  const input = byId(inputId);
  const button = event && event.currentTarget;
  if (!input) return;

  const show = input.type === 'password';
  input.type = show ? 'text' : 'password';
  if (button) {
    button.setAttribute('aria-label', show ? t('hide_pass') : t('show_pass'));
    button.setAttribute('aria-pressed', show ? 'true' : 'false');
  }
}

/* ═══ Boot ════════════════════════════════════════════════════════ */
export async function initAuth() {
  // Show the spinner until Firebase has actually spoken. Without this
  // the login form flashes for a second before the dashboard appears.
  switchView('loading');
  document.addEventListener('tk:lang-changed', greetUser);

  await authReady;

  // Returning from signInWithRedirect?
  try {
    const result = await getRedirectResult(auth);
    if (result && result.user) {
      await onGoogleSuccess(result.user);
      return;
    }
  } catch (error) {
    if (error.code === 'auth/account-exists-with-different-credential') await stashPendingLink(error);
    else reportAuthError(error, 'login');
  }

  // The real gate. Fires on load, sign-in, sign-out and token expiry.
  onAuthStateChanged(auth, (user) => {
    mirrorSession(user);
    if (user) {
      currentUser = user;
      const target = pendingRedirect();
      if (target) {
        window.location.href = target;
        return;
      }
      switchView('dashboard');
      renderDashboard(user);
    } else {
      currentUser = null;
      const hash = (window.location.hash || '').replace('#', '');
      switchView(['register', 'forgot'].includes(hash) ? hash : 'login');
    }
  }, (error) => {
    reportAuthError(error, 'login');
    switchView('login');
  });
}
