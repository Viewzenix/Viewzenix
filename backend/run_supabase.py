"""
Supabase-enabled entry point for running the Viewzenix Flask application.
"""
import os
from dotenv import load_dotenv

# Explicitly load environment variables from .env file
load_dotenv()

# Verify Supabase environment variables are loaded
supabase_url = os.getenv('SUPABASE_URL')
supabase_key = os.getenv('SUPABASE_KEY')

print(f"SUPABASE_URL loaded: {'Yes' if supabase_url else 'No'}")
print(f"SUPABASE_KEY loaded: {'Yes' if supabase_key else 'No'}")

from app import create_app

# Create Flask application instance
app = create_app(os.getenv('FLASK_ENV', 'development'))

if __name__ == '__main__':
    # Run the application
    app.run(host='0.0.0.0', port=int(os.getenv('PORT', 5000)), debug=app.config['DEBUG']) 