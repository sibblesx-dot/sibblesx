from flask import Flask, request, jsonify
import os
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# Mock response database
MOCK_RESPONSES = {
    "web development": "I can help you with web development! We offer custom websites, web apps, and full-stack solutions. Reach out to sibblesx@gmail.com to discuss your project! 🚀",
    "automation": "Automation is awesome! We specialize in Python scripts and N8N workflows to automate your workflows. What would you like to automate? 🤖",
    "chatbot": "AI chatbots are my specialty! 😄 We can build custom chatbots like me for your business. Interested? Ping sibblesx@gmail.com",
    "instagram": "We help manage Instagram pages with engaging content and growth strategies. Let's boost your presence! 📱",
    "admin dashboard": "Need an admin dashboard? We build custom dashboards to manage your data efficiently. Let's chat! 💻",
    "ai": "AI is the future! We're building AI-powered solutions. This chatbot is in testing - don't expect perfection yet! 😅",
    "price": "We don't discuss prices here, but feel free to email sibblesx@gmail.com or call +91 8791012083 for quotes.",
    "contact": "You can reach out to sibblesx@gmail.com or call +91 8791012083. We'd love to hear from you! 📞",
}

DEFAULT_RESPONSES = [
    "Hey! Thanks for chatting with me. What can I help you with? 😊",
    "I'm Sibbles! I can help with web development, automation, AI chatbots, and more. What interests you? 🚀",
    "That's interesting! Want to know more about sibblesX services? Just ask! 💡",
    "I'm here to help! Feel free to ask about web dev, AI chatbots, automation, or anything else. 🎯",
]

import random

def get_mock_response(user_message):
    """Generate a contextual mock response based on keywords"""
    user_lower = user_message.lower()
    
    # Check for keywords in the user message
    for keyword, response in MOCK_RESPONSES.items():
        if keyword in user_lower:
            return response
    
    # Return a random default response if no keywords match
    return random.choice(DEFAULT_RESPONSES)

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_message = data.get('message', '')
        
        if not user_message:
            return jsonify({'error': 'Empty message'}), 400
        
        # Generate mock response
        bot_response = get_mock_response(user_message)
        
        print(f"User: {user_message}")
        print(f"Bot: {bot_response}")
        
        return jsonify({'response': bot_response}), 200
    
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': 'Something went wrong. Please try again.'}), 500

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'}), 200

if __name__ == '__main__':
    # For local development
    app.run(debug=True, port=5000)
