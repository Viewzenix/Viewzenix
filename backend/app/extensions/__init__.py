"""
Flask extensions module for the Viewzenix trading webhook platform.

This module initializes and configures Flask extensions
used throughout the application.
"""
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from supabase import create_client, Client

# Initialize Supabase client placeholder
supabase_client: Client = None



def get_supabase_client() -> Client:
    """
    Get the initialized Supabase client.

    Returns:
        Supabase client instance
    """
    return supabase_client

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()

def init_extensions(app):
    """
    Initialize Flask extensions and Supabase client.

    Args:
        app: Flask application instance
    """
    global supabase_client
    """
    Initialize Flask extensions.
    
    Args:
        app: Flask application instance
    """
    # Initialize SQLAlchemy
    db.init_app(app)
    
    # Initialize Flask-Migrate
    migrate.init_app(app, db)

    # Initialize Supabase client
    supabase_client = create_client(
        app.config.get('SUPABASE_URL'),
        app.config.get('SUPABASE_KEY')
    )