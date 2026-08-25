/**
 * takeKONTROL — Account Dashboard
 * All panels read/write from DynamoDB via the server API.
 * Everything is scoped to the logged-in user (email + uid).
 */

import { STORAGE_KEYS } from '../shared/catalog.js';
import { byId, escapeHtml } from '../core/dom.js';
import { currentLang } from '../core/i18n.js';
import { readLocal } from '../core/storage.js';

const API = String(window.TK_API_BASE || '').replace(/\/$/, '');

/* ── State ───────────────────────────────────────────────────────── */
let activePanel  = null;
let currentUser  = null;

export function setDashboardUser(user) { currentUser = user; }

const userEmail = () => currentUser?.email || readLocal(STORAGE_KEYS.USER_EMAIL) || '';
const userUID   = () => currentUser?.uid   || readLocal(STORAGE_KEYS.USER_UID)   || '';
const isEn      = () => currentLang() === 'en';
const isMobile  = () => window.innerWidth <= 768;

/* ── API helpers ─────────────────────────────────────────────────── */
async function api(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

const get  = (path) => api(path);
const post = (path, body) => api(path, { method: 'POST', body: JSON.stringify(body) });
const del  = (path) => api(path, { method: 'DELETE' });

/* ── Panel container ─────────────────────────────────────────────── */
function getContainer() {
  let c = byId('dash-panel-container');
  if (!c) {
    c = document.createElement('div');
    c.id = 'dash-panel-container';
    c.hidden = true;
    document.body.appendChild(c);
  }
  return c;
}

function showPanel(name) {
  activePanel = name;
  const c = getContainer();

  for (const card of document.querySelectorAll('.dash-grid-item')) {
    card.classList.toggle('active', card.dataset.panel === name);
  }

  c.innerHTML = `<div class="dash-panel"><div class="dash-panel-body">
    <div class="dash-panel-loading">${isEn() ? 'Loading…' : 'Laden…'}</div>
  </div></div>`;
  c.hidden = false;

  if (isMobile()) {
    c.classList.add('dash-panel-sheet');
    document.body.style.overflow = 'hidden';
    let bd = byId('dash-sheet-backdrop');
    if (!bd) {
      bd = document.createElement('div');
      bd.id = 'dash-sheet-backdrop';
      bd.className = 'dash-sheet-backdrop';
      bd.addEventListener('click', closePanel);
      document.body.appendChild(bd);
    }
    bd.classList.add('active');
  } else {
    c.classList.remove('dash-panel-sheet');
    const card = document.querySelector('.auth-card');
    if (card) {
      const r = card.getBoundingClientRect();
      Object.assign(c.style, {
        position: 'fixed',
        top: Math.max(80, r.top) + 'px',
        left: r.left + 'px',
        width: r.width + 'px',
        maxHeight: (window.innerHeight - Math.max(80, r.top) - 20) + 'px',
        overflowY: 'auto',
        zIndex: '1001',
        borderRadius: 'var(--radius-corp)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.4)'
      });
    }
  }

  const renderers = { profile, addresses, orders, cancelled, returns };
  (renderers[name] || (() => {}))();
}

function closePanel() {
  activePanel = null;
  const c = byId('dash-panel-container');
  if (c) { c.hidden = true; c.classList.remove('dash-panel-sheet'); c.removeAttribute('style'); }
  document.body.style.overflow = '';
  document.body.classList.remove('dash-sheet-open');
  byId('dash-sheet-backdrop')?.classList.remove('active');
  document.querySelectorAll('.dash-grid-item').forEach(el => el.classList.remove('active'));
}
window.__dashClose = closePanel;

/* ── Panel shell ─────────────────────────────────────────────────── */
function shell(title, bodyHtml) {
  const c = getContainer();
  c.innerHTML = `
    <div class="dash-panel">
      <div class="dash-panel-header">
        <h3>${escapeHtml(title)}</h3>
        <button class="dash-panel-close" onclick="window.__dashClose()">✕</button>
      </div>
      <div class="dash-panel-body">${bodyHtml}</div>
    </div>`;
}

function setBody(html) {
  const b = getContainer().querySelector('.dash-panel-body');
  if (b) b.innerHTML = html;
}

/* ── Status badge ────────────────────────────────────────────────── */
const STATUS = {
  PAID:              { en: 'Paid',          de: 'Bezahlt',         color: '#22c55e' },
  CREATED:           { en: 'Processing',    de: 'In Bearbeitung',  color: '#888' },
  PENDING:           { en: 'Pending',       de: 'Ausstehend',      color: '#f59e0b' },
  AWAITING_TRANSFER: { en: 'Bank transfer', de: 'Überweisung',     color: '#3b82f6' },
  DENIED:            { en: 'Denied',        de: 'Abgelehnt',       color: '#ef4444' },
  REFUNDED:          { en: 'Refunded',      de: 'Erstattet',       color: '#8b5cf6' },
  CAPTURE_UNKNOWN:   { en: 'Checking…',    de: 'Wird geprüft…',   color: '#f59e0b' },
  REQUESTED:         { en: 'Requested',     de: 'Beantragt',       color: '#3b82f6' },
  APPROVED:          { en: 'Approved',      de: 'Genehmigt',       color: '#22c55e' },
  REJECTED:          { en: 'Rejected',      de: 'Abgelehnt',       color: '#ef4444' },
};

function badge(status) {
  const s = STATUS[status] || { en: status, de: status, color: '#888' };
  const label = isEn() ? s.en : s.de;
  return `<span class="dash-status-badge" style="background:${s.color}20;color:${s.color};border:1px solid ${s.color}40">${escapeHtml(label)}</span>`;
}

/* ── 1. Profile ──────────────────────────────────────────────────── */
async function profile() {
  const title = isEn() ? 'Profile & Settings' : 'Profil & Einstellungen';
  const email = userEmail();
  const name  = currentUser?.displayName || '';
  const isGoogle = currentUser?.providerData?.some(p => p.providerId === 'google.com');

  shell(title, `
    <div class="dash-form-group">
      <label>${isEn() ? 'Display Name' : 'Anzeigename'}</label>
      <div class="dash-input-row">
        <input id="dp-name" type="text" value="${escapeHtml(name)}" placeholder="${isEn() ? 'Your name' : 'Ihr Name'}">
        <button class="btn btn-primary btn-sm" id="dp-save-btn">${isEn() ? 'Save' : 'Speichern'}</button>
      </div>
      <p class="dash-hint" id="dp-name-msg"></p>
    </div>
    <div class="dash-form-group">
      <label>E-Mail</label>
      <input type="text" value="${escapeHtml(email)}" disabled>
      <p class="dash-hint">${isEn() ? 'Email cannot be changed here.' : 'E-Mail kann hier nicht geändert werden.'}</p>
    </div>
    ${!isGoogle ? `
    <div class="dash-form-group">
      <label>${isEn() ? 'Password' : 'Passwort'}</label>
      <button class="btn btn-outline-adaptive btn-sm" id="dp-pw-btn">${isEn() ? 'Send password reset email' : 'Passwort-Reset senden'}</button>
      <p class="dash-hint" id="dp-pw-msg"></p>
    </div>` : `
    <div class="dash-form-group">
      <p class="dash-hint">${isEn() ? 'Signed in with Google.' : 'Mit Google angemeldet.'}</p>
    </div>`}
    <div class="dash-form-group dash-danger-zone">
      <label>${isEn() ? 'Danger Zone' : 'Gefahrenzone'}</label>
      <button class="btn btn-danger btn-sm" id="dp-del-btn">${isEn() ? 'Delete account' : 'Konto löschen'}</button>
    </div>`);

  byId('dp-save-btn')?.addEventListener('click', async () => {
    const newName = byId('dp-name').value.trim();
    const msg = byId('dp-name-msg');
    if (!newName) return;
    try {
      const { updateProfile } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
      const { auth } = await import('./firebase-config.js');
      await updateProfile(auth.currentUser, { displayName: newName });
      msg.textContent = isEn() ? '✓ Saved.' : '✓ Gespeichert.';
      msg.style.color = '#22c55e';
    } catch (err) { msg.textContent = err.message; }
  });

  byId('dp-pw-btn')?.addEventListener('click', async () => {
    const msg = byId('dp-pw-msg');
    try {
      const { sendPasswordResetEmail } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
      const { auth } = await import('./firebase-config.js');
      await sendPasswordResetEmail(auth, email);
      msg.textContent = isEn() ? '✓ Email sent.' : '✓ E-Mail gesendet.';
      msg.style.color = '#22c55e';
    } catch (err) { msg.textContent = err.message; }
  });

  byId('dp-del-btn')?.addEventListener('click', () => {
    if (confirm(isEn() ? 'Delete your account permanently?' : 'Konto dauerhaft löschen?')) {
      window.location.href = 'login.html#delete';
    }
  });
}

/* ── 2. Addresses ────────────────────────────────────────────────── */
async function addresses() {
  const title = isEn() ? 'Manage Addresses' : 'Adressen verwalten';
  shell(title, `<div class="dash-panel-loading">${isEn() ? 'Loading…' : 'Laden…'}</div>`);

  let addrs = [];
  try {
    const data = await get(`/api/user/addresses?uid=${encodeURIComponent(userUID())}`);
    addrs = data.addresses || [];
  } catch { addrs = []; }

  const addrHtml = addrs.length === 0
    ? `<p class="dash-empty">${isEn() ? 'No saved addresses.' : 'Keine gespeicherten Adressen.'}</p>`
    : addrs.map(a => `
      <div class="dash-address-card" data-id="${escapeHtml(a.addressId)}">
        <div class="dash-address-body">
          ${a.label ? `<strong class="dash-addr-label">${escapeHtml(a.label)}</strong><br>` : ''}
          ${escapeHtml(a.firstName)} ${escapeHtml(a.lastName)}<br>
          ${escapeHtml(a.street)} ${escapeHtml(a.houseNumber)}<br>
          ${escapeHtml(a.postalCode)} ${escapeHtml(a.city)}, ${escapeHtml(a.country)}<br>
          ${a.phone ? escapeHtml(a.phone) : ''}
        </div>
        <div class="dash-address-actions">
          <button class="btn btn-sm btn-outline-adaptive edit-addr-btn" data-id="${escapeHtml(a.addressId)}">${isEn() ? 'Edit' : 'Bearbeiten'}</button>
          <button class="btn btn-sm btn-danger del-addr-btn" data-id="${escapeHtml(a.addressId)}">${isEn() ? 'Delete' : 'Löschen'}</button>
        </div>
      </div>`).join('');

  setBody(addrHtml + `
    ${addrs.length < 5 ? `<button class="btn btn-primary btn-sm" id="add-addr-btn" style="margin-top:16px">+ ${isEn() ? 'Add address' : 'Adresse hinzufügen'}</button>` : ''}
    <div id="addr-form-wrap"></div>`);

  getContainer().querySelectorAll('.del-addr-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm(isEn() ? 'Delete this address?' : 'Adresse löschen?')) return;
      btn.disabled = true;
      try {
        await del(`/api/user/addresses/${btn.dataset.id}?uid=${encodeURIComponent(userUID())}`);
        addresses();
      } catch { btn.disabled = false; }
    });
  });

  getContainer().querySelectorAll('.edit-addr-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const addr = addrs.find(a => a.addressId === btn.dataset.id);
      if (addr) showAddrForm(addr);
    });
  });

  byId('add-addr-btn')?.addEventListener('click', () => showAddrForm(null));
}

