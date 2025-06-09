from datetime import datetime, timezone
import hashlib
import uuid
from src.extensions import db
from src.models.user import User
from src.constants.constants import CONSTANT
from src.constants.logger import logger

def hash_text(text: str) -> str:
    """
    Hashes the input text using SHA3-256.
    
    Args:
        text (str): The text to hash.
    
    Returns:
        str: The hashed text.
    """
    return hashlib.sha3_256(text.encode()).hexdigest()

def initial_admin():
    """
    Initializes the admin user with the given initial username and password if it does not already exist.
    """
    admin_email = CONSTANT['ADMIN_INITIAL_EMAIL']
    admin_password = CONSTANT['ADMIN_INITIAL_PASSWORD']
    admin_username = CONSTANT['ADMIN_USERNAME']
    admin_verification_code = CONSTANT['ADMIN_VERIFICATION_CODE']
    admin_phone = CONSTANT['ADMIN_PHONE_NUMBER']

    existing_user = User.query.filter_by(email=admin_email).first()
    if existing_user:
        logger.info(f"initialAdmin already exist: {admin_email}")
        return

    if admin_password:
        user = User(
            id=str(uuid.uuid4()),
            username=admin_username,
            email=admin_email,
            password=hash_text(admin_password),
            verified=True,
            verification_code=admin_verification_code,
            role=CONSTANT['USER_ROLE']['ADMIN'],
            phone=admin_phone,
            refresh_token='',
            created_at=datetime.now(tz=timezone.utc),
            updated_at=datetime.now(tz=timezone.utc)
        )
        db.session.add(user)
        db.session.commit()
        logger.info(f"Created admin user: {admin_email}")

def initial_database():
    """
    Initializes the database connection.
    """
    try:
        db.create_all()  # Tạo tất cả bảng nếu chưa tồn tại
        logger.info("Connected to database")
    except Exception as e:
        logger.error(f"Error connecting to database: {str(e)}")