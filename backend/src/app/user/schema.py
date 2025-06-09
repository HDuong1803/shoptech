from marshmallow import Schema, fields, validate, validates, ValidationError

class UserSchema(Schema):
    id = fields.Str(data_key='id', attribute='id')
    username = fields.Str(allow_none=True)
    email = fields.Str(allow_none=True)
    verified = fields.Boolean(allow_none=True)
    password = fields.Str(allow_none=True, load_only=True)
    verification_code = fields.Str(allow_none=True)
    avatar_url = fields.Str(allow_none=True)
    role = fields.Integer(allow_none=True)
    phone = fields.Str(allow_none=True)
    two_factor_auth = fields.Boolean(allow_none=True)
    two_factor_secret = fields.Str(allow_none=True)
    refresh_token = fields.Str(allow_none=True)
    google_id = fields.Str(allow_none=True)
    last_login_at = fields.DateTime(allow_none=True)
    created_at = fields.DateTime(allow_none=True)
    updated_at = fields.DateTime(allow_none=True)

class InputUpdateUserSchema(Schema):
    username = fields.Str(allow_none=True)
    password = fields.Str(allow_none=True, load_only=True)
    phone = fields.Str(allow_none=True)
    avatar_url = fields.Str(allow_none=True)

class OutputListUserSchema(Schema):
    data = fields.List(fields.Nested(UserSchema))
    total = fields.Integer(allow_none=True)
