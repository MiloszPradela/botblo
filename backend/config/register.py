from flask import Blueprint, request, jsonify, render_template_string, url_for
from .extensions import db
from .models import User
from .send_email import send_registration_email

register_bp = Blueprint('register', __name__)

@register_bp.route('/register/request', methods=['POST'])
def register_request():
    data = request.get_json()
    if not data:
        return jsonify({'message': 'Brak danych w żądaniu.'}), 400

    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': 'Email i hasło są wymagane.'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'Konto z tym adresem e-mail już istnieje.'}), 409
    
    try:
        new_user = User(email=email, approved=False)
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()

        send_registration_email(email)
        
        return jsonify({'message': 'Prośba o rejestrację została pomyślnie wysłana do administratora.'}), 201

    except Exception as e:
        db.session.rollback()
        print(f"Błąd podczas tworzenia użytkownika: {e}")
        return jsonify({'message': 'Wystąpił wewnętrzny błąd serwera.'}), 500

@register_bp.route('/register/approve')
def approve_user():
    email = request.args.get('email')
    if not email:
        return "Brak adresu email w zapytaniu.", 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return "Użytkownik nie znaleziony.", 404
        
    user.approved = True
    db.session.commit()
    return render_template_string("<h1>Sukces!</h1><p>Konto dla użytkownika <b>{{email}}</b> zostało zatwierdzone.</p>", email=email), 200

@register_bp.route('/register/deny')
def deny_user():
    email = request.args.get('email')
    if not email:
        return "Brak adresu email w zapytaniu.", 400
        
    user = User.query.filter_by(email=email).first()
    if not user:
        return "Użytkownik nie znaleziony.", 404
        
    db.session.delete(user)
    db.session.commit()
    return render_template_string("<h1>Potwierdzenie</h1><p>Prośba o rejestrację dla użytkownika <b>{{email}}</b> została odrzucona, a konto usunięte.</p>", email=email), 200

