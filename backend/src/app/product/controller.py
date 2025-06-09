import uuid
from datetime import datetime, timezone
import arweave
from arweave.arweave_lib import Wallet, Transaction
import json
from src.models.product import Product, Review
from src.models.user import User
from src.extensions import db
from src.constants.constants import CONSTANT
import requests

class ProductController:
    @staticmethod
    def add_product_item(body: dict) -> dict:
        """
        Adds a new product item.
        
        Args:
            body (dict): Product details.
        
        Returns:
            dict: Created product data.
        """
        print("Adding product item with body:", body)
        new_product = Product(
            id=str(uuid.uuid4()),
            name=body['name'],
            image=body['image'],
            brand=body['brand'],
            category=body['category'],
            description=body['description'],
            rating=0.0,
            num_reviews=0,
            price=body['price'],
            count_in_stock=body['count_in_stock'],
            created_at=datetime.now(tz=timezone.utc),
            updated_at=datetime.now(tz=timezone.utc)
        )
        db.session.add(new_product)
        db.session.commit()

        return {
            'id': new_product.id,
            'name': new_product.name,
            'image': new_product.image,
            'brand': new_product.brand,
            'category': new_product.category,
            'description': new_product.description,
            'rating': new_product.rating,
            'num_reviews': new_product.num_reviews,
            'price': new_product.price,
            'count_in_stock': new_product.count_in_stock,
            'reviews': [],
            'created_at': new_product.created_at,
            'updated_at': new_product.updated_at
        }

    @staticmethod
    def upload_images(image_data: bytes, content_type: str) -> list:
        try:
            file_name = f"product_image_{uuid.uuid4()}.jpg"
    
            files = {
                'file': (file_name, image_data, content_type)  # key là 'file'
            }
            data = {
                'provider': 'ARWEAVE_STORAGE'
            }
    
            headers = {
                'accept': '*/*'
            }
    
            response = requests.post(
                # "http://localhost:8080/api/file",
                "http://13.230.133.95:4040/api/file",
                files=files,
                data=data,
                headers=headers,
                timeout=10
            )
            response.raise_for_status()
            json_data = response.json()
            file_url = json_data["data"]["url"]
            return file_url
        except requests.RequestException as e:
            print(f"Local upload failed: {e}")
            return []

    @staticmethod
    def remove_item(id: str) -> str:
        """
        Removes a product item.
        
        Args:
            id (str): Product ID.
        
        Returns:
            str: Success message.
        
        Raises:
            ValueError: If product not found.
        """
        product = Product.query.get(id)
        if product:
            db.session.delete(product)
            db.session.commit()
            return CONSTANT['NETWORK_STATUS_MESSAGE']['SUCCESS']
        raise ValueError(CONSTANT['NETWORK_STATUS_MESSAGE']['NOT_FOUND'])

    @staticmethod
    def update_item(body: dict, id: str) -> dict:
        """
        Updates a product item.
        
        Args:
            body (dict): Updated product details.
            id (str): Product ID.
        
        Returns:
            dict: Updated product data.
        
        Raises:
            ValueError: If product not found.
        """
        product = Product.query.get(id)
        if product:
            product.name = body.get('name', product.name)
            product.image = body.get('image', product.image)
            product.brand = body.get('brand', product.brand)
            product.category = body.get('category', product.category)
            product.description = body.get('description', product.description)
            product.price = body.get('price', product.price)
            product.count_in_stock = body.get('count_in_stock', product.count_in_stock)
            product.updated_at = datetime.now(tz=timezone.utc)
            db.session.commit()

            return {
                'id': product.id,
                'name': product.name,
                'image': product.image,
                'brand': product.brand,
                'category': product.category,
                'description': product.description,
                'rating': product.rating,
                'num_reviews': product.num_reviews,
                'price': product.price,
                'count_in_stock': product.count_in_stock,
                'reviews': [{
                    'id': review.id,
                    'user_id': review.user_id,
                    'rating': review.rating,
                    'comment': review.comment,
                    'product_id': review.product_id,
                    'created_at': review.created_at,
                    'updated_at': review.updated_at
                } for review in product.reviews],
                'created_at': product.created_at,
                'updated_at': product.updated_at
            }
        raise ValueError(CONSTANT['NETWORK_STATUS_MESSAGE']['NOT_FOUND'])

    @staticmethod
    def get_list_product(page: int = 1, limit: int = 5) -> dict:
        """
        Retrieves a list of products with pagination.
        
        Args:
            page (int): Page number.
            limit (int): Number of products per page.
        
        Returns:
            dict: List of products and total count.
        """
        offset = (page - 1) * limit
        products = Product.query.order_by(Product.rating.desc(), Product.num_reviews.desc()).offset(offset).limit(limit).all()
        total = Product.query.count()

        return {
            'data': [{
                'id': p.id,
                'name': p.name,
                'image': p.image,
                'brand': p.brand,
                'category': p.category,
                'description': p.description,
                'rating': p.rating,
                'numReviews': p.num_reviews,
                'price': p.price,
                'count_in_stock': p.count_in_stock,
                'reviews': [{
                    'id': r.id,
                    'user_id': r.user_id,
                    'rating': r.rating,
                    'comment': r.comment,
                    'product_id': r.product_id,
                    'created_at': r.created_at,
                    'updated_at': r.updated_at
                } for r in p.reviews],
                'created_at': p.created_at,
                'updated_at': p.updated_at
            } for p in products],
            'total': total
        }

    @staticmethod
    def get_product_by_id(id: str) -> dict:
        """
        Retrieves a product by ID.
        
        Args:
            id (str): Product ID.
        
        Returns:
            dict: Product data.
        
        Raises:
            ValueError: If product not found.
        """
        product = Product.query.get(id)
        if product:
            return {
                'id': product.id,
                'name': product.name,
                'image': product.image,
                'brand': product.brand,
                'category': product.category,
                'description': product.description,
                'rating': product.rating,
                'numReviews': product.num_reviews,
                'price': product.price,
                'count_in_stock': product.count_in_stock,
                'reviews': [{
                    'id': r.id,
                    'user_id': r.user_id,
                    'rating': r.rating,
                    'comment': r.comment,
                    'product_id': r.product_id,
                    'created_at': r.created_at,
                    'updated_at': r.updated_at
                } for r in product.reviews],
                'created_at': product.created_at,
                'updated_at': product.updated_at
            }
        raise ValueError(CONSTANT['NETWORK_STATUS_MESSAGE']['NOT_FOUND'])

    @staticmethod
    def search_product_item(keyword: str) -> dict:
        """
        Searches for products by keyword.
        
        Args:
            keyword (str): Search keyword.
        
        Returns:
            dict: Search results.
        
        Raises:
            ValueError: If no products found.
        """
        products = Product.query.filter(Product.name.ilike(f'%{keyword}%')).all()
        if products:
            return {
                'data': [{
                    'id': p.id,
                    'name': p.name,
                    'image': p.image,
                    'brand': p.brand,
                    'category': p.category,
                    'description': p.description,
                    'rating': p.rating,
                    'numReviews': p.num_reviews,
                    'price': p.price,
                    'count_in_stock': p.count_in_stock,
                    'reviews': [{
                        'id': r.id,
                        'user_id': r.user_id,
                        'rating': r.rating,
                        'comment': r.comment,
                        'product_id': r.product_id,
                        'created_at': r.created_at,
                        'updated_at': r.updated_at
                    } for r in p.reviews],
                    'created_at': p.created_at,
                    'updated_at': p.updated_at
                } for p in products]
            }
        raise ValueError(CONSTANT['NETWORK_STATUS_MESSAGE']['NOT_FOUND'])

    @staticmethod
    def add_product_review(body: dict, product_id: str, user_id: str) -> dict:
        """
        Adds a review for a product.
        
        Args:
            body (dict): Review details.
            product_id (str): Product ID.
            user_id (str): User ID.
        
        Returns:
            dict: Added review data.
        
        Raises:
            ValueError: If product/user not found or review exists.
        """
        product = Product.query.get(product_id)
        user = User.query.get(user_id)

        if not product:
            raise ValueError(CONSTANT['NETWORK_STATUS_MESSAGE']['NOT_FOUND'])
        if not user:
            raise ValueError(CONSTANT['NETWORK_STATUS_MESSAGE']['UNAUTHORIZED'])

        existing_review = Review.query.filter_by(user_id=user_id, product_id=product_id).first()
        if existing_review:
            raise ValueError(CONSTANT['NETWORK_STATUS_MESSAGE']['ALREADY_EXISTS'])

        new_review = Review(
            id=str(uuid.uuid4()),
            user_id=user_id,
            product_id=product_id,
            rating=body['rating'],
            comment=body['comment'],
            created_at=datetime.now(tz=timezone.utc),
            updated_at=datetime.now(tz=timezone.utc)
        )
        db.session.add(new_review)

        reviews = Review.query.filter_by(product_id=product_id).all()
        total_rating = sum(r.rating for r in reviews)
        avg_rating = total_rating / len(reviews) if reviews else 0.0

        product.rating = avg_rating
        product.num_reviews = len(reviews)
        db.session.commit()

        return {
            'id': new_review.id,
            'user_id': new_review.user_id,
            'rating': new_review.rating,
            'comment': new_review.comment,
            'product_id': new_review.product_id,
            'created_at': new_review.created_at,
            'updated_at': new_review.updated_at
        }