from flask import Blueprint, request, jsonify, render_template_string, current_app
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadSignature
from flask_mail import Message 
from .extensions import db, mail
from .models import User

password_reset_bp = Blueprint('password_reset', __name__)

def send_password_reset_email(user):
    """Generuje token i wysyła e-mail z linkiem do resetu hasła."""
    secret_key = current_app.config.get("JWT_SECRET_KEY")
    if not secret_key:
        print("KRYTYCZNY BŁĄD: Brak JWT_SECRET_KEY w konfiguracji aplikacji. Nie można wygenerować tokenu.")
        return

    s = URLSafeTimedSerializer(secret_key)
    token = s.dumps(user.email, salt='password-reset-salt')
    
    # URL wskazuje na ścieżkę w Twojej aplikacji frontendowej
    reset_url = f"http://localhost:5173/reset-password/{token}"
    
    msg = Message("Reset hasła - BotBlo", recipients=[user.email])
    
    html_template = """
        <h3>Otrzymaliśmy prośbę o zresetowanie hasła do Twojego konta.</h3>
        <p>Kliknij poniższy link, aby ustawić nowe hasło. Link jest ważny przez 1 godzinę.</p>
        <p style="text-align: center; margin: 20px 0;">
            <a href="{{ reset_url }}" style="background-color: #007BFF; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 16px;">
                Resetuj hasło
            </a>
        </p>
        <p>Jeśli nie prosiłeś/aś o reset hasła, po prostu zignoruj tę wiadomość.</p>
    """
    msg.html = render_template_string(html_template, reset_url=reset_url)
    
    try:
        mail.send(msg)
        print(f"Wysłano link do resetu hasła na adres {user.email}")
    except Exception as e:
        print(f"Błąd podczas wysyłania e-maila do resetu hasła dla {user.email}: {e}")

@password_reset_bp.route('/password/request-reset', methods=['POST'])
def request_password_reset():
    data = request.get_json()
    if not data or 'email' not in data:
        return jsonify({'message': 'Adres e-mail jest wymagany.'}), 400

    email = data['email']
    user = User.query.filter_by(email=email).first()
    
    # Ze względów bezpieczeństwa, zawsze zwracamy ten sam komunikat,
    # aby nie ujawniać, czy dany e-mail istnieje w bazie.
    if user:
        send_password_reset_email(user)
            
    return jsonify({'message': 'Jeśli konto o podanym adresie e-mail istnieje w naszej bazie, wysłano na nie link do resetu hasła.'}), 200

@password_reset_bp.route('/password/reset', methods=['POST'])
def perform_password_reset():
    data = request.get_json()
    if not data:
        return jsonify({'message': 'Brak danych w żądaniu.'}), 400
        
    token = data.get('token')
    new_password = data.get('password')

    if not token or not new_password:
        return jsonify({'message': 'Token i nowe hasło są wymagane.'}), 400

    secret_key = current_app.config.get("JWT_SECRET_KEY")
    s = URLSafeTimedSerializer(secret_key)
    
    try:
        # Sprawdzamy ważność tokenu (maksymalnie 1 godzina = 3600 sekund)
        email = s.loads(token, salt='password-reset-salt', max_age=3600)
    except SignatureExpired:
        return jsonify({'message': 'Link do resetowania hasła wygasł. Poproś o nowy.'}), 400
    except BadSignature:
        return jsonify({'message': 'Link do resetowania hasła jest nieprawidłowy lub został już użyty.'}), 400
    except Exception:
        return jsonify({'message': 'Wystąpił nieoczekiwany błąd podczas weryfikacji tokenu.'}), 500

    user = User.query.filter_by(email=email).first()
    if not user:
        # Ten przypadek jest mało prawdopodobny, ale warto go obsłużyć
        return jsonify({'message': 'Użytkownik powiązany z tym tokenem już nie istnieje.'}), 404
    
    user.set_password(new_password)
    db.session.commit()
    
    return jsonify({'message': 'Twoje hasło zostało pomyślnie zresetowane.'}), 200
