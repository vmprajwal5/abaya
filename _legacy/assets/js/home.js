/* --- Abaya Home JS --- */

/* Data */
const products = [
    {
        id: 1,
        name: "Classic Daily Wear Abaya",
        price: "$78.00",
        img: "https://images.unsplash.com/photo-1512413914633-b5043f4041ea?q=80&w=600"
    },
    {
        id: 2,
        name: "Royal Blue Embroidered",
        price: "$162.00",
        img: "https://images.unsplash.com/photo-1596464871407-1e5443202957?q=80&w=600"
    },
    {
        id: 3,
        name: "Burgundy Party Wear",
        price: "$120.00",
        img: "https://images.unsplash.com/photo-1585854460596-f3089d4d5462?q=80&w=600"
    },
    {
        id: 4,
        name: "Premium Charcoal Silk",
        price: "$195.00",
        img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600"
    },
    {
        id: 5,
        name: "Soft Beige Linen",
        price: "$85.00",
        img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=600"
    },
    {
        id: 6,
        name: "Midnight Black Velvet",
        price: "$145.00",
        img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600"
    },
    {
        id: 7,
        name: "Olive Green Casual",
        price: "$90.00",
        img: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=600"
    },
    {
        id: 8,
        name: "Bridal White Lace",
        price: "$280.00",
        img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600"
    }
];

/* Render Products */
const grid = document.getElementById('productGrid');

if (grid) {
    grid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.img}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-price">${product.price}</p>
            </div>
        </div>
    `).join('');
}

/* Mobile Menu Logic */
const menuToggle = document.querySelector('.menu-toggle');
const navOverlay = document.querySelector('.nav-overlay');
const closeMenu = document.querySelector('.close-menu');

if (menuToggle && navOverlay && closeMenu) {
    menuToggle.addEventListener('click', () => {
        navOverlay.classList.add('active');
    });

    closeMenu.addEventListener('click', () => {
        navOverlay.classList.remove('active');
    });
}