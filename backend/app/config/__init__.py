"""
Configuration module for the Viewzenix trading webhook platform.

This module defines configuration classes for different environments.
"""
import os
import logging
from typing import Dict, Any, Type


class Config:
    """Base configuration class."""
    # Flask settings
    DEBUG = False
    TESTING = False
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-key-change-in-production'
    
    # Logging settings
    LOG_LEVEL = logging.INFO
    
    # Application settings
    WEBHOOK_PASSPHRASE = os.environ.get('WEBHOOK_PASSPHRASE') or 'dev-passphrase'


class DevelopmentConfig(Config):
    """Development configuration."""
    DEBUG = True
    LOG_LEVEL = logging.DEBUG


class TestingConfig(Config):
    """Testing configuration."""
    TESTING = True
    DEBUG = True
    LOG_LEVEL = logging.DEBUG
    # Use in-memory database for testing


class ProductionConfig(Config):
    """Production configuration."""
    # Ensure SECRET_KEY is set in production
    SECRET_KEY = os.environ.get('SECRET_KEY')
    
    # Ensure WEBHOOK_PASSPHRASE is set in production
    WEBHOOK_PASSPHRASE = os.environ.get('WEBHOOK_PASSPHRASE')
    
    @classmethod
    def init_app(cls, app):
        """
        Initialize production application.
        
        Args:
            app: Flask application instance
        """
        # Ensure critical config vars are set
        assert cls.SECRET_KEY, "SECRET_KEY environment variable must be set"
        assert cls.WEBHOOK_PASSPHRASE, "WEBHOOK_PASSPHRASE environment variable must be set"


# Map of environment names to configuration classes
config_map: Dict[str, Type[Config]] = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig,
}


def get_config(config_name: str = None) -> Type[Config]:
    """
    Get configuration class based on the environment name.
    
    Args:
        config_name: Name of the configuration environment
                    (development, testing, production)
                    If None, reads from FLASK_ENV environment variable
                    or defaults to 'default'
    
    Returns:
        Configuration class
    """
    if not config_name:
        config_name = os.environ.get('FLASK_ENV', 'default')
    
    return config_map.get(config_name, config_map['default']) 