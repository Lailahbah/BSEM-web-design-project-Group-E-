/* ——— PRODUCT DATA ——— */
const products = [
  { id:1,  name:'Fresh Cassava',       category:'vegetables', emoji:'🥔', image: 'images/36451078229881304.jfif', price:15,  unit:'bag',  location:'Bo District',       badge:'Just In' },
  { id:2,  name:'Sweet Potato',        category:'vegetables', emoji:'🍠', image: 'images/Japanese Sweet Potato.jfif', price:12,  unit:'bag',  location:'Moyamba',           badge:null },
  { id:3,  name:'Okra',                category:'vegetables', emoji:'🫑', image: 'images/okra.jfif', price:8,   unit:'bunch',location:'Kenema',            badge:'Popular' },
  { id:4,  name:'Garden Egg',          category:'vegetables', emoji:'🍆', image: 'images/_The eggplant, or Aubergine, is a large pear….jfif', price:6,   unit:'bag',  location:'Kailahun',          badge:null },
  { id:5,  name:'Ripe Mango',          category:'fruits',     emoji:'🥭', image: 'images/12103492744141098.jfif', price:10,  unit:'dozen',location:'Freetown',          badge:'Season' },
  { id:6,  name:'Pineapple',           category:'fruits',     emoji:'🍍', image: 'images/Fresh Pineapple Isolated.jfif', price:7,   unit:'each', location:'Port Loko',         badge:null },
  { id:7,  name:'Banana Bunch',        category:'fruits',     emoji:'🍌', image: 'images/Bananas.jfif', price:9,   unit:'bunch',location:'Tonkolili',         badge:null },
  { id:8,  name:'Watermelon',          category:'fruits',     emoji:'🍉', image: 'images/Cooking Advice and Tips.jfif', price:18,  unit:'each', location:'Kambia',            badge:'Large' },
  { id:9,  name:'Local Rice (25kg)',   category:'grains',     emoji:'🌾', image: 'images/Rice AI.jfif', price:85,  unit:'bag',  location:'Bombali',           badge:'Staple' },
  { id:10, name:'Groundnuts',          category:'grains',     emoji:'🥜', image: 'images/416020084351876034.jfif', price:20,  unit:'tin',  location:'Kono',              badge:null },
  { id:11, name:'Fonio',               category:'grains',     emoji:'🌿', image: 'images/Fonio _ African grain.jfif', price:30,  unit:'bag',  location:'Koinadugu',         badge:'Organic' },
  { id:12, name:'Smoked Barracuda',    category:'fish',       emoji:'🐟', image: 'images/Smoked Mackerel, Smoked Fish Recipe - homecooked_cz.jfif', price:25,  unit:'pack', location:'Bonthe',            badge:'Smoked' },
  { id:13, name:'Fresh Tilapia',       category:'fish',       emoji:'🐠', image: 'images/7318418140113359.jfif', price:22,  unit:'kg',   location:'Freetown (Kroo Bay)',badge:'Fresh' },
  { id:14, name:'Dried Crayfish',      category:'fish',       emoji:'🦐', image: 'images/Sand free crayfish.jfif', price:35,  unit:'bag',  location:'Pujehun',           badge:null },
  { id:15, name:'Pepper (Red)',        category:'vegetables', emoji:'🌶️', image: 'images/107030928642769384.jfif', price:5,   unit:'cup',  location:'Makeni',            badge:'Hot' },
  { id:16, name:'Coconut',             category:'fruits',     emoji:'🥥', image: 'images/WhatsApp Image 2026-06-13 at 12.13.40 PM.jpeg', price:4,   unit:'each', location:'Western Area',      badge:null },
];

let cart = [];
let activeFilter = 'all';

/* ——— RENDER PRODUCTS ——— */
function renderProducts(filter) {
  const grid = document.getElementById('productsGrid');
  if (!grid) return; // Prevent errors on pages without the products grid
  
  const searchInput = document.getElementById('searchInput');
  const locationInput = document.getElementById('locationInput');
  const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
  const locationTerm = locationInput ? locationInput.value.toLowerCase() : '';

  const filtered = products.filter(p => {
    const matchesCategory = filter === 'all' || p.category === filter;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm);
    const matchesLocation = p.location.toLowerCase().includes(locationTerm);
    return matchesCategory && matchesSearch && matchesLocation;
  });

  grid.innerHTML = filtered.map(p => `
    <div class="product-card" data-category="${p.category}">
      <div class="product-img">
        ${p.image ? `<img src="${p.image}" alt="${p.name}" style="width:100%; height:100%; object-fit:cover;" />` : `<span style="font-size:4rem">${p.emoji}</span>`}
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
      </div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-location">📍 ${p.location}</div>
        <div class="product-footer">
          <span class="product-price">NLe ${p.price}/${p.unit}</span>
          <button class="add-cart" onclick="addToCart(${p.id})">Add +</button>
        </div>
      </div>
    </div>
  `).join('');
}

