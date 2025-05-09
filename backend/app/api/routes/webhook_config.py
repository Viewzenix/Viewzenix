"""
Webhook configuration management endpoints.

This module defines the webhook_config blueprint with CRUD endpoints for
managing webhook configurations.
"""
from flask import Blueprint, request, jsonify, current_app, g
from typing import Tuple
from datetime import datetime
import uuid

from app.extensions import get_supabase_client
from app.utils.logging_bus import LoggingBus
from app.api.middlewares.validation import validate_schema
from app.api.middlewares.auth import require_supabase_auth

# Create blueprint
webhook_config_bp = Blueprint('webhook_config', __name__, url_prefix='/webhooks')

# Initialize logger
logger = LoggingBus(__name__)

# WebhookConfig schema for validation
WEBHOOK_CONFIG_SCHEMA = {
    "type": "object",
    "required": ["name", "securityToken"],
    "properties": {
        "name": {"type": "string", "minLength": 1, "maxLength": 255},
        "description": {"type": "string"},
        "securityToken": {"type": "string", "minLength": 6, "maxLength": 255},
        "notificationPreferences": {
            "type": "object",
            "properties": {
                "email": {"type": "boolean"},
                "browser": {"type": "boolean"},
                "onSuccess": {"type": "boolean"},
                "onFailure": {"type": "boolean"}
            }
        },
        "isActive": {"type": "boolean"}
    },
    "additionalProperties": False
}

# WebhookConfig update schema for validation
WEBHOOK_CONFIG_UPDATE_SCHEMA = {
    "type": "object",
    "properties": {
        "name": {"type": "string", "minLength": 1, "maxLength": 255},
        "description": {"type": "string"},
        "securityToken": {"type": "string", "minLength": 6, "maxLength": 255},
        "notificationPreferences": {
            "type": "object",
            "properties": {
                "email": {"type": "boolean"},
                "browser": {"type": "boolean"},
                "onSuccess": {"type": "boolean"},
                "onFailure": {"type": "boolean"}
            }
        },
        "isActive": {"type": "boolean"}
    },
    "additionalProperties": False
}

# WebhookConfig toggle schema for validation
WEBHOOK_CONFIG_TOGGLE_SCHEMA = {
    "type": "object",
    "required": ["isActive"],
    "properties": {
        "isActive": {"type": "boolean"}
    },
    "additionalProperties": False
}

@webhook_config_bp.route('', methods=['GET'])
@require_supabase_auth
def get_all_webhook_configs() -> Tuple[Any, int]:
    """
    Get all webhook configurations.
    
    Returns:
        JSON response with all webhook configurations
    """
    try:
        user_id = g.get('user_id')
        supabase = get_supabase_client()
        response = supabase.table('webhook_configs')
                         .select('*')
                         .eq('user_id', user_id)
                         .execute()
        if response.error:
            raise Exception(response.error.message)
        configs = response.data
        
        return jsonify({
            "status": "success",
            "data": configs
        }), 200
        
    except Exception as e:
        # Log the error
        logger.error(f"Error retrieving webhook configurations: {str(e)}", exc_info=True)
        
        # Return error response
        return jsonify({
            "status": "error",
            "code": "SERVER_ERROR",
            "message": "An unexpected error occurred retrieving webhook configurations"
        }), 500


@webhook_config_bp.route('/<string:id>', methods=['GET'])
@require_supabase_auth
def get_webhook_config(id: str) -> Tuple[Any, int]:
    """
    Get a specific webhook configuration.
    
    Args:
        id: UUID of the webhook configuration
        
    Returns:
        JSON response with the webhook configuration
    """
    try:
        user_id = g.get('user_id')
        supabase = get_supabase_client()
        response = supabase.table('webhook_configs')
                         .select('*')
                         .eq('id', id)
                         .eq('user_id', user_id)
                         .single()
                         .execute()
        if response.error:
            # If no record found, return 404
            if response.status_code == 406 or 'no rows' in response.error.message.lower():
                return jsonify({
                    "status": "error",
                    "code": "NOT_FOUND",
                    "message": f"Webhook configuration with id {id} not found"
                }), 404
            raise Exception(response.error.message)
        config = response.data
        
        return jsonify({
            "status": "success",
            "data": config
        }), 200
        
    except Exception as e:
        # Log the error
        logger.error(f"Error retrieving webhook configuration: {str(e)}", exc_info=True)
        
        # Return error response
        return jsonify({
            "status": "error",
            "code": "SERVER_ERROR",
            "message": "An unexpected error occurred retrieving the webhook configuration"
        }), 500


