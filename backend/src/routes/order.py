from flask import Blueprint, jsonify, request
from flask_restx import Api, Namespace, Resource, fields
from src.constants.constants import CONSTANT
from src.constants.response import on_success, on_error
from src.constants.logger import log_error
from src.middlewares.auth import auth_middleware, admin_middleware
from src.providers.instance import Singleton
from src.app.order.schema import OrderSchema, InputOrderItemSchema, OutputCheckoutSchema
from marshmallow import ValidationError

# Define namespace for Swagger
api = Namespace('order', description='Order operations', path='/api/order')

order_item_model = api.model('OrderItem', {
    'id': fields.String(attribute='id'),
    'product_id': fields.String,
    'name': fields.String,
    'quantity': fields.Integer,
    'image': fields.String,
    'price': fields.Float
})

shipping_address_model = api.model('ShippingAddress', {
    'id': fields.String(attribute='id'),
    'address': fields.String,
    'city': fields.String,
    'postal_code': fields.String,
    'country': fields.String
})

payment_result_model = api.model('PaymentResult', {
    'id': fields.String(attribute='id'),
    'status': fields.String,
    'update_time': fields.DateTime,
    'email_address': fields.String
})

order_model = api.model('Order', {
    'id': fields.String(attribute='id'),
    'user_id': fields.String,
    'username': fields.String,
    'email': fields.String,
    'order_items': fields.List(fields.Nested(order_item_model)),
    'shipping_address': fields.Nested(shipping_address_model),
    'payment_method': fields.String,
    'payment_result': fields.Nested(payment_result_model, allow_null=True),
    'items_price': fields.Float,
    'shipping_price': fields.Float,
    'tax_price': fields.Float,
    'total_price': fields.Float,
    'is_paid': fields.Boolean,
    'paid_at': fields.DateTime,
    'is_delivered': fields.Boolean,
    'delivered_at': fields.DateTime,
    'created_at': fields.DateTime,
    'updated_at': fields.DateTime
})

# Define response models for Swagger
success_list_order_response = api.model('SuccessListOrderResponse', {
    'data': fields.List(fields.Nested(order_model)),
    'message': fields.String(example='Success'),
    'success': fields.Boolean(example=True),
    'count': fields.Integer(example=1),
    'total': fields.Integer(example=1)
})

success_order_response = api.model('SuccessOrderResponse', {
    'data': fields.Nested(order_model),
    'message': fields.String(example='Success'),
    'success': fields.Boolean(example=True),
    'count': fields.Integer(example=1)
})

success_update_response = api.model('SuccessUpdateResponse', {
    'data': fields.Boolean(example=True),
    'message': fields.String(example='Success'),
    'success': fields.Boolean(example=True),
    'count': fields.Integer(example=1)
})

success_checkout_response = api.model('SuccessCheckoutResponse', {
    'data': fields.String,
    'message': fields.String(example='Success'),
    'success': fields.Boolean(example=True),
    'count': fields.Integer(example=1)
})

error_response = api.model('ErrorResponse', {
    'message': fields.String,
    'success': fields.Boolean(example=False)
})

@api.route('/list')
class ListOrders(Resource):
    @api.doc(params={
        'page': 'Page number (default: 1)',
        'limit': 'Number of orders per page (default: 5)'
    }, security='Bearer Auth', responses={
        200: ('Success', success_list_order_response),
        401: ('Unauthorized', error_response),
        422: ('Validation Error', error_response),
        500: ('Internal Server Error', error_response)
    })
    # @api.marshal_with(success_list_order_response, code=200)
    @auth_middleware()
    @admin_middleware()
    def get(self):
        """Retrieves a list of orders."""
        try:
            page = int(request.args.get('page', 1))
            limit = int(request.args.get('limit', 5))
            result = Singleton.get_order_instance().get_list_orders(page, limit)
            return on_success(result['data'], total=result['total']), 200
        except Exception as e:
            log_error(e, request)
            response, status = on_error(str(e))
            return response, status

