/* ============================================
   SALONE MARKET - Main JavaScript
   DCOMP204 Web Design 1 | Limkokwing University
   ============================================ */

/* ---- Cart State ---- */
let cartCount = 0;

/* ---- DOM Ready ---- */
document.addEventListener('DOMContentLoaded', function () {
  initNavbar();
  initCategoryFilter();
  initProductButtons();
  initFormValidation();
  markActiveNavLink();
  initScrollReveal();
  initFilterButtons();
});

/* ============================================
   NAVBAR – Mobile hamburger toggle
   ============================================ */
function initNavbar() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', function () {
    const isOpen = mobileMenu.style.display === 'flex';
    mobileMenu.style.display = isOpen ? 'none' : 'flex';
    hamburger.setAttribute('aria-expanded', String(!isOpen));
  });

  // Close menu when a link is clicked
  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      mobileMenu.style.display = 'none';
    });
  });
}

/* ============================================
   ACTIVE NAV LINK – highlight current page
   ============================================ */
function markActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar__links a, .navbar__mobile-menu a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ============================================
   CATEGORY FILTER – homepage chips
   ============================================ */
function initCategoryFilter() {
  const chips = document.querySelectorAll('.category-chip');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (c) { c.classList.remove('active'); });
      chip.classList.add('active');

      const category = chip.dataset.category;
      filterProducts(category);
    });
  });
}

function filterProducts(category) {
  const cards = document.querySelectorAll('.product-card');
  cards.forEach(function (card) {
    if (category === 'all' || card.dataset.category === category) {
      card.style.display = 'block';
      card.style.animation = 'fadeIn 0.35s ease forwards';
    } else {
      card.style.display = 'none';
    }
  });
}

/* ============================================
   PRODUCT BUTTONS – add to cart
   ============================================ */
function initProductButtons() {
  document.querySelectorAll('.product-card__btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const card = btn.closest('.product-card');
      const productName = card.querySelector('.product-card__name')
        ? card.querySelector('.product-card__name').textContent
        : 'Item';

      addToCart(productName);
    });
  });
}

function addToCart(productName) {
  cartCount++;
  updateCartBadge();
  showToast('🛒 ' + productName + ' added to cart!');
}

function updateCartBadge() {
  const badge = document.getElementById('cartCount');
  if (!badge) return;
  badge.textContent = cartCount;
  badge.classList.toggle('visible', cartCount > 0);
}

/* ============================================
   TOAST NOTIFICATION
   ============================================ */
function showToast(message) {
  let toast = document.getElementById('toast');

  // Create if not present
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(toast._timer);
  toast._timer = setTimeout(function () {
    toast.classList.remove('show');
  }, 3000);
}

/* ============================================
   FILTER BUTTONS – products page
   ============================================ */
function initFilterButtons() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (!filterBtns.length) return;

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      const category = btn.dataset.filter;
      filterProducts(category);
    });
  });
}

/* ============================================
   FORM VALIDATION – register / contact
   ============================================ */
function initFormValidation() {
  const form = document.getElementById('mainForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let valid = true;

    // Clear previous errors
    form.querySelectorAll('.form-group').forEach(function (group) {
      group.classList.remove('has-error');
    });

    // Validate required fields
    form.querySelectorAll('[required]').forEach(function (field) {
      if (!field.value.trim()) {
        field.closest('.form-group').classList.add('has-error');
        valid = false;
      }
    });

    // Validate email format
    const emailField = form.querySelector('input[type="email"]');
    if (emailField && emailField.value.trim()) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(emailField.value)) {
        emailField.closest('.form-group').classList.add('has-error');
        valid = false;
      }
    }

    // Validate phone (Sierra Leone format)
    const phoneField = form.querySelector('input[type="tel"]');
    if (phoneField && phoneField.value.trim()) {
      const phonePattern = /^(\+232|0)[0-9]{8}$/;
      if (!phonePattern.test(phoneField.value.replace(/\s/g, ''))) {
        phoneField.closest('.form-group').classList.add('has-error');
        valid = false;
      }
    }

    if (valid) {
      submitForm(form);
    } else {
      showToast('⚠️ Please fix the highlighted fields.');
    }
  });

  // Live validation feedback
  form.querySelectorAll('input, select, textarea').forEach(function (field) {
    field.addEventListener('input', function () {
      if (field.value.trim()) {
        field.closest('.form-group').classList.remove('has-error');
      }
    });
  });
}

function submitForm(form) {
  const successDiv = document.getElementById('formSuccess');
  if (successDiv) {
    form.style.display = 'none';
    successDiv.style.display = 'block';
    showToast('✅ Submitted successfully!');
  }
}

/* ============================================
   SCROLL REVEAL – fade in on scroll
   ============================================ */
function initScrollReveal() {
  const elements = document.querySelectorAll(
    '.product-card, .feature-item, .testimonial-card, .stat-card, .team-card, .contact-info-card'
  );

  if (!elements.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'fadeIn 0.5s ease forwards';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    elements.forEach(function (el) {
      el.style.opacity = '0';
      observer.observe(el);
    });
  }
}

/* ============================================
   HERO COUNTER ANIMATION
   ============================================ */
function animateCounter(el, target, duration) {
  let start = 0;
  const step = target / (duration / 16);

  function update() {
    start += step;
    if (start < target) {
      el.textContent = Math.floor(start).toLocaleString();
      requestAnimationFrame(update);
    } else {
      el.textContent = target.toLocaleString();
    }
  }

  requestAnimationFrame(update);
}

// Animate stat counters when visible
document.addEventListener('DOMContentLoaded', function () {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.dataset.counter, 10);
          animateCounter(entry.target, target, 1500);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { observer.observe(el); });
  }
});