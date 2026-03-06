// --- CONFIG ---
const EXCHANGE_RATE = 15.4; // 1 USD = 15.4 MVR
const FREE_SHIPPING_THRESHOLD_USD = 50;

// --- STATE ---
let cart = [];
let currentCurrency = 'USD';
let lastRemovedItem = null;

// --- INIT ---
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    renderCart();
});

// --- CORE FUNCTIONS ---
function loadCart() {
    // Mock data if empty for demonstration
    const stored = localStorage.getItem('abayaCart');
    if (stored) {
        cart = JSON.parse(stored);
    } else {
        // Sample Data for BCA Project Presentation
        cart = [
            { id: 101, name: "Luxury Embroidered Abaya", price: 130, size: "M", color: "Black", qty: 1, image: "https://images.unsplash.com/photo-1596464871407-1e5443202957?w=150" },
            { id: 102, name: "Premium Silk Hijab", price: 25, size: "Std", color: "Beige", qty: 2, image: "https://images.unsplash.com/photo-1585854460596-f3089d4d5462?w=150" }
        ];
        saveCart();
    }
}

function saveCart() {
    localStorage.setItem('abayaCart', JSON.stringify(cart));
    updateHeaderCount();
}

function renderCart() {
    const list = document.getElementById('cartItemsList');
    const emptyState = document.getElementById('emptyCartState');
    const layout = document.getElementById('cartLayout');
    const countHeader = document.getElementById('cartCountHeader');

    // Handle Empty State
    if (cart.length === 0) {
        list.innerHTML = '';
        emptyState.classList.remove('hidden');
        layout.style.display = 'none'; // Hide layout items
        countHeader.innerText = "(0 items)";
        return;
    } else {
        emptyState.classList.add('hidden');
        layout.style.display = 'grid';
    }

    // Render Items
    let html = '';
    let subtotalUSD = 0;

    cart.forEach((item, index) => {
        subtotalUSD += item.price * item.qty;
        
        // Price Conversion
        const displayPrice = formatPrice(item.price);
        const displayTotal = formatPrice(item.price * item.qty);

        html += `
            <div class="cart-item">
                <img src="${item.image}" class="item-img" alt="${item.name}">
                <div class="item-details">
                    <div class="item-header">
                        <span class="item-name">${item.name}</span>
                        <span class="item-price">${displayTotal}</span>
                    </div>
                    <div class="item-meta">
                        Size: ${item.size} | Color: ${item.color} <span class="color-dot" style="background:${item.color}"></span>
                        <br>Availability: <span style="color:green">In Stock</span>
                    </div>
                    <div class="item-controls">
                        <div class="qty-wrapper">
                            <button class="qty-btn" onclick="updateQty(${index}, -1)">-</button>
                            <span class="qty-val">${item.qty}</span>
                            <button class="qty-btn" onclick="updateQty(${index}, 1)">+</button>
                        </div>
                        <div class="item-actions">
                            <button onclick="moveToWishlist(${index})">♡ Save</button>
                            <button onclick="removeItem(${index})">Remove</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    list.innerHTML = html;
    countHeader.innerText = `(${cart.length} items)`;

    updateSummary(subtotalUSD);
}

// --- CALCULATIONS ---
function updateSummary(subtotalUSD) {
    const shipping = subtotalUSD >= FREE_SHIPPING_THRESHOLD_USD ? 0 : 10;
    const tax = subtotalUSD * 0.05;
    const totalUSD = subtotalUSD + shipping + tax;

    // Render Summary
    document.getElementById('subtotalDisplay').innerText = formatPrice(subtotalUSD);
    document.getElementById('taxDisplay').innerText = formatPrice(tax);
    document.getElementById('totalDisplay').innerText = formatPrice(totalUSD);
    
    // Shipping Logic
    const shipDisplay = document.getElementById('shippingDisplay');
    if (shipping === 0) {
        shipDisplay.innerText = "FREE";
        shipDisplay.style.color = "green";
    } else {
        shipDisplay.innerText = formatPrice(shipping);
        shipDisplay.style.color = "#555";
    }

    // Progress Bar
    const progressFill = document.getElementById('progressBar');
    const shippingMsg = document.getElementById('shippingMsg');
    const successMsg = document.querySelector('.success-msg');
    
    if (subtotalUSD >= FREE_SHIPPING_THRESHOLD_USD) {
        progressFill.style.width = "100%";
        shippingMsg.classList.add('hidden');
        successMsg.classList.remove('hidden');
    } else {
        const percent = (subtotalUSD / FREE_SHIPPING_THRESHOLD_USD) * 100;
        const diff = FREE_SHIPPING_THRESHOLD_USD - subtotalUSD;
        
        progressFill.style.width = `${percent}%`;
        shippingMsg.classList.remove('hidden');
        successMsg.classList.add('hidden');
        document.getElementById('shippingDiff').innerText = currentCurrency === 'USD' ? diff.toFixed(2) : (diff * EXCHANGE_RATE).toFixed(2);
    }
}

// --- ACTIONS ---
function updateQty(index, change) {
    if (cart[index].qty + change > 0) {
        cart[index].qty += change;
        saveCart();
        renderCart();
    }
}

function removeItem(index) {
    lastRemovedItem = cart[index];
    cart.splice(index, 1);
    saveCart();
    renderCart();
    
    // Show Undo
    const undoBox = document.getElementById('recentlyRemoved');
    undoBox.classList.remove('hidden');
    setTimeout(() => undoBox.classList.add('hidden'), 5000);
}

function undoRemove() {
    if (lastRemovedItem) {
        cart.push(lastRemovedItem);
        saveCart();
        renderCart();
        document.getElementById('recentlyRemoved').classList.add('hidden');
    }
}

function confirmClearCart() {
    document.getElementById('clearModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('clearModal').style.display = 'none';
}

function clearCart() {
    cart = [];
    saveCart();
    renderCart();
    closeModal();
}

// --- CURRENCY ---
function switchCurrency(curr) {
    currentCurrency = curr;
    document.querySelectorAll('.currency-symbol').forEach(el => {
        el.innerText = curr === 'USD' ? '$' : 'MVR ';
    });
    renderCart();
}

function formatPrice(amountUSD) {
    if (currentCurrency === 'USD') {
        return `$${amountUSD.toFixed(2)}`;
    } else {
        return `MVR ${(amountUSD * EXCHANGE_RATE).toFixed(0)}`;
    }
}

// --- PROMO CODE ---
function togglePromo() {
    document.getElementById('promoBox').classList.toggle('hidden');
}

function applyPromo() {
    const code = document.getElementById('promoInput').value.trim().toUpperCase();
    const msg = document.getElementById('promoMsg');
    if (code === "WELCOME10") {
        msg.innerText = "Code Applied! 10% Discount calculated at checkout.";
        msg.style.color = "green";
    } else {
        msg.innerText = "Invalid Code";
        msg.style.color = "red";
    }
}

// Mock Add for Recommended
function addToCartMock(name, price) {
    cart.push({ id: Date.now(), name: name, price: price, size: "Std", color: "Matching", qty: 1, image: "https://via.placeholder.com/100" });
    saveCart();
    renderCart();
}

function updateHeaderCount() {
    // Optional: Update bubble in nav if exists
}