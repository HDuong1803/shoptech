from src.models.user import User
from src.constants.constants import CONSTANT
from src.extensions import db

class AdminController:
    @staticmethod
    def info_admin():
        """
        Retrieves information about the admin user.
        
        Returns:
            dict: Admin user data.
        
        Raises:
            ValueError: If no admin user is found.
        """
        admin_user = User.query.filter_by(role=CONSTANT['USER_ROLE']['ADMIN']).first()
        if admin_user:
            return {
                'id': admin_user.id,
                'email': admin_user.email,
                'username': admin_user.username,
                'role': admin_user.role,
                'phone': admin_user.phone,
                'refresh_token': admin_user.refresh_token or '',
                'update_at': admin_user.updated_at,
                'create_at': admin_user.created_at
            }
        raise ValueError(CONSTANT['NETWORK_STATUS_MESSAGE']['ADMIN_NOT_FOUND'])