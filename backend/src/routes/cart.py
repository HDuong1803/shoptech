from flask import Blueprint, jsonify, request
from flask_restx import Api, Namespace, Resource, fields
from src.app.cart.schema import InputCartItemSchema
from src.constants.constants import CONSTANT
from src.constants.response import on_success, on_error
from src.constants.logger import log_error
from src.middlewares.auth import auth_middleware
from src.providers.instance import Singleton
from marshmallow import ValidationError

# Define namespace for Swagger
api = Namespace('cart', description='Cart operations', path='/api/cart')

cart_item_model = api.model('CartItem', {
    'product_id': fields.String,
    'name': fields.String,
    'quantity': fields.Integer,
    'image': fields.String,
    'price': fields.Float
})

cart_model = api.model('Cart', {
    'id': fields.String(attribute='id'),
    'user_id': fields.String,
    'items': fields.List(fields.Nested(cart_item_model)),
    'total_price': fields.Float,
    'created_at': fields.DateTime,
    'updated_at': fields.DateTime
})

# Define response models for Swagger
success_cart_response = api.model('SuccessCartResponse', {
    'data': fields.Nested(cart_model),
    'message': fields.String(example='Success'),
    'success': fields.Boolean(example=True),
    'count': fields.Integer(example=1)
})

success_remove_response = api.model('SuccessRemoveResponse', {
    'data': fields.List(fields.Nested(cart_model)),
    'message': fields.String(example='Success'),
    'success': fields.Boolean(example=True),
    'count': fields.Integer(example=1)
})

error_response = api.model('ErrorResponse', {
    'message': fields.String,
    'success': fields.Boolean(example=False)
})

@api.route('')
class GetCart(Resource):
    @api.doc(security='Bearer Auth', responses={
        200: ('Success', success_cart_response),
        401: ('Unauthorized', error_response),
        422: ('Validation Error', error_response),
        500: ('Internal Server Error', error_response)
    })
    @api.marshal_with(success_cart_response, code=200)
    @auth_middleware()
    def get(self):
        """Retrieves the user's cart."""
        try:
            user_id = request.headers.get('id')
            result = Singleton.get_cart_instance().get_cart(user_id)
            return on_success(result), 200
        except Exception as e:
            log_error(e, request)
            response, status = on_error(str(e))
            return response, status

@api.route('/add')
class AddToCart(Resource):
    @api.doc(params={'product_id': 'Product ID'}, responses={
        200: ('Success', success_cart_response),
        401: ('Unauthorized', error_response),
        422: ('Validation Error', error_response),
        500: ('Internal Server Error', error_response)
    })
    @api.expect(cart_item_model)
    @api.marshal_with(success_cart_response, code=200)
    @auth_middleware()
    def post(self):
        """Adds an item to the user's cart."""
        try:
            data = InputCartItemSchema().load(request.get_json())
            user_id = request.headers.get('id')
            product_id = request.args.get('product_id')
            result = Singleton.get_cart_instance().add_to_cart(user_id, data, product_id)
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

@api.route('/item')
class RemoveItem(Resource):
    @api.doc(params={'product_id': 'Product ID'}, responses={
        200: ('Success', success_cart_response),
        401: ('Unauthorized', error_response),
        422: ('Validation Error', error_response),
        500: ('Internal Server Error', error_response)
    })
    @api.marshal_with(success_cart_response, code=200)
    @auth_middleware()
    def delete(self):
        """Removes an item from the user's cart."""
        try:
            user_id = request.headers.get('id')
            product_id = request.args.get('product_id')
            result = Singleton.get_cart_instance().remove_item(user_id, product_id)
            return on_success(result), 200
        except Exception as e:
            log_error(e, request)
            response, status = on_error(str(e))
            return response, status

# Blueprint to register in app
cart_bp = Blueprint('cart', __name__)
# api_extension = Api(cart_bp)
# api_extension.add_namespace(api)