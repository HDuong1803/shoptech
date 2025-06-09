from flask import Blueprint, jsonify, request
from flask_restx import Namespace, Resource, fields
from marshmallow import ValidationError
from src.constants.constants import CONSTANT
from src.constants.response import on_success, on_error, ErrorHandler
from src.constants.logger import log_error
from src.middlewares.auth import auth_middleware
from src.providers.instance import Singleton
from src.app.auth.schema import (
    InputLoginSchema,
    InputSignUpSchema,
    InputRefreshTokenSchema,
    InputVerifyPasswordSchema,
    OutputRefreshTokenSchema,
    OutputLoginAdminSchema,
    OutputVerifyPasswordSchema,
    OutputLogoutSchema,
    VerifyGoogleInputSchema
)

# Define namespace for Swagger
api = Namespace('auth', description='Authentication operations', path='/api/auth')

token_model = api.model('Token', {
    'access_token': fields.String(example='eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'),
    'refresh_token': fields.String(example='eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...')
})

user_model = api.model('User', {
    'id': fields.String(example='65dc4e4cc7d2ffcebd571312'),
    'email': fields.String(example='user@example.com'),
    'username': fields.String(example='user123'),
    'role': fields.Integer(example=0),
    'phone': fields.String(example='0123456789'),
    'refresh_token': fields.String(example='eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'),
    'update_at': fields.DateTime,
    'create_at': fields.DateTime,
})

user_model_with_token = api.inherit('UserWithToken', {
    'detail': fields.Nested(user_model, description='User details'),
    'access_token': fields.String(example='eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'),
    'refresh_token': fields.String(example='eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...')
})

access_token_model = api.model('AccessToken', {
    'access_token': fields.String(example='eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...')
})

sign_up_model = api.model('Users', {
    'username': fields.String(required=True, example='user123'),
    'email': fields.String(required=True, example='user@example.com'),
    'password': fields.String(required=True, example='password123'),
    'phone': fields.String(required=True, example='0123456789')
})

login_model = api.model('Users', {
    'email': fields.String(required=True, example='user@example.com'),
    'password': fields.String(required=True, example='password123')
})

logout_model = api.model('Token', {
    'logout': fields.Boolean(required=True, example=True)
})

# Define response models for Swagger
success_login_response = api.model('SuccessLoginResponse', {
    'data': fields.Nested(user_model_with_token),
    'message': fields.String(example='Success'),
    'success': fields.Boolean(example=True),
    'count': fields.Integer(example=1)
})

success_signup_response = api.model('SuccessSignupResponse', {
    'data': fields.Nested(user_model_with_token),
    'message': fields.String(example='Success'),
    'success': fields.Boolean(example=True),
    'count': fields.Integer(example=1)
})

success_refresh_response = api.model('SuccessRefreshResponse', {
    'data': fields.Nested(access_token_model),
    'message': fields.String(example='Success'),
    'success': fields.Boolean(example=True),
    'count': fields.Integer(example=1)
})

success_logout_response = api.model('SuccessLogoutResponse', {
    'data': fields.Nested(logout_model),
    'message': fields.String(example='Success'),
    'success': fields.Boolean(example=True),
    'count': fields.Integer(example=1)
})

error_response = api.model('ErrorResponse', {
    'message': fields.String,
    'success': fields.Boolean(example=False)
})

@api.route('/login')
class UserLogin(Resource):
    @api.doc(responses={
        200: ('Success', success_login_response),
        401: ('Unauthorized', error_response),
        422: ('Validation Error', error_response),
        500: ('Internal Server Error', error_response)
    })
    @api.expect(login_model)
    @api.marshal_with(success_login_response, code=200)
    def post(self):
        """Logs in a user."""
        try:
            data = InputLoginSchema().load(request.get_json())
            result = Singleton.get_auth_instance().user_login(data)
            return on_success(result), 200
        except ValidationError as e:
            raise ErrorHandler(e.messages, CONSTANT['NETWORK_STATUS_MESSAGE']['VALIDATE_ERROR'])
        except Exception as e:
            log_error(e, request)
            response, status = on_error(str(e))
            return response, status

