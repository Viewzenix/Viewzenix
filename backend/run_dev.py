"""
Development server runner for the Viewzenix trading webhook platform.
This script sets up a development environment and runs the Flask server.
"""
import os
import sys
from pathlib import Path

# Set environment variables for development
os.environ['FLASK_ENV'] = 'development'
os.environ['FLASK_DEBUG'] = '1'
# Force SQLite database
os.environ['DATABASE_URL'] = 'sqlite:///viewzenix.db'

# Make sure application directory is in path
app_dir = Path(__file__).parent
sys.path.insert(0, str(app_dir))

# Import the Flask app
from app import create_app

if __name__ == '__main__':
    app = create_app()
    try:
        # Create tables if they don't exist
        from app.extensions import db
        with app.app_context():
            db.create_all()
        print("Database tables created successfully")
    except Exception as e:
        print(f"Error creating database tables: {e}")

    # Run the app
    print(f"Starting development server at http://127.0.0.1:8000")
    app.run(host='127.0.0.1', port=8000)