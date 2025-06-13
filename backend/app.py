#!/usr/bin/env python3
"""
TurboTalk AI v1.2.6 - Advanced Competition Edition
Flask Web Application with Enhanced AI and Web Scraping
Company: Rango Productions
Created by: Rushi Bhavinkumar Soni (CEO/Founder)
Nationality: Indian
"""

from flask import Flask, render_template, request, jsonify, session
import json
import os
import time
import random
import threading
from datetime import datetime
import warnings
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass
from enum import Enum
import hashlib

# Import TurboTalkAI from run_finetunned.py
from run_finetunned import TurboTalkAI, SearchDecision

warnings.filterwarnings("ignore")

app = Flask(__name__)
app.secret_key = 'turbotalk_ai_v1_2_6_secret_key_rango_productions'

# Configuration
VERSION = "1.2.6"
COMPANY = "Rango Productions"
CREATOR = "Rushi Bhavinkumar Soni"
AI_NAME = "TurboTalk AI"

# Initialize TurboTalk AI from run_finetunned.py
turbotalk = TurboTalkAI()
# Load the model when the app starts
turbotalk.load_model()

@app.route('/api/chat', methods=['POST'])
def chat():
    """Chat API endpoint"""
    try:
        data = request.get_json()
        user_message = data.get('message', '').strip()
        research_mode = data.get('research_mode', True)
        temperature = data.get('temperature', 0.7)
        
        if not user_message:
            return jsonify({'error': 'No message provided'}), 400
        
        # Validate temperature
        temperature = max(0.1, min(1.0, float(temperature)))
        
        # Set research mode
        turbotalk.research_enabled = research_mode
        
        # Generate response using run_finetunned.py's TurboTalkAI
        start_time = time.time()
        response = turbotalk.generate_response(user_message, temperature)
        end_time = time.time()
        
        # Store in conversation history
        turbotalk.conversation_history.append({
            'user': user_message,
            'assistant': response,
            'temperature': temperature,
            'timestamp': datetime.now().isoformat()
        })
        
        return jsonify({
            'response': response,
            'response_time': round(end_time - start_time, 2),
            'temperature': temperature,
            'research_mode': research_mode,
            'timestamp': datetime.now().isoformat(),
            'ai_identity': turbotalk.ai_identity
        })
        
    except Exception as e:
        print(f"Chat error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/status')
def status():
    """API status endpoint"""
    return jsonify({
        'status': 'online',
        'ai_name': AI_NAME,
        'version': VERSION,
        'company': COMPANY,
        'creator': CREATOR,
        'features': [
            'Enhanced Web Scraping',
            'Clean Output Generation',
            'Multiple Search Engines',
            'Wikipedia Integration',
            'Quality Source Filtering',
            'Metadata Display'
        ],
        'timestamp': datetime.now().isoformat()
    })

@app.route('/')
def index():
    """Main page"""
    try:
        return render_template('index.html')
    except Exception as e:
        print(f"Template error: {e}")
        # Return basic HTML if template not found
        return """
        <!DOCTYPE html>
        <html>
        <head>
            <title>TurboTalk AI v1.2.6</title>
        </head>
        <body>
            <h1>TurboTalk AI v1.2.6</h1>
            <p>Flask application is running. Please ensure templates/index.html exists.</p>
        </body>
        </html>
        """

if __name__ == '__main__':
    print(f"🚀 Starting {AI_NAME} v{VERSION}")
    print(f"🏢 {COMPANY}")
    print(f"👨‍💻 Created by: {CREATOR}")
    print(f"🇮🇳 Made in India")
    print("🔥 Features: Enhanced Search + Clean Output + Metadata Display")
    print("=" * 50)
    
    app.run(debug=True, host='0.0.0.0', port=5000)