@webhook_config_bp.route('', methods=['POST'])
@validate_schema(WEBHOOK_CONFIG_SCHEMA)
@require_supabase_auth
def create_webhook_config() -> Tuple[Any, int]:
    """
    Create a new webhook configuration using Supabase.
    
    Returns:
        JSON response with the created webhook configuration
    """
    # Ensure authenticated Supabase user
    user_id = g.get('user_id')
    if not user_id:
        return jsonify({
            'status': 'error',
            'code': 'UNAUTHORIZED',
            'message': 'User not authenticated'
        }), 401

    try:
        data = request.get_json()
        webhook_id = str(uuid.uuid4())
        webhook_base_url = current_app.config.get('WEBHOOK_BASE_URL', 'https://api.viewzenix.com/webhook')
        webhook_url = f"{webhook_base_url}/{webhook_id}"

        # Prepare Supabase insertion
        supabase = get_supabase_client()
        insert_data = {
            'id': webhook_id,
            'user_id': user_id,
            'name': data['name'],
            'description': data.get('description', ''),
            'webhook_url': webhook_url,
            'security_token': data['securityToken'],
            'notification_preferences': data.get('notificationPreferences', {
                "email": True,
                "browser": True,
                "onSuccess": True,
                "onFailure": True
            }),
            'is_active': data.get('isActive', True)
        }
        resp = supabase.table('webhook_configs').insert([insert_data]).execute()
        if resp.error:
            if 'duplicate' in resp.error.message.lower():
                return jsonify({
                    "status": "error",
                    "code": "INTEGRITY_ERROR",
                    "message": "Webhook configuration with similar attributes already exists"
                }), 409
            raise Exception(resp.error.message)
        config = resp.data[0]

        # Log and return
        logger.info(f"Created webhook configuration: {webhook_id}", extra={"webhook_id": webhook_id})
        return jsonify({
            "status": "success",
            "message": "Webhook configuration created successfully",
            "data": {"webhook": config, "success": True}
        }), 201

    except Exception as e:
        logger.error(f"Error creating webhook configuration: {str(e)}", exc_info=True)
        return jsonify({
            "status": "error",
            "code": "SERVER_ERROR",
            "message": "An unexpected error occurred creating the webhook configuration"
        }), 500


@webhook_config_bp.route('/<string:id>', methods=['PUT'])
@validate_schema(WEBHOOK_CONFIG_UPDATE_SCHEMA)
@require_supabase_auth
def update_webhook_config(id: str) -> Tuple[Any, int]:
    """
    Update an existing webhook configuration using Supabase.

    Args:
        id: UUID of the webhook configuration

    Returns:
        JSON response with the updated webhook configuration
    """
    # Ensure authenticated Supabase user
    user_id = g.get('user_id')
    if not user_id:
        return jsonify({
            'status': 'error',
            'code': 'UNAUTHORIZED',
            'message': 'User not authenticated'
        }), 401

    try:
        data = request.get_json()
        # Build update payload
        update_payload = {}
        if 'name' in data:
            update_payload['name'] = data['name']
        if 'description' in data:
            update_payload['description'] = data['description']
        if 'securityToken' in data:
            update_payload['security_token'] = data['securityToken']
        if 'notificationPreferences' in data:
            update_payload['notification_preferences'] = data['notificationPreferences']
        if 'isActive' in data:
            update_payload['is_active'] = data['isActive']

        supabase = get_supabase_client()
        # Apply update
        resp = supabase.table('webhook_configs')
                         .update(update_payload)
                         .eq('id', id)
                         .eq('user_id', user_id)
                         .execute()
        if resp.error:
            raise Exception(resp.error.message)
        config = resp.data[0]

        logger.info(f"Updated webhook configuration: {id}", extra={"webhook_id": id})
        return jsonify({
            'status': 'success',
            'message': 'Webhook configuration updated successfully',
            'data': {'webhook': config, 'success': True}
        }), 200

    except Exception as e:
        logger.error(f"Error updating webhook configuration: {str(e)}", exc_info=True)
        return jsonify({
            'status': 'error',
            'code': 'SERVER_ERROR',
            'message': 'An unexpected error occurred updating the webhook configuration'
        }), 500


