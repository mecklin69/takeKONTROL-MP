/**
 * takeKONTROL — Shop mobile UX enhancements
 * - Sticky add-to-cart bar when scrolling past product
 * - Tap to expand product card (thumbnail → full)
 * - Category pills for quick navigation
 * - Touch-optimised carousel
 */

import { byId, $$ } from '../core/dom.js';

/* ── Category pills ──────────────────────────────────────────── */
function initCategoryPills() {
  const container = document.querySelector('.container');
  if (!container || window.innerWidth > 768) return;

  // Only inject if not already there
  if (byId('category-pills')) return;

  const pills = document.createElement('div');
  pills.className = 'category-pills';
  pills.id = 'category-pills';
  pills.innerHTML = `
    <a href="#home-kit" class="category-pill active">🏠 Home Kit</a>
    <a href="#backpacks" class="category-pill">🎒 Backpacks</a>
    <a href="#accessories" class="category-pill">🧰 Accessories</a>
    <a href="#comparison" class="category-pill">📊 Compare</a>
  `;

  // Insert after hero
  const hero = document.querySelector('.hero');
  if (hero) hero.insertAdjacentElement('afterend', pills);

  // Highlight active pill on scroll
  const sections = [
    { id: 'home-kit', pill: 0 },
    { id: 'backpacks', pill: 1 },
    { id: 'accessories', pill: 2 },
    { id: 'comparison', pill: 3 }
  ];

  const allPills = pills.querySelectorAll('.category-pill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const match = sections.find(s => s.id === entry.target.id);
        if (match) {
          allPills.forEach(p => p.classList.remove('active'));
          allPills[match.pill]?.classList.add('active');
        }
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(s => {
    const el = byId(s.id);
    if (el) observer.observe(el);
  });
}

/* ── Sticky add-to-cart bar ──────────────────────────────────── */
function initStickyCartBar() {
  if (window.innerWidth > 768) return;

  // Create the bar
  const bar = document.createElement('div');
  bar.className = 'sticky-cart-bar';
  bar.id = 'sticky-cart-bar';
  bar.innerHTML = `
    <div class="sticky-product-name" id="sticky-product-name">Product</div>
    <div class="sticky-price" id="sticky-price">€0</div>
    <button class="btn btn-primary sticky-add-btn" id="sticky-add-btn">+ Cart</button>
  `;
  document.body.appendChild(bar);

  let currentSku = null;
  let currentName = null;
  let currentPrice = null;

  // Watch each product section
  const products = [
    { el: byId('home-kit'),   sku: 'TK-HOME-7D', name: '7-Day Home Kit',      price: '€549.99' },
    { el: byId('backpacks'),  sku: null,          name: 'Backpacks',           price: null },
  ];

  // Also watch individual product cards
  const cards = $$('.product-card, .shelf-card');
  cards.forEach(card => {
    const addBtn = card.querySelector('.add-to-cart-btn');
    if (!addBtn) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          currentSku   = addBtn.dataset.sku;
          currentName  = addBtn.dataset.name;
          currentPrice = card.querySelector('.price')?.firstChild?.textContent?.trim() || '';
          byId('sticky-product-name').textContent = currentName || 'Product';
          byId('sticky-price').textContent = currentPrice;
          bar.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '-60px 0px -60% 0px' });

    observer.observe(card);
  });

  // Hide bar when back at top
  window.addEventListener('scroll', () => {
    if (window.scrollY < 300) bar.classList.remove('visible');
  }, { passive: true });

  // Sticky button adds to cart
  byId('sticky-add-btn')?.addEventListener('click', () => {
    if (!currentSku) return;
    // Fire the same add-to-cart as the product button
    const realBtn = document.querySelector(`.add-to-cart-btn[data-sku="${currentSku}"]`);
    if (realBtn) realBtn.click();

    // Visual feedback
    const btn = byId('sticky-add-btn');
    btn.textContent = '✓ Added';
    btn.style.background = '#22c55e';
    setTimeout(() => {
      btn.textContent = '+ Cart';
      btn.style.background = '';
    }, 1500);
  });
}

/* ── Expandable product cards on mobile ──────────────────────── */
function initExpandableCards() {
  if (window.innerWidth > 768) return;

  $$('.product-card').forEach(card => {
    const viewBtn = card.querySelector('.view-items-btn');
    if (!viewBtn) return;

    // Make the image area tappable to expand
    const imgContainer = card.querySelector('.product-image-container');

    const expand = () => {
      const isExpanded = card.classList.contains('expanded');
      // Collapse all others first
      $$('.product-card.expanded').forEach(c => c.classList.remove('expanded'));
      if (!isExpanded) {
        card.classList.add('expanded');
        card.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    imgContainer?.addEventListener('click', expand);
    viewBtn.addEventListener('click', (e) => {
      e.preventDefault();
      expand();
    });
  });
}

/* ── Swipe-to-dismiss for expandable items list ──────────────── */
function initSwipeDismiss() {
  $$('.expandable').forEach(el => {
    let startY = 0;
    el.addEventListener('touchstart', e => {
      startY = e.changedTouches[0].clientY;
    }, { passive: true });

    el.addEventListener('touchend', e => {
      const delta = e.changedTouches[0].clientY - startY;
      if (delta > 60) {
        // Swipe down — collapse
        const card = el.closest('.product-card');
        card?.classList.remove('expanded');
      }
    }, { passive: true });
  });
}

/* ── Init ────────────────────────────────────────────────────── */
export function initShopMobile() {
  if (window.innerWidth > 768) return;
  initCategoryPills();
  initStickyCartBar();
  initExpandableCards();
  initSwipeDismiss();
}
