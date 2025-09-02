from flask import render_template_string
from flask_mail import Message
from .extensions import mail
import os

def send_registration_email(user_email):
    admin_email = os.getenv('ADMIN_EMAIL')
    if not admin_email:
        print("Błąd: ADMIN_EMAIL nie jest ustawiony w .env")
        return

    msg = Message("Nowa prośba o rejestrację w BotBlo", recipients=[admin_email])
    msg.html = render_template_string("""
        <h3>Nowy użytkownik prosi o dostęp do aplikacji BotBlo.</h3>
        <p><b>Email użytkownika:</b> {{ email }}</p>
        <p style="margin-top: 20px;">
            <a href="{{ approve_url }}" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-right: 10px;">
                Zatwierdź
            </a>
            <a href="{{ deny_url }}" style="background-color: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                Odrzuć
            </a>
        </p>
    """, email=user_email, 
       approve_url=f"http://localhost:5000/api/register/approve?email={user_email}",
       deny_url=f"http://localhost:5000/api/register/deny?email={user_email}")
    
    try:
        mail.send(msg)
        print(f"Wysłano prośbę o aktywację dla {user_email} na adres {admin_email}")
    except Exception as e:
        print(f"Błąd podczas wysyłania e-maila: {e}")
