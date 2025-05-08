"""
Unit tests for the Order Engine service.
"""
import pytest
from unittest.mock import Mock, patch
from app.core.services.order_engine import OrderEngine
from app.core.models.trade import Trade, AssetClass, OrderSide, OrderType, TimeInForce
from app.core.models.order import OrderStatus
from app.core.adapters.broker_adapter import BrokerAdapter


class TestOrderEngine:
    """Test cases for the OrderEngine class."""
    
    def setup_method(self):
        """Set up test fixtures."""
        self.mock_broker = Mock(spec=BrokerAdapter)
        self.mock_broker.submit_order.return_value = OrderStatus(
            order_id="test-order-id",
            status="filled",
            symbol="AAPL",
            side=OrderSide.BUY,
            quantity=10,
            filled_quantity=10,
            average_fill_price=150.0
        )
        
        # Create the engine with our mock broker
        self.engine = OrderEngine(self.mock_broker)
        
    @patch('app.core.services.order_engine.current_app')
    def test_process_trade_with_explicit_quantity(self, mock_current_app):
        """Test processing a trade with explicit quantity."""
        # Arrange
        mock_current_app.config = {
            'SIMULATION_MODE': False
        }
        
        trade = Trade(
            symbol="AAPL",
            side=OrderSide.BUY,
            asset_class=AssetClass.STOCK,
            quantity=10,
            price=150.0
        )
        
        # Act
        order_status = self.engine.process_trade(trade)
        
        # Assert
        assert order_status.symbol == "AAPL"
        assert order_status.side == OrderSide.BUY
        assert order_status.quantity == 10
        assert order_status.filled_quantity == 10
        assert order_status.average_fill_price == 150.0
        self.mock_broker.submit_order.assert_called_once()
        
    @patch('app.core.services.order_engine.current_app')
    def test_process_trade_simulation_mode(self, mock_current_app):
        """Test processing a trade in simulation mode."""
        # Arrange
        mock_current_app.config = {
            'SIMULATION_MODE': True
        }
        
        trade = Trade(
            symbol="AAPL",
            side=OrderSide.BUY,
            asset_class=AssetClass.STOCK,
            quantity=10,
            price=150.0
        )
        
        # Act
        order_status = self.engine.process_trade(trade)
        
        # Assert
        assert order_status.is_simulated is True
        assert order_status.symbol == "AAPL"
        assert order_status.side == OrderSide.BUY
        assert order_status.quantity == 10
        assert order_status.filled_quantity == 10
        # The broker should not be called in simulation mode
        self.mock_broker.submit_order.assert_not_called()
        
    @patch('app.core.services.order_engine.current_app')
    def test_calculate_order_size_fixed(self, mock_current_app):
        """Test calculating order size with fixed sizing method."""
        # Arrange
        mock_current_app.config = {
            'POSITION_SIZING_METHOD': 'fixed',
            'POSITION_SIZE_VALUE': 5.0
        }
        
        trade = Trade(
            symbol="AAPL",
            side=OrderSide.BUY,
            asset_class=AssetClass.STOCK,
            price=150.0
        )
        
        # Act
        size = self.engine._calculate_order_size(trade)
        
        # Assert
        assert size == 5.0