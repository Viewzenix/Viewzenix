from functools import wraps
from flask import request, jsonify, g
from app.extensions import get_supabase_client


def require_supabase_auth(f):
    """
    Middleware to require and validate Supabase JWT in Authorization header.
    On success, sets g.user_id to the Supabase user ID.
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({
                'status': 'error',
                'code': 'UNAUTHORIZED',
                'message': 'Missing or invalid Authorization header'
            }), 401
        token = auth_header.split(' ')[1]
        supabase = get_supabase_client()
        user_resp = supabase.auth.api.get_user(token)
        if user_resp.error or not user_resp.user:
            return jsonify({
                'status': 'error',
                'code': 'UNAUTHORIZED',
                'message': 'Invalid or expired token'
            }), 401
        # Set the current user ID for route handlers
        g.user_id = user_resp.user.id
        return f(*args, **kwargs)
    return decorated_function 