@api.route('/<string:id>')
class GetOrder(Resource):
    @api.doc(security='Bearer Auth', responses={
        200: ('Success', success_order_response),
        401: ('Unauthorized', error_response),
        422: ('Validation Error', error_response),
        500: ('Internal Server Error', error_response)
    })
    @api.marshal_with(success_order_response, code=200)
    @auth_middleware()
    def get(self, id):
        """Retrieves an order by ID."""
        try:
            result = Singleton.get_order_instance().get_order(id)
            return on_success(result), 200
        except Exception as e:
            log_error(e, request)
            response, status = on_error(str(e))
            return response, status

@api.route('/<string:id>/pay')
class UpdateOrderToPaid(Resource):
    @api.doc(security='Bearer Auth', responses={
        200: ('Success', success_update_response),
        401: ('Unauthorized', error_response),
        422: ('Validation Error', error_response),
        500: ('Internal Server Error', error_response)
    })
    @api.marshal_with(success_update_response, code=200)
    @auth_middleware()
    @admin_middleware()
    def put(self, id):
        """Updates an order to paid status."""
        try:
            result = Singleton.get_order_instance().update_order_to_paid(id)
            return on_success(result), 200
        except Exception as e:
            log_error(e, request)
            response, status = on_error(str(e))
            return response, status

@api.route('/<string:id>/deliver')
class UpdateOrderToDelivered(Resource):
    @api.doc(security='Bearer Auth', responses={
        200: ('Success', success_update_response),
        401: ('Unauthorized', error_response),
        422: ('Validation Error', error_response),
        500: ('Internal Server Error', error_response)
    })
    @api.marshal_with(success_update_response, code=200)
    @auth_middleware()
    @admin_middleware()
    def put(self, id):
        """Updates an order to delivered status."""
        try:
            result = Singleton.get_order_instance().update_order_to_delivered(id)
            return on_success(result), 200
        except Exception as e:
            log_error(e, request)
            response, status = on_error(str(e))
            return response, status

@api.route('/add')
class AddOrder(Resource):
    @api.doc(security='Bearer Auth', responses={
        200: ('Success', success_order_response),
        401: ('Unauthorized', error_response),
        422: ('Validation Error', error_response),
        500: ('Internal Server Error', error_response)
    })
    @api.expect(InputOrderItemSchema)
    @api.marshal_with(success_order_response, code=200)
    @auth_middleware()
    def post(self):
        """Adds a new order."""
        try:
            data = InputOrderItemSchema().load(request.get_json())
            user_id = request.headers.get('id')
            result = Singleton.get_order_instance().add_order_items(data, user_id)
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

@api.route('')
class GetUserOrders(Resource):
    @api.doc(security='Bearer Auth', responses={
        200: ('Success', success_list_order_response),
        401: ('Unauthorized', error_response),
        422: ('Validation Error', error_response),
        500: ('Internal Server Error', error_response)
    })
    @api.marshal_with(success_list_order_response, code=200)
    @auth_middleware()
    def get(self):
        """Retrieves all orders of the user."""
        try:
            user_id = request.headers.get('id')
            result = Singleton.get_order_instance().get_order_of_user(user_id)
            return on_success(result, total=len(result)), 200
        except Exception as e:
            log_error(e, request)
            response, status = on_error(str(e))
            return response, status

@api.route('/checkout')
class GetCheckout(Resource):
    @api.doc(params={'order_id': 'Order ID'}, security='Bearer Auth', responses={
        200: ('Success', success_checkout_response),
        401: ('Unauthorized', error_response),
        422: ('Validation Error', error_response),
        500: ('Internal Server Error', error_response)
    })
    # @api.marshal_with(success_checkout_response, code=200)
    @auth_middleware()
    def post(self):
        """Retrieves a checkout session URL."""
        try:
            user_id = request.headers.get('id')
            order_id = request.args.get('order_id')
            result = Singleton.get_order_instance().get_checkout(user_id, order_id)
            return on_success(result), 200
        except Exception as e:
            log_error(e, request)
            response, status = on_error(str(e))
            return response, status

# Blueprint to register in app
order_bp = Blueprint('order', __name__)
# api_extension = Api(order_bp)
# api_extension.add_namespace(api)