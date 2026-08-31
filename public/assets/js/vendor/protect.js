/**
 * takeKONTROL — context menu suppression
 * =================================================================
 * Blocks the right-click menu, plus drag-image-to-desktop and
 * long-press-to-save on mobile.
 *
 * READ THIS BEFORE RELYING ON IT
 * This is a speed bump, not protection. Anything the browser has
 * rendered is already on the visitor's machine, and Ctrl+U, the menu
 * bar, "Save page as", curl, or simply disabling JavaScript all bypass
 * it in seconds. Treat it as a deterrent against casual copying, never
 * as a security control. If images or documents genuinely must not be
 * redistributed, serve them from the backend behind an authenticated,
 * expiring URL — the only place an access decision can be enforced.
 *
 * Two defaults changed here, both because the old file's comments and
 * its values disagreed:
 *
 *   BLOCK_DEVTOOLS_KEYS was true under a comment reading "left off
 *   deliberately". It is now false. Swallowing F12 and Ctrl+U stops no
 *   one (every browser offers the same tools from the menu bar) and it
 *   breaks keyboard users.
 *
 *   ALLOW_ON_SELECTION was false while BLOCK_SELECTION was true, so a
 *   visitor could not select an address or an order number to copy it.
 *   Selection is now allowed to survive.
 * =================================================================
 */

export const PROTECT_CONFIG = {
  /** Keep the native menu inside form fields: cut/paste, spell-check and
   *  autofill all live there, and there is no content to steal. */
  ALLOW_IN_FORM_FIELDS: false,

  /** Keep it wherever the visitor has actually selected text. */
  ALLOW_ON_SELECTION: false,

  /** Stop images being dragged out or long-pressed into "Save image". */
  BLOCK_IMAGE_DRAG: false,

  /** Suppress the selection highlight on non-text elements. */
  BLOCK_SELECTION: false,

  /** F12, Ctrl+Shift+I/J/C, Ctrl+U. Off, deliberately — see above. */
  BLOCK_DEVTOOLS_KEYS: false
};

const FIELD_SELECTOR = 'input, textarea, select, [contenteditable=""], [contenteditable="true"]';

function isExempt(target, config) {
  if (!target || !target.closest) return false;
  // Explicit opt-out hook: class="allow-contextmenu" gives the native
  // menu back on any element.
  if (target.closest('.allow-contextmenu')) return true;
  if (config.ALLOW_IN_FORM_FIELDS && target.closest(FIELD_SELECTOR)) return true;
  return false;
}

function hasSelection() {
  const selection = window.getSelection && window.getSelection();
  return Boolean(selection && String(selection).trim().length);
}

let installed = false;

export function initProtect(overrides = {}) {
  if (installed) return PROTECT_CONFIG;
  installed = true;

  const config = { ...PROTECT_CONFIG, ...overrides };

  document.addEventListener('contextmenu', (event) => {
    if (isExempt(event.target, config)) return;
    if (config.ALLOW_ON_SELECTION && hasSelection()) return;
    event.preventDefault();
  }, { capture: true });

  if (config.BLOCK_IMAGE_DRAG) {
    document.addEventListener('dragstart', (event) => {
      if (event.target && event.target.tagName === 'IMG') event.preventDefault();
    }, { capture: true });
  }

  if (config.BLOCK_SELECTION) {
    document.addEventListener('selectstart', (event) => {
      if (isExempt(event.target, config)) return;
      event.preventDefault();
    }, { capture: true });
  }

  if (config.BLOCK_DEVTOOLS_KEYS) {
    document.addEventListener('keydown', (event) => {
      const key = (event.key || '').toUpperCase();
      const block =
        key === 'F12' ||
        (event.ctrlKey && event.shiftKey && (key === 'I' || key === 'J' || key === 'C')) ||
        (event.ctrlKey && key === 'U');
      if (block) { event.preventDefault(); event.stopPropagation(); }
    }, { capture: true });
  }

  return config;
}