function filterProducts(cat, btn) {
  activeFilter = cat;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderProducts(cat);
}

function handleSearch() {
  renderProducts(activeFilter);
}

/* ——— CART LOGIC ——— */
function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(i => i.id === id);
  if (existing) { existing.qty++; }
  else { cart.push({...product, qty:1}); }
  updateCartUI();
  showToast(`${product.emoji} ${product.name} added to cart!`);
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  updateCartUI();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) { removeFromCart(id); return; }
  updateCartUI();
}

function updateCartUI() {
  const totalItems = cart.reduce((s,i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s,i) => s + i.qty * i.price, 0);
  const countEl = document.getElementById('cartCount');
  if (countEl) {
    countEl.textContent = totalItems;
    countEl.classList.toggle('visible', totalItems > 0);
  }

  const itemsEl = document.getElementById('cartItems');
  const footerEl = document.getElementById('cartFooter');
  
  if (!itemsEl || !footerEl) return;

  if (cart.length === 0) {
    itemsEl.innerHTML = `<div class="cart-empty"><div class="cart-empty-icon">🛒</div><p>Your cart is empty.<br>Browse the market and add some goods!</p></div>`;
    footerEl.style.display = 'none';
    return;
  }

  footerEl.style.display = 'block';
  document.getElementById('cartTotal').textContent = `NLe ${totalPrice.toFixed(2)}`;
  itemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-icon" style="overflow:hidden; display:flex; align-items:center; justify-content:center; border-radius:8px;">${item.image ? `<img src="${item.image}" alt="${item.name}" style="width:100%; height:100%; object-fit:cover;" />` : item.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">NLe ${(item.price * item.qty).toFixed(2)}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="changeQty(${item.id},-1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id},1)">+</button>
        </div>
      </div>
      <button class="remove-item" onclick="removeFromCart(${item.id})" title="Remove">🗑</button>
    </div>
  `).join('');
}

function toggleCart() {
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('cartOverlay');
  if (sidebar) sidebar.classList.toggle('open');
  if (overlay) overlay.classList.toggle('open');
}

function checkout() {
  showToast('✅ Order placed! You will receive an SMS confirmation shortly.');
  cart = [];
  updateCartUI();
  toggleCart();
}

/* ——— TOAST ——— */
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  document.getElementById('toastMsg').textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
}

/* ——— FORM SUBMIT ——— */
function handleSubmit() {
  const fname    = document.getElementById('fname') ? document.getElementById('fname').value.trim() : '';
  const lname    = document.getElementById('lname') ? document.getElementById('lname').value.trim() : '';
  const phone    = document.getElementById('phone') ? document.getElementById('phone').value.trim() : '';
  const district = document.getElementById('district') ? document.getElementById('district').value : '';
  const role     = document.getElementById('role') ? document.getElementById('role').value : '';

  if (!fname || !lname || !phone || !district || !role) {
    showToast('⚠️ Please fill in all required fields.');
    return;
  }
  if (document.getElementById('formArea')) document.getElementById('formArea').style.display    = 'none';
  if (document.getElementById('formSuccess')) document.getElementById('formSuccess').style.display = 'block';
  showToast(`🎉 Welcome, ${fname}! Account created.`);

  // Simulate receiving an SMS on the phone
  setTimeout(() => {
    showSimulatedSMS(fname);
  }, 3000);
}

function showSimulatedSMS(name) {
  const sms = document.createElement('div');
  sms.className = 'simulated-sms';
  sms.innerHTML = `
    <div class="sms-header">
      <span class="sms-app-name">💬 Messages • now</span>
    </div>
    <div class="sms-body">
      <strong>SaLone Market</strong>
      <p>Welcome ${name}! Your account is active. Start trading fresh produce today. 🇸🇱</p>
    </div>
  `;
  document.body.appendChild(sms);
  
  // Trigger animation
  setTimeout(() => sms.classList.add('show'), 100);
  
  // Remove after 6 seconds
  setTimeout(() => {
    sms.classList.remove('show');
    setTimeout(() => sms.remove(), 400);
  }, 6000);
}

/* ——— HAMBURGER ——— */
const hamburger = document.getElementById('hamburger');
if (hamburger) {
  hamburger.addEventListener('click', () => {
    document.getElementById('mobileMenu').classList.toggle('open');
  });
}
function closeMobile() {
  const mobileMenu = document.getElementById('mobileMenu');
  if (mobileMenu) mobileMenu.classList.remove('open');
}

/* ——— SCROLL REVEAL ——— */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      observer.unobserve(e.target);
    }
  });
}, { threshold:0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ——— INIT ——— */
document.addEventListener('DOMContentLoaded', () => {
  renderProducts('all');
});