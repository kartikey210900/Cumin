from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# Load the summarizer model
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

@app.route('/summarize', methods=['POST'])
def summarize():
    try:
        # Get the text from the request
        data = request.get_json()
        text = data['text']

        # Perform summarization
        summary = summarizer(text, max_length=500000, min_length=50, do_sample=False)

        # Return the summary
        return jsonify({'summary': summary[0]['summary_text']})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500

if __name__ == '__main__':
    app.run(debug=True)
