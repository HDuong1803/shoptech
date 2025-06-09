from flask import Blueprint, jsonify, request
from flask_restx import Api, Namespace, Resource, fields
from werkzeug.datastructures import FileStorage
from src.app.product.schema import InputItemSchema, InputReviewSchema, ProductSchema, ReviewSchema
from src.constants.constants import CONSTANT
from src.constants.response import on_success, on_error
from src.constants.logger import log_error
from src.middlewares.auth import auth_middleware, admin_middleware
from src.models.product import Product
from src.providers.instance import Singleton
from marshmallow import ValidationError

# Định nghĩa namespace cho Swagger
api = Namespace('product', description='Product operations', path='/api/product')

review_model = api.model('Review', {
    'id': fields.String(attribute='id'),
    'rating': fields.Float,
    'comment': fields.String,
    'user_id': fields.String,
    'username': fields.String,
    'created_at': fields.DateTime,
    'updated_at': fields.DateTime
})

# Register Product model
product_model = api.model('Product', {
    'id': fields.String(attribute='id'),
    'name': fields.String,
    'image': fields.String,
    'description': fields.String,
    'brand': fields.String,
    'category': fields.String,
    'price': fields.Float,
    'count_in_stock': fields.Integer,
    'rating': fields.Float,
    'num_reviews': fields.Integer,
    'reviews': fields.List(fields.Nested(review_model)),
    'created_at': fields.DateTime,
    'updated_at': fields.DateTime
})

submit_review_model = api.model('SubmitReview', {
    'rating': fields.Float(required=True, example=4.5, description='Rating for the product'),
    'comment': fields.String(required=True, example='Great product!', description='Review comment')
})

search_product_model = api.model('SearchProduct', {
    'id': fields.String,
    'name': fields.String,
    'image': fields.String,
    'price': fields.Float,
})

search_products_model = api.model('SearchProducts', {
    'data': fields.List(fields.Nested(search_product_model)),
    'total': fields.Integer
})

# Định nghĩa model response cho Swagger
success_list_product_response = api.model('SuccessListProductResponse', {
    'data': fields.List(fields.Nested(product_model)),
    'message': fields.String(example='Success'),
    'success': fields.Boolean(example=True),
    'count': fields.Integer(example=2),
    'total': fields.Integer(example=24)
})

success_product_response = api.model('SuccessProductResponse', {
    'data': fields.Nested(product_model),
    'message': fields.String(example='Success'),
    'success': fields.Boolean(example=True),
    'count': fields.Integer(example=1)
})

success_products_search_response = api.model('SuccessProductsSearchResponse', {
    'data': fields.List(fields.Nested(search_product_model)),
    'message': fields.String(example='Success'),
    'success': fields.Boolean(example=True),
    'count': fields.Integer(example=1),
    'total': fields.Integer(example=24)
})

success_review_response = api.model('SuccessReviewResponse', {
    'data': fields.Nested(review_model),
    'message': fields.String(example='Success'),
    'success': fields.Boolean(example=True),
    'count': fields.Integer(example=1)
})

success_upload_response = api.model('SuccessUploadResponse', {
    'data': fields.List(fields.String),
    'message': fields.String(example='Success'),
    'success': fields.Boolean(example=True),
    'count': fields.Integer(example=1)
})

success_remove_response = api.model('SuccessRemoveResponse', {
    'data': fields.String(example='Success'),
    'message': fields.String(example='Success'),
    'success': fields.Boolean(example=True),
    'count': fields.Integer(example=1)
})

error_response = api.model('ErrorResponse', {
    'message': fields.String,
    'success': fields.Boolean(example=False)
})

# Parser cho upload file
upload_parser = api.parser()
upload_parser.add_argument('image', type=FileStorage, location='files', required=True)

@api.route('/list/item')
class ListProduct(Resource):
    @api.doc(params={
        'page': 'Page number (default: 1)',
        'limit': 'Number of products per page (default: 5)'
    }, responses={
        200: ('Success', success_list_product_response),
        401: ('Unauthorized', error_response),
        422: ('Validation Error', error_response),
        500: ('Internal Server Error', error_response)
    })
    @api.marshal_with(success_list_product_response, code=200)
    def get(self):
        """Retrieves a list of products."""
        try:
            page = int(request.args.get('page', 1))
            limit = int(request.args.get('limit', 5))
            result = Singleton.get_product_instance().get_list_product(page, limit)
            return on_success(result['data'], total=result['total']), 200
        except Exception as e:
            log_error(e, request)
            response, status = on_error(str(e))
            return response, status

