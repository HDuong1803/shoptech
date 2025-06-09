import uuid
from src.extensions import db

class Cart(db.Model):
    __tablename__ = 'carts'
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    items = db.relationship('CartItem', backref='cart', lazy=True)

class CartItem(db.Model):
    __tablename__ = 'cart_items'
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    product_id = db.Column(db.String(36))
    name = db.Column(db.String(255))
    quantity = db.Column(db.Integer)
    image = db.Column(db.String(255))
    price = db.Column(db.Float)
    cart_id = db.Column(db.String(36), db.ForeignKey('carts.id'), nullable=False)