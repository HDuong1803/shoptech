import uuid
from src.extensions import db
from datetime import datetime

class Token(db.Model):
    __tablename__ = 'tokens'
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    token = db.Column(db.String(255), unique=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), unique=True, nullable=False)