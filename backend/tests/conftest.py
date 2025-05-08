"""
Pytest configuration file for the Viewzenix trading webhook platform.
"""
import pytest
from flask import Flask
from app import create_app
from app.core.models.trade import Trade, AssetClass, OrderSide, OrderType, TimeInForce


@pytest.fixture
def app():
    """Create and configure a Flask app for testing."""
    app = create_app('testing')
    app.config.update({
        'TESTING': True,
        'SIMULATION_MODE': True,
        'ALPACA_API_KEY': 'test-key',
        'ALPACA_API_SECRET': 'test-secret',
        'WEBHOOK_PASSPHRASE': 'test-passphrase'
    })
    
    # Create context
    with app.app_context():
        yield app


@pytest.fixture
def client(app):
    """A test client for the app."""
    return app.test_client()


@pytest.fixture
def sample_webhook_payload():
    """Sample webhook payload for testing."""
    return {
        "passphrase": "test-passphrase",
        "ticker": "AAPL",
        "action": "BUY",
        "quantity": 10,
        "price": 150.50,
        "order_type": "MARKET"
    }


@pytest.fixture
def sample_trade():
    """Sample trade object for testing."""
    return Trade(
        symbol="AAPL",
        side=OrderSide.BUY,
        asset_class=AssetClass.STOCK,
        order_type=OrderType.MARKET,
        quantity=10,
        price=150.50,
        time_in_force=TimeInForce.DAY
    )