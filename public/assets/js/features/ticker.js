/**
 * takeKONTROL — live situational awareness ticker
 * =================================================================
 * Pulls headlines from the Tagesschau public API and scrolls them under
 * the hero. Falls back to a static status line whenever the feed is
 * unavailable, which includes the common case of the browser blocking
 * the cross-origin request.
 *
 * Three defects came out of the original ticker.js:
 *
 *   1. It tested `response.isOk`, a property that does not exist. The
 *      check only ever passed because of the `status !== 200` clause
 *      beside it. It reads `response.ok` now.
 *   2. Headlines went into innerHTML unescaped. They arrive from a
 *      third-party API over the network, so they are untrusted input;
 *      they are escaped now.
 *   3. It mounted after `document.querySelector('.hero, #top, section')`
 *      — the first section on the page, whatever that happened to be.
 *      It looks for an explicit #ticker-mount now and only falls back to
 *      .hero.
 * =================================================================
 */

import { escapeHtml } from '../core/dom.js';

const FEED_URL = 'https://www.tagesschau.de/api2u/news/';
const FETCH_TIMEOUT_MS = 6_000;
const MAX_ITEMS = 8;

/** Headlines matching these get flagged as security-relevant. */
const CRISIS_KEYWORDS = [
  'krise', 'sicherheit', 'bundeswehr', 'notfall', 'schwerpunkt',
  'warnung', 'evakuierung', 'angriff', 'verteidigung', 'störung'
];

const TYPE_LABELS = {
  GEOPOLITIK: '⚠️ SICHERHEIT',
  INFRASTRUKTUR: '⚡ INFRASTRUKTUR',
  UNWETTER: '🌪️ LAGEBERICHT',
  BREAKING: '🔴 BRECHEND',
  STATUS: '🛡️ STATUS',
  NINA: '⚠️ NINA-WARNUNG'
};

const FALLBACK_ITEMS = [
  { type: 'STATUS', text: 'Lagezentrum Aktiv — Überwachung von kritischer Infrastruktur und Sicherheitsmeldungen' },
  { type: 'NINA', text: 'BBK Warnsystem online — Keine aktiven nationalen Katastrophenalarme gemeldet' }
];

function classify(title) {
  const lower = title.toLowerCase();
  if (CRISIS_KEYWORDS.some((keyword) => lower.includes(keyword))) return 'GEOPOLITIK';
  if (lower.includes('wetter') || lower.includes('sturm')) return 'UNWETTER';
  if (lower.includes('strom') || lower.includes('netz')) return 'INFRASTRUKTUR';
  return 'BREAKING';
}

async function fetchAlerts() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(FEED_URL, { signal: controller.signal });
    if (!response.ok) throw new Error(`API response error: ${response.status}`);

    const data = await response.json();
    const news = Array.isArray(data && data.news) ? data.news : [];

    const items = news
      .map((item) => String(item.title || '').trim())
      .filter(Boolean)
      .map((title) => ({ type: classify(title), text: title }))
      .slice(0, MAX_ITEMS);

    return items.length > 0 ? items : FALLBACK_ITEMS;
  } catch (error) {
    console.warn('[ticker] live feed unavailable, using local defaults.', error.message);
    return FALLBACK_ITEMS;
  } finally {
    clearTimeout(timer);
  }
}

function trackContent(items) {
  return items.map((item) => {
    const label = TYPE_LABELS[item.type] || '⚠️ WARNUNG';
    return '<span class="sit-item">' +
      `<span class="sit-type">${escapeHtml(label)}</span>` +
      '<span class="sit-sep">—</span>' +
      `<span class="sit-msg">${escapeHtml(item.text)}</span>` +
    '</span>';
  }).join('<span class="sit-dot">◆</span>');
}

function buildTicker(items) {
  const section = document.createElement('div');
  section.id = 'situational-ticker';
  section.className = 'sit-ticker';
  section.setAttribute('aria-label', 'Echtzeit-Lageübersicht');
  section.setAttribute('role', 'marquee');

  // The content is duplicated so the track can loop seamlessly.
  section.innerHTML = `
    <div class="sit-badge">
      <span class="sit-pulse"></span>
      <span class="sit-live-text">LIVE</span>
    </div>
    <div class="sit-track-wrap">
      <div class="sit-track">${trackContent(items)}${trackContent(items)}</div>
    </div>
    <div class="sit-right-fade"></div>`;

  return section;
}

function startAnimation(track) {
  if (!track) return;
  requestAnimationFrame(() => {
    const half = track.scrollWidth / 2;
    if (half <= 0) return;
    const duration = Math.max(half / 50, 32);   // ~50 px per second, never frantic
    track.style.setProperty('--ticker-half', `-${half}px`);
    track.style.animationDuration = `${duration}s`;
    track.classList.add('sit-running');
  });
}

export async function initTicker() {
  const anchor = document.getElementById('ticker-mount') || document.querySelector('.hero');
  if (!anchor) return;

  // Await the feed before inserting so the page does not jump.
  const ticker = buildTicker(await fetchAlerts());
  anchor.insertAdjacentElement('afterend', ticker);
  startAnimation(ticker.querySelector('.sit-track'));
}
