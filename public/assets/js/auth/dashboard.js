/**
 * takeKONTROL — Account Dashboard
 * =================================================================
 * Five panels, all functional:
 *
 *   Profile & Settings  — change display name, send password reset
 *   Manage Addresses    — save/edit up to 3 delivery addresses
 *   Your Orders         — live order history from /api/my-orders
 *   Cancelled Items     — filter of orders with DENIED/CANCELLED status
 *   Returns & Refunds   — policy info + pre-filled widerruf link
 *
 * Everything is rendered inside the existing #view-dashboard so the
 * login page layout and styles don't change.
 * =================================================================
 */

import { STORAGE_KEYS } from '../shared/catalog.js';
import { byId, escapeHtml } from '../core/dom.js';
import { currentLang } from '../core/i18n.js';
import { readLocalJson, writeLocalJson, removeLocal } from '../core/storage.js';

const API_BASE = String(window.TK_API_BASE || '').replace(/\/$/, '');

/* ── Panel registry ─────────────────────────────────────────────── */
const PANELS = ['profile', 'addresses', 'orders', 'cancelled', 'returns'];

let activePanel = null;
let currentUser = null;

export function setDashboardUser(user) {
  currentUser = user;
}

function panelContainer() {
  return byId('dash-panel-container');
}

const isMobile = () => window.innerWidth <= 768;

function showPanel(name) {
  activePanel = name;
  const container = panelContainer();
  if (!container) return;

  // Mark active card
  for (const card of document.querySelectorAll('.dash-grid-item')) {
    card.classList.toggle('active', card.dataset.panel === name);
  }

  container.innerHTML = '<div class="dash-panel-loading">Laden…</div>';
  container.hidden = false;

  // On mobile: show as bottom sheet overlay
  if (isMobile()) {
    container.classList.add('dash-panel-sheet');
    document.body.classList.add('dash-sheet-open');
    // Backdrop
    let backdrop = byId('dash-sheet-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'dash-sheet-backdrop';
      backdrop.className = 'dash-sheet-backdrop';
      backdrop.addEventListener('click', closePanel);
      document.body.appendChild(backdrop);
    }
    backdrop.classList.add('active');
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  } else {
    container.classList.remove('dash-panel-sheet');
    container.classList.add('dash-panel-desktop');
    document.body.classList.remove('dash-sheet-open');
    // Position over the dashboard card on desktop
    const card = document.querySelector('.auth-card');
    if (card) {
      const rect = card.getBoundingClientRect();
      container.style.position = 'fixed';
      container.style.top = Math.max(80, rect.top) + 'px';
      container.style.left = rect.left + 'px';
      container.style.width = rect.width + 'px';
      container.style.maxHeight = (window.innerHeight - Math.max(80, rect.top) - 20) + 'px';
      container.style.overflowY = 'auto';
      container.style.zIndex = '1001';
      container.style.borderRadius = 'var(--radius-corp)';
      container.style.boxShadow = '0 20px 60px rgba(0,0,0,0.4)';
    }
  }

  const renderers = {
    profile:    renderProfile,
    addresses:  renderAddresses,
    orders:     renderOrders,
    cancelled:  renderCancelled,
    returns:    renderReturns
  };

  (renderers[name] || (() => {}))();
}

function closePanel() {
  activePanel = null;
  const container = panelContainer();
  if (container) {
    container.hidden = true;
    container.classList.remove('dash-panel-sheet');
    container.classList.remove('dash-panel-desktop');
    container.removeAttribute('style');
  }
  document.body.classList.remove('dash-sheet-open');
  document.body.style.overflow = '';
  const backdrop = byId('dash-sheet-backdrop');
  if (backdrop) backdrop.classList.remove('active');
  for (const card of document.querySelectorAll('.dash-grid-item')) {
    card.classList.remove('active');
  }
}

