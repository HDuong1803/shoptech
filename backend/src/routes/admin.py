from flask import Blueprint, request
from flask_restx import Namespace, Resource, fields, Api
from src.constants.response import on_success, on_error
from src.constants.logger import log_error
from src.middlewares.auth import auth_middleware, admin_middleware
from src.providers.instance import Singleton

# Định nghĩa namespace cho Swagger
api = Namespace('admin', description='Admin operations', path='/api/admin')

# Định nghĩa model response cho Swagger
admin_response = api.model('Admin', {
    'id': fields.String(example='65dc4e4cc7d2ffcebd571312'),
    'email': fields.String(example='administrator@gmail.com'),
    'username': fields.String(example='admin'),
    'role': fields.Integer(example=1),
    'phone': fields.String(example='0000000000'),
    'refresh_token': fields.String(example=''),
    'update_at': fields.DateTime,
    'create_at': fields.DateTime
})

success_response = api.model('SuccessResponse', {
    'data': fields.Nested(admin_response),
    'message': fields.String(example='Success'),
    'success': fields.Boolean(example=True),
    'count': fields.Integer(example=1)
})

error_response = api.model('ErrorResponse', {
    'message': fields.String,
    'success': fields.Boolean(example=False)
})

@api.route('/info')
class AdminInfo(Resource):
    @api.doc(
        security='Bearer Auth',
        responses={
            200: ('Success', success_response),
            401: ('Unauthorized', error_response),
            422: ('Validation Error', error_response),
            500: ('Internal Server Error', error_response)
        }
    )
    @api.marshal_with(success_response, code=200)
    @auth_middleware()
    @admin_middleware()
    def get(self):
        """
        Retrieves information about the admin user.
        
        Returns:
            dict: Success response with admin data or error response.
        """
        try:
            admin_data = Singleton.get_admin_instance().info_admin()
            return on_success(admin_data), 200
        except Exception as e:
            log_error(e, request)
            response, status = on_error(str(e))
            return response, status

# Blueprint để đăng ký trong app
admin_bp = Blueprint('admin', __name__)
# api_extension = Api(admin_bp)
# api_extension.add_namespace(api)