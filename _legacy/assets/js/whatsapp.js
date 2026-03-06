/* --- CONFIGURATION --- */
const WA_PHONE = "9601234567"; // Replace with real number
const WA_API_WEB = "https://web.whatsapp.com/send";
const WA_API_MOBILE = "https://wa.me"; // Or whatsapp://send

/* --- CORE FUNCTIONS --- */

// 1. Detect Device & Open WhatsApp
function openWhatsApp(message) {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const encodedMsg = encodeURIComponent(message);
    
    let url;
    if (isMobile) {
        url = `${WA_API_MOBILE}/${WA_PHONE}?text=${encodedMsg}`;
    } else {
        url = `${WA_API_WEB}?phone=${WA_PHONE}&text=${encodedMsg}`;
    }
    
    window.open(url, '_blank');
}

// 2. Initialize Floating Button (Auto-injects into page)
document.addEventListener('DOMContentLoaded', () => {
    injectFloatingButton();
    setupProductPageButton();
    setupCartPageButton();
});

function injectFloatingButton() {
    const btn = document.createElement('a');
    btn.className = 'wa-float';
    btn.href = '#';
    btn.innerHTML = `
        <i class="fab fa-whatsapp"></i>
        <span class="wa-tooltip">Chat on WhatsApp</span>
    `;
    btn.onclick = (e) => {
        e.preventDefault();
        openWhatsApp("Hi! I'm visiting Abaya Clothing website and I have a question.");
    };
    document.body.appendChild(btn);
}

/* --- PAGE SPECIFIC FUNCTIONS --- */

// 3. Product Page Logic
function setupProductPageButton() {
    // Only run if we are on the product page (check for 'btn-add-bag')
    const addBagBtn = document.querySelector('.btn-add-bag');
    if (!addBagBtn) return;

    // Create the button
    const waBtn = document.createElement('button');
    waBtn.className = 'btn-wa-product';
    waBtn.innerHTML = '<i class="fab fa-whatsapp"></i> Ask About This Product';
    
    // Get Product Details
    const name = document.querySelector('.product-title')?.innerText || "Product";
    const sku = document.querySelector('.sku')?.innerText || "N/A";
    const price = document.querySelector('.current-price')?.innerText || "N/A";
    const url = window.location.href;

    waBtn.onclick = () => {
        const msg = `Hi! I'm interested in this product:\n\n*${name}*\nSKU: ${sku}\nPrice: ${price}\nLink: ${url}\n\nCould you help me with:\n- Availability\n- Sizing guidance\n- Custom requests\n\nThank you!`;
        openWhatsApp(msg);
    };

    // Insert after Add to Bag button
    addBagBtn.parentNode.insertBefore(waBtn, addBagBtn.nextSibling);
}

// 4. Cart Page Logic
function setupCartPageButton() {
    // Look for summary card
    const summaryCard = document.querySelector('.summary-card');
    if (!summaryCard) return;

    const waLink = document.createElement('div');
    waLink.style.marginTop = '15px';
    waLink.style.textAlign = 'center';
    waLink.innerHTML = `<a href="#" style="color:#25D366; font-weight:bold; font-size:13px;"><i class="fab fa-whatsapp"></i> Need help? Chat on WhatsApp</a>`;
    
    waLink.onclick = (e) => {
        e.preventDefault();
        const total = document.getElementById('totalDisplay')?.innerText || "0.00";
        // Get items from localstorage for accuracy
        const cart = JSON.parse(localStorage.getItem('abayaCart')) || [];
        let itemsMsg = "";
        cart.forEach(item => {
            itemsMsg += `• ${item.name} (${item.size}) - Qty: ${item.qty}\n`;
        });

        const msg = `Hi! I need help with my shopping cart:\n\n*Cart Items:*\n${itemsMsg}\n*Total:* ${total}\n\nI need assistance with checkout.`;
        openWhatsApp(msg);
    };

    summaryCard.appendChild(waLink);
}

// 5. Checkout "Pay via WhatsApp" Logic
// Call this function when "Place Order" is clicked IF WhatsApp is selected
function processWhatsAppOrder(formData) {
    const cart = JSON.parse(localStorage.getItem('abayaCart')) || [];
    let itemsList = "";
    cart.forEach((item, i) => {
        itemsList += `${i+1}. ${item.name} - ${item.size} - ${item.color} - Qty: ${item.qty}\n`;
    });

    const msg = `🛍️ *NEW ORDER REQUEST*\n\n` +
                `Customer: ${formData.fname} ${formData.lname}\n` +
                `Phone: ${formData.phone}\n` +
                `Email: ${formData.email}\n\n` +
                `*Shipping Address:*\n${formData.address}, ${formData.city}\n\n` +
                `*Order Items:*\n${itemsList}\n` +
                `*Total:* ${document.getElementById('checkoutTotal').innerText}\n\n` +
                `*Payment Method:* WhatsApp Order / COD\n\n` +
                `Please confirm this order. Thank you! 🙏`;

    openWhatsApp(msg);
    
    // Clear cart and redirect to home after a delay
    localStorage.removeItem('abayaCart');
    setTimeout(() => window.location.href = 'index.html', 3000);
}