function showAddrForm(existing) {
  const wrap = byId('addr-form-wrap');
  if (!wrap) return;
  const isEdit = !!existing;
  const v = (k) => escapeHtml(existing?.[k] || '');

  wrap.innerHTML = `
    <div class="dash-addr-form">
      <h4>${isEdit ? (isEn() ? 'Edit address' : 'Adresse bearbeiten') : (isEn() ? 'New address' : 'Neue Adresse')}</h4>
      <div class="dash-form-row">
        <input id="af-label"   placeholder="${isEn() ? 'Label (e.g. Home)' : 'Bezeichnung (z.B. Zuhause)'}" value="${v('label')}">
      </div>
      <div class="dash-form-row">
        <input id="af-first"  placeholder="${isEn() ? 'First name' : 'Vorname'} *" value="${v('firstName')}">
        <input id="af-last"   placeholder="${isEn() ? 'Last name' : 'Nachname'} *"  value="${v('lastName')}">
      </div>
      <div class="dash-form-row">
        <input id="af-street" placeholder="${isEn() ? 'Street' : 'Straße'} *"      value="${v('street')}">
        <input id="af-house"  placeholder="${isEn() ? 'No.' : 'Nr.'} *"            value="${v('houseNumber')}" style="max-width:100px">
      </div>
      <div class="dash-form-row">
        <input id="af-plz"    placeholder="PLZ *"                                   value="${v('postalCode')}" style="max-width:120px">
        <input id="af-city"   placeholder="${isEn() ? 'City' : 'Ort'} *"            value="${v('city')}">
      </div>
      <div class="dash-form-row">
        <input id="af-phone"  placeholder="${isEn() ? 'Phone (optional)' : 'Telefon (optional)'}" value="${v('phone')}">
      </div>
      <div class="dash-form-actions">
        <button class="btn btn-primary btn-sm" id="af-save">${isEn() ? 'Save' : 'Speichern'}</button>
        <button class="btn btn-outline-adaptive btn-sm" id="af-cancel">${isEn() ? 'Cancel' : 'Abbrechen'}</button>
      </div>
      <p id="af-err" style="color:var(--primary-red);font-size:0.85rem;margin-top:8px"></p>
    </div>`;

  byId('af-cancel')?.addEventListener('click', () => { wrap.innerHTML = ''; });

  byId('af-save')?.addEventListener('click', async () => {
    const g = (id) => byId(id)?.value.trim() || '';
    const body = {
      addressId:   existing?.addressId,
      label:       g('af-label'),
      firstName:   g('af-first'),
      lastName:    g('af-last'),
      street:      g('af-street'),
      houseNumber: g('af-house'),
      postalCode:  g('af-plz'),
      city:        g('af-city'),
      phone:       g('af-phone'),
      country:     'DE',
      uid:         userUID()
    };
    const required = ['firstName','lastName','street','houseNumber','postalCode','city'];
    if (required.some(k => !body[k])) {
      byId('af-err').textContent = isEn() ? 'Please fill in required fields.' : 'Pflichtfelder ausfüllen.';
      return;
    }
    byId('af-save').disabled = true;
    try {
      await post('/api/user/addresses', body);
      addresses();
    } catch (err) {
      byId('af-err').textContent = err.message;
      byId('af-save').disabled = false;
    }
  });
}

