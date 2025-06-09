import uuid
from datetime import datetime, timezone
from google.oauth2 import id_token
from google.auth.transport import requests
from src.models.user import User
from src.models.token import Token
from src.models.cart import Cart
from src.extensions import db
from src.constants.constants import CONSTANT
from src.constants.response import ErrorHandler
from src.providers.jwt import sign_jwt, renew_jwt
from src.providers.initial import hash_text
from src.utils.helper import generate_random_verification_code

class AuthController:
    @staticmethod
    def user_login(body: dict) -> dict:
        """
        Logs in a user and returns user details with tokens.
        
        Args:
            body (dict): Login credentials (email, password).
        
        Returns:
            dict: User details, access token, and refresh token.
        
        Raises:
            ErrorHandler: If email not found or password incorrect.
        """
        user = User.query.filter_by(email=body['email']).first()
        if not user:
            raise ErrorHandler(
                {'email': {'message': 'Email is not exist', 'value': body['email']}},
                CONSTANT['NETWORK_STATUS_MESSAGE']['UNAUTHORIZED']
            )

        hashed_password = hash_text(body['password'])
        user = User.query.filter_by(email=body['email'], password=hashed_password).first()
        if not user:
            raise ErrorHandler(
                {'password': {'message': 'Password is incorrect', 'value': body['password']}},
                CONSTANT['NETWORK_STATUS_MESSAGE']['UNAUTHORIZED']
            )

        user.last_login_at = datetime.now(tz=timezone.utc)
        db.session.commit()

        jwt_payload = sign_jwt({
            'email': user.email,
            'role': user.role,
            'phone': user.phone
        })

        user.refresh_token = hash_text(jwt_payload['refresh_token'])
        db.session.commit()

        token = Token.query.filter_by(user_id=user.id).first()
        if token:
            token.token = hash_text(jwt_payload['access_token'])
        else:
            token = Token(
                id=str(uuid.uuid4()),
                token=hash_text(jwt_payload['access_token']),
                created_at=datetime.now(tz=timezone.utc),
                user_id=user.id
            )
            db.session.add(token)
        db.session.commit()

        return {
            'detail': {
                'id': user.id,
                'email': user.email,
                'username': user.username,
                'role': user.role,
                'phone': user.phone,
                'refresh_token': user.refresh_token,
                'created_at': user.created_at,
                'updated_at': user.updated_at
            },
            'access_token': jwt_payload['access_token'],
            'refresh_token': jwt_payload['refresh_token']
        }

    @staticmethod
    def user_signup(body: dict) -> dict:
        """
        Signs up a new user and returns user details with tokens.
        
        Args:
            body (dict): Signup data (username, email, password, phone).
        
        Returns:
            dict: User details, access token, and refresh token.
        
        Raises:
            ErrorHandler: If email already exists.
        """
        user = User.query.filter_by(email=body['email']).first()
        print(f"user: {user}")
        if user:
            print(f"User with email {body['email']} already exists.")
            raise ErrorHandler(
                {'email': {'message': 'Email already exists', 'value': body['email']}},
                CONSTANT['NETWORK_STATUS_MESSAGE']['UNAUTHORIZED']
            )

        hashed_password = hash_text(body['password'])
        jwt_payload = sign_jwt({
            'email': body['email'],
            'role': CONSTANT['USER_ROLE']['USER']
        })

        new_user = User(
            id=str(uuid.uuid4()),
            username=body['username'],
            email=body['email'],
            verified=False,
            verification_code=generate_random_verification_code(6),
            avatar_url=None,
            phone=body['phone'],
            password=hashed_password,
            two_factor_auth=False,
            two_factor_secret=None,
            role=CONSTANT['USER_ROLE']['USER'],
            google_id=None,
            refresh_token=jwt_payload['refresh_token'],
            created_at=datetime.now(tz=timezone.utc),
            updated_at=datetime.now(tz=timezone.utc),
        )
        db.session.add(new_user)
        db.session.commit()

        token = Token(
            id=str(uuid.uuid4()),
            token=hash_text(jwt_payload['access_token']),
            created_at=datetime.now(tz=timezone.utc),
            user_id=new_user.id
        )
        db.session.add(token)

        cart = Cart(user_id=new_user.id)
        db.session.add(cart)
        db.session.commit()

        return {
            'detail': {
                'id': new_user.id,
                'username': new_user.username,
                'email': new_user.email,
                'role': new_user.role,
                'phone': new_user.phone,
                'refresh_token': new_user.refresh_token,
                'created_at': new_user.created_at,
                'updated_at': new_user.updated_at
            },
            'access_token': jwt_payload['access_token'],
            'refresh_token': jwt_payload['refresh_token']
        }

    @staticmethod
    def refresh_token(body: dict) -> dict:
        """
        Refreshes the access token using a refresh token.
        
        Args:
            body (dict): Contains refresh_token.
        
        Returns:
            dict: New access token.
        
        Raises:
            ValueError: If refresh token is invalid or user not found.
        """
        try:
            access_token, payload = renew_jwt(body['refresh_token']).values()
            user = User.query.filter_by(email=payload['email']).first()
            if not user:
                raise ValueError(CONSTANT['NETWORK_STATUS_MESSAGE']['UNAUTHORIZED'])

            token = Token.query.filter_by(user_id=user.id).first()
            if token:
                token.token = hash_text(access_token)
            else:
                token = Token(
                    id=str(uuid.uuid4()),
                    token=hash_text(access_token),
                    created_at=datetime.now(tz=timezone.utc),
                    user_id=user.id
                )
                db.session.add(token)
            db.session.commit()

            return {'access_token': access_token}
        except Exception:
            raise ValueError(CONSTANT['NETWORK_STATUS_MESSAGE']['UNAUTHORIZED'])

    @staticmethod
    def verify_password(body: dict, email: str) -> dict:
        """
        Verifies the user's password.
        
        Args:
            body (dict): Contains password.
            email (str): User's email.
        
        Returns:
            dict: Authorization status.
        """
        user = User.query.filter_by(email=email, password=hash_text(body['password'])).first()
        return {'authorized': bool(user)}

    @staticmethod
    def logout(access_token: str) -> dict:
        """
        Logs out a user by deleting their token.
        
        Args:
            access_token (str): User's access token.
        
        Returns:
            dict: Logout status.
        """
        token = Token.query.filter_by(token=hash_text(access_token)).first()
        if token:
            db.session.delete(token)
            db.session.commit()
        return {'logout': True}

    @staticmethod
    def verify_google(google_token_id: str) -> dict:
        """
        Verifies Google token and logs in/creates user.
        
        Args:
            google_token_id (str): Google token ID.
        
        Returns:
            dict: User details, access token, and refresh token.
        
        Raises:
            ValueError: If Google token is invalid.
        """
        try:
            idinfo = id_token.verify_oauth2_token(
                google_token_id,
                requests.Request(),
                CONSTANT['GOOGLE_ID']
            )
            email = idinfo['email']
            name = idinfo.get('name', '')
        except ValueError:
            raise ValueError(CONSTANT['NETWORK_STATUS_MESSAGE']['NOT_FOUND'])

        user = User.query.filter_by(email=email).first()
        if not user:
            user = User(
                id=str(uuid.uuid4()),
                email=email,
                username=name,
                verified=False,
                verification_code=generate_random_verification_code(6),
                avatar_url=None,
                phone=None,
                password=None,
                two_factor_auth=False,
                two_factor_secret=None,
                role=CONSTANT['USER_ROLE']['USER'],
                google_id=google_token_id,
                refresh_token=None,
                created_at=datetime.now(tz=timezone.utc),
                updated_at=datetime.now(tz=timezone.utc),
            )
            db.session.add(user)
            db.session.commit()
        else:
            user.username = name
            user.google_id = google_token_id
            db.session.commit()

        user.last_login_at = datetime.now(tz=timezone.utc),
        jwt_payload = sign_jwt({
            'email': user.email,
            'role': user.role,
            'phone': user.phone
        })

        user.refresh_token = hash_text(jwt_payload['refresh_token'])
        db.session.commit()

        token = Token.query.filter_by(user_id=user.id).first()
        if token:
            token.token = hash_text(jwt_payload['access_token'])
        else:
            token = Token(
                id=str(uuid.uuid4()),
                token=hash_text(jwt_payload['access_token']),
                created_at=datetime.now(tz=timezone.utc),
                user_id=user.id
            )
            db.session.add(token)
        db.session.commit()

        return {
            'detail': {
                'id': user.id,
                'email': user.email,
                'username': user.username,
                'role': user.role,
                'phone': user.phone,
                'refresh_token': user.refresh_token,
                'created_at': user.created_at,
                'updated_at': user.updated_at
            },
            'access_token': jwt_payload['access_token'],
            'refresh_token': jwt_payload['refresh_token']
        }