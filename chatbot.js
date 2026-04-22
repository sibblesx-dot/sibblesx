// Chatbot Configuration
const CHATBOT_CONFIG = {
    name: "Sibbles",
    ownerName: "Ajay",
    ownerAge: 18,
    personality: {
        tone: "calm and funny",
        openingMessage: "Hey there! 👋 I'm Sibbles, sibblesX's personal AI assistant. ⚠️ TESTING MODE: This bot is in beta - responses are mock data for now. Don't expect perfection! 😅",
    },
};

class SibblesBot {
    constructor() {
        this.messages = [];
        this.isOpen = false;
        this.isLoading = false;
        this.init();
    }

    init() {
        this.createChatbotUI();
        this.attachEventListeners();
    }

    createChatbotUI() {
        // Chat widget HTML
        const chatHTML = `
            <div id="sibbles-chatbot" class="sibbles-chatbot">
                <div class="sibbles-header">
                    <div class="sibbles-title">
                        <div class="sibbles-avatar">
                            <img src="sibblesx-logo.png" alt="Sibbles logo" class="sibbles-logo-img">
                        </div>
                        <div>
                            <h3>Sibbles</h3>
                            <span class="sibbles-status">🟢 Online</span>
                        </div>
                    </div>
                    <button class="sibbles-close" id="sibbles-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="sibbles-messages" id="sibbles-messages">
                    <div class="sibbles-message bot-message">
                        <div class="message-avatar">
                            <i class="fas fa-robot"></i>
                        </div>
                        <div class="message-content">${CHATBOT_CONFIG.personality.openingMessage}</div>
                    </div>
                </div>
                <div class="sibbles-input-area">
                    <input 
                        type="text" 
                        class="sibbles-input" 
                        id="sibbles-input" 
                        placeholder="Ask me anything..."
                        autocomplete="off"
                    />
                    <button class="sibbles-send" id="sibbles-send" title="Send">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>

            <button class="sibbles-toggle" id="sibbles-toggle" title="Open Sibbles Chat">
                <img src="sibblesx-logo.png" alt="Sibbles logo" class="sibbles-toggle-logo">
                <span class="sibbles-label">Chat</span>
            </button>
        `;

        // Append to body
        const container = document.createElement('div');
        container.id = 'sibbles-container';
        container.innerHTML = chatHTML;
        document.body.appendChild(container);
    }

