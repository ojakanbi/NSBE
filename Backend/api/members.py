from flask import Blueprint, request, jsonify
from api.db import mongo  # Import `mongo` from `db.py`
import logging

members_bp = Blueprint("members", __name__)

@members_bp.route('/', methods=['GET'])
def get_all_members():
    try:
        members = list(mongo.db.members.find())
        for member in members:
            member["_id"] = str(member["_id"])
        return jsonify({"members": members}), 200
    except Exception as e:
        logging.error(f"Error fetching members: {e}")
        return jsonify({"error": "Could not fetch members"}), 500

@members_bp.route('/<email>', methods=['GET'])
def get_member_by_email(email):
    try:
        member = mongo.db.members.find_one({"email": email})
        if not member:
            return jsonify({"error": "Member not found"}), 404
        member["_id"] = str(member["_id"])
        return jsonify({"member": member}), 200
    except Exception as e:
        logging.error(f"Error fetching member: {e}")
        return jsonify({"error": "Could not fetch member"}), 500

@members_bp.route('/add', methods=['POST'])
def add_member():
    data = request.json
    required_fields = ["email", "first_name", "last_name"]

    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    if mongo.db.members.find_one({"email": data["email"]}):
        return jsonify({"error": "Member already exists"}), 400

    member = {
        "email": data["email"],
        "first_name": data["first_name"],
        "last_name": data["last_name"],
        "points": 0
    }

    try:
        mongo.db.members.insert_one(member)
        return jsonify({"message": "Member added successfully"}), 201
    except Exception as e:
        logging.error(f"Error adding member: {e}")
        return jsonify({"error": "Could not add member"}), 500