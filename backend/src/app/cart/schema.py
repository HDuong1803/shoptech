from marshmallow import Schema, fields, validates, ValidationError

class CartItemSchema(Schema):
    id = fields.Str(data_key='id', attribute='id')
    product_id = fields.Str(allow_none=True)
    name = fields.Str(allow_none=True)
    quantity = fields.Integer(allow_none=True)
    image = fields.Str(allow_none=True)
    price = fields.Float(allow_none=True)

class CartSchema(Schema):
    id = fields.Str(data_key='id', attribute='id')
    user_id = fields.Str(allow_none=True)
    cart = fields.List(fields.Nested(CartItemSchema), data_key='items')

class InputCartItemSchema(Schema):
    product_id = fields.Str(required=True)
    name = fields.Str(required=True)
    quantity = fields.Integer(required=True)
    image = fields.Str(required=True)
    price = fields.Float(required=True)

    # @validates('quantity')
    # def validate_quantity(self, value):
    #     if value < 1:
    #         raise ValidationError("Quantity must be at least 1.")

    # @validates('price')
    # def validate_price(self, value):
    #     if value <= 0:
    #         raise ValidationError("Price must be greater than 0.")