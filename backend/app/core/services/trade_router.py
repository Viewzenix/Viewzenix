"""
Trade router service for the Viewzenix trading webhook platform.

This module defines the service for classifying and normalizing webhook data.
"""
from typing import Dict, Any
import re
from app.utils.logging_bus import LoggingBus, sanitize_log_data
from app.core.models.trade import (
    Trade, AssetClass, OrderSide, OrderType, TimeInForce
)


class TradeError(Exception):
    """Base class for trade-related errors."""
    pass


class InvalidSymbolError(TradeError):
    """Error for invalid trading symbols."""
    pass


class BrokerRestrictionError(TradeError):
    """Error for trades that violate broker restrictions."""
    pass


class TradeRouter:
    """
    Service that classifies and normalizes incoming webhook data into Trade objects.
    """
    
    def __init__(self):
        """Initialize the trade router."""
        self.logger = LoggingBus(__name__)
    
    def process_webhook(self, payload: Dict[str, Any]) -> Trade:
        """
        Process webhook payload into normalized Trade object.
        
        Args:
            payload: The validated webhook payload
            
        Returns:
            Normalized Trade object
            
        Raises:
            InvalidSymbolError: If the symbol is invalid or unsupported
            BrokerRestrictionError: If the trade violates broker restrictions
            TradeError: For other trade-related errors
        """
        try:
            # Extract required fields
            symbol = payload.get("ticker")
            side_str = payload.get("action")
            
            # Validate symbol
            if not symbol:
                raise InvalidSymbolError("Symbol is required")
                
            # Determine asset class
            asset_class = self._classify_asset(symbol)
            
            # Normalize side
            try:
                side = OrderSide[side_str.upper()]
            except (KeyError, ValueError):
                side = OrderSide.BUY if side_str.upper() == "BUY" else OrderSide.SELL
            
            # Normalize order type
            order_type_str = payload.get("order_type", "MARKET").upper()
            try:
                order_type = OrderType[order_type_str]
            except (KeyError, ValueError):
                order_type = OrderType.MARKET
            
            # Normalize time in force
            tif_str = payload.get("time_in_force", "DAY").upper()
            try:
                time_in_force = TimeInForce[tif_str]
            except (KeyError, ValueError):
                time_in_force = TimeInForce.DAY
            
            # Create normalized Trade object
            trade = Trade(
                symbol=symbol,
                side=side,
                asset_class=asset_class,
                order_type=order_type,
                quantity=payload.get("quantity"),
                price=payload.get("price"),
                stop_price=payload.get("stop_price"),
                take_profit=payload.get("take_profit"),
                stop_loss=payload.get("stop_loss"),
                time_in_force=time_in_force
            )
            
            # Log the normalized trade
            self.logger.info(
                f"Normalized trade for {trade.symbol}",
                extra={
                    "symbol": trade.symbol,
                    "side": trade.side.value,
                    "asset_class": trade.asset_class.value,
                    "order_type": trade.order_type.value
                }
            )
            
            # Validate the trade
            self._validate_trade(trade)
            
            return trade
            
        except (InvalidSymbolError, BrokerRestrictionError) as e:
            # Log specific errors with context
            self.logger.error(
                f"Trade routing error: {str(e)}",
                extra={"payload": sanitize_log_data(payload)}
            )
            raise
        
        except Exception as e:
            # Catch and wrap other exceptions
            self.logger.error(
                f"Unexpected error in trade routing: {str(e)}",
                extra={"payload": sanitize_log_data(payload)},
                exc_info=True
            )
            raise TradeError(f"Failed to process webhook: {str(e)}") from e
    
    def _classify_asset(self, symbol: str) -> AssetClass:
        """
        Classify the asset type based on the symbol.
        
        Args:
            symbol: The trading symbol
            
        Returns:
            AssetClass enum value
        """
        # Simple classification rules - can be enhanced later
        if re.match(r'^[A-Z]{2,5}$', symbol):
            # 2-5 uppercase letters is likely a stock
            return AssetClass.STOCK
        
        if '/' in symbol or symbol.endswith('USD') or symbol.endswith('USDT'):
            # Common patterns for crypto
            return AssetClass.CRYPTO
        
        if re.match(r'^[A-Z]{3}/[A-Z]{3}$', symbol):
            # Currency pairs like EUR/USD
            return AssetClass.FOREX
        
        # Default to stock if we can't determine
        return AssetClass.STOCK
    
    def _validate_trade(self, trade: Trade) -> None:
        """
        Validate that the trade is acceptable for processing.
        
        Args:
            trade: The normalized trade
            
        Raises:
            BrokerRestrictionError: If the trade violates broker restrictions
        """
        # For now, just basic validation
        # This would be expanded with actual broker restrictions
        
        # Check if we support the asset class
        if trade.asset_class == AssetClass.UNKNOWN:
            raise BrokerRestrictionError(f"Unsupported asset class for symbol: {trade.symbol}")
        
        # For limit orders, price is required
        if trade.order_type == OrderType.LIMIT and trade.price is None:
            raise BrokerRestrictionError("Limit orders require a price")
        
        # For stop orders, stop price is required
        if trade.order_type == OrderType.STOP and trade.stop_price is None:
            raise BrokerRestrictionError("Stop orders require a stop price")
        
        # For stop limit orders, both prices are required
        if trade.order_type == OrderType.STOP_LIMIT and (trade.price is None or trade.stop_price is None):
            raise BrokerRestrictionError("Stop limit orders require both limit price and stop price")