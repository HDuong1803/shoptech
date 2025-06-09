from marshmallow import Schema, fields, validates, ValidationError

class OrderItemSchema(Schema):
    id = fields.Str(data_key='id', attribute='id')
    product_id = fields.Str(allow_none=True)
    name = fields.Str(allow_none=True)
    quantity = fields.Integer(allow_none=True)
    image = fields.Str(allow_none=True)
    price = fields.Float(allow_none=True)

class ShippingAddressSchema(Schema):
    id = fields.Str(data_key='id', attribute='id')
    address = fields.Str(allow_none=True)
    city = fields.Str(allow_none=True)
    postal_code = fields.Str(allow_none=True)
    country = fields.Str(allow_none=True)

class PaymentResultSchema(Schema):
    id = fields.Str(data_key='id', attribute='id')
    status = fields.Str(allow_none=True)
    update_time = fields.DateTime(allow_none=True)
    email_address = fields.Str(allow_none=True)

class OrderSchema(Schema):
    id = fields.Str(data_key='id', attribute='id')
    user_id = fields.Str(allow_none=True)
    username = fields.Str(allow_none=True)
    email = fields.Str(allow_none=True)
    order_items = fields.List(fields.Nested(OrderItemSchema), allow_none=True)
    shipping_address = fields.Nested(ShippingAddressSchema, allow_none=True)
    payment_method = fields.Str(allow_none=True)
    payment_result = fields.Nested(PaymentResultSchema, allow_none=True)
    shipping_price = fields.Float(allow_none=True)
    total_price = fields.Float(allow_none=True)
    is_paid = fields.Boolean(allow_none=True)
    paid_at = fields.DateTime(allow_none=True)
    is_delivered = fields.Boolean(allow_none=True)
    delivered_at = fields.DateTime(allow_none=True)
    created_at = fields.DateTime(allow_none=True)
    updated_at = fields.DateTime(allow_none=True)

class InputOrderItemSchema(Schema):
    shipping_address = fields.Nested(ShippingAddressSchema, required=True)
    payment_method = fields.Str(required=True)

    # @validates('shipping_address')
    # def validate_shipping_address(self, value):
    #     if not all([value.get('address'), value.get('city'), value.get('postal_code'), value.get('country')]):
    #         raise ValidationError("All shipping address fields are required.")

class OutputCheckoutSchema(Schema):
    data = fields.Str()