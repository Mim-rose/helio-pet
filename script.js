// script.js

// Hamburger toggle for responsive navbar
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('active');
  console.log('Mobile menu classes:', mobileMenu.classList);
});
// Quantity selector functionality
const decreaseBtn = document.getElementById('decrease');
const increaseBtn = document.getElementById('increase');
const quantityDisplay = document.getElementById('quantity');
const sellingPriceDisplay = document.getElementById('selling-price');
const comparePriceDisplay = document.getElementById('compare-price');

const BASE_PRICE = 249;
const COMPARE_PRICE = 369;

let quantity = 1;

function updatePrices() {
  sellingPriceDisplay.textContent = `${currencySymbol}${(BASE_PRICE * quantity).toFixed(2)}`;
  comparePriceDisplay.textContent = `${currencySymbol}${(COMPARE_PRICE * quantity).toFixed(2)}`;
}

increaseBtn.addEventListener('click', () => {
  if (quantity < 10) {
    quantity++;
    quantityDisplay.textContent = quantity;
    updatePrices();
  }
});

decreaseBtn.addEventListener('click', () => {
  if (quantity > 1) {
    quantity--;
    quantityDisplay.textContent = quantity;
    updatePrices();
  }
});

// Add to cart handler
const addToCartBtn = document.getElementById('add-to-cart');
addToCartBtn.addEventListener('click', () => {
  const cartItem = {
    name: 'Helio Pet Device',
    quantity,
    price: BASE_PRICE * quantity,
    comparePrice: COMPARE_PRICE * quantity,
  };

  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart = [cartItem];
  localStorage.setItem('cart', JSON.stringify(cart));

  document.getElementById('cart-count').textContent = quantity;
  document.getElementById('cart-count-mobile').textContent = quantity;

  alert('Item added to cart!');
});

// Load cart quantity from localStorage
document.addEventListener('DOMContentLoaded', () => {
  const cart = JSON.parse(localStorage.getItem('cart'));
  if (cart && cart.length > 0) {
    const q = cart[0].quantity;
    document.getElementById('cart-count').textContent = q;
    document.getElementById('cart-count-mobile').textContent = q;
  }
});

// Language and Currency Toggle
const langToggle = document.getElementById('lang-toggle');
const currToggle = document.getElementById('curr-toggle');

let currentLanguage = 'ENG';
let currencySymbol = '$';

langToggle.addEventListener('click', () => {
  currentLanguage = currentLanguage === 'ENG' ? 'বাংলা' : 'ENG';
  langToggle.textContent = currentLanguage;
});

currToggle.addEventListener('click', () => {
  if (currencySymbol === '$') {
    currencySymbol = '৳'; // Taka symbol
    currToggle.textContent = 'BDT';
  } else {
    currencySymbol = '$';
    currToggle.textContent = 'USD';
  }
  updatePrices();
});

// === Cart Drawer Elements ===
const cartDrawer = document.getElementById('cart-drawer');
const cartItemsContainer = document.getElementById('cart-items');
const cartCloseBtn = document.getElementById('cart-close-btn');
const cartIcon = document.querySelector('.cart-icon');

// === Open & Close Cart ===
function openCart() {
  cartDrawer.classList.add('open');
  cartDrawer.setAttribute('aria-hidden', 'false');
}
function closeCart() {
  cartDrawer.classList.remove('open');
  cartDrawer.setAttribute('aria-hidden', 'true');
}
cartIcon.addEventListener('click', openCart);
cartCloseBtn.addEventListener('click', closeCart);

// === Render Cart Items in Drawer ===
function renderCartDrawer() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  cartItemsContainer.innerHTML = '';

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    return;
  }

  cart.forEach(item => {
    const itemEl = document.createElement('div');
    itemEl.className = 'cart-item';
    itemEl.dataset.id = item.name;

    itemEl.innerHTML = `
      <img src="/images/h2.webp" alt="${item.name}" />
      <div class="cart-item-details">
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-price">${currencySymbol}${item.price.toFixed(2)}</div>
        <div class="cart-quantity-selector">
          <button class="cart-decrement">-</button>
          <input type="text" value="${item.quantity}" readonly />
          <button class="cart-increment">+</button>
        </div>
      </div>
      <button class="cart-remove-btn">&times;</button>
    `;
    cartItemsContainer.appendChild(itemEl);
  });

// Update estimated total
const total = cart.reduce((sum, item) => sum + item.price, 0);
document.getElementById('estimated-total').textContent = `${currencySymbol}${total.toFixed(2)}`;







}

// === Update Cart Count Badge ===
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById('cart-count').textContent = totalQty;
  const mobileBadge = document.getElementById('cart-count-mobile');
  if (mobileBadge) mobileBadge.textContent = totalQty;
}

// === Add to Cart Logic (Updated) ===
addToCartBtn.addEventListener('click', () => {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  const existingIndex = cart.findIndex(item => item.name === 'Helio Pet Device');
  if (existingIndex > -1) {
    cart[existingIndex].quantity = Math.min(cart[existingIndex].quantity + quantity, 10);
    cart[existingIndex].price = BASE_PRICE * cart[existingIndex].quantity;
  } else {
    cart.push({
      name: 'Helio Pet Device',
      quantity,
      price: BASE_PRICE * quantity,
      comparePrice: COMPARE_PRICE * quantity
    });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  renderCartDrawer();
  openCart();
});

// === Quantity / Remove Event Delegation ===
cartItemsContainer.addEventListener('click', (e) => {
  const target = e.target;
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const itemEl = target.closest('.cart-item');
  if (!itemEl) return;
  const name = itemEl.dataset.id;
  const index = cart.findIndex(item => item.name === name);
  if (index === -1) return;

  if (target.classList.contains('cart-increment')) {
    if (cart[index].quantity < 10) {
      cart[index].quantity++;
      cart[index].price = BASE_PRICE * cart[index].quantity;
    }
  } else if (target.classList.contains('cart-decrement')) {
    if (cart[index].quantity > 1) {
      cart[index].quantity--;
      cart[index].price = BASE_PRICE * cart[index].quantity;
    }
  } else if (target.classList.contains('cart-remove-btn')) {
    cart.splice(index, 1);
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  renderCartDrawer();
});

// === Load on DOM Ready ===
document.addEventListener('DOMContentLoaded', () => {
  updatePrices();
  updateCartCount();
  renderCartDrawer();
});
// Checkout placeholder
document.getElementById('checkout-btn').addEventListener('click', () => {
  alert('Proceeding to checkout...');
});
