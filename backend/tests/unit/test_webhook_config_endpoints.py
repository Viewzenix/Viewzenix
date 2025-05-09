"""
Tests for webhook configuration management endpoints.

This module contains unit tests for the webhook configuration 
CRUD endpoints in the api/routes/webhook_config.py module.
"""
import pytest
import json
import uuid
from datetime import datetime, timedelta
from flask import url_for

from app import create_app
from app.extensions import db
from app.core.models.webhook_config import WebhookConfig


@pytest.fixture
def app():
    """Create and configure a Flask application for testing."""
    app = create_app('testing')
    
    # Create an application context
    with app.app_context():
        # Create all tables
        db.create_all()
        
        # Test data setup and cleanup
        yield app
        
        # Clean up after tests
        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    """Create a test client for the app."""
    return app.test_client()


@pytest.fixture
def sample_config(app):
    """Create a sample webhook configuration for testing."""
    with app.app_context():
        config = WebhookConfig(
            name="Test Trading Strategy",
            description="TradingView alerts for test strategy",
            webhook_url="https://api.viewzenix.com/webhook/test",
            security_token="test-token-123",
            notification_preferences={
                "email": True,
                "browser": True,
                "onSuccess": True,
                "onFailure": True
            },
            is_active=True
        )
        
        db.session.add(config)
        db.session.commit()
        
        yield config


def test_get_all_webhook_configs(client, sample_config):
    """Test GET /webhooks endpoint."""
    # Send request
    response = client.get('/webhooks')
    
    # Parse response
    data = json.loads(response.data)
    
    # Assertions
    assert response.status_code == 200
    assert data['status'] == 'success'
    assert isinstance(data['data'], list)
    assert len(data['data']) == 1
    assert data['data'][0]['id'] == str(sample_config.id)
    assert data['data'][0]['name'] == "Test Trading Strategy"


def test_get_webhook_config(client, sample_config):
    """Test GET /webhooks/{id} endpoint."""
    # Send request
    response = client.get(f'/webhooks/{sample_config.id}')
    
    # Parse response
    data = json.loads(response.data)
    
    # Assertions
    assert response.status_code == 200
    assert data['status'] == 'success'
    assert data['data']['id'] == str(sample_config.id)
    assert data['data']['name'] == "Test Trading Strategy"


def test_get_webhook_config_not_found(client):
    """Test GET /webhooks/{id} with non-existent ID."""
    # Generate random UUID
    random_id = uuid.uuid4()
    
    # Send request
    response = client.get(f'/webhooks/{random_id}')
    
    # Parse response
    data = json.loads(response.data)
    
    # Assertions
    assert response.status_code == 404
    assert data['status'] == 'error'
    assert data['code'] == 'NOT_FOUND'


def test_create_webhook_config(client):
    """Test POST /webhooks endpoint."""
    # Prepare data
    webhook_data = {
        "name": "New Trading Strategy",
        "description": "TradingView alerts for new strategy",
        "securityToken": "new-token-123",
        "notificationPreferences": {
            "email": True,
            "browser": False,
            "onSuccess": True,
            "onFailure": True
        },
        "isActive": True
    }
    
    # Send request
    response = client.post(
        '/webhooks',
        data=json.dumps(webhook_data),
        content_type='application/json'
    )
    
    # Parse response
    data = json.loads(response.data)
    
    # Assertions
    assert response.status_code == 201
    assert data['status'] == 'success'
    assert data['data']['success'] is True
    assert data['data']['webhook']['name'] == "New Trading Strategy"
    assert data['data']['webhook']['description'] == "TradingView alerts for new strategy"
    assert data['data']['webhook']['securityToken'] == "new-token-123"
    assert data['data']['webhook']['notificationPreferences']['browser'] is False
    assert data['data']['webhook']['isActive'] is True


def test_create_webhook_config_invalid(client):
    """Test POST /webhooks with invalid data."""
    # Prepare data with missing required field
    webhook_data = {
        "name": "Invalid Strategy"
        # Missing securityToken
    }
    
    # Send request
    response = client.post(
        '/webhooks',
        data=json.dumps(webhook_data),
        content_type='application/json'
    )
    
    # Parse response
    data = json.loads(response.data)
    
    # Assertions
    assert response.status_code == 400
    assert data['status'] == 'error'
    assert 'VALIDATION_ERROR' in data['code']


