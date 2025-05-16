from flask import Flask, request, jsonify
from flask_cors import CORS  # ✅ This fixes Postman + browser access
from transformers import pipeline

app = Flask(__name__)
CORS(app)  # ✅ Enable CORS for all origins

# Load toxic comment classification pipeline
classifier = pipeline("text-classification", model="unitary/toxic-bert")

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    text = data.get('text', '')

    if not text:
        return jsonify({"error": "No text provided"}), 400

    result = classifier(text)[0]
    score = int(result['score'] * 100)
    label = result['label']

    return jsonify({
        "risk_score": score,
        "label": label
    })

if __name__ == '__main__':
    print("Device set to use cpu")
    app.run(debug=True, port=5000)
