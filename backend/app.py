from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# Set your Hugging Face API Key
HF_API_KEY = "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"  # Use environment variable in production

# Hugging Face API URL for summarization
API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn"

# Function to get summary from Hugging Face API
def summarize_text(text):
    headers = {"Authorization": f"Bearer {HF_API_KEY}"}
    payload = {"inputs": text}
    
    response = requests.post(API_URL, headers=headers, json=payload)
    
    if response.status_code == 200:
        return response.json()[0]['summary_text']
    else:
        return f"Error: {response.json()}"

@app.route('/summarize', methods=['POST'])
def summarize():
    try:
        # Get the text from the request
        data = request.get_json()
        text = data['text']

        # Get summary using Hugging Face API
        summary = summarize_text(text)

        return jsonify({'summary': summary})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500

if __name__ == '__main__':
    app.run(debug=True)
