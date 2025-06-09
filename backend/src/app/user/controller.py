from src.models.user import User
from src.constants.constants import CONSTANT
from src.extensions import db
from datetime import datetime, timezone

class UserController:
    @staticmethod
    def get_user(user_id: str) -> dict:
        """
        Retrieves a user by ID.
        
        Args:
            user_id (str): The ID of the user.
        
        Returns:
            dict: User data.
        
        Raises:
            ValueError: If user is not found.
        """
        user = User.query.get(user_id)
        if user:
            return {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'verified': user.verified,
                'password': user.password,
                'verification_code': user.verification_code,
                'avatar_url': user.avatar_url,
                'role': user.role,
                'phone': user.phone,
                'two_factor_auth': user.two_factor_auth,
                'two_factor_secret': user.two_factor_secret,
                'refresh_token': user.refresh_token,
                'google_id': user.google_id,
                'last_login_at': user.last_login_at,
                'created_at': user.created_at,
                'updated_at': user.updated_at
            }
        raise ValueError(CONSTANT['NETWORK_STATUS_MESSAGE']['NOT_FOUND'])

    @staticmethod
    def get_list_user(page: int = 1, limit: int = 5) -> dict:
        """
        Retrieves a list of users with pagination.
        
        Args:
            page (int): Page number (default: 1).
            limit (int): Number of users per page (default: 5).
        
        Returns:
            dict: List of users and total count.
        """
        offset = (page - 1) * limit
        users = User.query.offset(offset).limit(limit).all()
        total = User.query.count()

        return {
            'data': [{
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'verified': user.verified,
                'password': user.password,
                'verification_code': user.verification_code,
                'avatar_url': user.avatar_url,
                'role': user.role,
                'phone': user.phone,
                'two_factor_auth': user.two_factor_auth,
                'two_factor_secret': user.two_factor_secret,
                'refresh_token': user.refresh_token,
                'google_id': user.google_id,
                'last_login_at': user.last_login_at,
                'created_at': user.created_at,
                'updated_at': user.updated_at
            } for user in users],
            'total': total
        }

    @staticmethod
    def update_user(user_id: str, body: dict) -> dict:
        """
        Updates user information.
        
        Args:
            user_id (str): The ID of the user.
            body (dict): Update data (username, password, phone, avatar_url).
        
        Returns:
            dict: Updated user data.
        
        Raises:
            ValueError: If user is not found.
        """
        user = User.query.get(user_id)
        if not user:
            raise ValueError(CONSTANT['NETWORK_STATUS_MESSAGE']['UNAUTHORIZED'])

        user.username = body.get('username', user.username)
        user.password = body.get('password', user.password)
        user.phone = body.get('phone', user.phone)
        user.avatar_url = body.get('avatar_url', user.avatar_url)
        user.updated_at = datetime.now(tz=timezone.utc)
        db.session.commit()

        return {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'verified': user.verified,
            'password': user.password,
            'verification_code': user.verification_code,
            'avatar_url': user.avatar_url,
            'role': user.role,
            'phone': user.phone,
            'two_factor_auth': user.two_factor_auth,
            'two_factor_secret': user.two_factor_secret,
            'refresh_token': user.refresh_token,
            'google_id': user.google_id,
            'last_login_at': user.last_login_at,
            'created_at': user.created_at,
            'updated_at': user.updated_at
        }