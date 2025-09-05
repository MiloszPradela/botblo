from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from config.models import User, WordPressSite
from config.bot_blogger.bot_actions import run_bot_to_publish_post

wordpress_bp = Blueprint('wordpress', __name__)

@wordpress_bp.route('/wordpress/posts', methods=['POST'])
@jwt_required()
def create_wordpress_post_endpoint():
    data = request.get_json()
    site_id = data.get('site_id')
    post_data = data.get('post')

    if not all([site_id, post_data]):
        return jsonify({"message": "Brak ID strony lub danych wpisu."}), 400

    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()

    if not user:
        return jsonify({"message": "Użytkownik nie znaleziony."}), 404

    site = WordPressSite.query.filter_by(id=site_id, user_id=user.id).first()
    
    if not site:
        return jsonify({"message": "Nie znaleziono strony lub nie masz do niej uprawnień."}), 404

    result = run_bot_to_publish_post(site, post_data)

    if result.get("success"):
        return jsonify({"message": result.get("message", "Wpis opublikowany pomyślnie.")}), 201
    else:
        error_msg = result.get("message", "Wystąpił nieznany błąd bota.")
        print(f"Błąd bota podczas publikacji na stronie ID {site.id}: {error_msg}")
        return jsonify({"message": str(error_msg)}), 500
