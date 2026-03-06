// --- PRODUCT DATA (Simulated) ---
const productInfo = {
    id: "AB-LUX-BLK-001",
    name: "Luxury Embroidered Abaya",
    priceUSD: 130,
    priceMVR: 1999,
    image: "https://images.unsplash.com/photo-1596464871407-1e5443202957?w=150"
};

let currentSize = "M";
let currentColor = "Black";
let currentQty = 1;
let currentCurrency = "USD"; // Should sync with header global state

// --- IMAGE GALLERY ---
function changeImage(thumb) {
    // 1. Update Main Image
    const mainImg = document.getElementById('mainImage');
    mainImg.src = thumb.src.replace("w=150", "w=800"); // High res swap
    
    // 2. Update Active State
    document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
}

function openLightbox() {
    const src = document.getElementById('mainImage').src;
    document.getElementById('lightboxImg').src = src;
    document.getElementById('lightboxModal').classList.add('active');
}

function closeLightbox() {
    document.getElementById('lightboxModal').classList.remove('active');
}

// --- TABS ---
function openTab(evt, tabName) {
    // Hide all
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    
    // Show current
    document.getElementById(tabName).classList.add('active');
    evt.currentTarget.classList.add('active');
}

// --- SELECTION LOGIC ---
function selectSize(el) {
    document.querySelectorAll('.p-size').forEach(s => s.classList.remove('selected'));
    el.classList.add('selected');
    currentSize = el.innerText;
}

function selectColor(el) {
    document.querySelectorAll('.p-color').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
    currentColor = el.dataset.name;
    document.getElementById('colorName').innerText = currentColor;
}

function changeQty(n) {
    let input = document.getElementById('qtyInput');
    let val = parseInt(input.value);
    val += n;
    if (val < 1) val = 1;
    if (val > 10) val = 10;
    input.value = val;
    currentQty = val;
}

// --- CART & WISHLIST ---
function addToBag() {
    // Create Cart Object
    const cartItem = {
        id: productInfo.id,
        name: productInfo.name,
        price: productInfo.priceUSD, // Store base currency
        size: currentSize,
        color: currentColor,
        qty: currentQty,
        image: productInfo.image
    };

    // Get existing cart from LocalStorage
    let cart = JSON.parse(localStorage.getItem('abayaCart')) || [];
    
    // Check if item exists (same ID, Size, Color)
    const existingIndex = cart.findIndex(item => item.id === cartItem.id && item.size === cartItem.size && item.color === cartItem.color);
    
    if (existingIndex > -1) {
        cart[existingIndex].qty += currentQty; // Update qty
    } else {
        cart.push(cartItem); // Add new
    }

    // Save back
    localStorage.setItem('abayaCart', JSON.stringify(cart));
    
    // Update Header Badge (if function exists)
    // updateCartBadge(); 

    alert(`${currentQty} x ${productInfo.name} (${currentSize}) added to bag!`);
}

// --- MODALS ---
function openModal(id) {
    document.getElementById(id).style.display = "flex";
}
function closeModal(id) {
    document.getElementById(id).style.display = "none";
}

// --- RELATED PRODUCTS RENDER ---
const related = [
    { name: "Daily Wear Abaya", price: "$78.00", img: "https://images.unsplash.com/photo-1512413914633-b5043f4041ea?w=300" },
    { name: "Chiffon Layer Abaya", price: "$110.00", img: "https://images.unsplash.com/photo-1585854460596-f3089d4d5462?w=300" },
    { name: "Silk Party Abaya", price: "$150.00", img: "https://images.unsplash.com/photo-1596464871383-09741d402b8d?w=300" },
    { name: "Embroidered Cape", price: "$125.00", img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300" }
];

const relatedGrid = document.getElementById('relatedGrid');
related.forEach(p => {
    relatedGrid.innerHTML += `
        <div class="product-card">
            <div class="product-image-wrapper" style="height:300px;">
                <img src="${p.img}" class="product-img" style="width:100%; height:100%; object-fit:cover;">
            </div>
            <div class="product-details">
                <h3 class="product-title" style="font-size:14px;">${p.name}</h3>
                <p class="product-price">${p.price}</p>
            </div>
        </div>
    `;
});