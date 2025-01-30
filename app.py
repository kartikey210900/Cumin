import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Fetch API Key from Environment Variables
HF_API_KEY = os.getenv("HF_API_KEY")

# Check if the API key is missing
if not HF_API_KEY:
    print("⚠️ Missing Hugging Face API Key! Set HF_API_KEY in environment variables.")
    HF_API_KEY = "your-default-api-key"  # Optional: Set a fallback key for local testing

# Hugging Face API URL for summarization
API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn"

# Function to get summary from Hugging Face API
def summarize_text(text):
    headers = {"Authorization": f"Bearer {HF_API_KEY}"}
    payload = {"inputs": text}

    try:
        response = requests.post(API_URL, headers=headers, json=payload)
        response.raise_for_status()  # Raises HTTPError for bad responses (4xx, 5xx)
        return response.json()[0]['summary_text']
    except requests.exceptions.RequestException as e:
        print(f"❌ API Request Failed: {str(e)}")  # Log error
        return "Error: Could not connect to Hugging Face API"

# ✅ NEW: Root Route to Prevent 404 Errors
@app.route('/')
def home():
    return jsonify({"message": "Flask Summarization API is running!"}), 200

@app.route('/summarize', methods=['POST'])
def summarize():
    try:
        # Get the text from the request
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({'error': 'Invalid request, missing "text" field'}), 400

        text = data['text'].strip()
        if not text:
            return jsonify({'error': 'Text cannot be empty'}), 400

        # Get summary using Hugging Face API
        summary = summarize_text(text)

        # ✅ Ensure API response is valid
        if "Error" in summary:
            return jsonify({'error': summary}), 500

        return jsonify({'summary': summary})

    except Exception as e:
        print(f"⚠️ Internal Server Error: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500

if __name__ == '__main__':
    app.run(debug=True)
