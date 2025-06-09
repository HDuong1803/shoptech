from marshmallow import Schema, fields, validates, ValidationError
import re

class InputLoginAdminSchema(Schema):
    email = fields.Str(required=True)
    password = fields.Str(required=True, load_only=True)

class InputRefreshTokenSchema(Schema):
    refresh_token = fields.Str(required=True)

class InputVerifyPasswordSchema(Schema):
    password = fields.Str(required=True, load_only=True)

class VerifyGoogleInputSchema(Schema):
    google_token_id = fields.Str(required=True)

class InputSignUpSchema(Schema):
    username = fields.Str(required=True)
    email = fields.Str(required=True)
    password = fields.Str(required=True, load_only=True)
    phone = fields.Str(required=True)

class OutputLoginAdminSchema(Schema):
    detail = fields.Dict(allow_none=True)
    access_token = fields.Str(allow_none=True)
    refresh_token = fields.Str(allow_none=True)

class OutputRefreshTokenSchema(Schema):
    access_token = fields.Str()

class OutputVerifyPasswordSchema(Schema):
    authorized = fields.Boolean()

class OutputLogoutSchema(Schema):
    logout = fields.Boolean()

class InputLoginSchema(Schema):
    email = fields.Str(required=True)
    password = fields.Str(required=True, load_only=True)

    # @validates('email')
    # def validate_email(self, value):
    #     if not 8 <= len(value) <= 320:
    #         raise ValidationError("Email must be between 8 and 320 characters.")
    #     if re.match(r'^[^a-zA-Z0-9]', value):
    #         raise ValidationError("Email must not start with special character.")
    #     if '@' in value:
    #         if not re.match(r'^[a-zA-Z0-9]+([._-][a-zA-Z0-9]+)*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', value):
    #             raise ValidationError("Email must be a valid email address.")
    #         after_email = value.split('@')[1]
    #         if re.search(r'(\W)\1', after_email):
    #             raise ValidationError("Email must not contain consecutive special characters.")

    # @validates('password')
    # def validate_password(self, value):
    #     if not 8 <= len(value) <= 320:
    #         raise ValidationError("Password must be between 8 and 320 characters.")
    #     checks = [
    #         bool(re.search(r'[a-z]', value)),
    #         bool(re.search(r'[A-Z]', value)),
    #         bool(re.search(r'[0-9]', value)),
    #         bool(re.search(r'[^a-zA-Z0-9]', value))
    #     ]
    #     if sum(checks) < 3:
    #         raise ValidationError(
    #             "Password must contain at least 3 of: lowercase letters, uppercase letters, numbers, special characters."
    #         )