@api.route('/detail')
class ProductDetail(Resource):
    @api.doc(params={'id': 'Product ID'}, responses={
        200: ('Success', success_product_response),
        401: ('Unauthorized', error_response),
        422: ('Validation Error', error_response),
        500: ('Internal Server Error', error_response)
    })
    @api.marshal_with(success_product_response, code=200)
    def get(self):
        """Retrieves a product by ID."""
        try:
            product_id = request.args.get('id')
            result = Singleton.get_product_instance().get_product_by_id(product_id)
            return on_success(result), 200
        except Exception as e:
            log_error(e, request)
            response, status = on_error(str(e))
            return response, status

@api.route('/search')
class SearchProduct(Resource):
    @api.doc(params={'keyword': 'Search keyword'}, responses={
        200: ('Success', success_products_search_response),
        401: ('Unauthorized', error_response),
        422: ('Validation Error', error_response),
        500: ('Internal Server Error', error_response)
    })
    def get(self):
        """Searches for products by keyword."""
        try:
            keyword = request.args.get('keyword', '').strip()
            if not keyword:
                return on_success({'data': [], 'total': 0}), 200
            products = Product.query.filter(Product.name.ilike(f'%{keyword}%')).limit(5).all()

            result = {
                'data': [
                    {
                        'id': product.id,
                        'name': product.name,
                        'image': product.image,
                        'price': product.price
                    } for product in products
                ],
                'total': len(products)
            }

            return on_success(result), 200
        except Exception as e:
            log_error(e, request)
            response, status = on_error(str(e))
            return response, status

@api.route('/upload')
class UploadImage(Resource):
    @api.doc(responses={
        200: ('Success', success_upload_response),
        401: ('Unauthorized', error_response),
        422: ('Validation Error', error_response),
        500: ('Internal Server Error', error_response)
    })
    @api.expect(upload_parser)
    # @api.marshal_with(success_upload_response, code=200)
    def post(self):
        try:
            image = request.files['image']
            if not image:
                return on_error("No image provided"), 422
            content_type = image.mimetype or 'image/jpeg'  # Fallback to jpeg
            result = Singleton.get_product_instance().upload_images(image.read(), content_type)
            return on_success({'data': result}), 200
        except Exception as e:
            log_error(e, request)
            response, status = on_error(str(e))
            return response, status

@api.route('/item/review')
class AddReview(Resource):
    @api.doc(params={'product_id': 'Product ID'}, responses={
        200: ('Success', success_review_response),
        401: ('Unauthorized', error_response),
        422: ('Validation Error', error_response),
        500: ('Internal Server Error', error_response)
    })
    @api.expect(submit_review_model)
    @api.marshal_with(success_review_response, code=200)
    @auth_middleware()
    def post(self):
        """Adds a review for a product."""
        try:
            data = InputReviewSchema().load(request.get_json())
            product_id = request.args.get('product_id')
            user_id = request.headers.get('id')
            result = Singleton.get_product_instance().add_product_review(data, product_id, user_id)
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

@api.route('/add')
class AddProduct(Resource):
    @api.doc(responses={
        200: ('Success', success_product_response),
        401: ('Unauthorized', error_response),
        422: ('Validation Error', error_response),
        500: ('Internal Server Error', error_response)
    })
    @api.expect(InputItemSchema)
    @api.marshal_with(success_product_response, code=200)
    @admin_middleware()
    def post(self):
        """Adds a new product."""
        try:
            data = InputItemSchema().load(request.get_json())
            print(f"Received data: {data}")
            result = Singleton.get_product_instance().add_product_item(data)
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

@api.route('/update')
class UpdateProduct(Resource):
    @api.doc(params={'id': 'Product ID'}, responses={
        200: ('Success', success_product_response),
        401: ('Unauthorized', error_response),
        422: ('Validation Error', error_response),
        500: ('Internal Server Error', error_response)
    })
    @api.expect(InputItemSchema)
    @api.marshal_with(success_product_response, code=200)
    def put(self):
        """Updates a product."""
        try:
            data = InputItemSchema().load(request.get_json())
            product_id = request.args.get('id')
            result = Singleton.get_product_instance().update_item(data, product_id)
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

@api.route('/remove')
class RemoveProduct(Resource):
    @api.doc(params={'id': 'Product ID'}, responses={
        200: ('Success', success_remove_response),
        401: ('Unauthorized', error_response),
        422: ('Validation Error', error_response),
        500: ('Internal Server Error', error_response)
    })
    @api.marshal_with(success_remove_response, code=200)
    def delete(self):
        """Removes a product."""
        try:
            product_id = request.args.get('id')
            result = Singleton.get_product_instance().remove_item(product_id)
            return on_success(result), 200
        except Exception as e:
            log_error(e, request)
            response, status = on_error(str(e))
            return response, status

product_bp = Blueprint('product', __name__)
# api_extension = Api(product_bp)
# api_extension.add_namespace(api)