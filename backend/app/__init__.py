"""
Application factory for the Viewzenix trading webhook platform.

This module contains the application factory function for creating
a Flask application instance with the appropriate configuration.
"""
from flask import Flask
from typing import Dict, Any, Optional
import os
import logging
from logging.handlers import RotatingFileHandler

from app.config import get_config


def create_app(config_name: Optional[str] = None) -> Flask:
    """
    Create and configure a Flask application instance.
    
    Args:
        config_name: Configuration environment name
                     (development, testing, production)
                     If None, defaults to environment variable or development
    
    Returns:
        A configured Flask application instance
    """
    app = Flask(__name__)
    
    # Load configuration
    config = get_config(config_name)
    app.config.from_object(config)
    
    # Ensure log directory exists
    if not os.path.exists('logs'):
        os.mkdir('logs')
    
    # Set up logging
    _configure_logging(app)
    
    # Register blueprints
    _register_blueprints(app)
    
    return app


def _configure_logging(app: Flask) -> None:
    """
    Configure logging for the application.
    
    Args:
        app: Flask application instance
    """
    log_level = app.config.get("LOG_LEVEL", logging.INFO)
    
    # Set up file handler for general logs
    file_handler = RotatingFileHandler(
        'logs/viewzenix.log', 
        maxBytes=10485760,  # 10MB
        backupCount=10
    )
    file_handler.setFormatter(logging.Formatter(
        '%(asctime)s %(levelname)s: %(message)s '
        '[in %(pathname)s:%(lineno)d]'
    ))
    file_handler.setLevel(log_level)
    
    # Set up file handler for JSON logs
    json_handler = RotatingFileHandler(
        'logs/viewzenix.jsonl',
        maxBytes=10485760,  # 10MB
        backupCount=10
    )
    json_handler.setLevel(log_level)
    
    # Add handlers to app logger
    app.logger.addHandler(file_handler)
    app.logger.addHandler(json_handler)
    app.logger.setLevel(log_level)
    
    # Log application startup
    app.logger.info('Viewzenix startup')


def _register_blueprints(app: Flask) -> None:
    """
    Register blueprints with the application.
    
    Args:
        app: Flask application instance
    """
    # Import blueprints
    from app.api.routes.webhook import webhook_bp
    
    # Register blueprints
    app.register_blueprint(webhook_bp)