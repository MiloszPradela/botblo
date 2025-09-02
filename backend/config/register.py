from flask import Blueprint, request, jsonify, render_template_string
from .extensions import db
from .models import User
from .send_email import send_registration_email

register_bp = Blueprint('register', __name__)

@register_bp.route('/api/register/request', methods=['POST'])
def register_request():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': 'Email i hasło są wymagane'}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({'message': 'Konto z tym adresem email już istnieje.'}), 409
    
    new_user = User(email=email, approved=False)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    send_registration_email(email)
    
    return jsonify({'message': 'Prośba o rejestrację została wysłana.'}), 200

@register_bp.route('/api/register/approve')
def approve_user():
    email = request.args.get('email')
    user = User.query.filter_by(email=email).first()
    if not user:
        return "Użytkownik nie znaleziony.", 404
    user.approved = True
    db.session.commit()
    return render_template_string("<h1>Sukces!</h1><p>Użytkownik <b>{{email}}</b> został zatwierdzony.</p>", email=email), 200

@register_bp.route('/api/register/deny')
def deny_user():
    email = request.args.get('email')
    user = User.query.filter_by(email=email).first()
    if not user:
        return "Użytkownik nie znaleziony.", 404
    db.session.delete(user)
    db.session.commit()
    return render_template_string("<h1>Sukces</h1><p>Prośba odrzucona.</p>"), 200
