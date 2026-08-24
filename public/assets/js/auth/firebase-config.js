/**
 * takeKONTROL — Firebase bootstrap
 * =================================================================
 * Fill in the values from Firebase console → Project settings → your
 * web app. Until you do, a local bypass account is active so you can
 * develop and test the rest of the site without Firebase.
 *
 * LOCAL BYPASS
 * When apiKey is not configured (still REPLACE_ME), Firebase is skipped
 * entirely. One hardcoded test account is accepted instead:
 *
 *   dhoop@gmail.com  /  Rohitdhoop123#
 *
 * This bypass is ONLY active when the real API key is missing. The
 * moment you paste in real Firebase credentials it is gone.
 * =================================================================
 */

/* ── Test credentials for the local bypass ── */
const BYPASS_EMAIL    = 'dhoop@gmail.com';
const BYPASS_PASSWORD = 'Rohitdhoop123#';

const firebaseConfig = {
  apiKey:            'REPLACE_ME',
  authDomain:        'REPLACE_ME.firebaseapp.com',
  projectId:         'REPLACE_ME',
  storageBucket:     'REPLACE_ME.appspot.com',
  messagingSenderId: 'REPLACE_ME',
  appId:             'REPLACE_ME'
};

const FIREBASE_READY = firebaseConfig.apiKey !== 'REPLACE_ME';

/* ── Bypass auth object (used when Firebase is not configured) ── */
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
    // Fire immediately with the current state
    setTimeout(() => listener(bypassUser), 0);
    return () => {};   // unsubscribe no-op
  }
};

/* ── Exports: real Firebase when configured, bypass otherwise ── */

export let app          = null;
export let auth         = bypassAuth;
export let googleProvider = null;
export let authReady    = Promise.resolve();

/* Expose for auth.js: true = real Firebase, false = bypass mode */
export const FIREBASE_MODE = FIREBASE_READY;

/**
 * Called by auth.js sign-in handlers.
 * In bypass mode: accepts only the test credentials.
 * In Firebase mode: delegates to real Firebase.
 */
export async function bypassSignIn(email, password) {
  if (FIREBASE_READY) return null;   // auth.js uses Firebase directly

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
  if (FIREBASE_READY) return null;
  bypassUser = null;
  bypassAuth.currentUser = null;
  bypassListeners.forEach(fn => fn(null));
}

if (FIREBASE_READY) {
  /* Real Firebase — only imported when the API key is set */
  const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
  const { getAuth, setPersistence, browserLocalPersistence, GoogleAuthProvider }
    = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');

  app           = initializeApp(firebaseConfig);
  auth          = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: 'select_account' });

  authReady = setPersistence(auth, browserLocalPersistence).catch(err => {
    console.warn('[tk-auth] falling back to in-memory persistence:', err.code);
  });
} else {
  console.info('[tk-auth] Firebase not configured — local bypass active (dhoop@gmail.com)');
}