/**
 * takeKONTROL — light/dark theme
 * =================================================================
 * The chosen theme is stored under tk_theme and applied to
 * <html data-theme>. Before this refactor only checkout.html and
 * login.html remembered the choice, so switching to dark mode and then
 * clicking through to the shop threw you back into light mode.
 *
 * The very first paint is handled by the inline snippet in each page's
 * <head> (see theme-boot in the page templates); this module owns the
 * toggle and keeps the two icons in sync.
 * =================================================================
 */

import { STORAGE_KEYS } from '../shared/catalog.js';
import { byId } from './dom.js';
import { readLocal, writeLocal } from './storage.js';

export const THEMES = { LIGHT: 'light', DARK: 'dark' };

export function currentTheme() {
  return document.documentElement.getAttribute('data-theme') === THEMES.DARK
    ? THEMES.DARK
    : THEMES.LIGHT;
}

export function applyTheme(theme) {
  const next = theme === THEMES.DARK ? THEMES.DARK : THEMES.LIGHT;
  document.documentElement.setAttribute('data-theme', next);
  syncIcons(next);
  document.dispatchEvent(new CustomEvent('tk:theme-changed', { detail: { theme: next } }));
  return next;
}

/** The sun icon shows in dark mode (click to go light), and vice versa. */
function syncIcons(theme) {
  const sun = byId('sunIcon');
  const moon = byId('moonIcon');
  if (sun) sun.style.display = theme === THEMES.DARK ? 'block' : 'none';
  if (moon) moon.style.display = theme === THEMES.DARK ? 'none' : 'block';
}

export function initTheme() {
  const stored = readLocal(STORAGE_KEYS.THEME);
  applyTheme(stored === THEMES.DARK ? THEMES.DARK : currentTheme());

  const toggle = byId('themeToggle');
  if (!toggle) return;

  toggle.addEventListener('click', () => {
    const next = currentTheme() === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
    applyTheme(next);
    writeLocal(STORAGE_KEYS.THEME, next);
  });
}