/* ── Profile & Settings ─────────────────────────────────────────── */
function renderProfile() {
  const c = panelContainer();
  const email = currentUser?.email || '';
  const name  = currentUser?.displayName || '';
  const isGoogle = currentUser?.providerData?.some(p => p.providerId === 'google.com');

  c.innerHTML = `
    <div class="dash-panel">
      <div class="dash-panel-header">
        <h3>${currentLang() === 'en' ? 'Profile & Settings' : 'Profil & Einstellungen'}</h3>
        <button class="dash-panel-close" onclick="window.__dashClose()">✕</button>
      </div>

      <div class="dash-panel-body">
        <div class="dash-form-group">
          <label>${currentLang() === 'en' ? 'Display Name' : 'Anzeigename'}</label>
          <div class="dash-input-row">
            <input id="dp-name" type="text" value="${escapeHtml(name)}" placeholder="${currentLang() === 'en' ? 'Your name' : 'Ihr Name'}">
            <button class="btn btn-primary btn-sm" onclick="window.__dashSaveName()">
              ${currentLang() === 'en' ? 'Save' : 'Speichern'}
            </button>
          </div>
          <p class="dash-hint" id="dp-name-msg"></p>
        </div>

        <div class="dash-form-group">
          <label>E-Mail</label>
          <input type="text" value="${escapeHtml(email)}" disabled>
          <p class="dash-hint">${currentLang() === 'en' ? 'Email cannot be changed here.' : 'E-Mail kann hier nicht geändert werden.'}</p>
        </div>

        ${!isGoogle ? `
        <div class="dash-form-group">
          <label>${currentLang() === 'en' ? 'Password' : 'Passwort'}</label>
          <button class="btn btn-outline-adaptive btn-sm" onclick="window.__dashResetPw()">
            ${currentLang() === 'en' ? 'Send password reset email' : 'Passwort-Reset-E-Mail senden'}
          </button>
          <p class="dash-hint" id="dp-pw-msg"></p>
        </div>` : `
        <div class="dash-form-group">
          <p class="dash-hint">${currentLang() === 'en' ? 'Signed in with Google. Password is managed by Google.' : 'Mit Google angemeldet. Passwort wird von Google verwaltet.'}</p>
        </div>`}

        <div class="dash-form-group dash-danger-zone">
          <label>${currentLang() === 'en' ? 'Danger Zone' : 'Gefahrenzone'}</label>
          <button class="btn btn-danger btn-sm" onclick="window.__dashDeleteAccount()">
            ${currentLang() === 'en' ? 'Delete account' : 'Konto löschen'}
          </button>
          <p class="dash-hint">${currentLang() === 'en' ? 'This cannot be undone.' : 'Diese Aktion kann nicht rückgängig gemacht werden.'}</p>
        </div>
      </div>
    </div>`;

  window.__dashSaveName = async () => {
    const newName = byId('dp-name').value.trim();
    const msg = byId('dp-name-msg');
    if (!newName) { msg.textContent = currentLang() === 'en' ? 'Name cannot be empty.' : 'Name darf nicht leer sein.'; return; }
    try {
      const { updateProfile } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
      const { auth } = await import('./firebase-config.js');
      await updateProfile(auth.currentUser, { displayName: newName });
      msg.textContent = currentLang() === 'en' ? '✓ Name updated.' : '✓ Name aktualisiert.';
      msg.style.color = 'var(--primary-red)';
    } catch (err) {
      msg.textContent = err.message;
    }
  };

  window.__dashResetPw = async () => {
    const msg = byId('dp-pw-msg');
    try {
      const { sendPasswordResetEmail } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
      const { auth } = await import('./firebase-config.js');
      await sendPasswordResetEmail(auth, currentUser.email);
      msg.textContent = currentLang() === 'en' ? '✓ Reset email sent.' : '✓ Reset-E-Mail gesendet.';
      msg.style.color = 'var(--primary-red)';
    } catch (err) {
      msg.textContent = err.message;
    }
  };

  window.__dashDeleteAccount = () => {
    const confirmed = window.confirm(
      currentLang() === 'en'
        ? 'Are you sure? This permanently deletes your account.'
        : 'Sind Sie sicher? Ihr Konto wird dauerhaft gelöscht.'
    );
    if (!confirmed) return;
    // Re-authentication required for sensitive operations — redirect to login
    window.location.href = 'login.html#delete';
  };
}

/* ── Manage Addresses ───────────────────────────────────────────── */
const ADDR_KEY = 'tk_saved_addresses';

