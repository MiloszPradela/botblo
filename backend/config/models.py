from .extensions import db, bcrypt

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.LargeBinary(200), nullable=False) # Musi być LargeBinary
    approved = db.Column(db.Boolean, default=False, nullable=False)

    def set_password(self, password_text):
        self.password = bcrypt.generate_password_hash(password_text.encode('utf-8'))

    def check_password(self, password_text):
        return bcrypt.check_password_hash(self.password, password_text)
