/**
 * takeKONTROL — storage helpers
 * =================================================================
 * Safari in private mode, and any browser with cookies blocked, throws
 * on localStorage access. Every read and write in the front end goes
 * through here so a storage failure degrades to "nothing was saved"
 * instead of a thrown exception that stops the rest of the script.
 * =================================================================
 */

export function readLocal(key, fallback = null) {
  try {
    const value = window.localStorage.getItem(key);
    return value === null ? fallback : value;
  } catch {
    return fallback;
  }
}

export function writeLocal(key, value) {
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function removeLocal(key) {
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function readLocalJson(key, fallback = null) {
  const raw = readLocal(key);
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeLocalJson(key, value) {
  return writeLocal(key, JSON.stringify(value));
}

export function readSession(key, fallback = null) {
  try {
    const value = window.sessionStorage.getItem(key);
    return value === null ? fallback : value;
  } catch {
    return fallback;
  }
}

export function writeSession(key, value) {
  try {
    window.sessionStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function removeSession(key) {
  try {
    window.sessionStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}
