import uuid
from src.extensions import db

class Product(db.Model):
    __tablename__ = 'products'
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(255))
    image = db.Column(db.String(255))
    brand = db.Column(db.String(255))
    category = db.Column(db.String(255))
    description = db.Column(db.Text)
    rating = db.Column(db.Float, default=0)
    num_reviews = db.Column(db.Integer, default=0)
    price = db.Column(db.Float)
    count_in_stock = db.Column(db.Integer)
    reviews = db.relationship('Review', backref='product', lazy=True)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

class Review(db.Model):
    __tablename__ = 'reviews'
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'))
    rating = db.Column(db.Float)
    comment = db.Column(db.Text)
    product_id = db.Column(db.String(36), db.ForeignKey('products.id'))
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())