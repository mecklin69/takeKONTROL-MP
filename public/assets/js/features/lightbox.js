/**
 * takeKONTROL — Image Lightbox
 * Click any product image to open a fullscreen lightbox.
 * Supports: keyboard navigation, swipe on touch, ESC to close.
 */

let lightboxImages = [];
let lightboxIndex  = 0;

/* ── Build lightbox DOM (once) ─────────────────────────────── */
function buildLightbox() {
  if (document.getElementById('tk-lightbox')) return;

  const lb = document.createElement('div');
  lb.id = 'tk-lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.setAttribute('aria-label', 'Product image viewer');
  lb.innerHTML = `
    <div id="tk-lb-backdrop"></div>
    <button id="tk-lb-close" aria-label="Close">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
    <button id="tk-lb-prev" aria-label="Previous image">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
    </button>
    <div id="tk-lb-img-wrap">
      <img id="tk-lb-img" src="" alt="">
      <div id="tk-lb-loader">
        <div class="tk-lb-spinner"></div>
      </div>
    </div>
    <button id="tk-lb-next" aria-label="Next image">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
    </button>
    <div id="tk-lb-counter"></div>
    <div id="tk-lb-thumbnails"></div>
  `;
  document.body.appendChild(lb);

  // Events
  document.getElementById('tk-lb-backdrop').addEventListener('click', closeLightbox);
  document.getElementById('tk-lb-close').addEventListener('click', closeLightbox);
  document.getElementById('tk-lb-prev').addEventListener('click', () => moveLightbox(-1));
  document.getElementById('tk-lb-next').addEventListener('click', () => moveLightbox(1));

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (!document.getElementById('tk-lightbox').classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  moveLightbox(-1);
    if (e.key === 'ArrowRight') moveLightbox(1);
  });

  // Touch swipe
  let touchStartX = 0;
  const wrap = document.getElementById('tk-lb-img-wrap');
  wrap.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
  wrap.addEventListener('touchend', e => {
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 50) moveLightbox(delta < 0 ? 1 : -1);
  }, { passive: true });
}

/* ── Open ──────────────────────────────────────────────────── */
function openLightbox(images, startIndex) {
  buildLightbox();
  lightboxImages = images;
  lightboxIndex  = startIndex;

  document.getElementById('tk-lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';

  renderLightboxImage();
  renderThumbnails();

  // Focus close button for accessibility
  setTimeout(() => document.getElementById('tk-lb-close')?.focus(), 60);
}

function closeLightbox() {
  document.getElementById('tk-lightbox')?.classList.remove('open');
  document.body.style.overflow = '';
}

function moveLightbox(dir) {
  lightboxIndex = (lightboxIndex + dir + lightboxImages.length) % lightboxImages.length;
  renderLightboxImage();
  renderThumbnails();
}

function renderLightboxImage() {
  const img    = document.getElementById('tk-lb-img');
  const loader = document.getElementById('tk-lb-loader');
  const counter = document.getElementById('tk-lb-counter');

  loader.style.display = 'flex';
  img.style.opacity = '0';

  const src = lightboxImages[lightboxIndex];
  img.onload = () => {
    loader.style.display = 'none';
    img.style.opacity = '1';
  };
  img.onerror = () => { loader.style.display = 'none'; img.style.opacity = '1'; };
  img.src = src;
  img.alt = `Product image ${lightboxIndex + 1}`;

  counter.textContent = `${lightboxIndex + 1} / ${lightboxImages.length}`;

  // Show/hide arrows
  const showArrows = lightboxImages.length > 1;
  document.getElementById('tk-lb-prev').style.display = showArrows ? '' : 'none';
  document.getElementById('tk-lb-next').style.display = showArrows ? '' : 'none';
}

function renderThumbnails() {
  const wrap = document.getElementById('tk-lb-thumbnails');
  if (lightboxImages.length <= 1) { wrap.innerHTML = ''; return; }

  wrap.innerHTML = lightboxImages.map((src, i) => `
    <img src="${src}" class="tk-lb-thumb${i === lightboxIndex ? ' active' : ''}"
         alt="Thumbnail ${i + 1}" data-index="${i}"
         onerror="this.style.display='none'">
  `).join('');

  wrap.querySelectorAll('.tk-lb-thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      lightboxIndex = Number(thumb.dataset.index);
      renderLightboxImage();
      renderThumbnails();
    });
  });
}

/* ── Wire up all product images ─────────────────────────────── */
export function initLightbox() {
  buildLightbox();

  // Find every carousel container
  document.querySelectorAll('.product-image-container').forEach(container => {
    const slides = Array.from(container.querySelectorAll('.carousel-slide'));
    if (slides.length === 0) return;

    slides.forEach((img, i) => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', (e) => {
        e.stopPropagation();
        const srcs = slides.map(s => s.src);
        openLightbox(srcs, i);
      });
    });
  });
}
