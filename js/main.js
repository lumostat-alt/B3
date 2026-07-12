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
burger?.addEventListener('click', () => {
  navLinksWrap.style.display = navLinksWrap.style.display === 'flex' ? 'none' : 'flex';
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

// ===== FILTER CHIPS (Collection) =====
const chips = document.querySelectorAll('.chip');
const filterCards = document.querySelectorAll('[data-cat]');
chips.forEach(chip => {
  chip.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    const cat = chip.dataset.filter;
    filterCards.forEach(card => {
      const show = cat === 'all' || card.dataset.cat === cat;
      card.style.display = show ? '' : 'none';
    });
  });
});

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
