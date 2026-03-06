// --- STATE ---
let currentStep = 1;
let cart = [];
let currency = 'USD';
const EXCHANGE_RATE = 15.4;

// --- INIT ---
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    renderSummary();
});

// --- LOAD CART ---
function loadCart() {
    // Attempt to load from storage or use mock
    const stored = localStorage.getItem('abayaCart');
    if (stored) {
        cart = JSON.parse(stored);
    } else {
        // Fallback for demo
        cart = [
            { name: "Luxury Embroidered Abaya", price: 130, qty: 1, image: "https://via.placeholder.com/50" }
        ];
    }
}

// --- RENDER SUMMARY ---
function renderSummary() {
    const list = document.getElementById('summaryItems');
    let subtotalUSD = 0;
    let html = '';

    cart.forEach(item => {
        subtotalUSD += item.price * item.qty;
        html += `
            <div class="summary-item">
                <img src="${item.image}" class="summary-img">
                <div class="summary-info">
                    <p>${item.name}</p>
                    <span>Qty: ${item.qty}</span>
                </div>
                <div style="margin-left:auto; font-weight:bold;">
                    ${formatPrice(item.price * item.qty)}
                </div>
            </div>
        `;
    });

    list.innerHTML = html;

    // Costs
    const shippingUSD = subtotalUSD > 50 ? 0 : 10;
    const taxUSD = subtotalUSD * 0.05;
    const totalUSD = subtotalUSD + shippingUSD + taxUSD;

    document.getElementById('checkoutSubtotal').innerText = formatPrice(subtotalUSD);
    document.getElementById('checkoutShipping').innerText = shippingUSD === 0 ? 'FREE' : formatPrice(shippingUSD);
    document.getElementById('checkoutTax').innerText = formatPrice(taxUSD);
    document.getElementById('checkoutTotal').innerText = formatPrice(totalUSD);
}

function formatPrice(usd) {
    if (currency === 'USD') return `$${usd.toFixed(2)}`;
    else return `MVR ${(usd * EXCHANGE_RATE).toFixed(0)}`;
}

function switchCurrency(c) {
    currency = c;
    document.querySelectorAll('.currency-toggle button').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    renderSummary();
}

// --- NAVIGATION & VALIDATION ---
function goToStep(step) {
    if (step > currentStep) {
        // Validate current step before moving forward
        if (!validateStep(currentStep)) return;
    }

    // Update Step UI
    document.querySelectorAll('.step-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));
    
    // Show new step
    if (step === 1) document.getElementById('shippingForm').classList.add('active');
    if (step === 2) document.getElementById('paymentForm').classList.add('active');
    if (step === 3) {
        document.getElementById('reviewStep').classList.add('active');
        populateReview();
    }

    // Update Progress Bar
    for (let i = 1; i <= step; i++) {
        document.getElementById(`stepIndicator${i}`).classList.add('active');
    }

    currentStep = step;
    window.scrollTo(0, 0);
}

function validateStep(step) {
    if (step === 1) {
        const req = ['email', 'fname', 'lname', 'address', 'city', 'phone'];
        let valid = true;
        req.forEach(id => {
            const el = document.getElementById(id);
            if (!el.value) {
                el.style.borderColor = "red";
                valid = false;
            } else {
                el.style.borderColor = "#ddd";
            }
        });
        if (!valid) alert("Please fill in all required fields.");
        return valid;
    }
    return true;
}

// --- PAYMENT TOGGLE (UPDATED) ---
function togglePayment(method) {
    // Hide all payment details first
    document.querySelectorAll('.payment-details').forEach(el => el.classList.add('hidden'));
    
    // Show the selected one
    if (method === 'card') document.getElementById('cardDetails').classList.remove('hidden');
    if (method === 'bml') document.getElementById('bmlDetails').classList.remove('hidden');
    if (method === 'cod') document.getElementById('codDetails').classList.remove('hidden');
    
    // NEW: Handle WhatsApp toggle
    if (method === 'whatsapp') {
        const waDetails = document.getElementById('whatsappDetails');
        if(waDetails) waDetails.classList.remove('hidden');
    }
}

// --- REVIEW POPULATION (UPDATED) ---
function populateReview() {
    const addr = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const country = document.getElementById('country').value;
    document.getElementById('reviewAddress').innerText = `${addr}, ${city}, ${country}`;
    
    // Payment Method Text
    let method = "Credit Card";
    if (document.getElementById('payBML').checked) method = "BML Transfer";
    if (document.getElementById('payCOD').checked) method = "Cash on Delivery";
    
    // NEW: Check for WhatsApp
    const waRadio = document.getElementById('payWhatsApp');
    if (waRadio && waRadio.checked) method = "WhatsApp Order";

    document.getElementById('reviewPayment').innerText = method;

    // Items List for Review
    const list = document.getElementById('reviewItemsList');
    list.innerHTML = document.getElementById('summaryItems').innerHTML; // Reuse summary html
}

function togglePlaceOrder() {
    const terms = document.getElementById('terms').checked;
    document.getElementById('placeOrderBtn').disabled = !terms;
}

// --- PLACE ORDER (UPDATED) ---
function placeOrder() {
    const btn = document.getElementById('placeOrderBtn');
    
    // 1. Check if WhatsApp Payment is selected
    const waRadio = document.getElementById('payWhatsApp');
    if (waRadio && waRadio.checked) {
        // Prepare Form Data for WhatsApp
        const formData = {
            fname: document.getElementById('fname').value,
            lname: document.getElementById('lname').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value
        };
        
        // Pass data to external function in whatsapp.js
        if (typeof processWhatsAppOrder === "function") {
            processWhatsAppOrder(formData);
        } else {
            alert("WhatsApp integration not loaded. Check console.");
        }
        return; // Stop here, do not run the standard success simulation
    }

    // 2. Standard Logic (Credit Card / BML / COD)
    btn.innerText = "Processing...";
    btn.disabled = true;

    // Simulate API Call
    setTimeout(() => {
        // Success
        document.querySelectorAll('.step-content').forEach(el => el.classList.remove('active'));
        document.getElementById('successMessage').classList.remove('hidden');
        document.getElementById('successMessage').classList.add('active');
        
        document.getElementById('orderNum').innerText = Math.floor(Math.random() * 1000000);
        document.getElementById('confirmEmail').innerText = document.getElementById('email').value;

        // Clear Cart
        localStorage.removeItem('abayaCart');
        
        // Hide sidebar on success
        document.querySelector('.checkout-sidebar').style.display = 'none';
        document.querySelector('.checkout-wrapper').style.gridTemplateColumns = '1fr';

        window.scrollTo(0, 0);
    }, 2000);
}