// --- STATE MANAGEMENT ---
let currentState = {
    category: "abaya", // Default type
    filters: {
        categories: [],
        colors: [],
        minPrice: 0,
        maxPrice: 5000
    },
    sort: "newest",
    view: "grid",
    currency: "USD",
    page: 1,
    limit: 9
};

// --- DOM ELEMENTS ---
const grid = document.getElementById('shopGrid');
const countLabel = document.getElementById('countVal');
const pagination = document.getElementById('pagination');

// --- INIT ---
document.addEventListener('DOMContentLoaded', () => {
    filterAndRender();
    setupEventListeners();
});

// --- CORE FUNCTIONS ---

function filterAndRender() {
    // 1. Get Base Data
    let filtered = productsData.filter(p => p.type === currentState.category);

    // 2. Apply Filters
    // Category Checkboxes
    if (currentState.filters.categories.length > 0) {
        filtered = filtered.filter(p => currentState.filters.categories.includes(p.category));
    }
    // Colors
    if (currentState.filters.colors.length > 0) {
        filtered = filtered.filter(p => p.colors.some(c => currentState.filters.colors.includes(c)));
    }
    // Price
    const priceKey = currentState.currency === 'USD' ? 'priceUSD' : 'priceMVR';
    filtered = filtered.filter(p => p[priceKey] >= currentState.filters.minPrice && p[priceKey] <= currentState.filters.maxPrice);

    // 3. Sorting
    if (currentState.sort === 'priceLow') filtered.sort((a, b) => a[priceKey] - b[priceKey]);
    else if (currentState.sort === 'priceHigh') filtered.sort((a, b) => b[priceKey] - a[priceKey]);
    else if (currentState.sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);
    // else newest (default logic via array order or date)

    // 4. Update Count
    countLabel.innerText = filtered.length;

    // 5. Pagination Logic
    const start = (currentState.page - 1) * currentState.limit;
    const paginatedItems = filtered.slice(start, start + currentState.limit);

    // 6. Render
    renderGrid(paginatedItems);
    renderPagination(filtered.length);
}

function renderGrid(items) {
    grid.innerHTML = "";
    if (items.length === 0) {
        grid.innerHTML = "<p>No products found matching your filters.</p>";
        return;
    }

    const priceKey = currentState.currency === 'USD' ? 'priceUSD' : 'priceMVR';
    const symbol = currentState.currency === 'USD' ? '$' : 'MVR ';

    items.forEach(p => {
        const html = `
            <div class="product-card">
                <div class="product-image-wrapper">
                    <img src="${p.image}" class="product-img main-img" alt="${p.name}">
                    <div class="action-buttons">
                        <button class="btn-quick-view">Quick View</button>
                        <button class="btn-add-cart">Add to Bag</button>
                    </div>
                </div>
                <div class="product-details">
                    <span class="product-cat">${p.category}</span>
                    <h3 class="product-title">${p.name}</h3>
                    <div class="stars">
                        ${getStars(p.rating)}
                    </div>
                    <p class="product-price">${symbol}${p[priceKey]}</p>
                </div>
            </div>
        `;
        grid.innerHTML += html;
    });
    
    // Maintain View Mode
    if(currentState.view === 'list') grid.classList.add('list-view');
    else grid.classList.remove('list-view');
}

function getStars(rating) {
    let stars = '';
    for(let i=0; i<5; i++) {
        if(i < Math.floor(rating)) stars += '<i class="fas fa-star"></i>';
        else stars += '<i class="far fa-star"></i>';
    }
    return stars;
}

// --- FILTER HANDLERS ---
function setupEventListeners() {
    // Checkboxes (Category)
    document.querySelectorAll('.filter-input').forEach(cb => {
        cb.addEventListener('change', (e) => {
            const val = e.target.value;
            if (e.target.checked) currentState.filters.categories.push(val);
            else currentState.filters.categories = currentState.filters.categories.filter(c => c !== val);
            currentState.page = 1; // Reset to page 1
            filterAndRender();
        });
    });

    // Colors
    document.querySelectorAll('.color-swatch').forEach(swatch => {
        swatch.addEventListener('click', function() {
            this.classList.toggle('active');
            const color = this.dataset.val;
            if (this.classList.contains('active')) currentState.filters.colors.push(color);
            else currentState.filters.colors = currentState.filters.colors.filter(c => c !== color);
            currentState.page = 1;
            filterAndRender();
        });
    });
}

function applyPriceFilter() {
    currentState.filters.minPrice = document.getElementById('minPrice').value;
    currentState.filters.maxPrice = document.getElementById('maxPrice').value;
    filterAndRender();
}

function handleSort() {
    currentState.sort = document.getElementById('sortSelect').value;
    filterAndRender();
}

function setView(view) {
    currentState.view = view;
    // Toggle active class on icons
    document.querySelectorAll('.view-toggle i').forEach(i => i.classList.remove('active'));
    event.target.classList.add('active');
    filterAndRender();
}

function toggleSidebar() {
    document.getElementById('filterSidebar').classList.toggle('active');
    document.querySelector('.overlay-sidebar').classList.toggle('active');
}

function clearFilters() {
    // Reset inputs
    document.querySelectorAll('input[type="checkbox"]').forEach(c => c.checked = false);
    document.querySelectorAll('.color-swatch').forEach(c => c.classList.remove('active'));
    document.getElementById('minPrice').value = 0;
    
    // Reset state
    currentState.filters.categories = [];
    currentState.filters.colors = [];
    currentState.filters.minPrice = 0;
    
    filterAndRender();
}

// --- PAGINATION RENDER ---
function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / currentState.limit);
    pagination.innerHTML = "";
    
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.innerText = i;
        btn.className = `page-btn ${i === currentState.page ? 'active' : ''}`;
        btn.onclick = () => {
            currentState.page = i;
            filterAndRender();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
        pagination.appendChild(btn);
    }
}