/* ── 3. Orders ───────────────────────────────────────────────────── */
async function orders() {
  const title = isEn() ? 'Your Orders' : 'Meine Bestellungen';
  shell(title, `<div class="dash-panel-loading">${isEn() ? 'Loading…' : 'Laden…'}</div>`);

  let allOrders = [];
  try {
    const data = await get(`/api/user/orders?email=${encodeURIComponent(userEmail())}`);
    allOrders = (data.orders || []).filter(o => !['DENIED'].includes(o.status));
  } catch { allOrders = []; }

  if (allOrders.length === 0) {
    setBody(`<p class="dash-empty">${isEn() ? 'No orders yet.' : 'Noch keine Bestellungen.'}</p>
      <a href="takekontrol-revamp.html" class="btn btn-primary btn-sm">${isEn() ? 'Go to shop' : 'Zum Shop'}</a>`);
    return;
  }

  setBody(allOrders.map(o => orderCard(o)).join(''));

  getContainer().querySelectorAll('.view-order-btn').forEach(btn => {
    btn.addEventListener('click', () => orderDetail(btn.dataset.id));
  });

  getContainer().querySelectorAll('.invoice-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      window.open(`/api/user/orders/${btn.dataset.id}/invoice?email=${encodeURIComponent(userEmail())}`, '_blank');
    });
  });
}