    attachEventListeners() {
        const toggleBtn = document.getElementById('sibbles-toggle');
        const closeBtn = document.getElementById('sibbles-close');
        const sendBtn = document.getElementById('sibbles-send');
        const input = document.getElementById('sibbles-input');

        toggleBtn.addEventListener('click', () => this.toggleChat());
        closeBtn.addEventListener('click', () => this.closeChat());
        sendBtn.addEventListener('click', () => this.sendMessage());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !this.isLoading) this.sendMessage();
        });
    }

    toggleChat() {
        const chatbot = document.getElementById('sibbles-chatbot');
        this.isOpen = !this.isOpen;
        chatbot.classList.toggle('active', this.isOpen);
        
        if (this.isOpen) {
            document.getElementById('sibbles-input').focus();
        }
    }

    closeChat() {
        const chatbot = document.getElementById('sibbles-chatbot');
        this.isOpen = false;
        chatbot.classList.remove('active');
    }

    sendMessage() {
        const input = document.getElementById('sibbles-input');
        const sendBtn = document.getElementById('sibbles-send');
        const message = input.value.trim();

        if (!message || this.isLoading) return;

        // Disable input and button during loading
        input.disabled = true;
        sendBtn.disabled = true;
        sendBtn.style.opacity = '0.6';

        // Add user message
        this.addMessage(message, 'user');
        input.value = '';

        // Show loading
        this.isLoading = true;
        this.addMessage('✍️ Typing...', 'bot-thinking');

        // Simulate API delay
        setTimeout(() => {
            try {
                // Get response
                const response = this.generateResponse(message);

                // Remove thinking message
                const messagesDiv = document.getElementById('sibbles-messages');
                const thinkingMsg = messagesDiv.querySelector('.bot-thinking');
                if (thinkingMsg) {
                    thinkingMsg.remove();
                }

                // Add bot response
                this.addMessage(response, 'bot');
            } catch (error) {
                console.error('Error generating response:', error);
                this.addMessage('Oops! Something went wrong. Please try again! 😅', 'bot');
            } finally {
                this.isLoading = false;
                input.disabled = false;
                sendBtn.disabled = false;
                sendBtn.style.opacity = '1';
                input.focus();
            }
        }, 800);
    }

    addMessage(text, sender) {
        const messagesDiv = document.getElementById('sibbles-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `sibbles-message ${sender === 'user' ? 'user-message' : sender === 'bot-thinking' ? 'bot-message bot-thinking' : 'bot-message'}`;
        
        if (sender !== 'user' && sender !== 'bot-thinking') {
            const avatar = document.createElement('div');
            avatar.className = 'message-avatar';
            avatar.innerHTML = '<i class="fas fa-robot"></i>';
            messageDiv.appendChild(avatar);
        }
        
        const content = document.createElement('div');
        content.className = 'message-content';
        content.textContent = text;
        
        messageDiv.appendChild(content);
        messagesDiv.appendChild(messageDiv);

        // Scroll to bottom smoothly
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    generateResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        const contains = (keywords) => keywords.some(word => lowerMessage.includes(word));

        // OWNER & IDENTITY
        if (contains(['owner', 'ajay', 'who are you', 'who am i chatting with'])) {
            return `I work with Ajay, the owner of sibblesX! He's 18 years old and an amazing developer and entrepreneur. Ask me anything about web apps, automation, or chatbots. 🚀`;
        }

        // GREETINGS
        if (contains(['hello', 'hi', 'hey', 'welcome', 'hii'])) {
            return `Hey there! 👋 I'm Sibbles, your AI assistant. Tell me about your project - whether it's a website, automation, chatbot, or something else, I'll give you the best timeline! 🎯`;
        }

        // SERVICES LIST
        if (contains(['service', 'offer', 'what can you do', 'capabilities', 'what do you offer'])) {
            return `I offer: 🌐 Web Development, 🤖 AI Chatbots, ⚙️ Python/N8N Automation, 📱 Web Apps, 📊 Admin Dashboards, 📸 Instagram Management. What interests you?`;
        }

        // PRICING - redirect but helpful
        if (contains(['price', 'cost', 'pay', 'charge', 'budget', 'how much'])) {
            return `Pricing varies by project scope! 📊 Simple sites: ~2-3 days. Complex apps with dashboards: 5-14+ days. For exact quotes on your project, email sibblesx@gmail.com or call +91 8791012083. I can help you plan first! 💡`;
        }

        // SPECIFIC SERVICES
        if (contains(['automation', 'automate', 'workflow'])) {
            return `Automation is my favorite! 🔧 Python scripts & N8N workflows to save you hours. Timeline: 3-7 days depending on complexity. What workflow needs automating? 🤔`;
        }

        if (contains(['chatbot', 'ai assistant', 'bot development'])) {
            return `Building AI chatbots is my specialty! 🤖 (Just like me!) They take 3-7 days. More features = more time. What should your chatbot do? 😊`;
        }

        if (contains(['instagram', 'social media'])) {
            return `Instagram management is an ongoing service! 📱 I can help with content strategy, posting, engagement, and growth. Let's make you viral! 🚀`;
        }

        // WEBSITE REQUESTS - SMART DETECTION
        // This handles ANY website type - restaurant, shop, blog, portfolio, etc.
        const isWebsiteRequest = contains(['website', 'site', 'web', 'build', 'create', 'develop', 'need', 'want', 'make', 'project', 'platform', 'online presence']) && !contains(['price', 'cost', 'budget']);
        
        if (isWebsiteRequest) {
            // Detect website type
            const websiteType = this.detectWebsiteType(lowerMessage);
            
            // Detect features mentioned
            const features = this.detectFeatures(lowerMessage);
            
            // Calculate base time
            let timeEstimate = 2;
            let description = websiteType;
            
            // Add time for each feature
            if (features.length > 0) {
                timeEstimate = Math.min(2 + (features.length * 1.5), 14);
                description = websiteType + ` with ${features.join(', ')}`;
            } else if (contains(['simple', 'basic', 'landing', 'page'])) {
                timeEstimate = 2;
                description = 'simple ' + websiteType;
            } else if (contains(['complex', 'advanced', 'full-featured', 'custom'])) {
                timeEstimate = 10;
                description = 'advanced ' + websiteType;
            }
            
            return `Nice! A ${description} website typically takes ${timeEstimate}-${Math.min(timeEstimate + 3, 14)} days. Features like booking, payments, or dashboards add more time. Want to discuss specifics? 💬`;
        }

        // CONTACT
        if (contains(['contact', 'reach', 'email', 'phone', 'get in touch'])) {
            return `📧 Email: sibblesx@gmail.com\n📱 Phone: +91 8791012083\n\nI'm here to help! Feel free to reach out anytime. 😊`;
        }

        // Fallback smart responses
        return this.generateSmartResponse(userMessage);
    }

    detectWebsiteType(text) {
        const types = [
            { keywords: ['restaurant', 'food', 'cafe', 'dining', 'menu'], type: 'restaurant' },
            { keywords: ['shop', 'store', 'ecommerce', 'e-commerce', 'sell', 'product', 'selling'], type: 'e-commerce store' },
            { keywords: ['portfolio', 'showcase', 'gallery', 'work'], type: 'portfolio' },
            { keywords: ['blog', 'news', 'article'], type: 'blog' },
            { keywords: ['saas', 'app', 'software', 'tool', 'service'], type: 'SaaS app' },
            { keywords: ['coaching', 'academy', 'training', 'course', 'education'], type: 'coaching/learning' },
            { keywords: ['clinic', 'hospital', 'doctor', 'health', 'medical'], type: 'healthcare' },
            { keywords: ['salon', 'spa', 'barber'], type: 'salon/spa' },
            { keywords: ['realestate', 'property', 'apartment', 'house'], type: 'real estate' },
            { keywords: ['agency', 'studio', 'service'], type: 'service' },
        ];
        
        for (const { keywords, type } of types) {
            if (keywords.some(word => text.includes(word))) {
                return type;
            }
        }
        return 'custom';
    }

    detectFeatures(text) {
        const featureMap = [
            { keywords: ['booking', 'appointment', 'reserve', 'schedule'], feature: 'booking system' },
            { keywords: ['payment', 'checkout', 'card', 'pay', 'purchase'], feature: 'payment processing' },
            { keywords: ['login', 'account', 'user', 'profile', 'authentication'], feature: 'user accounts' },
            { keywords: ['chat', 'messaging', 'support', 'contact'], feature: 'chat/messaging' },
            { keywords: ['dashboard', 'analytics', 'stats', 'report', 'data'], feature: 'admin dashboard' },
            { keywords: ['email', 'notification', 'alert'], feature: 'notifications' },
            { keywords: ['review', 'rating', 'comment'], feature: 'reviews/ratings' },
            { keywords: ['order', 'cart', 'delivery'], feature: 'ordering system' },
            { keywords: ['inventory', 'stock', 'manage'], feature: 'inventory management' },
            { keywords: ['beautiful', 'design', 'ui', 'ux', 'modern'], feature: 'advanced design' },
        ];
        
        const detected = [];
        for (const { keywords, feature } of featureMap) {
            if (keywords.some(word => text.includes(word))) {
                detected.push(feature);
            }
        }
        return detected;
    }

    generateSmartResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        
        // If it's a question, give a helpful response
        if (userMessage.includes('?')) {
            const questionResponses = [
                `That's a great question! 🤔 Tell me more about it and I can give you a better answer.`,
                `I'd love to help! Could you give me a bit more context? What's your project about?`,
                `Interesting! To give you the best timeline, could you describe your project idea?`,
                `That's awesome! 🎯 Tell me more about what you're thinking and I can help!`,
            ];
            return questionResponses[Math.floor(Math.random() * questionResponses.length)];
        }
        
        // Check if it mentions a technology or tool
        if (lowerMessage.match(/react|vue|angular|node|python|javascript|php|laravel|wordpress|html|css|database/i)) {
            return `Nice tech choice! 🚀 Web development with those technologies typically takes 5-14 days depending on complexity. Let's discuss your specific project! 💬`;
        }
        
        // Check if it sounds like a project description
        if (lowerMessage.length > 20 && (lowerMessage.includes('want') || lowerMessage.includes('need') || lowerMessage.includes('build'))) {
            return `That sounds interesting! 🎨 To give you an accurate timeline, tell me: Is this a website, web app, or something else? What features are important? 🤔`;
        }
        
        // Default helpful responses
        const defaultResponses = [
            `Sounds cool! 🚀 Tell me more about your project and I can give you a timeline estimate.`,
            `I'm here to help! 💡 What kind of project are you thinking about?`,
            `That's interesting! 🎯 Feel free to describe your project idea and I'll help with timelines.`,
            `Let's chat about your project! 🌟 What needs to be built?`,
        ];
        
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }
}

// Initialize chatbot when page loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.sibblesBot = new SibblesBot();
    }, 300);
});
