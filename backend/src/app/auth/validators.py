from marshmallow import ValidationError

from src.app.auth.schema import InputLoginSchema

def input_login_validate(data: dict) -> None:
    """
    Validates login input data.
    
    Args:
        data (dict): Input data containing email and password.
    
    Raises:
        ValidationError: If validation fails.
    """
    schema = InputLoginSchema()
    errors = schema.validate(data)
    if errors:
        raise ValidationError(errors)