function orderCard(o) {
  const date  = o.createdAt ? new Date(o.createdAt).toLocaleDateString(isEn() ? 'en-IE' : 'de-DE') : '—';
  const total = o.grandTotal ? `€${Number(o.grandTotal).toFixed(2)}` : '—';
  const items = (o.items || []).map(l => `${l.qty}× ${escapeHtml(l.name)}`).join(', ') || '—';

  return `
    <div class="dash-order-card">
      <div class="dash-order-header">
        <span class="dash-order-num">${escapeHtml(o.orderNumber)}</span>
        ${badge(o.status)}
      </div>
      <div class="dash-order-meta">
        <span>${isEn() ? 'Date' : 'Datum'}: ${date}</span>
        <span>${isEn() ? 'Total' : 'Gesamt'}: <strong>${total}</strong></span>
        ${o.captureId ? `<span>Tx: <code style="font-size:0.75rem">${escapeHtml(o.captureId.slice(0,16))}…</code></span>` : ''}
      </div>
      <div class="dash-order-items">${items}</div>
      <div class="dash-order-actions">
        <button class="btn btn-sm btn-outline-adaptive view-order-btn" data-id="${escapeHtml(o.orderId)}">
          ${isEn() ? 'View details' : 'Details'}
        </button>
        ${o.status === 'PAID' ? `
        <button class="btn btn-sm btn-outline-adaptive invoice-btn" data-id="${escapeHtml(o.orderId)}">
          ${isEn() ? 'Invoice' : 'Rechnung'} ↗
        </button>` : ''}
        ${o.status === 'PAID' ? `
        <button class="btn btn-sm btn-outline-adaptive return-from-order-btn" data-num="${escapeHtml(o.orderNumber)}" data-id="${escapeHtml(o.orderId)}" data-items="${escapeHtml(items)}">
          ${isEn() ? 'Return' : 'Zurücksenden'}
        </button>` : ''}
      </div>
    </div>`;
}

