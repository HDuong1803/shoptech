import random
import string

def generate_random_verification_code(length: int) -> str:
    """
    Generates a random verification code of specified length.
    
    Args:
        length (int): The length of the verification code.
    
    Returns:
        str: A random verification code.
    """
    charset = string.ascii_letters + string.digits
    code = ''.join(random.choice(charset) for _ in range(length))
    return code