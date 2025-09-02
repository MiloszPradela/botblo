from flask import Blueprint, request, jsonify
from .extensions import db
from .models import User
from flask_jwt_extended import create_access_token

login_bp = Blueprint('login', __name__)

@login_bp.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password_candidate = data.get("password")

    if not email or not password_candidate:
        return jsonify({"message": "Email i hasło są wymagane"}), 400

    user = User.query.filter_by(email=email).first()

    # check_password z models.py
    if user and user.check_password(password_candidate):
        if not user.approved:
            return jsonify({"message": "Konto nie zostało jeszcze zatwierdzone."}), 403
        
        access_token = create_access_token(identity=email)
        return jsonify(token=access_token)
    
    return jsonify({"message": "Nieprawidłowy login lub hasło"}), 401
