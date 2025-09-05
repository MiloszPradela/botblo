from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from .extensions import db
from .models import User, WordPressSite

sites_bp = Blueprint('sites', __name__)

# endpointy
@sites_bp.route('/sites', methods=['GET'])
@jwt_required()
def get_sites():
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first_or_404()
    sites = WordPressSite.query.filter_by(user_id=user.id).all()
    
    return jsonify([{
        "id": site.id,
        "name": site.name,
        "url": site.url
    } for site in sites])

@sites_bp.route('/sites', methods=['POST'])
@jwt_required()
def add_site():
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first_or_404()
    data = request.get_json()

    # Tworzymy obiekt, przypisując hasło bezpośrednio jako czysty tekst.
    new_site = WordPressSite(
        name=data['name'],
        url=data['url'],
        username=data['username'],
        password=data['password'], # Bezpośrednie przypisanie bez szyfrowania
        user_id=user.id
    )
    
    db.session.add(new_site)
    db.session.commit()
    
    return jsonify({"message": "Strona została pomyślnie dodana.", "id": new_site.id}), 201

@sites_bp.route('/sites/<int:site_id>', methods=['DELETE'])
@jwt_required()
def delete_site(site_id):
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first_or_404()
    
    site = WordPressSite.query.filter_by(id=site_id, user_id=user.id).first()
    
    if not site:
        return jsonify({"message": "Nie znaleziono strony lub nie masz do niej uprawnień."}), 404
        
    db.session.delete(site)
    db.session.commit()
    
    return jsonify({"message": "Strona została pomyślnie usunięta."}), 200

@sites_bp.route('/sites/<int:site_id>', methods=['PUT'])
@jwt_required()
def update_site(site_id):
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first_or_404()
    
    site = WordPressSite.query.filter_by(id=site_id, user_id=user.id).first_or_404()
    
    data = request.get_json()
    
    site.name = data.get('name', site.name)
    site.url = data.get('url', site.url)
    site.username = data.get('username', site.username)
    
    # Jeśli hasło jest aktualizowane, również przypisujemy je bezpośrednio.
    if 'password' in data and data['password']:
        site.password = data['password']
        
    db.session.commit()
    
    return jsonify({"message": "Dane strony zostały zaktualizowane."}), 200
