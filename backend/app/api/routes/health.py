from flask import Blueprint, jsonify
from flask_cors import cross_origin

health_bp = Blueprint('health', __name__)

@health_bp.route('/health', methods=['GET', 'OPTIONS'])
@cross_origin()
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "ok"}), 200