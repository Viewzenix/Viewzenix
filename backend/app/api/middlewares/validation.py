"""
Validation middleware for API requests in the Viewzenix platform.

This module provides JSON schema validation for API endpoints.
"""
import jsonschema
from flask import request, jsonify
from functools import wraps
from typing import Dict, Any, Callable, TypeVar, cast

from app.utils.logging_bus import LoggingBus, sanitize_log_data

# Type variable for function return type
F = TypeVar('F', bound=Callable[..., Any])

# Initialize logger
logger = LoggingBus(__name__)


class ValidationError(Exception):
    """Exception raised for validation errors."""
    
    def __init__(self, message: str, details: Dict[str, Any] = None):
        """
        Initialize validation error.
        
        Args:
            message: Error message
            details: Additional error details
        """
        self.message = message
        self.details = details or {}
        super().__init__(message)


def validate_schema(schema: Dict[str, Any]) -> Callable[[F], F]:
    """
    Validate request JSON against the provided schema.
    
    Args:
        schema: JSON schema to validate against
        
    Returns:
        Decorated function
    """
    def decorator(f: F) -> F:
        @wraps(f)
        def decorated_function(*args: Any, **kwargs: Any) -> Any:
            # Get request JSON
            request_json = request.get_json()
            if not request_json:
                error_message = "Missing or invalid JSON payload"
                logger.warning(error_message)
                return jsonify({
                    "status": "error",
                    "code": "INVALID_JSON",
                    "message": error_message
                }), 400
            
            # Log sanitized request data at debug level
            logger.debug(
                "Validating request data", 
                extra={"data": sanitize_log_data(request_json)}
            )
            
            # Validate against schema
            try:
                jsonschema.validate(instance=request_json, schema=schema)
            except jsonschema.exceptions.ValidationError as e:
                error_path = ".".join(str(p) for p in e.path) if e.path else "unknown"
                error_message = f"Invalid data at {error_path}: {e.message}"
                
                logger.warning(
                    f"Schema validation error: {error_message}",
                    extra={
                        "path": error_path,
                        "schema_error": e.message
                    }
                )
                
                return jsonify({
                    "status": "error",
                    "code": "SCHEMA_VALIDATION_ERROR",
                    "message": error_message,
                    "details": {
                        "path": error_path,
                        "error": e.message
                    }
                }), 400
            
            # Continue to the route handler
            return f(*args, **kwargs)
        
        return cast(F, decorated_function)
    return decorator 