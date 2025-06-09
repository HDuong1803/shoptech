import jwt
from datetime import datetime, timedelta, timezone
from src.constants.constants import CONSTANT
from typing import Dict, Any

PayloadJwt = Dict[str, Any]  # {'email': str, 'role': int, 'phone': str}

def verify_jwt(token: str) -> PayloadJwt:
    """
    Verifies a JWT token and returns its payload.
    
    Args:
        token (str): The JWT token to verify.
    
    Returns:
        PayloadJwt: The decoded payload.
    
    Raises:
        jwt.InvalidTokenError: If the token is invalid.
    """
    return jwt.decode(token, CONSTANT['JWT_SECRET'], algorithms=['HS256'])

def renew_jwt(refresh_token: str) -> Dict[str, Any]:
    """
    Renews a JWT access token using a refresh token.
    
    Args:
        refresh_token (str): The refresh token.
    
    Returns:
        dict: Contains the new access token and payload.
    
    Raises:
        jwt.InvalidTokenError: If the refresh token is invalid.
    """
    payload = jwt.decode(refresh_token, CONSTANT['JWT_SECRET_REFRESH'], algorithms=['HS256'])
    return {
        'access_token': sign_jwt({
            'email': payload.get('email'),
            'role': payload.get('role'),
            'phone': payload.get('phone')
        })['access_token'],
        'payload': payload
    }

def sign_jwt(payload: PayloadJwt) -> Dict[str, str]:
    """
    Signs a JWT token with the given payload.
    
    Args:
        payload (PayloadJwt): The payload to include in the token.
    
    Returns:
        dict: Contains the access token and refresh token.
    """
    access_token = jwt.encode(
        payload | {'exp': datetime.now(tz=timezone.utc) + timedelta(days=1)},  # 1d
        CONSTANT['JWT_SECRET'],
        algorithm='HS256'
    )
    refresh_token = jwt.encode(
        payload | {'exp': datetime.now(tz=timezone.utc) + timedelta(days=7)},  # 7d
        CONSTANT['JWT_SECRET_REFRESH'],
        algorithm='HS256'
    )
    return {
        'access_token': access_token,
        'refresh_token': refresh_token
    }