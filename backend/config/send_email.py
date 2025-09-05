from flask import render_template_string, url_for
from flask_mail import Message
from .extensions import mail
import os

def send_registration_email(user_email):
    """Wysyła e-mail do administratora z prośbą o zatwierdzenie nowego użytkownika."""
    admin_email = os.getenv('ADMIN_EMAIL')
    if not admin_email:
        print("KRYTYCZNY BŁĄD: Zmienna środowiskowa ADMIN_EMAIL nie jest ustawiona.")
        return

    approve_url = url_for('register.approve_user', email=user_email, _external=True)
    deny_url = url_for('register.deny_user', email=user_email, _external=True)

    msg = Message("Nowa prośba o rejestrację w BotBlo", recipients=[admin_email])
    
    html_template = """
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
    """

    msg.html = render_template_string(html_template, 
                                      email=user_email, 
                                      approve_url=approve_url,
                                      deny_url=deny_url)
    
    try:
        mail.send(msg)
        print(f"Wysłano prośbę o aktywację dla {user_email} na adres administratora {admin_email}")
    except Exception as e:
        print(f"Błąd podczas wysyłania e-maila aktywacyjnego: {e}")

