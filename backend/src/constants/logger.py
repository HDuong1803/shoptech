import logging
import os
from datetime import datetime
from flask import request, Response

# Configure logger
logger = logging.getLogger('laptop_store')
logger.setLevel(logging.INFO)

# Console handler
console_handler = logging.StreamHandler()
console_handler.setFormatter(logging.Formatter(
    '[%(asctime)s] [%(levelname)s] %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
))
logger.addHandler(console_handler)

# File handlers
log_dir = os.path.join(os.path.dirname(__file__), '../logs')
os.makedirs(log_dir, exist_ok=True)

error_handler = logging.FileHandler(os.path.join(log_dir, 'error.log'))
error_handler.setLevel(logging.ERROR)
error_handler.setFormatter(logging.Formatter(
    '[%(asctime)s] [%(levelname)s] %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
))
logger.addHandler(error_handler)

info_handler = logging.FileHandler(os.path.join(log_dir, 'info.log'))
info_handler.setLevel(logging.INFO)
info_handler.setFormatter(logging.Formatter(
    '[%(asctime)s] [%(levelname)s] %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
))
logger.addHandler(info_handler)

def log_request(req, res: Response, time: float) -> None:
    """
    Logs the details of an HTTP request and response to the console.
    
    Args:
        req: The Flask request object.
        res: The Flask response object.
        time: The time taken to process the request in milliseconds.
    """
    method = req.method
    url = req.url
    ip = req.remote_addr
    authorization = req.headers.get('Authorization')
    body = req.get_json(silent=True) or {}
    query = req.args.to_dict()
    status_code = res.status_code
    logger.info(
        f"[{method}] {url} {ip} authorization={authorization} body={body} query={query} status={status_code} time={time}ms",
        extra={
            'method': method,
            'url': url,
            'ip': ip,
            'authorization': authorization,
            'body': body,
            'query': query,
            'duration': time,
            'status': status_code
        }
    )

def log_error(err: Exception, req, prefix: str = '') -> None:
    """
    Logs error details for a request.
    
    Args:
        err: The exception object.
        req: The Flask request object.
        prefix: Optional prefix for the log message.
    """
    method = req.method
    url = req.url
    ip = req.remote_addr
    authorization = req.headers.get('Authorization')
    body = req.get_json(silent=True) or {}
    query = req.args.to_dict()
    logger.error(
        f"{prefix}[{method}] {url} {ip} authorization={authorization} body={body} query={query}",
        extra={
            'method': method,
            'url': url,
            'ip': ip,
            'authorization': authorization,
            'body': body,
            'query': query,
            'error': str(err),
            'stack': err.__traceback__
        }
    )