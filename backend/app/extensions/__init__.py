"""
Flask extensions module for the Viewzenix trading webhook platform.

This module initializes and configures Flask extensions
used throughout the application.
"""
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()

def init_extensions(app):
    """
    Initialize Flask extensions.
    
    Args:
        app: Flask application instance
    """
    # Initialize SQLAlchemy
    db.init_app(app)
    
    # Initialize Flask-Migrate
    migrate.init_app(app, db)