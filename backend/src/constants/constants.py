import os
from dotenv import load_dotenv
import hashlib
from datetime import datetime

load_dotenv()

# PayloadJwt equivalent as a dictionary type (no strict typing in Python)
PayloadJwt = dict[str, str | int]  # {'email': str, 'role': int, 'phone': str}

# User roles
USER_ROLE = {
    'ADMIN': 1,
    'USER': 0
}

# Payment status
PAYMENT_STATUS = {
    'PENDING': 'PENDING',
    'SUCCESS': 'SUCCESS',
    'FAILED': 'FAILED'
}

# OTP timeout in milliseconds
OTP_TIMEOUT = 60000

def get_verify_code(username: str, hashed_password: str, timestamp: datetime) -> str:
    """
    Generates a verification code for a user based on their username, hashed password, and a timestamp.
    
    Args:
        username (str): The username of the user.
        hashed_password (str): The hashed password of the user.
        timestamp (datetime): The timestamp to use for generating the verification code.
    
    Returns:
        str: The verification code as a hashed value.
    """
    secret_key = f"{username}-{hashed_password}"
    hashed_value = hashlib.sha3_256(f"{int(timestamp.timestamp() * 1000)}{secret_key}".encode()).hexdigest()
    return hashed_value

# Constants object
CONSTANT = {
    'JWT_EXPIRES_IN': '1d',
    'JWT_REFRESH_EXPIRES_IN': '7d',
    'JWT_SECRET': os.getenv('JWT_SECRET', 'your-jwt-secret'),
    'JWT_SECRET_REFRESH': os.getenv('JWT_SECRET_REFRESH', 'your-jwt-refresh-secret'),
    'ADMIN_INITIAL_PASSWORD': os.getenv('ADMIN_INITIAL_PASSWORD', 'admin123'),
    'ADMIN_INITIAL_EMAIL': os.getenv('ADMIN_INITIAL_EMAIL', 'admin@example.com'),
    'ADMIN_VERIFICATION_CODE': os.getenv('ADMIN_VERIFICATION_CODE', 'admin_verify_code'),
    'PORT': os.getenv('PORT', '5000'),
    'DATABASE_URL': os.getenv('DATABASE_URL', 'postgresql://user:password@localhost:5432/laptop_store'),
    'SECRET': os.getenv('SECRET', 'your-secret'),
    'GOOGLE_ID': os.getenv('GOOGLE_ID', ''),
    'GOOGLE_SECRET': os.getenv('GOOGLE_SECRET', ''),
    'S3_SECRET_ACCESS_KEY': os.getenv('S3_SECRET_ACCESS_KEY', ''),
    'S3_ACCESS_KEY': os.getenv('S3_ACCESS_KEY', ''),
    'BUCKET_NAME': os.getenv('BUCKET_NAME', ''),
    'STRIPE_PK': os.getenv('STRIPE_PK', ''),
    'STRIPE_SK': os.getenv('STRIPE_SK', ''),
    'PUBLIC_URL': os.getenv('PUBLIC_URL', 'http://localhost:3000'),
    'ENDPOINT_SECRET': os.getenv('ENDPOINT_SECRET', ''),
    'EMAIL_HOST': os.getenv('EMAIL_HOST', ''),
    'EMAIL_USERNAME': os.getenv('EMAIL_USERNAME', ''),
    'EMAIL_PASSWORD': os.getenv('EMAIL_PASSWORD', ''),
    'EMAIL_FROM': os.getenv('EMAIL_FROM', ''),
    'STRIPE_SECRET_KEY': os.getenv('STRIPE_SECRET_KEY', ''),
    'ADMIN_USERNAME': 'admin',
    'ADMIN_PHONE_NUMBER': '0000000000',
    'NETWORK_STATUS_CODE': {
        'EMPTY': 204,
        'SUCCESS': 200,
        'BAD_REQUEST': 400,
        'EXPIRE': 498,
        'UNAUTHORIZED': 401,
        'NOT_FOUND': 404,
        'INTERNAL_SERVER_ERROR': 500,
        'NOT_ENOUGH_RIGHT': 403,
        'CONTENT_TOO_LARGE': 413,
        'VALIDATE_ERROR': 422,
        'LOGIN_BEFORE': 400,
        'OTP_EXPIRED': 400,
        'INVALID_VERIFY_CODE': 400,
        'ADMIN_NOT_FOUND': 404
    },
    'NETWORK_STATUS_MESSAGE': {
        'EMPTY': 'Empty',
        'SUCCESS': 'Success',
        'BAD_REQUEST': 'Bad request',
        'EXPIRE': 'Expire time',
        'UNAUTHORIZED': 'Unauthorized',
        'NOT_FOUND': 'Not found',
        'INTERNAL_SERVER_ERROR': 'Internal server error',
        'NOT_ENOUGH_RIGHT': 'Not Enough Rights',
        'CONTENT_TOO_LARGE': 'Content too large',
        'VALIDATE_ERROR': 'Validate error',
        'LOGIN_BEFORE': 'Please login before',
        'OTP_EXPIRED': 'OTP expired',
        'INVALID_VERIFY_CODE': 'Invalid verify code',
        'ADMIN_NOT_FOUND': 'Admin not found',
        'ALREADY_EXISTS': 'Already exists'
    },
    'USER_ROLE': USER_ROLE,
    'SHIPPING_PRICE': 0,
    'PAYMENT_STATUS': PAYMENT_STATUS,
    'ARWEAVE_WALLET_PATH': 'arweave_wallet.json',
    'ARWEAVE_GATEWAY': 'https://arweave.net'
}