@api.route('/signup')
class UserSignup(Resource):
    @api.doc(responses={
        200: ('Success', success_signup_response),
        401: ('Unauthorized', error_response),
        422: ('Validation Error', error_response),
        500: ('Internal Server Error', error_response)
    })
    @api.expect(sign_up_model)
    @api.marshal_with(success_signup_response, code=200)
    def post(self):
        """Signs up a new user."""
        try:
            data = InputSignUpSchema().load(request.get_json())

            result = Singleton.get_auth_instance().user_signup(data)
            return on_success(result), 200
        except ValidationError as e:
            raise ErrorHandler(e.messages, CONSTANT['NETWORK_STATUS_MESSAGE']['VALIDATE_ERROR'])
        except Exception as e:
            log_error(e, request)
            response, status = on_error(str(e))
            return response, status

@api.route('/admin/token')
class RefreshTokenAdmin(Resource):
    @api.doc(responses={
        200: ('Success', success_refresh_response),
        401: ('Unauthorized', error_response),
        422: ('Validation Error', error_response),
        500: ('Internal Server Error', error_response)
    })
    @api.expect(InputRefreshTokenSchema)
    @api.marshal_with(success_refresh_response, code=200)
    def post(self):
        """Refreshes admin token."""
        try:
            data = InputRefreshTokenSchema().load(request.get_json())
            result = Singleton.get_auth_instance().refresh_token(data)
            return on_success(result), 200
        except ValidationError as e:
            raise ErrorHandler(e.messages, CONSTANT['NETWORK_STATUS_MESSAGE']['VALIDATE_ERROR'])
        except Exception as e:
            log_error(e, request)
            response, status = on_error(str(e))
            return response, status

@api.route('/logout')
class Logout(Resource):
    @api.doc(security='Bearer Auth', responses={
        200: ('Success', success_logout_response),
        401: ('Unauthorized', error_response),
        422: ('Validation Error', error_response),
        500: ('Internal Server Error', error_response)
    })
    @api.marshal_with(success_logout_response, code=200)
    def post(self):
        """Logs out a user."""
        try:
            authorization = request.headers.get('Authorization', '')
            result = Singleton.get_auth_instance().logout(authorization)
            return on_success(result), 200
        except Exception as e:
            log_error(e, request)
            response, status = on_error(str(e))
            return response, status

@api.route('/user/login/google')
class LoginGoogle(Resource):
    @api.doc(responses={
        200: ('Success', success_login_response),
        401: ('Unauthorized', error_response),
        422: ('Validation Error', error_response),
        500: ('Internal Server Error', error_response)
    })
    @api.expect(VerifyGoogleInputSchema)
    @api.marshal_with(success_login_response, code=200)
    def post(self):
        """Logs in a user via Google."""
        try:
            data = VerifyGoogleInputSchema().load(request.get_json())
            result = Singleton.get_auth_instance().verify_google(data['google_token_id'])
            return on_success(result), 200
        except ValidationError as e:
            raise ErrorHandler(e.messages, CONSTANT['NETWORK_STATUS_MESSAGE']['VALIDATE_ERROR'])
        except Exception as e:
            log_error(e, request)
            response, status = on_error(str(e))
            return response, status

@api.route('/user/token')
class RefreshTokenUser(Resource):
    @api.doc(responses={
        200: ('Success', success_refresh_response),
        401: ('Unauthorized', error_response),
        422: ('Validation Error', error_response),
        500: ('Internal Server Error', error_response)
    })
    @api.expect(InputRefreshTokenSchema)
    @api.marshal_with(success_refresh_response, code=200)
    def post(self):
        """Refreshes user token."""
        try:
            data = InputRefreshTokenSchema().load(request.get_json())
            result = Singleton.get_auth_instance().refresh_token(data)
            return on_success(result), 200
        except ValidationError as e:
            raise ErrorHandler(e.messages, CONSTANT['NETWORK_STATUS_MESSAGE']['VALIDATE_ERROR'])
        except Exception as e:
            log_error(e, request)
            response, status = on_error(str(e))
            return response, status

# Blueprint to register in app
auth_bp = Blueprint('auth', __name__)