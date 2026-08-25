/**
 * takeKONTROL — Firebase bootstrap
 * =================================================================
 * Fill in the values from Firebase console → Project settings → your
 * web app. Until you do, a local bypass account is active.
 *
 * LOCAL BYPASS
 * When apiKey is still REPLACE_ME, Firebase is skipped entirely.
 * One hardcoded test account is accepted:
 *   dhoop@gmail.com  /  Rohitdhoop123#
 * =================================================================
 */

import { initializeApp }        from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  GoogleAuthProvider
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

/* ── Test credentials for the local bypass ── */
const BYPASS_EMAIL    = 'dhoop@gmail.com';
const BYPASS_PASSWORD = 'Rohitdhoop123#';

const firebaseConfig = {
  apiKey: "AIzaSyAob0uqTOYmR1uk_f5TSLJRMlijNGwf_zo",
  authDomain: "takekontrol-mp.firebaseapp.com",
  projectId: "takekontrol-mp",
  storageBucket: "takekontrol-mp.firebasestorage.app",
  messagingSenderId: "749324107038",
  appId: "1:749324107038:web:50d6ef262154e7c95d1d0f",
  measurementId: "G-Q8YPMYLTDD"
};

export const FIREBASE_MODE = firebaseConfig.apiKey !== 'REPLACE_ME';

/* ── Bypass auth (when Firebase is not configured) ── */
const bypassListeners = [];
let   bypassUser      = null;

function makeBypassUser(email) {
  return {
    uid:           'local-bypass-uid',
    email,
    displayName:   'Test User',
    photoURL:      null,
    emailVerified: true,
    providerData:  [{ providerId: 'password' }]
  };
}

const bypassAuth = {
  currentUser: null,
  onAuthStateChanged(listener) {
    bypassListeners.push(listener);
    setTimeout(() => listener(bypassUser), 0);
    return () => {};
  }
};

export async function bypassSignIn(email, password) {
  if (FIREBASE_MODE) return null;
  if (email.trim().toLowerCase() === BYPASS_EMAIL.toLowerCase()
      && password === BYPASS_PASSWORD) {
    bypassUser = makeBypassUser(email.trim().toLowerCase());
    bypassAuth.currentUser = bypassUser;
    bypassListeners.forEach(fn => fn(bypassUser));
    return { user: bypassUser };
  }
  const err = new Error('auth/invalid-credential');
  err.code = 'auth/invalid-credential';
  throw err;
}

export function bypassSignOut() {
  if (FIREBASE_MODE) return null;
  bypassUser = null;
  bypassAuth.currentUser = null;
  bypassListeners.forEach(fn => fn(null));
}

/* ── Real Firebase or bypass exports ── */
export let app           = null;
export let auth          = bypassAuth;
export let googleProvider = null;
export let authReady     = Promise.resolve();

if (FIREBASE_MODE) {
  try {
    app           = initializeApp(firebaseConfig);
    auth          = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });
    authReady     = setPersistence(auth, browserLocalPersistence).catch(err => {
      console.warn('[tk-auth] falling back to in-memory persistence:', err.code);
    });
    console.info('[tk-auth] Firebase initialised');
  } catch (err) {
    console.error('[tk-auth]', err.code, err.message);
  }
} else {
  console.info('[tk-auth] Firebase not configured — local bypass active (dhoop@gmail.com)');
}