import uuid
from src.extensions import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    username = db.Column(db.String(255))
    email = db.Column(db.String(255), unique=True, nullable=False)
    verified = db.Column(db.Boolean)
    password = db.Column(db.String(255))
    verification_code = db.Column(db.String(255))
    avatar_url = db.Column(db.String(255))
    role = db.Column(db.Integer)
    phone = db.Column(db.String(20))
    two_factor_auth = db.Column(db.Boolean, default=False)
    two_factor_secret = db.Column(db.String(255))
    refresh_token = db.Column(db.String(255))
    google_id = db.Column(db.String(256))
    last_login_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    cart = db.relationship('Cart', backref='user', lazy=True)
    token = db.relationship('Token', backref='user', lazy=True)
    order = db.relationship('Order', backref='user', lazy=True)
    review = db.relationship('Review', backref='user', lazy=True)