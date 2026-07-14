// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// active link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 140) current = s.id;
  });
  navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
});

// ===== MOBILE MENU =====
const burger = document.getElementById('burger');
const navLinksWrap = document.getElementById('navLinks');
const menuOverlay = document.getElementById('menuOverlay');

function openMenu() {
  navLinksWrap.classList.add('open');
  menuOverlay.classList.add('show');
  burger.classList.add('open');
  burger.setAttribute('aria-expanded', 'true');
  document.body.classList.add('menu-open');
}
function closeMenu() {
  navLinksWrap.classList.remove('open');
  menuOverlay.classList.remove('show');
  burger.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
}
burger?.addEventListener('click', () => {
  navLinksWrap.classList.contains('open') ? closeMenu() : openMenu();
});
menuOverlay?.addEventListener('click', closeMenu);
navLinksWrap?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMenu);
});
window.addEventListener('resize', () => {
  if (window.innerWidth > 900) closeMenu();
});

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll('.reveal, .reveal-scale');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach((el, i) => {
  el.style.transitionDelay = (i % 4) * 0.08 + 's';
  io.observe(el);
});

// ===== FAQ ACCORDION =====
document.querySelectorAll('.faq-item').forEach(item => {
  item.querySelector('.faq-q').addEventListener('click', () => {
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

// ===== FILTER CHIPS (Collection) + MOBILE LOAD MORE (Our Bakery Menu) =====
const chips = document.querySelectorAll('.chip');
const filterCards = document.querySelectorAll('[data-cat]');
const shopLoadMoreWrap = document.getElementById('shopLoadMoreWrap');
const shopLoadMoreBtn = document.getElementById('shopLoadMoreBtn');
const SHOP_MOBILE_INITIAL_COUNT = 4;
let shopExpanded = false;
let activeShopFilter = 'all';

function shopIsMobile() {
  return window.matchMedia('(max-width:900px)').matches;
}

function applyShopVisibility() {
  const matches = Array.from(filterCards).filter(
    card => activeShopFilter === 'all' || card.dataset.cat === activeShopFilter
  );
  Array.from(filterCards).forEach(card => {
    if (!matches.includes(card)) card.style.display = 'none';
  });
  if (shopIsMobile()) {
    matches.forEach((card, i) => {
      card.style.display = (shopExpanded || i < SHOP_MOBILE_INITIAL_COUNT) ? '' : 'none';
    });
    const hasMore = matches.length > SHOP_MOBILE_INITIAL_COUNT;
    if (shopLoadMoreWrap) shopLoadMoreWrap.style.display = hasMore ? 'flex' : 'none';
    if (shopLoadMoreBtn) {
      shopLoadMoreBtn.innerHTML = shopExpanded
        ? 'Show Less <span class="arrow-circle">↑</span>'
        : 'Load More <span class="arrow-circle">→</span>';
    }
  } else {
    matches.forEach(card => { card.style.display = ''; });
    if (shopLoadMoreWrap) shopLoadMoreWrap.style.display = 'none';
  }
}

chips.forEach(chip => {
  chip.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    activeShopFilter = chip.dataset.filter;
    shopExpanded = false;
    applyShopVisibility();
  });
});

shopLoadMoreBtn?.addEventListener('click', () => {
  shopExpanded = !shopExpanded;
  applyShopVisibility();
});

window.addEventListener('resize', applyShopVisibility);
applyShopVisibility();

// ===== CART SYSTEM =====
let cart = [];
const cartCount = document.getElementById('cartCount');
const drawer = document.getElementById('cartDrawer');
const overlay = document.getElementById('overlay');
const drawerBody = document.getElementById('drawerBody');
const drawerTotal = document.getElementById('drawerTotal');

function openDrawer() {
  drawer.classList.add('show');
  overlay.classList.add('show');
}
function closeDrawer() {
  drawer.classList.remove('show');
  overlay.classList.remove('show');
}
document.getElementById('cartIcon')?.addEventListener('click', openDrawer);
document.getElementById('drawerClose')?.addEventListener('click', closeDrawer);
overlay?.addEventListener('click', closeDrawer);

function renderCart() {
  cartCount.textContent = cart.length;
  if (cart.length === 0) {
    drawerBody.innerHTML = '<div class="cart-empty">Your bag is empty.<br>Time to add something sweet 🍰</div>';
    drawerTotal.textContent = '₹0';
    return;
  }
  drawerBody.innerHTML = cart.map((item, idx) => `
    <div class="cart-row">
      <img src="${item.img}" alt="${item.name}">
      <div class="ci-info">
        <b>${item.name}</b>
        <div class="price">₹${item.price}</div>
      </div>
      <button class="drawer-close" style="width:28px;height:28px;font-size:.9rem" onclick="removeFromCart(${idx})">✕</button>
    </div>
  `).join('');
  const total = cart.reduce((sum, i) => sum + i.price, 0);
  drawerTotal.textContent = '₹' + total;
}
function removeFromCart(idx) {
  cart.splice(idx, 1);
  renderCart();
}
function addToCart(name, price, img) {
  cart.push({ name, price, img });
  renderCart();
  showToast(`${name} added to your bag`);
  openDrawer();
}
document.querySelectorAll('.add-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    addToCart(btn.dataset.name, parseInt(btn.dataset.price), btn.dataset.img);
  });
});

