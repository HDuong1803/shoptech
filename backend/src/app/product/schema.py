from marshmallow import Schema, fields, validates, ValidationError

class ReviewSchema(Schema):
    id = fields.Str(data_key='id', attribute='id')
    rating = fields.Float(required=True)
    comment = fields.Str(allow_none=True)
    user_id = fields.Str(required=True)
    username = fields.Str(required=True)
    created_at = fields.DateTime(allow_none=True)
    updated_at = fields.DateTime(allow_none=True)

class ProductSchema(Schema):
    id = fields.Str(data_key='id', attribute='id')
    name = fields.Str(required=True)
    image = fields.Str(required=True)  # Arweave URL, e.g., https://arweave.net/<transaction_id>
    description = fields.Str(allow_none=True)
    brand = fields.Str(allow_none=True)
    category = fields.Str(allow_none=True)
    price = fields.Float(required=True)
    count_in_stock = fields.Integer(required=True)
    rating = fields.Float(allow_none=True)
    num_reviews = fields.Integer(allow_none=True)
    reviews = fields.List(fields.Nested(ReviewSchema), allow_none=True)
    created_at = fields.DateTime(allow_none=True)
    updated_at = fields.DateTime(allow_none=True)

class InputItemSchema(Schema):
    name = fields.Str(required=True)
    image = fields.Str(required=True)
    description = fields.Str(allow_none=True)
    brand = fields.Str(allow_none=True)
    category = fields.Str(allow_none=True)
    price = fields.Float(required=True)
    count_in_stock = fields.Integer(required=True)

class InputReviewSchema(Schema):
    rating = fields.Float(required=True)
    comment = fields.Str(allow_none=True)

class OutputListProductSchema(Schema):
    data = fields.List(fields.Nested(ProductSchema))
    total = fields.Integer()

class OutputSearchProductSchema(Schema):
    data = fields.List(fields.Nested(ProductSchema))
    total = fields.Integer()

class OutputUploadSchema(Schema):
    image = fields.Str()

class SearchProductSchema(Schema):
    id = fields.Str(data_key='id', attribute='id')
    name = fields.Str()
    image = fields.Str()
    price = fields.Float()

class SearchProductListSchema(Schema):
    data = fields.List(fields.Nested(SearchProductSchema))
    total = fields.Integer()