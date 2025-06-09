from src.app.auth.controller import AuthController
from src.app.product.controller import ProductController
from src.app.cart.controller import CartController
from src.app.order.controller import OrderController
from src.app.admin.controller import AdminController
from src.app.user.controller import UserController

class Singleton:
    _admin_instance = None
    _auth_instance = None
    _order_instance = None
    _product_instance = None
    _cart_instance = None
    _user_instance = None

    @classmethod
    def get_admin_instance(cls) -> AdminController:
        """
        Returns the singleton instance of the AdminController.
        
        Returns:
            AdminController: The singleton instance.
        """
        if cls._admin_instance is None:
            cls._admin_instance = AdminController()
        return cls._admin_instance

    @classmethod
    def get_auth_instance(cls) -> AuthController:
        """
        Returns the singleton instance of the AuthController.
        
        Returns:
            AuthController: The singleton instance.
        """
        if cls._auth_instance is None:
            cls._auth_instance = AuthController()
        return cls._auth_instance

    @classmethod
    def get_cart_instance(cls) -> CartController:
        """
        Returns the singleton instance of the CartController.
        
        Returns:
            CartController: The singleton instance.
        """
        if cls._cart_instance is None:
            cls._cart_instance = CartController()
        return cls._cart_instance

    @classmethod
    def get_product_instance(cls) -> ProductController:
        """
        Returns the singleton instance of the ProductController.
        
        Returns:
            ProductController: The singleton instance.
        """
        if cls._product_instance is None:
            cls._product_instance = ProductController()
        return cls._product_instance

    @classmethod
    def get_order_instance(cls) -> OrderController:
        """
        Returns the singleton instance of the OrderController.
        
        Returns:
            OrderController: The singleton instance.
        """
        if cls._order_instance is None:
            cls._order_instance = OrderController()
        return cls._order_instance

    @classmethod
    def get_user_instance(cls) -> UserController:
        """
        Returns the singleton instance of the UserController.
        
        Returns:
            UserController: The singleton instance.
        """
        if cls._user_instance is None:
            cls._user_instance = UserController()
        return cls._user_instance