from flask import Blueprint, request, jsonify, render_template_string, current_app
from itsdangerous import URLSafeTimedSerializer
from flask_mail import Message 
from .extensions import db, mail
from .models import User
import os

password_reset_bp = Blueprint('password_reset', __name__)

def send_password_reset_email(user):
    secret_key = current_app.config.get("JWT_SECRET_KEY")
    s = URLSafeTimedSerializer(secret_key)
    token = s.dumps(user.email, salt='password-reset-salt')
    
    reset_url = f"http://localhost:5173/reset-password/{token}"
    
    msg = Message("Reset hasła - BotBlo", recipients=[user.email])
    msg.html = render_template_string("""
        <h3>Otrzymaliśmy prośbę o zresetowanie hasła do Twojego konta.</h3>
        <p>Kliknij poniższy link, aby ustawić nowe hasło. Link jest ważny przez 1 godzinę.</p>
        <p>
            <a href="{{ reset_url }}" style="background-color: #007BFF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                Resetuj hasło
            </a>
        </p>
        <p>Jeśli nie prosiłeś o reset hasła, zignoruj tę wiadomość.</p>
    """, reset_url=reset_url)
    
    mail.send(msg)

@password_reset_bp.route('/api/password/request-reset', methods=['POST'])
def request_reset():
    data = request.get_json()
    email = data.get('email')
    
    user = User.query.filter_by(email=email).first()
    
    if user:
        send_password_reset_email(user)
            
    return jsonify({'message': 'Jeśli konto o podanym adresie e-mail istnieje, wysłano na nie link do resetu hasła.'}), 200

@password_reset_bp.route('/api/password/reset', methods=['POST'])
def reset_password():
    data = request.get_json()
    token = data.get('token')
    new_password = data.get('password')

    secret_key = current_app.config.get("JWT_SECRET_KEY")
    s = URLSafeTimedSerializer(secret_key)
    try:
        email = s.loads(token, salt='password-reset-salt', max_age=3600)
    except:
        return jsonify({'message': 'Link do resetowania hasła jest nieprawidłowy lub wygasł.'}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'message': 'Nie znaleziono użytkownika.'}), 404
    
    #  metoda set_password z models.py
    user.set_password(new_password)
    db.session.commit()
    
    return jsonify({'message': 'Hasło zostało pomyślnie zresetowane.'}), 200
