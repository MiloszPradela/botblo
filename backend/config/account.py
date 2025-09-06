# Plik: backend/config/account.py

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from .extensions import db
from .models import User, PublishedPost

account_bp = Blueprint('account', __name__)

@account_bp.route('/account', methods=['GET', 'PUT'])
@jwt_required()
def manage_account():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first_or_404()

    if request.method == 'GET':
        return jsonify({"email": user.email, "username": user.username}), 200

    if request.method == 'PUT':
        data = request.get_json()
        if 'username' in data:
            user.username = data.get('username')
            db.session.commit()
            return jsonify({"message": "Profil został pomyślnie zaktualizowany"}), 200
        if 'currentPassword' in data and 'newPassword' in data:
            if not user.check_password(data.get('currentPassword')):
                return jsonify({"message": "Aktualne hasło jest nieprawidłowe"}), 400
            user.set_password(data.get('newPassword'))
            db.session.commit()
            return jsonify({"message": "Hasło zostało pomyślnie zmienione"}), 200
        return jsonify({"message": "Nieprawidłowe dane w zapytaniu."}), 400

@account_bp.route('/posts', methods=['GET'])
@jwt_required()
def get_user_posts():
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first_or_404()
    posts = PublishedPost.query.filter_by(user_id=user.id).order_by(PublishedPost.published_at.desc()).all()
    posts_data = [{
        "id": post.id, "title": post.title, "published_at": post.published_at.isoformat(),
        "domain": post.domain, "url": post.post_url
    } for post in posts]
    return jsonify(posts_data), 200
