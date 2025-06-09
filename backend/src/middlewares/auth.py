from functools import wraps
from flask import request, jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from src.models.user import User
from src.models.token import Token
from src.constants.constants import CONSTANT
from src.constants.response import on_error
from src.constants.logger import log_error
import hashlib

def auth_middleware():
    """
    Decorator that checks if the request has a valid authorization header and verifies the token.
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            try:
                # Kiểm tra header Authorization
                authorization = request.headers.get('Authorization')
                if not authorization:
                    response, status = on_error(CONSTANT['NETWORK_STATUS_MESSAGE']['UNAUTHORIZED'])
                    return jsonify(response), CONSTANT['NETWORK_STATUS_CODE']['UNAUTHORIZED']

                # Hash token để kiểm tra trong database
                hashed_token = hashlib.sha3_256(authorization.encode()).hexdigest()
                token_in_db = Token.query.filter_by(token=hashed_token).first()
                if not token_in_db:
                    response, status = on_error(CONSTANT['NETWORK_STATUS_MESSAGE']['UNAUTHORIZED'])
                    return jsonify(response), CONSTANT['NETWORK_STATUS_CODE']['UNAUTHORIZED']

                return f(*args, **kwargs)
            except Exception as e:
                log_error(e, request, '[AuthMiddleware]')
                response, status = on_error(CONSTANT['NETWORK_STATUS_MESSAGE']['UNAUTHORIZED'])
                return jsonify(response), CONSTANT['NETWORK_STATUS_CODE']['UNAUTHORIZED']
        return decorated_function
    return decorator

def admin_middleware():
    """
    Decorator that checks if the user making the request is an admin.
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            try:
                # Kiểm tra header Authorization
                authorization = request.headers.get('Authorization')
                if not authorization:
                    response, status = on_error(CONSTANT['NETWORK_STATUS_MESSAGE']['UNAUTHORIZED'])
                    return jsonify(response), CONSTANT['NETWORK_STATUS_CODE']['UNAUTHORIZED']

                # Verify JWT và lấy user_id
                verify_jwt_in_request()
                user_id = get_jwt_identity()

                # Kiểm tra user có role ADMIN
                user = User.query.filter_by(id=user_id, role=CONSTANT['USER_ROLE']['ADMIN']).first()
                if not user:
                    response, status = on_error(CONSTANT['NETWORK_STATUS_MESSAGE']['UNAUTHORIZED'])
                    return jsonify(response), CONSTANT['NETWORK_STATUS_CODE']['UNAUTHORIZED']

                return f(*args, **kwargs)
            except Exception as e:
                log_error(e, request, '[AdminMiddleware]')
                response, status = on_error(CONSTANT['NETWORK_STATUS_MESSAGE']['UNAUTHORIZED'])
                return jsonify(response), CONSTANT['NETWORK_STATUS_CODE']['UNAUTHORIZED']
        return decorated_function
    return decorator