function renderAddresses() {
  const c = panelContainer();
  const addresses = readLocalJson(ADDR_KEY) || [];
  const isEn = currentLang() === 'en';

  const addrHtml = addresses.length === 0
    ? `<p class="dash-empty">${isEn ? 'No saved addresses yet.' : 'Noch keine gespeicherten Adressen.'}</p>`
    : addresses.map((a, i) => `
        <div class="dash-address-card">
          <div class="dash-address-body">
            <strong>${escapeHtml(a.firstName)} ${escapeHtml(a.lastName)}</strong><br>
            ${escapeHtml(a.street)} ${escapeHtml(a.houseNumber)}<br>
            ${escapeHtml(a.postalCode)} ${escapeHtml(a.city)}, ${escapeHtml(a.country)}<br>
            ${a.phone ? escapeHtml(a.phone) : ''}
          </div>
          <div class="dash-address-actions">
            <button class="btn btn-sm btn-outline-adaptive" onclick="window.__dashEditAddr(${i})">
              ${isEn ? 'Edit' : 'Bearbeiten'}
            </button>
            <button class="btn btn-sm btn-danger" onclick="window.__dashDeleteAddr(${i})">
              ${isEn ? 'Delete' : 'Löschen'}
            </button>
          </div>
        </div>`).join('');

  c.innerHTML = `
    <div class="dash-panel">
      <div class="dash-panel-header">
        <h3>${isEn ? 'Manage Addresses' : 'Adressen verwalten'}</h3>
        <button class="dash-panel-close" onclick="window.__dashClose()">✕</button>
      </div>
      <div class="dash-panel-body">
        ${addrHtml}
        ${addresses.length < 3 ? `
        <button class="btn btn-primary btn-sm" style="margin-top:16px;" onclick="window.__dashAddAddr()">
          + ${isEn ? 'Add address' : 'Adresse hinzufügen'}
        </button>` : ''}
        <div id="addr-form-wrap" hidden></div>
      </div>
    </div>`;

  window.__dashDeleteAddr = (index) => {
    const addrs = readLocalJson(ADDR_KEY) || [];
    addrs.splice(index, 1);
    writeLocalJson(ADDR_KEY, addrs);
    renderAddresses();
  };

  window.__dashAddAddr = () => showAddressForm(-1);
  window.__dashEditAddr = (index) => showAddressForm(index);
}

function showAddressForm(editIndex) {
  const existing = editIndex >= 0 ? (readLocalJson(ADDR_KEY) || [])[editIndex] : {};
  const isEn = currentLang() === 'en';
  const wrap = byId('addr-form-wrap');
  if (!wrap) return;
  wrap.hidden = false;

  const val = (key) => escapeHtml(existing[key] || '');

  wrap.innerHTML = `
    <div class="dash-addr-form">
      <h4>${editIndex >= 0 ? (isEn ? 'Edit address' : 'Adresse bearbeiten') : (isEn ? 'New address' : 'Neue Adresse')}</h4>
      <div class="dash-form-row">
        <input id="af-first" placeholder="${isEn ? 'First name' : 'Vorname'} *" value="${val('firstName')}">
        <input id="af-last"  placeholder="${isEn ? 'Last name' : 'Nachname'} *"  value="${val('lastName')}">
      </div>
      <div class="dash-form-row">
        <input id="af-street" placeholder="${isEn ? 'Street' : 'Straße'} *" value="${val('street')}">
        <input id="af-house"  placeholder="${isEn ? 'No.' : 'Nr.'} *"       value="${val('houseNumber')}" style="max-width:100px;">
      </div>
      <div class="dash-form-row">
        <input id="af-plz"   placeholder="PLZ *"             value="${val('postalCode')}" style="max-width:120px;">
        <input id="af-city"  placeholder="${isEn ? 'City' : 'Ort'} *"       value="${val('city')}">
      </div>
      <div class="dash-form-row">
        <input id="af-phone" placeholder="${isEn ? 'Phone (optional)' : 'Telefon (optional)'}" value="${val('phone')}">
      </div>
      <div class="dash-form-actions">
        <button class="btn btn-primary btn-sm" onclick="window.__dashSaveAddr(${editIndex})">
          ${isEn ? 'Save' : 'Speichern'}
        </button>
        <button class="btn btn-outline-adaptive btn-sm" onclick="document.getElementById('addr-form-wrap').hidden=true">
          ${isEn ? 'Cancel' : 'Abbrechen'}
        </button>
      </div>
      <p id="af-err" style="color:var(--primary-red);font-size:0.85rem;margin-top:8px;"></p>
    </div>`;

  window.__dashSaveAddr = (index) => {
    const get = (id) => byId(id)?.value.trim() || '';
    const addr = {
      firstName:   get('af-first'),
      lastName:    get('af-last'),
      street:      get('af-street'),
      houseNumber: get('af-house'),
      postalCode:  get('af-plz'),
      city:        get('af-city'),
      phone:       get('af-phone'),
      country:     'DE'
    };
    const required = ['firstName','lastName','street','houseNumber','postalCode','city'];
    if (required.some(k => !addr[k])) {
      byId('af-err').textContent = isEn ? 'Please fill in all required fields.' : 'Bitte alle Pflichtfelder ausfüllen.';
      return;
    }
    const addrs = readLocalJson(ADDR_KEY) || [];
    if (index >= 0) addrs[index] = addr;
    else addrs.push(addr);
    writeLocalJson(ADDR_KEY, addrs);
    renderAddresses();
  };
}

