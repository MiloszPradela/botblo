from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from config.extensions import db, bcrypt, mail, jwt
from config.register import register_bp
from config.login import login_bp
from config.password_reset import password_reset_bp
import os

def create_app():
    load_dotenv()
    app = Flask(__name__)

    # Conf. Aplikacji
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER')
    app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
    app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS', 'True').lower() in ['true', '1', 't']
    app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
    app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
    app.config['MAIL_DEFAULT_SENDER'] = ('BotBlo Admin', os.getenv('MAIL_USERNAME'))
    app.config["JWT_SECRET_KEY"] = "super-secret-key-change-me"

    #  Rozszerzenia 
    db.init_app(app)
    bcrypt.init_app(app)
    mail.init_app(app)
    jwt.init_app(app)
    CORS(app)

    # Moduły
    app.register_blueprint(register_bp)
    app.register_blueprint(login_bp)
    app.register_blueprint(password_reset_bp)
    return app

# Start Aplikacji
if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        db.create_all()
        print("Sprawdzono/utworzono tabele w bazie PostgreSQL.")
    app.run(debug=True, port=5000)
