/**
 * takeKONTROL — translation
 * =================================================================
 * One implementation for the whole site. Every page used to carry its
 * own near-identical copy of applyDictionary(), and the copies had
 * drifted: two of them wrote the language to localStorage, two did not,
 * one fired tk:lang-changed, three did not, and the shop used
 * data-i18n while everything else used data-localize.
 *
 * Both attribute names are supported here on purpose so no existing
 * markup had to be rewritten. data-i18n is the name to use in new
 * markup.
 *
 *   data-i18n / data-localize              text, or HTML if the string
 *                                          itself contains markup
 *   data-i18n-html / data-localize-html    always innerHTML
 *   data-i18n-placeholder                  placeholder attribute
 *   data-i18n-aria / data-localize-aria    aria-label attribute
 *
 * Dictionary values are authored in this repository, never supplied by
 * a visitor, which is what makes the innerHTML path acceptable. Do not
 * feed user input through it.
 * =================================================================
 */

import { STORAGE_KEYS } from '../shared/catalog.js';
import { $$, byId } from './dom.js';
import { readLocal, writeLocal } from './storage.js';

export const LANGS = ['de', 'en'];
export const DEFAULT_LANG = 'de';

let dictionary = { de: {}, en: {} };
let current = DEFAULT_LANG;

export const currentLang = () => current;

export function normaliseLang(value) {
  const lang = String(value || '').toLowerCase();
  return lang.startsWith('en') ? 'en' : 'de';
}

/** Register (or extend) the dictionary for this page. */
export function registerDictionary(dict) {
  if (!dict) return;
  dictionary = {
    de: { ...dictionary.de, ...(dict.de || {}) },
    en: { ...dictionary.en, ...(dict.en || {}) }
  };
}

/** Look up a single key in the active language. Falls back to the key. */
export function t(key) {
  const table = dictionary[current] || {};
  return table[key] !== undefined ? table[key] : key;
}

function translateElements(selector, attribute, apply) {
  const table = dictionary[current] || {};
  for (const el of $$(selector)) {
    const key = el.getAttribute(attribute);
    const value = table[key];
    if (value === undefined) continue;
    apply(el, value);
  }
}

function applyToNode(el, value) {
  if (String(value).includes('<')) {
    // The string carries its own markup (a <span> highlight, a link in a
    // consent line). Replacing the children is the intent.
    el.innerHTML = value;
    return;
  }
  if (el.firstElementChild) {
    // Plain text against an element that wraps other elements — writing
    // textContent here would delete a link or an icon. checkout.html had
    // this guard; now every page has it.
    return;
  }
  el.textContent = value;
}

export function applyLanguage(lang) {
  current = normaliseLang(lang);

  translateElements('[data-i18n]', 'data-i18n', applyToNode);
  translateElements('[data-localize]', 'data-localize', applyToNode);

  translateElements('[data-i18n-html]', 'data-i18n-html', (el, v) => { el.innerHTML = v; });
  translateElements('[data-localize-html]', 'data-localize-html', (el, v) => { el.innerHTML = v; });

  translateElements('[data-i18n-placeholder]', 'data-i18n-placeholder',
    (el, v) => el.setAttribute('placeholder', v));

  translateElements('[data-i18n-aria]', 'data-i18n-aria', (el, v) => el.setAttribute('aria-label', v));
  translateElements('[data-localize-aria]', 'data-localize-aria', (el, v) => el.setAttribute('aria-label', v));

  document.documentElement.setAttribute('lang', current);
  document.documentElement.setAttribute('data-tk-lang', current);
  writeLocal(STORAGE_KEYS.LANG, current);

  const toggle = byId('langToggle');
  // The button shows the language you would switch TO.
  if (toggle) toggle.textContent = current === 'en' ? 'DE' : 'EN';

  document.dispatchEvent(new CustomEvent('tk:lang-changed', { detail: { lang: current } }));
  return current;
}

/** Saved choice first, then the document's own lang attribute. */
export function preferredLang() {
  const saved = readLocal(STORAGE_KEYS.LANG);
  if (saved && LANGS.includes(normaliseLang(saved))) return normaliseLang(saved);
  const documentLang = document.documentElement.getAttribute('lang');
  return documentLang ? normaliseLang(documentLang) : DEFAULT_LANG;
}

export function initI18n(dict) {
  registerDictionary(dict);
  applyLanguage(preferredLang());

  const toggle = byId('langToggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      applyLanguage(current === 'en' ? 'de' : 'en');
    });
  }
}