/* ── Order history helpers ──────────────────────────────────────── */
const STATUS_LABELS = {
  CREATED:          { en: 'Processing',    de: 'In Bearbeitung',  color: '#888' },
  PAID:             { en: 'Paid',          de: 'Bezahlt',         color: '#22c55e' },
  PENDING:          { en: 'Pending',       de: 'Ausstehend',      color: '#f59e0b' },
  AWAITING_TRANSFER:{ en: 'Bank transfer', de: 'Überweisung',     color: '#3b82f6' },
  DENIED:           { en: 'Denied',        de: 'Abgelehnt',       color: '#ef4444' },
  REFUNDED:         { en: 'Refunded',      de: 'Erstattet',       color: '#8b5cf6' },
  CAPTURE_UNKNOWN:  { en: 'Checking…',    de: 'Wird geprüft…',   color: '#f59e0b' },
  PRICE_CHANGED:    { en: 'Price changed', de: 'Preis geändert',  color: '#ef4444' }
};

function statusBadge(status) {
  const s = STATUS_LABELS[status] || { en: status, de: status, color: '#888' };
  const label = currentLang() === 'en' ? s.en : s.de;
  return `<span class="dash-status-badge" style="background:${s.color}20;color:${s.color};border:1px solid ${s.color}40;">${escapeHtml(label)}</span>`;
}

function orderCard(o) {
  const isEn = currentLang() === 'en';
  const date = o.createdAt ? new Date(o.createdAt).toLocaleDateString(isEn ? 'en-IE' : 'de-DE') : '—';
  const total = o.grandTotal ? `€${Number(o.grandTotal).toFixed(2)}` : '—';
  const items = (o.lines || []).map(l => `${l.qty}× ${escapeHtml(l.name)}`).join(', ') || '—';

  return `
    <div class="dash-order-card">
      <div class="dash-order-header">
        <span class="dash-order-num">${escapeHtml(o.orderNumber)}</span>
        ${statusBadge(o.status)}
      </div>
      <div class="dash-order-meta">
        <span>${isEn ? 'Date' : 'Datum'}: ${date}</span>
        <span>${isEn ? 'Total' : 'Gesamt'}: <strong>${total}</strong></span>
      </div>
      <div class="dash-order-items">${items}</div>
    </div>`;
}

