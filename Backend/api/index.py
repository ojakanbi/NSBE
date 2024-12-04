from api.db import app  # Import the app initialized in `db.py`
from flask_cors import CORS
from api.members import members_bp
from api.points import points_bp
from api.scholarships import scholarships_bp
import logging
import os

# CORS Configuration
allowed_origins = [
    "https://nsbe-frontend-1.vercel.app",
    "http://localhost:3000"
]
CORS(app, resources={r"/*": {"origins": allowed_origins}})

# Logging Setup
logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

# Register Blueprints
app.register_blueprint(members_bp, url_prefix="/api/members")
app.register_blueprint(points_bp, url_prefix="/api/points")
app.register_blueprint(scholarships_bp, url_prefix="/api/scholarships")

# Root Route
@app.route('/', methods=['GET'])
def home():
    return {"message": "Welcome to the NSBE Backend!"}, 200

# Run the app
if __name__ == '__main__':
    is_debug = os.getenv("FLASK_ENV") == "development"
    app.run(debug=is_debug, port=8000)