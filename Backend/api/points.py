from flask import Blueprint, request, jsonify
from api.db import mongo  # Import `mongo` from `db.py`
import logging

points_bp = Blueprint("points", __name__)

PREDEFINED_EVENTS = {
    "General Body Meeting (GBM)": 10,
    "Workshop": 15,
    "Volunteer Event": 20,
    "Social Event": 5
}

EXTRA_POINTS_FOR_PICTURE = 5

@points_bp.route('/process-sheet', methods=['POST'])
def process_google_sheet():
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    try:
        import pandas as pd
        df = pd.read_csv(file)

        for _, row in df.iterrows():
            email = row.get("PSU Email", "").strip()
            event_name = row.get("Event Name", "").strip()
            picture_submission = row.get("Take a picture with your Big Brother/Sister (fc)", "").strip()

            if not email or "@" not in email:
                continue

            member = mongo.db.members.find_one({"email": email})
            if not member:
                continue

            event_points = PREDEFINED_EVENTS.get(event_name, 0)
            if picture_submission:
                event_points += EXTRA_POINTS_FOR_PICTURE

            mongo.db.members.update_one(
                {"email": email},
                {"$inc": {"points": event_points}}
            )

        return jsonify({"message": "Points processed and updated successfully"}), 200

    except Exception as e:
        logging.error(f"Error processing Google Sheet: {e}")
        return jsonify({"error": "Failed to process sheet"}), 500