async function fetchOrders() {
  const email = currentUser?.email;
  if (!email) return [];
  try {
    const res = await fetch(`${API_BASE}/api/my-orders?email=${encodeURIComponent(email)}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.orders || [];
  } catch {
    return [];
  }
}

/* ── Your Orders ────────────────────────────────────────────────── */
async function renderOrders() {
  const c = panelContainer();
  const isEn = currentLang() === 'en';

  c.innerHTML = `
    <div class="dash-panel">
      <div class="dash-panel-header">
        <h3>${isEn ? 'Your Orders' : 'Meine Bestellungen'}</h3>
        <button class="dash-panel-close" onclick="window.__dashClose()">✕</button>
      </div>
      <div class="dash-panel-body">
        <div class="dash-panel-loading">${isEn ? 'Loading orders…' : 'Bestellungen werden geladen…'}</div>
      </div>
    </div>`;

  const orders = await fetchOrders();
  const active = orders.filter(o => !['DENIED','REFUNDED','PRICE_CHANGED'].includes(o.status));
  const body = c.querySelector('.dash-panel-body');

  if (active.length === 0) {
    body.innerHTML = `<p class="dash-empty">${isEn ? 'No orders yet.' : 'Noch keine Bestellungen.'}</p>
      <a href="takekontrol-revamp.html" class="btn btn-primary btn-sm">${isEn ? 'Go to shop' : 'Zum Shop'}</a>`;
  } else {
    body.innerHTML = active.map(orderCard).join('');
  }
}

/* ── Cancelled Items ────────────────────────────────────────────── */
async function renderCancelled() {
  const c = panelContainer();
  const isEn = currentLang() === 'en';

  c.innerHTML = `
    <div class="dash-panel">
      <div class="dash-panel-header">
        <h3>${isEn ? 'Cancelled Items' : 'Stornierte Artikel'}</h3>
        <button class="dash-panel-close" onclick="window.__dashClose()">✕</button>
      </div>
      <div class="dash-panel-body">
        <div class="dash-panel-loading">${isEn ? 'Loading…' : 'Wird geladen…'}</div>
      </div>
    </div>`;

  const orders = await fetchOrders();
  const cancelled = orders.filter(o => ['DENIED','PRICE_CHANGED','CAPTURE_UNKNOWN'].includes(o.status));
  const body = c.querySelector('.dash-panel-body');

  if (cancelled.length === 0) {
    body.innerHTML = `<p class="dash-empty">${isEn ? 'No cancelled orders.' : 'Keine stornierten Bestellungen.'}</p>`;
  } else {
    body.innerHTML = cancelled.map(orderCard).join('');
  }
}

/* ── Returns & Refunds ──────────────────────────────────────────── */
function renderReturns() {
  const c = panelContainer();
  const isEn = currentLang() === 'en';
  const email = currentUser?.email || '';

  c.innerHTML = `
    <div class="dash-panel">
      <div class="dash-panel-header">
        <h3>${isEn ? 'Returns & Refunds' : 'Rückgabe & Erstattung'}</h3>
        <button class="dash-panel-close" onclick="window.__dashClose()">✕</button>
      </div>
      <div class="dash-panel-body">
        <div class="dash-return-policy">
          <h4>${isEn ? '14-Day Right of Withdrawal' : '14-tägiges Widerrufsrecht'}</h4>
          <p>${isEn
            ? 'You may withdraw from your purchase within 14 days of receiving your order without giving any reason. To exercise your right of withdrawal, notify us clearly by email or using the form below.'
            : 'Sie können Ihren Kauf innerhalb von 14 Tagen nach Erhalt der Ware ohne Angabe von Gründen widerrufen. Nutzen Sie dazu das Formular oder senden Sie uns eine E-Mail.'}</p>
          <ul>
            <li>${isEn ? 'Items must be unused and in original packaging.' : 'Artikel müssen unbenutzt und in Originalverpackung sein.'}</li>
            <li>${isEn ? 'Return shipping costs are borne by the customer.' : 'Rücksendekosten trägt der Kunde.'}</li>
            <li>${isEn ? 'Refund within 14 days of receiving the return.' : 'Erstattung innerhalb von 14 Tagen nach Eingang der Retoure.'}</li>
          </ul>
        </div>

        <div class="dash-return-actions">
          <a href="widerruf.html" class="btn btn-primary btn-sm" target="_blank">
            ${isEn ? 'Open withdrawal form' : 'Widerrufsformular öffnen'}
          </a>
          <a href="mailto:info@takekontrol.de?subject=${encodeURIComponent(isEn ? 'Return request' : 'Rückgabeanfrage')}&body=${encodeURIComponent((isEn ? 'My email: ' : 'Meine E-Mail: ') + email)}"
             class="btn btn-outline-adaptive btn-sm">
            ${isEn ? 'Contact support' : 'Support kontaktieren'}
          </a>
        </div>

        <div class="dash-return-contact">
          <p style="font-size:0.85rem;color:var(--text-muted);margin-top:20px;">
            ${isEn ? 'Questions? Email us at' : 'Fragen? Schreiben Sie uns:'} 
            <a href="mailto:info@takekontrol.de">info@takekontrol.de</a>
          </p>
        </div>
      </div>
    </div>`;
}

/* ── Init ───────────────────────────────────────────────────────── */
export function initDashboard(user) {
  currentUser = user;

  // Panel container lives on body so it can escape overflow:hidden parents
  if (!byId('dash-panel-container')) {
    const wrap = document.createElement('div');
    wrap.id = 'dash-panel-container';
    wrap.hidden = true;
    document.body.appendChild(wrap);
  }

  // Wire up cards
  for (const card of document.querySelectorAll('.dash-grid-item[data-panel]')) {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const panel = card.dataset.panel;
      if (activePanel === panel) closePanel();
      else showPanel(panel);
    });
  }

  window.__dashClose = closePanel;
}
