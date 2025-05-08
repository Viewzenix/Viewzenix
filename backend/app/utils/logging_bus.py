"""
Logging utilities for the Viewzenix trading webhook platform.

This module provides structured logging capabilities with both
human-readable and JSON formatted outputs.
"""
import logging
import json
import time
from typing import Dict, Any, Optional
from flask import request, g


class LoggingBus:
    """
    Dual-format logging system that outputs both:
    1. Human-readable logs to activity.log
    2. Machine-readable JSON logs to logs.jsonl
    """
    
    def __init__(self, name: str):
        """
        Initialize loggers with a specific name.
        
        Args:
            name: Logger name, typically the module name
        """
        # Setup human-readable logger
        self.text_logger = logging.getLogger(f"{name}.text")
        
        # Setup JSON logger
        self.json_logger = logging.getLogger(f"{name}.json")
    
    def info(self, message: str, extra: Optional[Dict[str, Any]] = None) -> None:
        """
        Log an info message to both log formats.
        
        Args:
            message: Log message
            extra: Additional context to include in the log
        """
        self._log(logging.INFO, message, extra)
    
    def warning(self, message: str, extra: Optional[Dict[str, Any]] = None) -> None:
        """
        Log a warning message to both log formats.
        
        Args:
            message: Log message
            extra: Additional context to include in the log
        """
        self._log(logging.WARNING, message, extra)
    
    def error(self, message: str, extra: Optional[Dict[str, Any]] = None, exc_info: bool = False) -> None:
        """
        Log an error message to both log formats.
        
        Args:
            message: Log message
            extra: Additional context to include in the log
            exc_info: Whether to include exception information
        """
        self._log(logging.ERROR, message, extra, exc_info)
    
    def debug(self, message: str, extra: Optional[Dict[str, Any]] = None) -> None:
        """
        Log a debug message to both log formats.
        
        Args:
            message: Log message
            extra: Additional context to include in the log
        """
        self._log(logging.DEBUG, message, extra)
    
    def _log(self, level: int, message: str, extra: Optional[Dict[str, Any]] = None, exc_info: bool = False) -> None:
        """
        Internal method to log to both formats.
        
        Args:
            level: Log level
            message: Log message
            extra: Additional context to include in the log
            exc_info: Whether to include exception information
        """
        # Get request ID if available
        request_id = getattr(g, 'request_id', 'no-request-id')
        
        # Prepare extra data
        log_extra = {
            'timestamp': time.time(),
            'request_id': request_id
        }
        
        if extra:
            log_extra.update(extra)
        
        # Log human-readable message
        self.text_logger.log(level, message, exc_info=exc_info, extra=log_extra)
        
        # Log JSON message
        json_message = {
            'message': message,
            'level': logging.getLevelName(level),
            **log_extra
        }
        
        # Don't include potentially sensitive data in logs
        if 'passphrase' in json_message:
            json_message['passphrase'] = '[REDACTED]'
        
        self.json_logger.log(
            level, 
            json.dumps(json_message),
            exc_info=exc_info
        )


def get_request_id() -> str:
    """
    Generate or retrieve a request ID for the current request.
    
    Returns:
        A unique request ID
    """
    if hasattr(g, 'request_id'):
        return g.request_id
    
    # Generate request ID from headers or create new one
    if request and request.headers.get('X-Request-ID'):
        request_id = request.headers.get('X-Request-ID')
    else:
        import uuid
        request_id = str(uuid.uuid4())
    
    # Store in Flask g object
    if request:
        g.request_id = request_id
    
    return request_id


def sanitize_log_data(data: Any) -> Any:
    """
    Sanitize data for logging to remove sensitive information.
    
    Args:
        data: Data to sanitize
        
    Returns:
        Sanitized data safe for logging
    """
    if isinstance(data, dict):
        result = {}
        for key, value in data.items():
            # Redact sensitive fields
            if key.lower() in ('passphrase', 'password', 'secret', 'key', 'token', 'api_key'):
                result[key] = '[REDACTED]'
            else:
                result[key] = sanitize_log_data(value)
        return result
    elif isinstance(data, list):
        return [sanitize_log_data(item) for item in data]
    else:
        return data 