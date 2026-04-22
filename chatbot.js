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
        chatbot.classList.toggle('open', this.isOpen);
        
        if (this.isOpen) {
            document.getElementById('sibbles-input').focus();
        }
    }

    closeChat() {
        const chatbot = document.getElementById('sibbles-chatbot');
        this.isOpen = false;
        chatbot.classList.remove('open');
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

        if (contains(['owner', 'ajay', 'who are you'])) {
            return `I work with Ajay, the owner of sibblesX! He's 18 years old and an amazing developer and entrepreneur. Ask me anything about web apps, automation, or chatbots.`;
        }

        if (contains(['price', 'cost', 'pay', 'charge'])) {
            return `We customize pricing based on project requirements. For a clear quote, contact us at sibblesx@gmail.com or +91 8791012083. I can help you plan the timeline first!`;
        }

        if (contains(['coaching', 'academy', 'training', 'tutor']) && contains(['website', 'site'])) {
            return `A coaching website usually takes around 4-8 days depending on features like booking, pricing, courses, and student dashboards. If you want a simple landing page first, that can be ready in about 2 days.`;
        }

        if (contains(['how long', 'time', 'timeline', 'take']) && contains(['website', 'site'])) {
            return `A basic website takes about 2 days. If it includes advanced features like dashboards, AI chat, or student management, it may take 5-14 days depending on the scope.`;
        }

        if (contains(['website', 'site', 'webpage']) && contains(['build', 'create', 'need', 'want', 'make'])) {
            return `I can build your website quickly and cleanly. Simple sites take about 2 days, while custom apps and dashboards take a little more time based on the features.`;
        }

        if (contains(['service', 'offer', 'what can you do'])) {
            return `I offer these services: Automation with Python & n8n, Web Development, AI Chatbots, Web Apps, Admin Dashboards, and Instagram Page Management. Which one are you interested in?`;
        }

        if (contains(['automation'])) {
            return `Automation is my sweet spot! 🔧 I use Python and n8n to save time and reduce repetitive work. Typical projects take 3-7 days.`;
        }

        if (contains(['chatbot'])) {
            return `Yes, I build AI chatbots like me! 🤖 They usually take 3-7 days depending on how smart you want them to be.`;
        }

        if (contains(['dashboard'])) {
            return `Admin dashboards are perfect for your data. I can build one in about 7-14 days with charts, controls, and clean layout.`;
        }

        if (contains(['instagram'])) {
            return `Instagram management is an ongoing service. I can help with posting strategy, engagement, and content ideas.`;
        }

        if (contains(['web app'])) {
            return `Web apps are custom tools that solve real problems. They usually take 5-10 days depending on complexity and integrations.`;
        }

        if (contains(['contact', 'reach', 'email', 'phone'])) {
            return `You can reach us at: 📧 sibblesx@gmail.com or 📱 +91 8791012083. I'm happy to help with any project idea!`;
        }

        if (contains(['hello', 'hi', 'hey', 'welcome'])) {
            return `Hey there! 👋 I'm Sibbles, your calm and funny AI assistant. Tell me about your project and I'll give you the best timeline.`;
        }

        return this.generateSmartResponse(userMessage);
    }

    generateSmartResponse(userMessage) {
        const responses = [
            `That's an interesting question! 🤔 I'd love to help you with that. Could you tell me more about what you're looking for? Or feel free to reach out to us directly at sibblesx@gmail.com!`,
            `Great question! 😊 I'm here to help with all things web development, automation, and digital solutions. What specific service are you interested in?`,
            `I appreciate you reaching out! 💬 We specialize in creating amazing digital experiences. What can I help you build today?`,
            `Thanks for chatting with me! 🎯 Whether it's automation, web apps, or AI solutions, we've got you covered. What's on your mind?`,
            `Awesome to hear from you! 🚀 We love working on innovative projects. Tell me more about what you need!`
        ];

        if (userMessage.includes('?')) {
            return responses[Math.floor(Math.random() * responses.length)];
        }

        return `I received your message: "${userMessage}". That's really interesting! 🤔 For the best assistance, feel free to reach out to us at sibblesx@gmail.com or call +91 8791012083. We'd love to help! 😊`;
    }
}

// Initialize chatbot when page loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.sibblesBot = new SibblesBot();
    }, 300);
});
