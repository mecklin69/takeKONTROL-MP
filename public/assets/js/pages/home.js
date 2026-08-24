/**
 * takeKONTROL — home page
 * Site chrome plus the 25-scenario threat browser.
 */

import { initSite } from '../core/site.js';
import { dictionary } from '../i18n/home.js';
import { byId, escapeHtml } from '../core/dom.js';
import { currentLang } from '../core/i18n.js';
import { THREATS } from '../data/threats.js';
import { initTicker } from '../features/ticker.js';
import * as cart from '../cart/engine.js';

const LABELS = {
  de: {
    likelihood: 'Wahrscheinlichkeit',
    impact: 'Auswirkung',
    speed: 'Geschwindigkeit',
    consequences: 'Mögliche Folgen',
    products: 'Empfohlene Vorsorge',
    scenarios: 'Szenarien'
  },
  en: {
    likelihood: 'Likelihood',
    impact: 'Impact',
    speed: 'Speed',
    consequences: 'Potential Consequences',
    products: 'Recommended Preparedness',
    scenarios: 'Threats'
  }
};

const SEVERE = ['High', 'Very High', 'Hoch', 'Sehr Hoch'];

const label = (key) => LABELS[currentLang()][key];
const activeThreats = () => THREATS[currentLang()] || THREATS.de;

function renderCategories() {
  const grid = byId('threatCategories');
  if (!grid) return;

  const data = activeThreats();
  grid.innerHTML = '';

  for (const [category, entry] of Object.entries(data)) {
    const card = document.createElement('div');
    card.className = 'threat-category';
    card.innerHTML = `
      <div class="card-cover">
        <img src="assets/img/${escapeHtml(entry.image)}" alt="${escapeHtml(category)}">
      </div>
      <div class="card-body-sm">
        <div class="icon"><i class="${escapeHtml(entry.icon)}"></i></div>
        <h4>${escapeHtml(category)}</h4>
        <div class="count">${entry.threats.length} ${escapeHtml(label('scenarios'))}</div>
      </div>`;
    card.addEventListener('click', () => openModal(category));
    grid.appendChild(card);
  }
}

function threatMarkup(threat) {
  const impactClass = SEVERE.includes(threat.impact) ? 'is-severe' : '';

  const badges = (threat.likelihood || threat.impact || threat.speed) ? `
    <div class="threat-badges">
      ${threat.likelihood ? `<span class="badge-pill">${escapeHtml(label('likelihood'))}: ${escapeHtml(threat.likelihood)}</span>` : ''}
      ${threat.impact ? `<span class="badge-pill ${impactClass}">${escapeHtml(label('impact'))}: ${escapeHtml(threat.impact)}</span>` : ''}
      ${threat.speed ? `<span class="badge-pill">${escapeHtml(label('speed'))}: ${escapeHtml(threat.speed)}</span>` : ''}
    </div>` : '';

  const consequences = (threat.consequences && threat.consequences.length) ? `
    <div class="threat-consequences">
      <span class="block-label">${escapeHtml(label('consequences'))}</span>
      <ul>${threat.consequences.map((c) => `<li>${escapeHtml(c)}</li>`).join('')}</ul>
    </div>` : '';

  const products = (threat.products && threat.products.length) ? `
    <div class="threat-products">
      <span class="block-label">${escapeHtml(label('products'))}</span>
      <div class="product-links">
        ${threat.products.map((p) =>
          `<a href="${escapeHtml(p.href)}" class="product-link-btn">${escapeHtml(p.name)} <i class="fa-solid fa-arrow-right"></i></a>`).join('')}
      </div>
    </div>` : '';

  return `
    <div class="threat-item">
      <div class="title">${escapeHtml(threat.name)}</div>
      <div class="desc">${escapeHtml(threat.desc)}</div>
      ${badges}
      ${consequences}
      ${products}
    </div>`;
}

function openModal(category) {
  const modal = byId('threatModal');
  const title = byId('modalTitle');
  const body = byId('modalBody');
  const entry = activeThreats()[category];
  if (!modal || !entry) return;

  if (title) title.textContent = category;
  if (body) {
    body.innerHTML =
      `<img src="assets/img/${escapeHtml(entry.image)}" alt="${escapeHtml(category)}" class="threat-modal-cover">` +
      entry.threats.map(threatMarkup).join('');
  }

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

export function closeModal() {
  byId('threatModal')?.classList.remove('open');
  document.body.style.overflow = '';
}

/* ── The counter above the fold ─────────────────────────────────── */
const TARGET_COUNT = 124_837;
const GOAL = 1_000_000;

function animateCount(el, target, duration) {
  const start = performance.now();
  const frame = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    el.textContent = Math.floor(eased * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(frame);
    else el.textContent = target.toLocaleString();
  };
  requestAnimationFrame(frame);
}

function initCounter() {
  const count = byId('count-num');
  const remaining = byId('remaining-num');
  const fill = byId('progress-fill');
  if (!count && !remaining && !fill) return;

  if (remaining) remaining.textContent = (GOAL - TARGET_COUNT).toLocaleString();
  setTimeout(() => {
    if (fill) fill.style.width = `${((TARGET_COUNT / GOAL) * 100).toFixed(2)}%`;
    if (count) animateCount(count, TARGET_COUNT, 2800);
  }, 600);
}

/* ── Scroll reveal ──────────────────────────────────────────────── */
function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (elements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (!entry.isIntersecting) return;
      setTimeout(() => entry.target.classList.add('in'), index * 60);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08 });

  for (const el of elements) observer.observe(el);
}

/* ── Boot ───────────────────────────────────────────────────────── */
initSite({ dictionary });

document.addEventListener('DOMContentLoaded', () => {
  renderCategories();
  initTicker();
  initCounter();
  initReveal();
  cart.refreshBadge();

  byId('threatModal')?.addEventListener('click', (event) => {
    if (event.target === event.currentTarget) closeModal();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeModal();
  });
});

document.addEventListener('tk:lang-changed', renderCategories);

// Published for the inline onclick attributes still in index.html.
// Migrating those to listeners is the next tidy-up; see docs/REFACTOR.md.
window.closeModal = closeModal;
