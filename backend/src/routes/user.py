from flask import Blueprint, jsonify, request
from flask_restx import Api, Namespace, Resource, fields
from src.app.user.schema import InputUpdateUserSchema, UserSchema
from src.constants.constants import CONSTANT
from src.constants.response import on_success, on_error
from src.constants.logger import log_error
from src.middlewares.auth import auth_middleware, admin_middleware
from src.providers.instance import Singleton
from marshmallow import ValidationError

# Định nghĩa namespace cho Swagger
api = Namespace('user', description='User operations', path='/api/user')

user_model = api.model('User', {
    'id': fields.String(attribute='id'),
    'email': fields.String,
    'username': fields.String,
    'verified': fields.Boolean,
    'password': fields.String,
    'role': fields.Integer,
    'phone': fields.String,
    'refresh_token': fields.String,
    'avatar_url': fields.String,
    'last_login_at': fields.DateTime,
    'created_at': fields.DateTime,
    'updated_at': fields.DateTime
})

# Định nghĩa model response cho Swagger
success_user_response = api.model('SuccessUserResponse', {
    'data': fields.Nested(user_model),
    'message': fields.String(example='Success'),
    'success': fields.Boolean(example=True),
    'count': fields.Integer(example=1)
})

success_list_user_response = api.model('SuccessListUserResponse', {
    'data': fields.List(fields.Nested(user_model)),
    'message': fields.String(example='Success'),
    'success': fields.Boolean(example=True),
    'count': fields.Integer(example=2),
    'total': fields.Integer(example=2)
})

error_response = api.model('ErrorResponse', {
    'message': fields.String,
    'success': fields.Boolean(example=False)
})

@api.route('/profile')
class UserProfile(Resource):
    @api.doc(security='Bearer Auth', responses={
        200: ('Success', success_user_response),
        401: ('Unauthorized', error_response),
        422: ('Validation Error', error_response),
        500: ('Internal Server Error', error_response)
    })
    @api.marshal_with(success_user_response, code=200)
    @auth_middleware()
    def get(self):
        """Retrieves user profile."""
        try:
            user_id = request.headers.get('id')  # Giả định id chứa user_id
            result = Singleton.get_user_instance().get_user(user_id)
            return on_success(result), 200
        except Exception as e:
            log_error(e, request)
            response, status = on_error(str(e))
            return response, status

@api.route('/list/profile')
class ListUser(Resource):
    @api.doc(security='Bearer Auth', responses={
        200: ('Success', success_list_user_response),
        401: ('Unauthorized', error_response),
        422: ('Validation Error', error_response),
        500: ('Internal Server Error', error_response)
    }, params={
        'page': 'Page number (default: 1)',
        'limit': 'Number of users per page (default: 5)'
    })
    @admin_middleware()
    def get(self):
        """Retrieves a list of users."""
        try:
            page = int(request.args.get('page', 1))
            limit = int(request.args.get('limit', 5))
            result = Singleton.get_user_instance().get_list_user(page, limit)
            return on_success(result['data'], total=result['total']), 200
        except Exception as e:
            log_error(e, request)
            response, status = on_error(str(e))
            return response, status

@api.route('/profile')
class UpdateUser(Resource):
    @api.doc(security='Bearer Auth', responses={
        200: ('Success', success_user_response),
        401: ('Unauthorized', error_response),
        422: ('Validation Error', error_response),
        500: ('Internal Server Error', error_response)
    })
    @api.expect(InputUpdateUserSchema)
    @api.marshal_with(success_user_response, code=200)
    @auth_middleware()
    def put(self):
        """Updates user profile."""
        try:
            data = InputUpdateUserSchema().load(request.get_json())
            user_id = request.headers.get('id')  # Giả định id chứa user_id
            result = Singleton.get_user_instance().update_user(user_id, data)
            return on_success(result), 200
        except ValidationError as e:
            response, status = on_error({
                **e.messages,
                'message': CONSTANT['NETWORK_STATUS_MESSAGE']['VALIDATE_ERROR']
            }, CONSTANT['NETWORK_STATUS_CODE']['VALIDATE_ERROR'])
            return response, status
        except Exception as e:
            log_error(e, request)
            response, status = on_error(str(e))
            return response, status

# Blueprint để đăng ký trong app
user_bp = Blueprint('user', __name__)
# api_extension = Api(user_bp)
# api_extension.add_namespace(api)