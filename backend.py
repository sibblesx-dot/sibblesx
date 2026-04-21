from flask import Flask, request, jsonify
import requests
import os
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

HF_TOKEN = os.getenv('HF_TOKEN')
HF_MODEL = os.getenv('HF_MODEL', 'mistralai/Mistral-7B-Instruct-v0.2')
HF_API_URL = f"https://api-inference.huggingface.co/models/{HF_MODEL}"

# Validate token on startup
if not HF_TOKEN:
    print("⚠️  Warning: HF_TOKEN not found in environment variables!")

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_message = data.get('message', '')
        
        if not user_message:
            return jsonify({'error': 'Empty message'}), 400
        
        # System prompt for the AI
        system_prompt = """You are Sibbles, a calm and funny AI assistant for sibblesX. You help visitors learn about web development, automation, AI chatbots, Instagram management, web apps, and admin dashboards.

Owner: Ajay (Age 18)
Personality: Calm and funny with casual, friendly tone.
Important: NEVER mention prices or costs. If asked, direct to email sibblesx@gmail.com or phone +91 8791012083.

Keep responses concise (2-3 sentences max), friendly, and helpful."""

        # Call HuggingFace API
        headers = {"Authorization": f"Bearer {HF_TOKEN}"}
        payload = {
            "inputs": f"{system_prompt}\n\nUser: {user_message}\nAssistant:",
            "parameters": {
                "max_new_tokens": 100,
                "temperature": 0.7,
            }
        }
        
        print(f"Making request to: {HF_API_URL}")
        response = requests.post(HF_API_URL, headers=headers, json=payload, timeout=30)
        print(f"Response status: {response.status_code}")
        print(f"Response text: {response.text}")
        
        if response.status_code != 200:
            return jsonify({'error': 'API error', 'details': response.text}), response.status_code
        
        result = response.json()
        
        # Extract the generated text
        if isinstance(result, list) and len(result) > 0:
            generated_text = result[0].get('generated_text', '')
            # Extract just the assistant response
            if 'Assistant:' in generated_text:
                bot_response = generated_text.split('Assistant:')[1].strip().split('\n')[0].strip()
            else:
                bot_response = generated_text.strip()
        else:
            bot_response = "I'm thinking... 🤔"
        
        return jsonify({'response': bot_response}), 200
    
    except requests.exceptions.Timeout:
        return jsonify({'error': 'Request timeout. Please try again.'}), 504
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'}), 200

if __name__ == '__main__':
    # For local development
    app.run(debug=True, port=5000)
