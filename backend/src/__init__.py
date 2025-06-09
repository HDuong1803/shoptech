from datetime import datetime, timezone
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_restx import Api
from src.extensions import db, migrate, jwt
from src.config import Config
from src.constants.constants import CONSTANT
from src.constants.logger import logger, log_request
from src.constants.response import on_error
from src.providers.initial import initial_database, initial_admin
from src.providers.webhook import handle_webhook
from src.routes.auth import auth_bp
from src.routes.product import product_bp
from src.routes.cart import cart_bp
from src.routes.order import order_bp
from src.routes.admin import admin_bp
from src.routes.user import user_bp
from src.routes.auth import api as auth_api
from src.routes.product import api as product_api
from src.routes.cart import api as cart_api
from src.routes.order import api as order_api
from src.routes.admin import api as admin_api
from src.routes.user import api as user_api
import time
from marshmallow import ValidationError

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Khởi tạo extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Khởi tạo database và admin
    with app.app_context():
        try:
            initial_database()
            initial_admin()
            logger.info(f"[InitialAdmin] {CONSTANT['ADMIN_INITIAL_EMAIL']}")
        except Exception as e:
            logger.error(f"[InitialAdmin/Database] {str(e)}")

    # Đăng ký blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(product_bp)
    app.register_blueprint(cart_bp)
    app.register_blueprint(order_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(user_bp)

    # Swagger UI
    api = Api(
        app,
        version='1.0',
        title='Laptop Store API',
        description='API for Laptop Store',
        doc='/docs'
    )

    api.add_namespace(auth_api)
    api.add_namespace(product_api)
    api.add_namespace(cart_api)
    api.add_namespace(order_api)
    api.add_namespace(admin_api)
    api.add_namespace(user_api)

    # Webhook route
    @app.route('/api/webhook/stripe', methods=['POST'])
    def stripe_webhook():
        try:
            result = handle_webhook()
            return jsonify(result), 200
        except ValueError as e:
            return jsonify({'error': str(e)}), 400

    # Middleware ghi log response time
    @app.before_request
    def start_timer():
        request.start_time = time.time()

    @app.after_request
    def log_response(response):
        duration = (time.time() - request.start_time) * 1000  # ms
        log_request(request, response, duration)
        return response

    # Xử lý lỗi
    @app.errorhandler(ValidationError)
    def handle_validation_error(error):
        processed_fields = {k.replace('body.', ''): v for k, v in error.messages.items()}
        response, status = on_error({
            **processed_fields,
            'message': CONSTANT['NETWORK_STATUS_MESSAGE']['VALIDATE_ERROR']
        }, CONSTANT['NETWORK_STATUS_CODE']['VALIDATE_ERROR'])
        return jsonify(response), status

    @app.errorhandler(Exception)
    def handle_general_error(error):
        response, status = on_error(str(error), CONSTANT['NETWORK_STATUS_CODE']['INTERNAL_SERVER_ERROR'])
        return jsonify(response), status

    logger.info(f"Server start at {datetime.now(tz=timezone.utc).strftime('%Y-%m-%d %H:%M:%S')}")

    return app