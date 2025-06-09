import uuid
from datetime import datetime, timezone
from src.models.cart import Cart, CartItem
from src.models.user import User
from src.extensions import db
from src.constants.constants import CONSTANT

class CartController:
    @staticmethod
    def get_cart(user_id: str) -> dict:
        """
        Retrieves a user's cart.
        
        Args:
            user_id (str): The ID of the user.
        
        Returns:
            dict: Cart data.
        
        Raises:
            ValueError: If cart or user not found.
        """
        user = User.query.get(user_id)
        if not user:
            raise ValueError(CONSTANT['NETWORK_STATUS_MESSAGE']['UNAUTHORIZED'])

        cart = Cart.query.filter_by(user_id=user_id).first()
        print(f"Cart for user {user_id}: {cart.id if cart else 'No cart found'}")
        items = CartItem.query.filter_by(cart_id=cart.id).all() if cart else []
        print(f"Cart items for user {user_id}: {[item.name for item in items]}")
        if not cart:
            raise ValueError(CONSTANT['NETWORK_STATUS_MESSAGE']['NOT_FOUND'])

        return {
            'id': cart.id,
            'user_id': cart.user_id,
            'items': [{
                'id': item.id,
                'product_id': item.product_id,
                'name': item.name,
                'quantity': item.quantity,
                'image': item.image,
                'price': item.price
            } for item in items],
        }

    @staticmethod
    def add_to_cart(user_id: str, body: dict, product_id: str) -> dict:
        """
        Adds an item to the user's cart.
        
        Args:
            user_id (str): The ID of the user.
            body (dict): Cart item details.
            product_id (str): The ID of the product.
        
        Returns:
            dict: Updated cart data.
        
        Raises:
            ValueError: If user not found or validation fails.
        """
        user = User.query.get(user_id)
        if not user:
            raise ValueError(CONSTANT['NETWORK_STATUS_MESSAGE']['UNAUTHORIZED'])

        cart = Cart.query.filter_by(user_id=user_id).first()
        if cart:
            existing_item = CartItem.query.filter_by(cart_id=cart.id, product_id=product_id).first()
            if existing_item:
                existing_item.quantity += 1
                existing_item.updated_at = datetime.now(tz=timezone.utc)
                db.session.commit()
            else:
                new_item = CartItem(
                    id=str(uuid.uuid4()),
                    cart_id=cart.id,
                    product_id=product_id,
                    name=body['name'],
                    quantity=body['quantity'],
                    image=body['image'],
                    price=body['price'],
                )
                db.session.add(new_item)
                db.session.commit()
        else:
            cart = Cart(
                id=str(uuid.uuid4()),
                user_id=user_id,
            )
            db.session.add(cart)
            db.session.commit()

            new_item = CartItem(
                id=str(uuid.uuid4()),
                cart_id=cart.id,
                product_id=product_id,
                name=body['name'],
                quantity=body['quantity'],
                image=body['image'],
                price=body['price']
            )
            db.session.add(new_item)
            db.session.commit()

        updated_cart = Cart.query.filter_by(user_id=user_id).first()
        return {
            'id': updated_cart.id,
            'user_id': updated_cart.user_id,
            'cart': [{
                'id': item.id,
                'product_id': item.product_id,
                'name': item.name,
                'quantity': item.quantity,
                'image': item.image,
                'price': item.price
            } for item in updated_cart.items],
        }

    @staticmethod
    def remove_item(user_id: str, product_id: str) -> dict:
        """
        Removes an item from the user's cart.
        
        Args:
            user_id (str): The ID of the user.
            product_id (str): The ID of the product to remove.
        
        Returns:
            dict: Updated cart data.
        
        Raises:
            ValueError: If user, cart, or item not found.
        """
        user = User.query.get(user_id)
        if not user:
            raise ValueError(CONSTANT['NETWORK_STATUS_MESSAGE']['UNAUTHORIZED'])

        cart = Cart.query.filter_by(user_id=user_id).first()
        if not cart:
            raise ValueError(CONSTANT['NETWORK_STATUS_MESSAGE']['NOT_FOUND'])

        item = CartItem.query.filter_by(cart_id=cart.id, product_id=product_id).first()
        if not item:
            raise ValueError("Item not found in the cart")

        db.session.delete(item)
        db.session.commit()

        updated_cart = Cart.query.filter_by(user_id=user_id).first()
        return {
            'id': updated_cart.id if updated_cart else None,
            'user_id': user_id,
            'cart': [{
                'id': item.id,
                'product_id': item.product_id,
                'name': item.name,
                'quantity': item.quantity,
                'image': item.image,
                'price': item.price
            } for item in updated_cart.items] if updated_cart else []
        }