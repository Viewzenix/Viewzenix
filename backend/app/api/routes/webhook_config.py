"""
Webhook configuration management endpoints.

This module defines the webhook_config blueprint with CRUD endpoints for
managing webhook configurations.
"""
from flask import Blueprint, request, jsonify, current_app, url_for
from typing import Dict, Any, Tuple, List, Optional
from sqlalchemy.exc import IntegrityError
import uuid

from app.extensions import db
from app.utils.logging_bus import LoggingBus, sanitize_log_data
from app.api.middlewares.validation import validate_schema
from app.core.models.webhook_config import WebhookConfig

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


@webhook_config_bp.route('', methods=['GET'])
def get_all_webhook_configs() -> Tuple[Any, int]:
    """
    Get all webhook configurations.
    
    Returns:
        JSON response with all webhook configurations
    """
    try:
        # Query all webhook configurations
        webhook_configs = WebhookConfig.query.all()
        
        # Convert to dictionary
        configs = [config.to_dict() for config in webhook_configs]
        
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


@webhook_config_bp.route('/<uuid:id>', methods=['GET'])
def get_webhook_config(id: uuid.UUID) -> Tuple[Any, int]:
    """
    Get a specific webhook configuration.
    
    Args:
        id: UUID of the webhook configuration
        
    Returns:
        JSON response with the webhook configuration
    """
    try:
        # Query the webhook configuration
        webhook_config = WebhookConfig.query.get(id)
        
        # Check if webhook configuration exists
        if not webhook_config:
            return jsonify({
                "status": "error",
                "code": "NOT_FOUND",
                "message": f"Webhook configuration with id {id} not found"
            }), 404
        
        # Convert to dictionary
        config = webhook_config.to_dict()
        
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
def create_webhook_config() -> Tuple[Any, int]:
    """
    Create a new webhook configuration.
    
    Returns:
        JSON response with the created webhook configuration
    """
    try:
        # Get request data
        data = request.get_json()
        
        # Generate UUID for the webhook configuration
        webhook_id = uuid.uuid4()
        
        # Generate webhook URL
        webhook_base_url = current_app.config.get('WEBHOOK_BASE_URL', 'https://api.viewzenix.com/webhook')
        webhook_url = f"{webhook_base_url}/{webhook_id}"
        
        # Create webhook configuration
        webhook_config = WebhookConfig(
            id=webhook_id,
            name=data['name'],
            description=data.get('description', ''),
            webhook_url=webhook_url,
            security_token=data['securityToken'],
            notification_preferences=data.get('notificationPreferences', {
                "email": True,
                "browser": True,
                "onSuccess": True,
                "onFailure": True
            }),
            is_active=data.get('isActive', True)
        )
        
        # Add to database
        db.session.add(webhook_config)
        db.session.commit()
        
        # Convert to dictionary
        config = webhook_config.to_dict()
        
        # Log the creation
        logger.info(f"Created webhook configuration: {webhook_config.id}",
                   extra={"webhook_id": str(webhook_config.id)})
        
        return jsonify({
            "status": "success",
            "message": "Webhook configuration created successfully",
            "data": {
                "webhook": config,
                "success": True
            }
        }), 201
        
    except IntegrityError as e:
        # Roll back the session
        db.session.rollback()
        
        # Log the error
        logger.error(f"Integrity error creating webhook configuration: {str(e)}")
        
        # Return error response
        return jsonify({
            "status": "error",
            "code": "INTEGRITY_ERROR",
            "message": "Webhook configuration with similar attributes already exists"
        }), 409
        
    except Exception as e:
        # Roll back the session
        db.session.rollback()
        
        # Log the error
        logger.error(f"Error creating webhook configuration: {str(e)}", exc_info=True)
        
        # Return error response
        return jsonify({
            "status": "error",
            "code": "SERVER_ERROR",
            "message": "An unexpected error occurred creating the webhook configuration"
        }), 500


@webhook_config_bp.route('/<uuid:id>', methods=['PUT'])
@validate_schema(WEBHOOK_CONFIG_UPDATE_SCHEMA)
def update_webhook_config(id: uuid.UUID) -> Tuple[Any, int]:
    """
    Update a webhook configuration.
    
    Args:
        id: UUID of the webhook configuration
        
    Returns:
        JSON response with the updated webhook configuration
    """
    try:
        # Query the webhook configuration
        webhook_config = WebhookConfig.query.get(id)
        
        # Check if webhook configuration exists
        if not webhook_config:
            return jsonify({
                "status": "error",
                "code": "NOT_FOUND",
                "message": f"Webhook configuration with id {id} not found"
            }), 404
        
        # Get request data
        data = request.get_json()
        
        # Update fields if they are in the request
        if 'name' in data:
            webhook_config.name = data['name']
        
        if 'description' in data:
            webhook_config.description = data['description']
        
        if 'securityToken' in data:
            webhook_config.security_token = data['securityToken']
        
        if 'notificationPreferences' in data:
            webhook_config.notification_preferences = data['notificationPreferences']
        
        if 'isActive' in data:
            webhook_config.is_active = data['isActive']
        
        # Commit the changes
        db.session.commit()
        
        # Convert to dictionary
        config = webhook_config.to_dict()
        
        # Log the update
        logger.info(f"Updated webhook configuration: {webhook_config.id}",
                   extra={"webhook_id": str(webhook_config.id)})
        
        return jsonify({
            "status": "success",
            "message": "Webhook configuration updated successfully",
            "data": {
                "webhook": config,
                "success": True
            }
        }), 200
        
    except IntegrityError as e:
        # Roll back the session
        db.session.rollback()
        
        # Log the error
        logger.error(f"Integrity error updating webhook configuration: {str(e)}")
        
        # Return error response
        return jsonify({
            "status": "error",
            "code": "INTEGRITY_ERROR",
            "message": "Update would create a duplicate webhook configuration"
        }), 409
        
    except Exception as e:
        # Roll back the session
        db.session.rollback()
        
        # Log the error
        logger.error(f"Error updating webhook configuration: {str(e)}", exc_info=True)
        
        # Return error response
        return jsonify({
            "status": "error",
            "code": "SERVER_ERROR",
            "message": "An unexpected error occurred updating the webhook configuration"
        }), 500


@webhook_config_bp.route('/<uuid:id>', methods=['DELETE'])
def delete_webhook_config(id: uuid.UUID) -> Tuple[Any, int]:
    """
    Delete a webhook configuration.
    
    Args:
        id: UUID of the webhook configuration
        
    Returns:
        JSON response with the result of the deletion
    """
    try:
        # Query the webhook configuration
        webhook_config = WebhookConfig.query.get(id)
        
        # Check if webhook configuration exists
        if not webhook_config:
            return jsonify({
                "status": "error",
                "code": "NOT_FOUND",
                "message": f"Webhook configuration with id {id} not found"
            }), 404
        
        # Delete from database
        db.session.delete(webhook_config)
        db.session.commit()
        
        # Log the deletion
        logger.info(f"Deleted webhook configuration: {id}",
                   extra={"webhook_id": str(id)})
        
        return jsonify({
            "status": "success",
            "message": "Webhook configuration deleted successfully",
            "data": {
                "id": str(id),
                "success": True
            }
        }), 200
        
    except Exception as e:
        # Roll back the session
        db.session.rollback()
        
        # Log the error
        logger.error(f"Error deleting webhook configuration: {str(e)}", exc_info=True)
        
        # Return error response
        return jsonify({
            "status": "error",
            "code": "SERVER_ERROR",
            "message": "An unexpected error occurred deleting the webhook configuration"
        }), 500