"""
Entry point for running the Viewzenix Flask application.
"""
import os
from app import create_app

# Create Flask application instance
app = create_app(os.getenv('FLASK_ENV', 'development'))

if __name__ == '__main__':
    # Run the application
    app.run(host='0.0.0.0', port=int(os.getenv('PORT', 5000)), debug=app.config['DEBUG']) 