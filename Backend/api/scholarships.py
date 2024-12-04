from flask import Blueprint, jsonify
import logging
from api.scholarship import NSBEScholarshipsJVL

scholarships_bp = Blueprint("scholarships", __name__)

urls = [
    "https://jlvcollegecounseling.com/scholarships/september-scholarships/",
    "https://jlvcollegecounseling.com/scholarships/october-scholarships/",
    "https://jlvcollegecounseling.com/scholarships/november-scholarships/",
    "https://jlvcollegecounseling.com/scholarships/december-scholarships/"
]

@scholarships_bp.route('/', methods=['GET'])
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