def test_update_webhook_config(client, sample_config):
    """Test PUT /webhooks/{id} endpoint."""
    # Prepare update data
    update_data = {
        "name": "Updated Trading Strategy",
        "description": "Updated description",
        "isActive": False
    }
    
    # Send request
    response = client.put(
        f'/webhooks/{sample_config.id}',
        data=json.dumps(update_data),
        content_type='application/json'
    )
    
    # Parse response
    data = json.loads(response.data)
    
    # Assertions
    assert response.status_code == 200
    assert data['status'] == 'success'
    assert data['data']['webhook']['name'] == "Updated Trading Strategy"
    assert data['data']['webhook']['description'] == "Updated description"
    assert data['data']['webhook']['isActive'] is False
    
    # Check that other fields weren't changed
    assert data['data']['webhook']['securityToken'] == "test-token-123"


def test_update_webhook_config_not_found(client):
    """Test PUT /webhooks/{id} with non-existent ID."""
    # Generate random UUID
    random_id = uuid.uuid4()
    
    # Prepare update data
    update_data = {
        "name": "Updated Trading Strategy"
    }
    
    # Send request
    response = client.put(
        f'/webhooks/{random_id}',
        data=json.dumps(update_data),
        content_type='application/json'
    )
    
    # Parse response
    data = json.loads(response.data)
    
    # Assertions
    assert response.status_code == 404
    assert data['status'] == 'error'
    assert data['code'] == 'NOT_FOUND'


def test_delete_webhook_config(client, sample_config):
    """Test DELETE /webhooks/{id} endpoint."""
    # Send request
    response = client.delete(f'/webhooks/{sample_config.id}')
    
    # Parse response
    data = json.loads(response.data)
    
    # Assertions
    assert response.status_code == 200
    assert data['status'] == 'success'
    assert data['data']['id'] == str(sample_config.id)
    assert data['data']['success'] is True
    
    # Verify webhook config was deleted
    response = client.get(f'/webhooks/{sample_config.id}')
    assert response.status_code == 404


def test_delete_webhook_config_not_found(client):
    """Test DELETE /webhooks/{id} with non-existent ID."""
    # Generate random UUID
    random_id = uuid.uuid4()
    
    # Send request
    response = client.delete(f'/webhooks/{random_id}')
    
    # Parse response
    data = json.loads(response.data)
    
    # Assertions
    assert response.status_code == 404
    assert data['status'] == 'error'
    assert data['code'] == 'NOT_FOUND'


def test_toggle_webhook_active(client, sample_config):
    """Test PATCH /webhooks/{id}/toggle endpoint."""
    # Initial status is active (True)
    assert sample_config.is_active is True
    
    # Prepare toggle data (to inactive)
    toggle_data = {
        "isActive": False
    }
    
    # Send request
    response = client.patch(
        f'/webhooks/{sample_config.id}/toggle',
        data=json.dumps(toggle_data),
        content_type='application/json'
    )
    
    # Parse response
    data = json.loads(response.data)
    
    # Assertions for turning off
    assert response.status_code == 200
    assert data['status'] == 'success'
    assert data['data']['webhook']['isActive'] is False
    assert data['data']['success'] is True
    
    # Now toggle back to active
    toggle_data = {
        "isActive": True
    }
    
    # Send request
    response = client.patch(
        f'/webhooks/{sample_config.id}/toggle',
        data=json.dumps(toggle_data),
        content_type='application/json'
    )
    
    # Parse response
    data = json.loads(response.data)
    
    # Assertions for turning on
    assert response.status_code == 200
    assert data['status'] == 'success'
    assert data['data']['webhook']['isActive'] is True
    assert data['data']['success'] is True


def test_toggle_webhook_active_not_found(client):
    """Test PATCH /webhooks/{id}/toggle with non-existent ID."""
    # Generate random UUID
    random_id = uuid.uuid4()
    
    # Prepare toggle data
    toggle_data = {
        "isActive": False
    }
    
    # Send request
    response = client.patch(
        f'/webhooks/{random_id}/toggle',
        data=json.dumps(toggle_data),
        content_type='application/json'
    )
    
    # Parse response
    data = json.loads(response.data)
    
    # Assertions
    assert response.status_code == 404
    assert data['status'] == 'error'
    assert data['code'] == 'NOT_FOUND'


def test_toggle_webhook_active_invalid(client, sample_config):
    """Test PATCH /webhooks/{id}/toggle with invalid data."""
    # Prepare invalid toggle data (missing isActive)
    toggle_data = {
        "active": False  # Wrong field name
    }
    
    # Send request
    response = client.patch(
        f'/webhooks/{sample_config.id}/toggle',
        data=json.dumps(toggle_data),
        content_type='application/json'
    )
    
    # Parse response
    data = json.loads(response.data)
    
    # Assertions
    assert response.status_code == 400
    assert data['status'] == 'error'
    assert 'VALIDATION_ERROR' in data['code']