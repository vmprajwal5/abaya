/* --- CONFIGURATION --- */
const BOT_NAME = "Aisha";
const START_MSG = `السلام عليكم! Welcome to Abaya Clothing 👋<br><br>I'm ${BOT_NAME}, your virtual assistant. How can I help you today?`;

/* --- KNOWLEDGE BASE (Keyword Matching) --- */
const KNOWLEDGE_BASE = [
    {
        keywords: ["hello", "hi", "salam", "hey"],
        response: "Wa alaykumu s-salam! How can I assist you with your modest fashion needs today?"
    },
    {
        keywords: ["shipping", "delivery", "track", "ship"],
        response: "We offer <strong>Free Shipping</strong> in Maldives for orders over MVR 1000.<br>Standard delivery takes 2-5 business days.",
        action: "track_order"
    },
    {
        keywords: ["return", "refund", "exchange"],
        response: "We have a 30-day hassle-free return policy. Items must be unworn with tags attached.<br><a href='#'>View full policy</a>"
    },
    {
        keywords: ["size", "fit", "chart", "measure"],
        response: "Our abayas fit true to size. I recommend checking our Size Guide for exact measurements.",
        action: "size_guide"
    },
    {
        keywords: ["price", "cost", "much"],
        response: "Our prices range from MVR 1,200 for Daily Wear to MVR 3,000 for Premium Silk Abayas."
    },
    {
        keywords: ["party", "wedding", "occasion"],
        response: "Looking for something special? Check out our <strong>Party Wear Collection</strong>.",
        action: "show_products"
    }
];

/* --- INITIALIZATION --- */
document.addEventListener('DOMContentLoaded', () => {
    initChatWidget();
    loadChatHistory();
});

function initChatWidget() {
    const html = `
        <div class="chat-widget-btn" onclick="toggleChat()">
            <i class="fas fa-comment-dots"></i>
            <div class="chat-badge" id="chatBadge"></div>
        </div>

        <div class="chat-window" id="chatWindow">
            <div class="chat-header">
                <div class="chat-title">
                    <h3>Abaya Clothing Support</h3>
                    <span><span class="online-status"></span> We reply instantly</span>
                </div>
                <div class="chat-controls">
                    <i class="fas fa-minus" onclick="toggleChat()"></i>
                    <i class="fas fa-times" onclick="closeChat()"></i>
                </div>
            </div>
            
            <div class="chat-body" id="chatBody">
                </div>

            <div class="typing-indicator" id="typingIndicator">
                ${BOT_NAME} is typing <span>.</span><span>.</span><span>.</span>
            </div>

            <div class="chat-footer">
                <input type="text" id="chatInput" class="chat-input" placeholder="Type your message..." onkeypress="handleEnter(event)">
                <button class="send-btn" onclick="sendMessage()"><i class="fas fa-paper-plane"></i></button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
    
    // Check if first time, if so, show welcome
    if (!localStorage.getItem('abayaChatHistory')) {
        setTimeout(() => {
            addBotMessage(START_MSG);
            showQuickReplies();
            document.getElementById('chatBadge').classList.add('active'); // Notify user
        }, 1000);
    }
}

/* --- CORE FUNCTIONS --- */
function toggleChat() {
    const win = document.getElementById('chatWindow');
    win.classList.toggle('active');
    document.getElementById('chatBadge').classList.remove('active'); // Clear badge
    
    // Scroll to bottom
    const body = document.getElementById('chatBody');
    body.scrollTop = body.scrollHeight;
}

function closeChat() {
    document.getElementById('chatWindow').classList.remove('active');
}

function handleEnter(e) {
    if (e.key === 'Enter') sendMessage();
}

/* --- MESSAGING LOGIC --- */
function sendMessage(text = null) {
    const input = document.getElementById('chatInput');
    const msg = text || input.value.trim();
    
    if (!msg) return;

    // 1. Add User Message
    addUserMessage(msg);
    input.value = "";

    // 2. Simulate Bot Thinking
    showTyping();

    // 3. Process Response
    setTimeout(() => {
        hideTyping();
        const response = getBotResponse(msg);
        addBotMessage(response.text);
        
        if(response.action) handleAction(response.action);
        
        saveChatHistory();
    }, 1500); // 1.5s simulated delay
}

function addUserMessage(text) {
    const body = document.getElementById('chatBody');
    const div = document.createElement('div');
    div.className = 'message user';
    div.innerHTML = `<div class="msg-content">${text}</div>`;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
}

function addBotMessage(html) {
    const body = document.getElementById('chatBody');
    const div = document.createElement('div');
    div.className = 'message bot';
    div.innerHTML = `
        <div class="bot-avatar"><i class="fas fa-headset"></i></div>
        <div class="msg-content">${html}</div>
    `;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
}

/* --- AI LOGIC (Simple Keyword Matching) --- */
function getBotResponse(input) {
    const lower = input.toLowerCase();
    
    // Default Fallback
    let response = { text: "I'm not sure about that. Would you like to speak to a human agent?", action: "contact_human" };

    // Check Knowledge Base
    for (let item of KNOWLEDGE_BASE) {
        if (item.keywords.some(k => lower.includes(k))) {
            response = { text: item.response, action: item.action };
            break;
        }
    }
    
    return response;
}

function handleAction(action) {
    if (action === "show_products") {
        const html = `
            <div class="product-card-chat">
                <img src="https://images.unsplash.com/photo-1596464871407-1e5443202957?w=100">
                <div class="p-info">
                    <h4>Luxury Embroidered</h4>
                    <span>$130.00</span>
                    <a href="product-details.html" class="btn-view">View Details</a>
                </div>
            </div>
        `;
        addBotMessage("Here is a top pick for you:" + html);
    }
    
    if (action === "size_guide") {
        addBotMessage('<img src="https://via.placeholder.com/300x150?text=Size+Chart" style="width:100%; border-radius:4px;">');
    }
    
    if (action === "contact_human") {
        const btn = `<div class="quick-replies">
            <div class="quick-btn" onclick="window.open('https://wa.me/123456789')"><i class="fab fa-whatsapp"></i> WhatsApp Us</div>
        </div>`;
        addBotMessage("You can connect with us directly:" + btn);
    }
}

function showQuickReplies() {
    const html = `
        <div class="quick-replies">
            <div class="quick-btn" onclick="sendMessage('Show me party wear')">🛍️ Browse</div>
            <div class="quick-btn" onclick="sendMessage('Track my order')">🚚 Track Order</div>
            <div class="quick-btn" onclick="sendMessage('Size Guide')">📏 Size Guide</div>
        </div>
    `;
    addBotMessage(html);
}

/* --- UTILS --- */
function showTyping() {
    document.getElementById('typingIndicator').style.display = 'block';
    const body = document.getElementById('chatBody');
    body.scrollTop = body.scrollHeight;
}

function hideTyping() {
    document.getElementById('typingIndicator').style.display = 'none';
}

function saveChatHistory() {
    const body = document.getElementById('chatBody');
    localStorage.setItem('abayaChatHistory', body.innerHTML);
}

function loadChatHistory() {
    const history = localStorage.getItem('abayaChatHistory');
    if (history) {
        document.getElementById('chatBody').innerHTML = history;
    }
}