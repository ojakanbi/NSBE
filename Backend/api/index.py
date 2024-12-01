from flask import Flask, jsonify, request
from flask_cors import CORS
try:
    from scholarship import NSBEScholarshipsJVL  # Absolute import for local testing
except ImportError:
    from .scholarship import NSBEScholarshipsJVL  # Relative import for deployment
from dotenv import load_dotenv
import os
import logging

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["https://nsbe-frontend-1.vercel.app"])


urls = [
    "https://jlvcollegecounseling.com/scholarships/september-scholarships/",
    "https://jlvcollegecounseling.com/scholarships/october-scholarships/",
    "https://jlvcollegecounseling.com/scholarships/november-scholarships/",
    "https://jlvcollegecounseling.com/scholarships/december-scholarships/"
]


logging.basicConfig(level=logging.DEBUG)

@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "Welcome to the backend!"}), 200

@app.route('/api/scholarships', methods=['GET'])
def get_scholarships():
    try:
        logging.info("Starting the scraper...")
        scraper = NSBEScholarshipsJVL(urls)
        all_scholarships = scraper.run()
        logging.info("Scraper completed successfully.")
        return jsonify(all_scholarships)
    except Exception as e:
        logging.error(f"Error in scraper: {e}")
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    is_debug = os.getenv("FLASK_ENV") == "development"
    app.run(debug=is_debug, port=8000)