from .extensions import db, bcrypt
from datetime import datetime, timezone

class PasswordManagerMixin:
    """
    Mixin do zarządzania hasłami (hashowanie i sprawdzanie).
    Może być używany przez dowolny model, który potrzebuje bezpiecznego hasła.
    """
    def set_password(self, password_text):
        """Tworzy hash hasła i zapisuje go w polu 'password'."""
        self.password = bcrypt.generate_password_hash(password_text.encode('utf-8'))

    def check_password(self, password_text):
        """Sprawdza, czy podane hasło pasuje do zapisanego hasha."""
        return bcrypt.check_password_hash(self.password, password_text.encode('utf-8'))

class User(db.Model, PasswordManagerMixin):
    """Model reprezentujący użytkownika aplikacji."""
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(80), nullable=True)
    password = db.Column(db.LargeBinary(200), nullable=False)
    approved = db.Column(db.Boolean, default=False, nullable=False)
    registration_token = db.Column(db.String(128), unique=True, nullable=True)
    sites = db.relationship('WordPressSite', backref='user', lazy=True, cascade="all, delete-orphan")
    published_posts = db.relationship('PublishedPost', backref='author', lazy=True, cascade="all, delete-orphan")

class WordPressSite(db.Model):
    """Model reprezentujący zapisaną stronę WordPress."""
    __tablename__ = 'word_press_site'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    url = db.Column(db.String(255), nullable=False, unique=True)
    username = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(255), nullable=False)
    
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

class PublishedPost(db.Model):
    """Model reprezentujący wpis opublikowany przez bota."""
    __tablename__ = 'published_post'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    post_url = db.Column(db.String(512), nullable=False)
    domain = db.Column(db.String(255), nullable=False)
    published_at = db.Column(db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
    
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
