from marshmallow import ValidationError
from .schema import InputItemSchema, InputReviewSchema

def input_item_validate(data: dict) -> None:
    """
    Validates input for adding a product item.
    
    Args:
        data (dict): Input product data.
    
    Raises:
        ValidationError: If validation fails.
    """
    schema = InputItemSchema()
    errors = schema.validate(data)
    if errors:
        raise ValidationError(errors)

def input_review_validate(data: dict) -> None:
    """
    Validates input for adding a product review.
    
    Args:
        data (dict): Input review data.
    
    Raises:
        ValidationError: If validation fails.
    """
    schema = InputReviewSchema()
    errors = schema.validate(data)
    if errors:
        raise ValidationError(errors)