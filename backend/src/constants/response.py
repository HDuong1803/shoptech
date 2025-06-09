from flask import jsonify
from typing import TypeVar, Dict, Any, Optional
from src.constants.constants import CONSTANT

T = TypeVar('T')  # Generic type for SuccessResponse

# SuccessResponse equivalent as a dictionary
SuccessResponse = Dict[str, Any]  # {'data': T, 'message': str, 'success': bool, 'count': int, 'total': int}

# ErrorResponse equivalent as a dictionary
ErrorResponse = Dict[str, Any]  # {'message': str, 'success': bool, 'data': Any}

def on_error(error: Any, status_code: Optional[int] = None) -> tuple[ErrorResponse, int]:
    """
    Handles errors that occur during network requests and returns an error response object.
    
    Args:
        error: The error object or message.
        status_code: Optional HTTP status code to override default.
    
    Returns:
        tuple: (ErrorResponse, HTTP status code)
    """
    msg = None
    default_status = CONSTANT['NETWORK_STATUS_CODE']['INTERNAL_SERVER_ERROR']
    
    if isinstance(error, str):
        msg = error
    elif isinstance(error, Exception):
        msg = str(error)
    
    for key, status_message in CONSTANT['NETWORK_STATUS_MESSAGE'].items():
        if msg == status_message:
            default_status = CONSTANT['NETWORK_STATUS_CODE'][key]
            break
    
    status = status_code or default_status
    response = {
        'message': msg or CONSTANT['NETWORK_STATUS_MESSAGE']['INTERNAL_SERVER_ERROR'],
        'success': False,
        'data': str(error) if isinstance(error, Exception) else error
    }
    return response, status

def on_success(data: Any = None, total: Optional[int] = None) -> SuccessResponse:
    """
    Returns a success response object with the given data and total count.
    
    Args:
        data: The data to include in the response object.
        total: The total count of items in the response object.
    
    Returns:
        SuccessResponse: A success response object with the given data and total count.
    """
    if isinstance(data, list):
        return {
            'data': data,
            'success': True,
            'message': CONSTANT['NETWORK_STATUS_MESSAGE']['EMPTY'] if len(data) == 0 else CONSTANT['NETWORK_STATUS_MESSAGE']['SUCCESS'],
            'count': len(data),
            'total': total
        }
    return {
        'data': data,
        'success': True,
        'message': CONSTANT['NETWORK_STATUS_MESSAGE']['SUCCESS'],
        'count': 1,
        'total': total
    }

class ErrorHandler(Exception):
    """
    Custom exception class for handling validation errors.
    """
    def __init__(self, fields: Dict[str, Any], message: str):
        super().__init__(message)
        self.fields = fields