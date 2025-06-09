import uuid
from datetime import datetime, timezone
import stripe
from src.models.order import Order, OrderItem, ShippingAddress, PaymentResult
from src.models.user import User
from src.models.cart import Cart, CartItem
from src.extensions import db
from src.constants.constants import CONSTANT

class OrderController:
    @staticmethod
    def get_list_orders(page: int = 1, limit: int = 5) -> dict:
        """
        Retrieves a list of orders with pagination.
        
        Args:
            page (int): Page number.
            limit (int): Number of orders per page.
        
        Returns:
            dict: List of orders and total count.
        """
        offset = (page - 1) * limit
        orders = Order.query.order_by(Order.id.desc()).offset(offset).limit(limit).all()
        total = Order.query.count()

        return {
            'data': [{
                'id': order.id,
                'user_id': order.user_id,
                'username': order.username,
                'email': order.email,
                'order_items': [{
                    'id': item.id,
                    'product_id': item.product_id,
                    'name': item.name,
                    'quantity': item.quantity,
                    'image': item.image,
                    'price': item.price
                } for item in order.items],
                'shipping_address': {
                    'id': order.shipping_address.id,
                    'address': order.shipping_address.address,
                    'city': order.shipping_address.city,
                    'postal_code': order.shipping_address.postal_code,
                    'country': order.shipping_address.country
                } if order.shipping_address else None,
                'payment_method': order.payment_method,
                'payment_result': {
                    'id': order.payment_result.id,
                    'status': order.payment_result.status,
                    'update_time': order.payment_result.update_time,
                    'email_address': order.payment_result.email_address
                } if order.payment_result else None,
                'shipping_price': order.shipping_price,
                'total_price': order.total_price,
                'is_paid': order.is_paid,
                'paid_at': order.paid_at,
                'is_delivered': order.is_delivered,
                'delivered_at': order.delivered_at,
                'created_at': order.created_at,
                'updated_at': order.updated_at
            } for order in orders],
            'total': total
        }

    @staticmethod
    def get_order(order_id: str) -> dict:
        """
        Retrieves an order by ID.
        
        Args:
            order_id (str): Order ID.
        
        Returns:
            dict: Order data.
        
        Raises:
            ValueError: If order not found.
        """
        order = Order.query.get(order_id)
        if not order:
            raise ValueError(CONSTANT['NETWORK_STATUS_MESSAGE']['NOT_FOUND'])

        return {
            'id': order.id,
            'user_id': order.user_id,
            'username': order.username,
            'email': order.email,
            'order_items': [{
                'id': item.id,
                'product_id': item.product_id,
                'name': item.name,
                'quantity': item.quantity,
                'image': item.image,
                'price': item.price
            } for item in order.items],
            'shipping_address': {
                'id': order.shipping_address.id,
                'address': order.shipping_address.address,
                'city': order.shipping_address.city,
                'postal_code': order.shipping_address.postal_code,
                'country': order.shipping_address.country
            } if order.shipping_address else None,
            'payment_method': order.payment_method,
            'payment_result': {
                'id': order.payment_result.id,
                'status': order.payment_result.status,
                'update_time': order.payment_result.update_time,
                'email_address': order.payment_result.email_address
            } if order.payment_result else None,
            'shipping_price': order.shipping_price,
            'total_price': order.total_price,
            'is_paid': order.is_paid,
            'paid_at': order.paid_at,
            'is_delivered': order.is_delivered,
            'delivered_at': order.delivered_at,
            'created_at': order.created_at,
            'updated_at': order.updated_at
        }

    @staticmethod
    def update_order_to_paid(order_id: str) -> bool:
        """
        Updates an order to mark it as paid.
        
        Args:
            order_id (str): Order ID.
        
        Returns:
            bool: True if updated successfully.
        
        Raises:
            ValueError: If order not found.
        """
        order = Order.query.get(order_id)
        if not order:
            raise ValueError(CONSTANT['NETWORK_STATUS_MESSAGE']['NOT_FOUND'])

        order.is_paid = True
        order.paid_at = datetime.now(tz=timezone.utc)
        if order.payment_result:
            order.payment_result.update_time = datetime.now(tz=timezone.utc)
        db.session.commit()
        return True

    @staticmethod
    def update_order_to_delivered(order_id: str) -> bool:
        """
        Updates an order to mark it as delivered.
        
        Args:
            order_id (str): Order ID.
        
        Returns:
            bool: True if updated successfully.
        
        Raises:
            ValueError: If order not found.
        """
        order = Order.query.get(order_id)
        if not order:
            raise ValueError(CONSTANT['NETWORK_STATUS_MESSAGE']['NOT_FOUND'])

        order.is_delivered = True
        order.delivered_at = datetime.now(tz=timezone.utc)
        db.session.commit()
        return True

    @staticmethod
    def add_order_items(body: dict, user_id: str) -> dict:
        """
        Adds order items to create a new order.
        
        Args:
            body (dict): Order details (shipping_address, payment_method).
            user_id (str): User ID.
        
        Returns:
            dict: Created order data.
        
        Raises:
            ValueError: If user or cart not found.
        """
        user = User.query.get(user_id)
        if not user:
            raise ValueError(CONSTANT['NETWORK_STATUS_MESSAGE']['NOT_FOUND'])

        cart = Cart.query.filter_by(user_id=user_id).first()
        items = CartItem.query.filter_by(cart_id=cart.id).all() if cart else []
        if not cart or not items:
            raise ValueError("Cart not found for the user")

        order_items = [{
            'product_id': item.product_id,
            'name': item.name,
            'quantity': item.quantity,
            'image': item.image,
            'price': item.price
        } for item in items]

        total_price = sum(item['price'] * item['quantity'] for item in order_items)

        order = Order(
            id=str(uuid.uuid4()),
            user_id=user_id,
            username=user.username,
            email=user.email,
            payment_method=body['payment_method'],
            shipping_price=CONSTANT['SHIPPING_PRICE'],
            total_price=round(total_price + CONSTANT['SHIPPING_PRICE'], 2),
            is_paid=False,
            created_at=datetime.now(tz=timezone.utc),
            updated_at=datetime.now(tz=timezone.utc)
        )
        db.session.add(order)

        for item in order_items:
            order_item = OrderItem(
                id=str(uuid.uuid4()),
                order_id=order.id,
                product_id=item['product_id'],
                name=item['name'],
                quantity=item['quantity'],
                image=item['image'],
                price=item['price'],
                created_at=datetime.now(tz=timezone.utc),
                updated_at=datetime.now(tz=timezone.utc)
            )
            db.session.add(order_item)

        shipping_address = ShippingAddress(
            id=str(uuid.uuid4()),
            order_id=order.id,
            address=body['shipping_address']['address'],
            city=body['shipping_address']['city'],
            postal_code=body['shipping_address']['postal_code'],
            country=body['shipping_address']['country'],
            created_at=datetime.now(tz=timezone.utc),
            updated_at=datetime.now(tz=timezone.utc)
        )
        db.session.add(shipping_address)

        payment_result = PaymentResult(
            id=str(uuid.uuid4()),
            order_id=order.id,
            status=CONSTANT['PAYMENT_STATUS']['PENDING'],
            update_time=datetime.now(tz=timezone.utc),
            email_address=user.email,
            created_at=datetime.now(tz=timezone.utc),
            updated_at=datetime.now(tz=timezone.utc)
        )
        db.session.add(payment_result)

        db.session.commit()

        return {
            'id': order.id,
            'user_id': order.user_id,
            'username': order.username,
            'email': order.email,
            'order_items': [{
                'id': item.id,
                'product_id': item.product_id,
                'name': item.name,
                'quantity': item.quantity,
                'image': item.image,
                'price': item.price
            } for item in order.items],
            'shipping_address': {
                'id': order.shipping_address.id,
                'address': order.shipping_address.address,
                'city': order.shipping_address.city,
                'postal_code': order.shipping_address.postal_code,
                'country': order.shipping_address.country
            },
            'payment_method': order.payment_method,
            'payment_result': {
                'id': order.payment_result.id,
                'status': order.payment_result.status,
                'update_time': order.payment_result.update_time,
                'email_address': order.payment_result.email_address
            },
            'shipping_price': order.shipping_price,
            'total_price': order.total_price,
            'is_paid': order.is_paid,
            'paid_at': order.paid_at,
            'is_delivered': order.is_delivered,
            'delivered_at': order.delivered_at,
            'created_at': order.created_at,
            'updated_at': order.updated_at
        }

    @staticmethod
    def get_checkout(user_id: str, order_id: str) -> str:
        """
        Retrieves a checkout session URL for payment.
        
        Args:
            user_id (str): User ID.
            order_id (str): Order ID.
        
        Returns:
            str: Checkout session URL.
        
        Raises:
            ValueError: If user, order, or required item info not found.
        """
        user = User.query.get(user_id)
        print('user', user)
        if not user or not user.email:
            raise ValueError(CONSTANT['NETWORK_STATUS_MESSAGE']['NOT_FOUND'])

        order = Order.query.get(order_id)
        print('order', order)
        if not order:
            raise ValueError(CONSTANT['NETWORK_STATUS_MESSAGE']['NOT_FOUND'])

        line_items = []
        for item in order.items:
            if not all([item.name, item.image, item.price, item.quantity]):
                raise ValueError("Missing required item information")
            line_items.append({
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': item.name,
                        'images': [item.image]
                    },
                    'unit_amount': int(item.price * 100)
                },
                'quantity': item.quantity
            })

        stripe.api_key = CONSTANT['STRIPE_SECRET_KEY']
        session = stripe.checkout.Session.create(
            line_items=line_items,
            mode='payment',
            customer_email=user.email,
            success_url=f"{CONSTANT['PUBLIC_URL']}/order/{order_id}",
            cancel_url=f"{CONSTANT['PUBLIC_URL']}/cart?canceled=1",
            metadata={'orderId': order_id, 'test': 'ok'}
        )

        return session.url

    @staticmethod
    def get_order_of_user(user_id: str) -> list:
        """
        Retrieves all orders of a user.
        
        Args:
            user_id (str): User ID.
        
        Returns:
            list: List of user orders.
        
        Raises:
            ValueError: If user or orders not found.
        """
        user = User.query.get(user_id)
        if not user:
            raise ValueError(CONSTANT['NETWORK_STATUS_MESSAGE']['NOT_FOUND'])

        orders = Order.query.filter_by(user_id=user_id).all()

        return [{
            'id': order.id,
            'user_id': order.user_id,
            'username': order.username,
            'email': order.email,
            'order_items': [{
                'id': item.id,
                'product_id': item.product_id,
                'name': item.name,
                'quantity': item.quantity,
                'image': item.image,
                'price': item.price
            } for item in order.items],
            'shipping_address': {
                'id': order.shipping_address.id,
                'address': order.shipping_address.address,
                'city': order.shipping_address.city,
                'postal_code': order.shipping_address.postal_code,
                'country': order.shipping_address.country
            } if order.shipping_address else None,
            'payment_method': order.payment_method,
            'payment_result': {
                'id': order.payment_result.id,
                'status': order.payment_result.status,
                'update_time': order.payment_result.update_time,
                'email_address': order.payment_result.email_address
            } if order.payment_result else None,
            'shipping_price': order.shipping_price,
            'total_price': order.total_price,
            'is_paid': order.is_paid,
            'paid_at': order.paid_at,
            'is_delivered': order.is_delivered,
            'delivered_at': order.delivered_at,
            'created_at': order.created_at,
            'updated_at': order.updated_at
        } for order in orders] if orders else []