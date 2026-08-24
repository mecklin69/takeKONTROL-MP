/**
 * takeKONTROL — DOM helpers
 * Small, boring, and used everywhere so pages stop reinventing them.
 */

export const $ = (selector, scope = document) => scope.querySelector(selector);
export const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
export const byId = (id) => document.getElementById(id);

/** Set text content by element id, ignoring ids that are not on this page. */
export function setText(id, value) {
  const el = byId(id);
  if (el) el.textContent = value;
  return el;
}

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/**
 * Escape a string for insertion into an HTML template literal.
 * Anything that came from storage, a URL or a remote API goes through
 * this before it touches innerHTML.
 */
export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ESCAPES[c]);
}

/** Run now if the document is parsed, otherwise on DOMContentLoaded. */
export function onReady(callback) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback, { once: true });
  } else {
    callback();
  }
}
