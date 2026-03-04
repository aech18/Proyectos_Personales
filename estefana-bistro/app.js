/* ===================================================
   Estefana Bistro — app.js
   Handles: navbar scroll, mobile menu, menu filter,
   cart sidebar, WhatsApp order builder, year footer
   =================================================== */

(function () {
  'use strict';

  // ── Utilities ──────────────────────────────────────
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  // ── Footer year ────────────────────────────────────
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── Navbar: sticky + scroll effect ─────────────────
  const navbar = $('#navbar');
  const SCROLL_THRESHOLD = 80;

  function updateNavbar() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  // ── Mobile hamburger menu ───────────────────────────
  const hamburger = $('#hamburger');
  const navLinks = $('#nav-links');
  let navOverlay = null;

  function openMobileNav() {
    hamburger.classList.add('open');
    navLinks.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');

    // Create overlay to close nav when clicking outside
    navOverlay = document.createElement('div');
    navOverlay.style.cssText =
      'position:fixed;inset:0;z-index:98;background:rgba(0,0,0,0.4)';
    navOverlay.addEventListener('click', closeMobileNav);
    document.body.appendChild(navOverlay);
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    if (navOverlay) {
      navOverlay.remove();
      navOverlay = null;
    }
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    if (navLinks.classList.contains('open')) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  });

  // Close nav on link click
  navLinks.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') closeMobileNav();
  });

  // ── Menu category filter ────────────────────────────
  const tabs = $$('.tab');
  const menuCards = $$('.menu-card');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const category = tab.dataset.category;

      // Update active tab
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      // Filter cards
      menuCards.forEach((card) => {
        if (category === 'all' || card.dataset.category === category) {
          card.classList.remove('hidden');
          card.style.animation = 'none';
          // Trigger reflow for re-animation
          void card.offsetWidth;
          card.style.animation = 'fadeInUp 0.35s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ── Cart state ──────────────────────────────────────
  /** @type {Array<{name: string, price: number, qty: number}>} */
  let cart = [];

  const cartSidebar = $('#cart-sidebar');
  const cartOverlay = $('#cart-overlay');
  const cartBtn = $('#cart-btn');
  const cartClose = $('#cart-close');
  const cartCountEl = $('#cart-count');
  const cartItemsEl = $('#cart-items');
  const cartTotalPriceEl = $('#cart-total-price');
  const cartWhatsappBtn = $('#cart-whatsapp-btn');

  // Open / close cart
  function openCart() {
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  cartBtn.addEventListener('click', openCart);
  cartClose.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);

  // Format price as COP
  function formatPrice(n) {
    return '$' + n.toLocaleString('es-CO');
  }

  // Render cart items
  function renderCart() {
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

    // Update badge
    cartCountEl.textContent = totalItems;
    cartTotalPriceEl.textContent = formatPrice(total);

    // Show/hide cart button
    if (totalItems > 0) {
      cartBtn.classList.remove('hidden');
    } else {
      cartBtn.classList.add('hidden');
    }

    // Render items list
    if (cart.length === 0) {
      cartItemsEl.innerHTML = '<p class="cart-empty">Aún no has agregado nada 🛒</p>';
    } else {
      cartItemsEl.innerHTML = cart
        .map(
          (item) => `
          <div class="cart-item" data-name="${escapeHtml(item.name)}">
            <span class="cart-item-name">${escapeHtml(item.name)}</span>
            <div class="cart-item-qty">
              <button class="qty-btn" data-action="dec" data-name="${escapeHtml(item.name)}" aria-label="Quitar uno">−</button>
              <span>${item.qty}</span>
              <button class="qty-btn" data-action="inc" data-name="${escapeHtml(item.name)}" aria-label="Agregar uno">+</button>
            </div>
            <span class="cart-item-price">${formatPrice(item.price * item.qty)}</span>
          </div>`
        )
        .join('');
    }

    // Build WhatsApp message
    if (cart.length > 0) {
      const lines = cart.map(
        (item) => `• ${item.name} x${item.qty} = ${formatPrice(item.price * item.qty)}`
      );
      lines.push('');
      lines.push(`*Total: ${formatPrice(total)}*`);
      const msg = encodeURIComponent(
        'Hola, quiero hacer el siguiente pedido en Estefana Bistro:\n\n' + lines.join('\n')
      );
      cartWhatsappBtn.href = `https://wa.me/573001234567?text=${msg}`;
    } else {
      cartWhatsappBtn.href = '#';
    }
  }

  // Escape HTML to prevent XSS using a DOM text node (browser-native, no double-escaping)
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  // Handle qty button clicks (delegated)
  cartItemsEl.addEventListener('click', (e) => {
    const btn = e.target.closest('.qty-btn');
    if (!btn) return;

    const name = btn.dataset.name;
    const action = btn.dataset.action;
    const idx = cart.findIndex((i) => i.name === name);
    if (idx === -1) return;

    if (action === 'inc') {
      cart[idx].qty += 1;
    } else if (action === 'dec') {
      cart[idx].qty -= 1;
      if (cart[idx].qty <= 0) {
        cart.splice(idx, 1);
      }
    }
    renderCart();
  });

  // ── Add-to-cart buttons ─────────────────────────────
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-add');
    if (!btn) return;

    const name = btn.dataset.item;
    const price = parseInt(btn.dataset.price, 10);

    // Validate that price is a finite positive number
    if (!name || !Number.isFinite(price) || price <= 0) return;

    const existing = cart.find((i) => i.name === name);

    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ name, price, qty: 1 });
    }

    renderCart();

    // Animate button feedback
    const originalText = btn.textContent;
    btn.textContent = '✓ Agregado';
    btn.style.background = '#22c55e';
    btn.style.color = '#fff';
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      btn.style.color = '';
    }, 1000);

    // Open cart on first add
    if (cart.length === 1) {
      setTimeout(openCart, 300);
    }
  });

  // Initial render
  renderCart();

  // ── Smooth scroll for anchor links ─────────────────
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight + 16;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });

  // ── Intersection Observer for scroll animations ─────
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    $$('.menu-card, .gallery-item, .feature, .contact-list li, .badge-item').forEach(
      (el) => {
        el.classList.add('observe');
        observer.observe(el);
      }
    );
  }
})();
