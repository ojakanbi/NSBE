from flask import Flask, jsonify, request
from flask_cors import CORS
from scholarship import NSBEScholarshipsJVL  # Import the scraper class
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["https://frontend-nsbe-1.vercel.app"])


urls = [
    "https://jlvcollegecounseling.com/scholarships/january-scholarships/",
    "https://jlvcollegecounseling.com/scholarships/february-scholarships/",
    "https://jlvcollegecounseling.com/scholarships/march-scholarships/",
    "https://jlvcollegecounseling.com/scholarships/april-scholarships/",
    "https://jlvcollegecounseling.com/scholarships/may-scholarships/",
    "https://jlvcollegecounseling.com/scholarships/june-scholarships/",
    "https://jlvcollegecounseling.com/scholarships/july-scholarships/",
    "https://jlvcollegecounseling.com/scholarships/august-scholarships/",
    "https://jlvcollegecounseling.com/scholarships/september-scholarships/",
    "https://jlvcollegecounseling.com/scholarships/october-scholarships/",
    "https://jlvcollegecounseling.com/scholarships/november-scholarships/",
    "https://jlvcollegecounseling.com/scholarships/december-scholarships/"
]

import logging
logging.basicConfig(level=logging.DEBUG)

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