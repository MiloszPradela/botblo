from flask import Blueprint, request, jsonify
from .extensions import db
from .models import User
from flask_jwt_extended import create_access_token

login_bp = Blueprint('login', __name__)

# Usunęliśmy /api z tej ścieżki, ponieważ jest dodawane globalnie w app.py
@login_bp.route("/login", methods=["POST"])
def login():
    # Sprawdzamy, czy żądanie zawiera poprawne dane JSON
    data = request.get_json()
    if not data:
        return jsonify({"message": "Brak danych w żądaniu lub nieprawidłowy format (Content-Type)."}), 400

    email = data.get("email")
    password_candidate = data.get("password")

    if not email or not password_candidate:
        return jsonify({"message": "Email i hasło są wymagane."}), 400

    # Szukamy użytkownika w bazie danych
    user = User.query.filter_by(email=email).first()

    # Sprawdzamy, czy użytkownik istnieje ORAZ czy hasło się zgadza
    # Metoda user.check_password() pochodzi z modelu User
    if user and user.check_password(password_candidate):
        # Dodatkowo sprawdzamy, czy konto zostało zatwierdzone przez admina
        if not user.approved:
            return jsonify({"message": "Konto nie zostało jeszcze zatwierdzone przez administratora."}), 403
        
        # Jeśli wszystko się zgadza, tworzymy token JWT
        access_token = create_access_token(identity=email)
        
        # Zwracamy token i status 200 OK
        return jsonify(token=access_token), 200
    
    # Jeśli użytkownik nie istnieje lub hasło jest nieprawidłowe, zwracamy błąd 401
    return jsonify({"message": "Nieprawidłowy e-mail lub hasło."}), 401