async function orderDetail(orderId) {
  shell(isEn() ? 'Order Detail' : 'Bestelldetails', `<div class="dash-panel-loading">${isEn() ? 'Loading…' : 'Laden…'}</div>`);
  try {
    const data = await get(`/api/user/orders/${orderId}?email=${encodeURIComponent(userEmail())}`);
    const o = data.order;
    const ship = o.shipping || {};
    const date = o.createdAt ? new Date(o.createdAt).toLocaleDateString(isEn() ? 'en-IE' : 'de-DE') : '—';
    const paidAt = o.paidAt ? new Date(o.paidAt).toLocaleString(isEn() ? 'en-IE' : 'de-DE') : '—';

    setBody(`
      <div class="dash-order-detail">
        <div class="dash-detail-row"><span>${isEn() ? 'Order number' : 'Bestellnummer'}</span><strong>${escapeHtml(o.orderNumber)}</strong></div>
        <div class="dash-detail-row"><span>${isEn() ? 'Status' : 'Status'}</span>${badge(o.status)}</div>
        <div class="dash-detail-row"><span>${isEn() ? 'Order date' : 'Bestelldatum'}</span><span>${date}</span></div>
        ${o.paidAt ? `<div class="dash-detail-row"><span>${isEn() ? 'Payment date' : 'Zahlungsdatum'}</span><span>${paidAt}</span></div>` : ''}
        ${o.captureId ? `<div class="dash-detail-row"><span>Transaction ID</span><code style="font-size:0.8rem;word-break:break-all">${escapeHtml(o.captureId)}</code></div>` : ''}
        ${o.payerEmail ? `<div class="dash-detail-row"><span>PayPal</span><span>${escapeHtml(o.payerEmail)}</span></div>` : ''}

        <div class="dash-detail-section">${isEn() ? 'Delivery address' : 'Lieferadresse'}</div>
        <div class="dash-addr-display">
          ${escapeHtml(ship.firstName || '')} ${escapeHtml(ship.lastName || '')}<br>
          ${escapeHtml(ship.street || '')} ${escapeHtml(ship.houseNumber || '')}<br>
          ${escapeHtml(ship.postalCode || '')} ${escapeHtml(ship.city || '')}, ${escapeHtml(ship.country || '')}
        </div>

        <div class="dash-detail-section">${isEn() ? 'Items' : 'Artikel'}</div>
        ${(o.items || []).map(l => `
          <div class="dash-order-line">
            <span>${l.qty}× ${escapeHtml(l.name)}</span>
            <span>€${l.lineNet || '—'}</span>
          </div>`).join('')}

        <div class="dash-detail-totals">
          <div class="dash-order-line"><span>${isEn() ? 'Subtotal (net)' : 'Zwischensumme'}</span><span>€${o.itemTotalNet || '—'}</span></div>
          <div class="dash-order-line"><span>${isEn() ? 'Shipping (net)' : 'Versand'}</span><span>${Number(o.shippingNet) === 0 ? (isEn() ? 'Free' : 'Kostenlos') : '€' + o.shippingNet}</span></div>
          <div class="dash-order-line"><span>MwSt. 19%</span><span>€${o.vat || '—'}</span></div>
          <div class="dash-order-line dash-order-total"><span>${isEn() ? 'Total' : 'Gesamt'}</span><strong>€${Number(o.grandTotal).toFixed(2)}</strong></div>
        </div>

        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:20px">
          <button class="btn btn-outline-adaptive btn-sm" onclick="window.__dashBack()">${isEn() ? '← Back' : '← Zurück'}</button>
          ${o.status === 'PAID' ? `<button class="btn btn-outline-adaptive btn-sm" onclick="window.open('/api/user/orders/${escapeHtml(o.orderId)}/invoice?email=${encodeURIComponent(userEmail())}','_blank')">${isEn() ? 'Download Invoice' : 'Rechnung öffnen'} ↗</button>` : ''}
        </div>
      </div>`);

    window.__dashBack = orders;
  } catch (err) {
    setBody(`<p style="color:var(--primary-red)">${err.message}</p>`);
  }
}

