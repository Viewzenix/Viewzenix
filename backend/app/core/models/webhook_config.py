"""
WebhookConfig model module.

This module defines the WebhookConfig model which represents a webhook configuration
in the database. The model corresponds to the webhook_configs table.
"""
import uuid
from datetime import datetime
from sqlalchemy.types import Uuid, JSON

from app.extensions import db


class WebhookConfig(db.Model):
    """
    WebhookConfig model representing a webhook configuration.
    
    This model stores webhook configurations that users can create
    to manage their TradingView webhook integrations.
    """
    __tablename__ = 'webhook_configs'
    
    # Primary key - Using database-agnostic Uuid type with as_uuid=False for SQLite compatibility
    id = db.Column(Uuid(as_uuid=False), primary_key=True, default=lambda: str(uuid.uuid4()))
    
    # Basic information
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    
    # Webhook endpoint details
    webhook_url = db.Column(db.String(512), nullable=False, unique=True)
    security_token = db.Column(db.String(255), nullable=False)
    
    # Notification preferences - Using database-agnostic JSON type instead of PostgreSQL JSONB
    notification_preferences = db.Column(JSON, nullable=False, default={
        "email": True,
        "browser": True,
        "onSuccess": True,
        "onFailure": True
    })
    
    # Status
    is_active = db.Column(db.Boolean, nullable=False, default=True)
    
    # Timestamps
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow,
                         onupdate=datetime.utcnow)
    
    def __repr__(self):
        """String representation of WebhookConfig."""
        return f"<WebhookConfig {self.id}: {self.name}>"
    
    def to_dict(self):
        """
        Convert model to dictionary.
        
        Returns:
            Dictionary representation of the webhook configuration.
        """
        return {
            "id": str(self.id),
            "name": self.name,
            "description": self.description,
            "webhookUrl": self.webhook_url,
            "securityToken": self.security_token,
            "notificationPreferences": self.notification_preferences,
            "isActive": self.is_active,
            "createdAt": self.created_at.isoformat(),
            "updatedAt": self.updated_at.isoformat()
        }