// ===== WHATSAPP ORDER BUTTONS (Our Bakery Menu) =====
// Edit the phone number below (digits only, with country code, no + or spaces)
const WHATSAPP_ORDER_NUMBER = '919876543210';
document.querySelectorAll('.whatsapp-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const name = btn.dataset.name;
    const price = btn.dataset.price;
    const message = `Hi! I'd like to order: ${name} (₹${price}) from Brownie Bistro Baker's.`;
    const url = `https://wa.me/${WHATSAPP_ORDER_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  });
});

// ===== FAVORITES =====
document.querySelectorAll('.pcard-fav').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
    btn.textContent = btn.classList.contains('active') ? '♥' : '♡';
    showToast(btn.classList.contains('active') ? 'Added to wishlist' : 'Removed from wishlist');
  });
});

// ===== TOAST =====
function showToast(msg) {
  const wrap = document.getElementById('toastWrap');
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  wrap.appendChild(t);
  setTimeout(() => t.remove(), 2800);
}

// ===== NEWSLETTER =====
document.getElementById('newsForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  showToast('Welcome to the family 🎂 Check your inbox!');
  e.target.reset();
});

// ===== QUICK VIEW (toast placeholder) =====
document.querySelectorAll('.qv-btn').forEach(btn => {
  btn.addEventListener('click', () => showToast('Opening quick view…'));
});

// ===== MOUSE FLOATING CRUMB (desktop only, subtle) =====
if (window.matchMedia('(min-width: 900px)').matches) {
  const crumb = document.createElement('div');
  crumb.className = 'cursor-crumb';
  document.body.appendChild(crumb);
  let mx = 0, my = 0, cx = 0, cy = 0;
  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  function loop() {
    cx += (mx - cx) * 0.15;
    cy += (my - cy) * 0.15;
    crumb.style.transform = `translate(${cx - 4}px, ${cy - 4}px)`;
    requestAnimationFrame(loop);
  }
  loop();
}

// ===== HERO PARALLAX ON MOUSE =====
const heroVisual = document.querySelector('.hero-visual');
document.querySelector('.hero')?.addEventListener('mousemove', (e) => {
  if (!heroVisual || window.innerWidth < 900) return;
  const x = (e.clientX / window.innerWidth - 0.5) * 14;
  const y = (e.clientY / window.innerHeight - 0.5) * 14;
  heroVisual.style.transform = `translate(${x}px, ${y}px)`;
});

