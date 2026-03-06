/* --- CONFIGURATION --- */
const POPUP_DELAY = 10000; // 10 seconds
const COOKIE_NAME = 'abaya_newsletter_popup';
const COOKIE_DAYS = 7;

/* --- POPUP LOGIC --- */
document.addEventListener('DOMContentLoaded', () => {
    // Only inject popup if on homepage (index.html)
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        injectPopupHTML();
        initPopupTriggers();
    }
});

function injectPopupHTML() {
    const html = `
    <div class="newsletter-popup" id="newsletterPopup">
        <div class="popup-content">
            <div class="close-popup" onclick="closePopup()">&times;</div>
            <div class="popup-left">
                <h3>Modest.<br>Elegant.<br>You.</h3>
            </div>
            <div class="popup-right" id="popupFormView">
                <h2>Get 10% Off Your First Order</h2>
                <p>Plus exclusive access to new collections.</p>
                <form class="popup-form" onsubmit="handleSubscription(event, 'popup')">
                    <input type="email" id="popupEmail" placeholder="Enter your email" required>
                    <button type="submit" class="btn-gold-lg">Claim My Discount</button>
                </form>
                <div class="popup-footer" onclick="closePopup()">No thanks, I prefer full price</div>
            </div>
            
            <div class="popup-right success-view" id="popupSuccessView">
                <div class="success-icon"><i class="fas fa-check-circle"></i></div>
                <h3>Welcome to the Community!</h3>
                <p>Here is your discount code:</p>
                <div class="discount-code" id="discCode">WELCOME10</div>
                <button class="btn-gold-lg" onclick="copyCode()">Copy Code</button>
                <div class="popup-footer" onclick="closePopup()">Start Shopping</div>
            </div>
        </div>
    </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
}

function initPopupTriggers() {
    // Check Cookie
    if (getCookie(COOKIE_NAME)) return;

    // 1. Time Delay
    setTimeout(showPopup, POPUP_DELAY);

    // 2. Scroll Trigger (50%)
    window.addEventListener('scroll', () => {
        if (!getCookie(COOKIE_NAME) && (window.scrollY + window.innerHeight) > (document.body.offsetHeight / 2)) {
            showPopup();
        }
    });

    // 3. Exit Intent (Desktop only)
    document.addEventListener('mouseleave', (e) => {
        if (e.clientY < 0 && !getCookie(COOKIE_NAME)) {
            showPopup();
        }
    });
}

function showPopup() {
    if (document.getElementById('newsletterPopup').classList.contains('active')) return;
    document.getElementById('newsletterPopup').classList.add('active');
}

function closePopup() {
    document.getElementById('newsletterPopup').classList.remove('active');
    setCookie(COOKIE_NAME, 'dismissed', COOKIE_DAYS);
}

/* --- SUBSCRIPTION HANDLER --- */
function handleSubscription(e, source) {
    e.preventDefault();
    const email = source === 'popup' 
        ? document.getElementById('popupEmail').value 
        : document.getElementById('pageEmail').value;
    
    // Simulate API Call
    const btn = e.target.querySelector('button');
    const originalText = btn.innerText;
    btn.innerText = "Subscribing...";
    
    setTimeout(() => {
        if (source === 'popup') {
            document.getElementById('popupFormView').style.display = 'none';
            document.getElementById('popupSuccessView').style.display = 'block';
            setCookie(COOKIE_NAME, 'subscribed', 365); // Don't show for a year
        } else {
            alert(`Thanks for subscribing with ${email}! Your 10% off code is sent to your inbox.`);
            btn.innerText = "Subscribed!";
            e.target.reset();
        }
    }, 1500);
}

/* --- UTILS --- */
function copyCode() {
    const code = document.getElementById('discCode').innerText;
    navigator.clipboard.writeText(code);
    alert("Code copied to clipboard!");
    closePopup();
}

function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}