// 1. ANNOUNCEMENT BAR ROTATION
const messages = [
    "Free Shipping on Orders Above $50",
    "New Collection Available Now",
    "10% Off on First Purchase - Use Code: WELCOME10"
];
let msgIndex = 0;
const msgElement = document.getElementById("announcementText");

function rotateMessages() {
    msgElement.style.opacity = 0; // Fade out
    setTimeout(() => {
        msgIndex = (msgIndex + 1) % messages.length;
        msgElement.innerText = messages[msgIndex];
        msgElement.style.opacity = 1; // Fade in
    }, 500); // Wait for fade out to finish
}

setInterval(rotateMessages, 5000); // Change every 5 seconds

function closeAnnouncement() {
    document.getElementById("announcementBar").style.display = "none";
}

// 2. STICKY HEADER ON SCROLL
window.addEventListener("scroll", function() {
    const header = document.getElementById("mainHeader");
    const announcementHeight = document.getElementById("announcementBar").offsetHeight;
    
    // Make sticky if scrolled past announcement bar
    if (window.scrollY > announcementHeight) {
        header.classList.add("sticky");
    } else {
        header.classList.remove("sticky");
    }
});

// 3. CURRENCY TOGGLE (MVR <-> USD)
function toggleCurrency() {
    const currencySpan = document.getElementById("currencyText");
    if (currencySpan.innerText === "USD") {
        currencySpan.innerText = "MVR";
        // Here you would add logic to update prices on the page
        alert("Currency switched to Maldivian Rufiyaa (MVR)");
    } else {
        currencySpan.innerText = "USD";
        alert("Currency switched to US Dollar (USD)");
    }
}

// 4. MOBILE MENU & SUBMENUS
function toggleMobileMenu() {
    document.getElementById("mobileSidebar").classList.toggle("active");
    document.getElementById("sidebarOverlay").classList.toggle("active");
}

function toggleMobileSubmenu(icon) {
    const submenu = icon.parentElement.nextElementSibling;
    submenu.classList.toggle("active");
    // Toggle icon from plus to minus
    if(submenu.classList.contains("active")) {
        icon.classList.remove("fa-plus");
        icon.classList.add("fa-minus");
    } else {
        icon.classList.add("fa-plus");
        icon.classList.remove("fa-minus");
    }
}

// 5. SEARCH OVERLAY
function toggleSearch() {
    document.getElementById("searchOverlay").classList.toggle("active");
}