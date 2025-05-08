"""
Unit tests for the Trade Router service.
"""
import pytest
from app.core.services.trade_router import TradeRouter, InvalidSymbolError, BrokerRestrictionError
from app.core.models.trade import AssetClass, OrderSide, OrderType, TimeInForce


class TestTradeRouter:
    """Test cases for the TradeRouter class."""
    
    def setup_method(self):
        """Set up test fixtures."""
        self.router = TradeRouter()
        
    def test_process_webhook_valid_payload(self):
        """Test processing a valid webhook payload."""
        # Arrange
        payload = {
            "ticker": "AAPL",
            "action": "BUY",
            "quantity": 10,
            "price": 150.50,
            "order_type": "MARKET"
        }
        
        # Act
        trade = self.router.process_webhook(payload)
        
        # Assert
        assert trade.symbol == "AAPL"
        assert trade.side == OrderSide.BUY
        assert trade.asset_class == AssetClass.STOCK
        assert trade.order_type == OrderType.MARKET
        assert trade.quantity == 10
        assert trade.price == 150.50
        
    def test_process_webhook_missing_symbol(self):
        """Test processing a payload with missing symbol."""
        # Arrange
        payload = {
            "action": "BUY",
            "quantity": 10
        }
        
        # Act/Assert
        with pytest.raises(InvalidSymbolError):
            self.router.process_webhook(payload)
            
    def test_classify_asset_stock(self):
        """Test asset classification for stocks."""
        # Act
        asset_class = self.router._classify_asset("AAPL")
        
        # Assert
        assert asset_class == AssetClass.STOCK
        
    def test_classify_asset_crypto(self):
        """Test asset classification for crypto."""
        # Act
        asset_class1 = self.router._classify_asset("BTC/USD")
        asset_class2 = self.router._classify_asset("BTCUSD")
        
        # Assert
        assert asset_class1 == AssetClass.CRYPTO
        assert asset_class2 == AssetClass.CRYPTO
        
    def test_classify_asset_forex(self):
        """Test asset classification for forex."""
        # Act
        asset_class = self.router._classify_asset("EUR/USD")
        
        # Assert
        assert asset_class == AssetClass.FOREX
        
    def test_validate_trade_limit_order_without_price(self):
        """Test validation fails for limit order without price."""
        # Arrange
        trade = self.router.process_webhook({
            "ticker": "AAPL",
            "action": "BUY",
            "order_type": "LIMIT",
            "quantity": 10
        })
        trade.price = None  # Force price to None
        
        # Act/Assert
        with pytest.raises(BrokerRestrictionError):
            self.router._validate_trade(trade)