/* ── 4. Cancelled ────────────────────────────────────────────────── */
async function cancelled() {
  const title = isEn() ? 'Cancelled Items' : 'Stornierte Artikel';
  shell(title, `<div class="dash-panel-loading">${isEn() ? 'Loading…' : 'Laden…'}</div>`);

  let allOrders = [];
  try {
    const data = await get(`/api/user/orders?email=${encodeURIComponent(userEmail())}`);
    allOrders = (data.orders || []).filter(o => ['DENIED','PRICE_CHANGED','CAPTURE_UNKNOWN'].includes(o.status));
  } catch { allOrders = []; }

  setBody(allOrders.length === 0
    ? `<p class="dash-empty">${isEn() ? 'No cancelled orders.' : 'Keine stornierten Bestellungen.'}</p>`
    : allOrders.map(orderCard).join(''));
}

/* ── 5. Returns ──────────────────────────────────────────────────── */
async function returns() {
  const title = isEn() ? 'Returns & Refunds' : 'Rückgabe & Erstattung';
  shell(title, `<div class="dash-panel-loading">${isEn() ? 'Loading…' : 'Laden…'}</div>`);

  let myReturns = [];
  try {
    const data = await get(`/api/user/returns?email=${encodeURIComponent(userEmail())}`);
    myReturns = data.returns || [];
  } catch { myReturns = []; }

  const returnsHtml = myReturns.length === 0 ? '' : `
    <div class="dash-detail-section">${isEn() ? 'My Return Requests' : 'Meine Rücksendeanfragen'}</div>
    ${myReturns.map(r => `
      <div class="dash-return-item">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span class="dash-order-num">${escapeHtml(r.returnId)}</span>
          ${badge(r.status)}
        </div>
        <div class="dash-order-meta">
          <span>${isEn() ? 'Order' : 'Bestellung'}: ${escapeHtml(r.orderNumber)}</span>
          <span>${new Date(r.createdAt).toLocaleDateString(isEn() ? 'en-IE' : 'de-DE')}</span>
        </div>
        <div class="dash-order-items">${escapeHtml(r.reason)}</div>
      </div>`).join('')}`;

  setBody(`
    ${returnsHtml}
    <div class="dash-return-policy">
      <h4>${isEn() ? '14-Day Right of Withdrawal' : '14-tägiges Widerrufsrecht'}</h4>
      <ul>
        <li>${isEn() ? 'Items must be unused and in original packaging.' : 'Artikel müssen unbenutzt und in Originalverpackung sein.'}</li>
        <li>${isEn() ? 'Return shipping costs are borne by the customer.' : 'Rücksendekosten trägt der Kunde.'}</li>
        <li>${isEn() ? 'Refund within 14 days of receiving the return.' : 'Erstattung innerhalb von 14 Tagen.'}</li>
      </ul>
    </div>

    <div class="dash-addr-form">
      <h4>${isEn() ? 'Submit Return Request' : 'Rücksendung beantragen'}</h4>
      <div class="dash-form-row">
        <input id="ret-ordernum" placeholder="${isEn() ? 'Order number (TK-...)' : 'Bestellnummer (TK-...)'} *">
      </div>
      <div class="dash-form-row">
        <input id="ret-items" placeholder="${isEn() ? 'Items to return' : 'Zurückzusendende Artikel'} *">
      </div>
      <div class="dash-form-row">
        <select id="ret-reason">
          <option value="">${isEn() ? 'Reason *' : 'Grund *'}</option>
          <option value="defective">${isEn() ? 'Defective / damaged' : 'Defekt / beschädigt'}</option>
          <option value="wrong_item">${isEn() ? 'Wrong item received' : 'Falscher Artikel erhalten'}</option>
          <option value="not_as_described">${isEn() ? 'Not as described' : 'Nicht wie beschrieben'}</option>
          <option value="no_longer_needed">${isEn() ? 'No longer needed' : 'Nicht mehr benötigt'}</option>
          <option value="withdrawal">${isEn() ? 'Right of withdrawal' : 'Widerrufsrecht'}</option>
        </select>
      </div>
      <div class="dash-form-row">
        <textarea id="ret-message" rows="3" placeholder="${isEn() ? 'Additional details (optional)' : 'Weitere Details (optional)'}"></textarea>
      </div>
      <div class="dash-form-actions">
        <button class="btn btn-primary btn-sm" id="ret-submit">${isEn() ? 'Submit request' : 'Anfrage senden'}</button>
      </div>
      <p id="ret-msg" style="margin-top:8px;font-size:0.85rem"></p>
    </div>`);

  byId('ret-submit')?.addEventListener('click', async () => {
    const orderNumber = byId('ret-ordernum').value.trim();
    const reason      = byId('ret-reason').value;
    const items       = byId('ret-items').value.trim();
    const message     = byId('ret-message').value.trim();
    const msg         = byId('ret-msg');

    if (!orderNumber || !reason || !items) {
      msg.textContent = isEn() ? 'Please fill in all required fields.' : 'Bitte alle Pflichtfelder ausfüllen.';
      msg.style.color = 'var(--primary-red)';
      return;
    }

    byId('ret-submit').disabled = true;
    try {
      const data = await post('/api/user/returns', { email: userEmail(), orderNumber, reason, items, message });
      msg.textContent = `✓ ${isEn() ? 'Return request submitted.' : 'Rücksendeanfrage eingereicht.'} ID: ${data.returnId}`;
      msg.style.color = '#22c55e';
      byId('ret-ordernum').value = '';
      byId('ret-items').value = '';
      byId('ret-reason').value = '';
      byId('ret-message').value = '';
      byId('ret-submit').disabled = false;
    } catch (err) {
      msg.textContent = err.message;
      msg.style.color = 'var(--primary-red)';
      byId('ret-submit').disabled = false;
    }
  });
}

/* ── Init ────────────────────────────────────────────────────────── */
export function initDashboard(user) {
  currentUser = user;
  document.querySelectorAll('.dash-grid-item[data-panel]').forEach(card => {
    card.addEventListener('click', e => {
      e.preventDefault();
      const panel = card.dataset.panel;
      if (activePanel === panel) closePanel();
      else showPanel(panel);
    });
  });
  window.__dashClose = closePanel;
}