@webhook_config_bp.route('/<string:id>', methods=['DELETE'])
@require_supabase_auth
def delete_webhook_config(id: str) -> Tuple[Any, int]:
    """
    Delete a webhook configuration using Supabase.

    Args:
        id: UUID of the webhook configuration

    Returns:
        JSON response with the result of the deletion
    """
    # Ensure authenticated Supabase user
    user_id = g.get('user_id')
    if not user_id:
        return jsonify({
            'status': 'error',
            'code': 'UNAUTHORIZED',
            'message': 'User not authenticated'
        }), 401

    try:
        supabase = get_supabase_client()
        resp = supabase.table('webhook_configs')
                         .delete()
                         .eq('id', id)
                         .eq('user_id', user_id)
                         .execute()
        if resp.error:
            raise Exception(resp.error.message)
        # If no rows affected, record not found
        if not resp.data or len(resp.data) == 0:
            return jsonify({
                'status': 'error',
                'code': 'NOT_FOUND',
                'message': f'Webhook configuration with id {id} not found'
            }), 404

        logger.info(f"Deleted webhook configuration: {id}", extra={'webhook_id': id})
        return jsonify({
            'status': 'success',
            'message': 'Webhook configuration deleted successfully',
            'data': {'id': id, 'success': True}
        }), 200

    except Exception as e:
        logger.error(f"Error deleting webhook configuration: {str(e)}", exc_info=True)
        return jsonify({
            'status': 'error',
            'code': 'SERVER_ERROR',
            'message': 'An unexpected error occurred deleting the webhook configuration'
        }), 500


@webhook_config_bp.route('/<string:id>/toggle', methods=['PATCH'])
@validate_schema(WEBHOOK_CONFIG_TOGGLE_SCHEMA)
@require_supabase_auth
def toggle_webhook_active(id: str) -> Tuple[Any, int]:
    """
    Toggle a webhook configuration's active status using Supabase.

    Args:
        id: UUID of the webhook configuration

    Returns:
        JSON response with the updated webhook configuration
    """
    # Ensure authenticated Supabase user
    user_id = g.get('user_id')
    if not user_id:
        return jsonify({
            'status': 'error',
            'code': 'UNAUTHORIZED',
            'message': 'User not authenticated'
        }), 401

    try:
        data = request.get_json()
        new_status = data.get('isActive')

        supabase = get_supabase_client()
        # Apply update
        resp = supabase.table('webhook_configs')
                         .update({'is_active': new_status})
                         .eq('id', id)
                         .eq('user_id', user_id)
                         .execute()
        if resp.error:
            raise Exception(resp.error.message)
        if not resp.data or len(resp.data) == 0:
            return jsonify({
                'status': 'error',
                'code': 'NOT_FOUND',
                'message': f'Webhook configuration with id {id} not found'
            }), 404
        config = resp.data[0]

        status_str = 'activated' if config['is_active'] else 'deactivated'
        logger.info(f"Webhook configuration {status_str}: {id}", extra={'webhook_id': id, 'is_active': config['is_active']})
        return jsonify({
            'status': 'success',
            'message': f'Webhook configuration {status_str} successfully',
            'data': {'webhook': config, 'success': True}
        }), 200
    except Exception as e:
        logger.error(f"Error toggling webhook configuration: {str(e)}", exc_info=True)
        return jsonify({
            'status': 'error',
            'code': 'SERVER_ERROR',
            'message': 'An unexpected error occurred toggling the webhook configuration status'
        }), 500