"""
Unit tests for the webhook endpoint.
"""
import pytest
import json
from unittest.mock import patch, MagicMock
from app.core.services.trade_router import TradeError
from app.core.services.order_engine import OrderSizingError
from app.core.adapters.broker_adapter import BrokerError


class TestWebhookEndpoint:
    """Test cases for the webhook endpoint."""
    
    def test_webhook_valid_payload(self, client, sample_webhook_payload):
        """Test webhook endpoint with valid payload."""
        # Act
        response = client.post(
            '/webhook',
            data=json.dumps(sample_webhook_payload),
            content_type='application/json'
        )
        data = json.loads(response.data)
        
        # Assert
        assert response.status_code == 200
        assert data['status'] == 'success'
        assert 'order' in data
        assert data['order']['symbol'] == 'AAPL'
        assert data['order']['simulation_mode'] is True
        
    def test_webhook_invalid_passphrase(self, client, sample_webhook_payload):
        """Test webhook endpoint with invalid passphrase."""
        # Arrange
        sample_webhook_payload['passphrase'] = 'wrong-passphrase'
        
        # Act
        response = client.post(
            '/webhook',
            data=json.dumps(sample_webhook_payload),
            content_type='application/json'
        )
        data = json.loads(response.data)
        
        # Assert
        assert response.status_code == 401
        assert data['status'] == 'error'
        assert data['code'] == 'INVALID_PASSPHRASE'
        
    def test_webhook_missing_required_field(self, client):
        """Test webhook endpoint with missing required field."""
        # Arrange
        payload = {
            "passphrase": "test-passphrase",
            "action": "BUY"  # Missing ticker
        }
        
        # Act
        response = client.post(
            '/webhook',
            data=json.dumps(payload),
            content_type='application/json'
        )
        data = json.loads(response.data)
        
        # Assert
        assert response.status_code == 400
        assert data['status'] == 'error'
        assert data['code'] == 'SCHEMA_VALIDATION_ERROR'
        
    @patch('app.api.routes.webhook.TradeRouter')
    def test_webhook_trade_error(self, mock_trade_router, client, sample_webhook_payload):
        """Test webhook endpoint with trade error."""
        # Arrange
        mock_router_instance = MagicMock()
        mock_router_instance.process_webhook.side_effect = TradeError("Invalid symbol")
        mock_trade_router.return_value = mock_router_instance
        
        # Act
        response = client.post(
            '/webhook',
            data=json.dumps(sample_webhook_payload),
            content_type='application/json'
        )
        data = json.loads(response.data)
        
        # Assert
        assert response.status_code == 400
        assert data['status'] == 'error'
        assert data['code'] == 'TRADE_ERROR'
        assert "Invalid symbol" in data['message']
        
    @patch('app.api.routes.webhook.TradeRouter')
    @patch('app.api.routes.webhook.OrderEngine')
    def test_webhook_order_sizing_error(self, mock_order_engine, mock_trade_router, client, sample_webhook_payload, sample_trade):
        """Test webhook endpoint with order sizing error."""
        # Arrange
        mock_router_instance = MagicMock()
        mock_router_instance.process_webhook.return_value = sample_trade
        mock_trade_router.return_value = mock_router_instance
        
        mock_engine_instance = MagicMock()
        mock_engine_instance.process_trade.side_effect = OrderSizingError("Invalid order size")
        mock_order_engine.return_value = mock_engine_instance
        
        # Act
        response = client.post(
            '/webhook',
            data=json.dumps(sample_webhook_payload),
            content_type='application/json'
        )
        data = json.loads(response.data)
        
        # Assert
        assert response.status_code == 400
        assert data['status'] == 'error'
        assert data['code'] == 'ORDER_SIZING_ERROR'
        assert "Invalid order size" in data['message']