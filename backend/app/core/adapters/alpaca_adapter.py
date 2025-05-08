"""
Alpaca broker adapter for the Viewzenix trading webhook platform.

This module implements the broker adapter interface for Alpaca.
"""
from typing import Dict, Any
import alpaca_trade_api as tradeapi
from flask import current_app

from app.utils.logging_bus import LoggingBus
from app.core.models.order import Order, OrderStatus
from app.core.models.trade import OrderSide, OrderType, TimeInForce
from app.core.adapters.broker_adapter import (
    BrokerAdapter, BrokerError, BrokerConnectionError, OrderSubmissionError
)


class AlpacaAdapter(BrokerAdapter):
    """Adapter for the Alpaca trading API."""
    
    def __init__(self):
        """Initialize the Alpaca adapter."""
        self.logger = LoggingBus(__name__)
        self._api = None
    
    @property
    def api(self) -> tradeapi.REST:
        """
        Get the Alpaca API client, initializing if needed.
        
        Returns:
            Configured Alpaca API client
        
        Raises:
            BrokerConnectionError: If API initialization fails
        """
        if self._api is None:
            try:
                self._api = tradeapi.REST(
                    key_id=current_app.config['ALPACA_API_KEY'],
                    secret_key=current_app.config['ALPACA_API_SECRET'],
                    base_url=current_app.config['ALPACA_API_URL']
                )
                self.logger.info(
                    "Alpaca API initialized",
                    extra={"api_url": current_app.config['ALPACA_API_URL']}
                )
            except Exception as e:
                self.logger.error(
                    f"Failed to initialize Alpaca API: {str(e)}", 
                    exc_info=True
                )
                raise BrokerConnectionError(f"Failed to connect to Alpaca: {str(e)}") from e
        
        return self._api
    
    def submit_order(self, order: Order) -> OrderStatus:
        """
        Submit an order to Alpaca.
        
        Args:
            order: Order to submit
            
        Returns:
            Order status from Alpaca
            
        Raises:
            BrokerConnectionError: If connection to Alpaca fails
            OrderSubmissionError: If order submission fails
            BrokerError: For other Alpaca-related errors
        """
        try:
            # Log the order submission attempt
            self.logger.info(
                f"Submitting {order.side.value} order for {order.quantity} {order.symbol}",
                extra={
                    "symbol": order.symbol,
                    "side": order.side.value,
                    "quantity": order.quantity,
                    "order_type": order.order_type.value,
                    "client_order_id": order.client_order_id
                }
            )
            
            # Prepare order parameters
            order_params = {
                "symbol": order.symbol,
                "qty": order.quantity,
                "side": order.side.value,
                "type": order.order_type.value,
                "time_in_force": order.time_in_force.value,
                "client_order_id": order.client_order_id
            }
            
            # Add conditional parameters
            if order.price is not None:
                order_params["limit_price"] = order.price
                
            if order.stop_price is not None:
                order_params["stop_price"] = order.stop_price
                
            if order.take_profit_price is not None:
                order_params["take_profit"] = {"limit_price": order.take_profit_price}
                
            if order.stop_loss_price is not None:
                order_params["stop_loss"] = {"stop_price": order.stop_loss_price}
            
            # Submit order to Alpaca
            alpaca_order = self.api.submit_order(**order_params)
            
            # Log success
            self.logger.info(
                f"Order submitted successfully: {alpaca_order.id}",
                extra={
                    "order_id": alpaca_order.id,
                    "status": alpaca_order.status,
                    "symbol": order.symbol
                }
            )
            
            # Convert to our OrderStatus model
            return OrderStatus(
                order_id=alpaca_order.id,
                status=alpaca_order.status,
                symbol=order.symbol,
                side=order.side,
                quantity=float(order.quantity),
                filled_quantity=float(alpaca_order.filled_qty) if hasattr(alpaca_order, 'filled_qty') else 0.0,
                average_fill_price=float(alpaca_order.filled_avg_price) if hasattr(alpaca_order, 'filled_avg_price') and alpaca_order.filled_avg_price else None
            )
            
        except tradeapi.rest.APIError as e:
            error_msg = f"Alpaca API error: {str(e)}"
            self.logger.error(
                error_msg,
                extra={
                    "symbol": order.symbol,
                    "side": order.side.value,
                    "error_code": getattr(e, 'code', 'unknown')
                }
            )
            raise OrderSubmissionError(error_msg) from e
            
        except Exception as e:
            error_msg = f"Unexpected error submitting order to Alpaca: {str(e)}"
            self.logger.error(
                error_msg,
                extra={"symbol": order.symbol},
                exc_info=True
            )
            raise BrokerError(error_msg) from e
    
    def get_order_status(self, order_id: str) -> OrderStatus:
        """
        Get order status from Alpaca.
        
        Args:
            order_id: Alpaca order ID
            
        Returns:
            Current order status
            
        Raises:
            BrokerConnectionError: If connection to Alpaca fails
            BrokerError: For other Alpaca-related errors
        """
        try:
            # Get order from Alpaca
            alpaca_order = self.api.get_order(order_id)
            
            # Convert to our OrderStatus model
            return OrderStatus(
                order_id=alpaca_order.id,
                status=alpaca_order.status,
                symbol=alpaca_order.symbol,
                side=OrderSide.BUY if alpaca_order.side == 'buy' else OrderSide.SELL,
                quantity=float(alpaca_order.qty),
                filled_quantity=float(alpaca_order.filled_qty) if hasattr(alpaca_order, 'filled_qty') else 0.0,
                average_fill_price=float(alpaca_order.filled_avg_price) if hasattr(alpaca_order, 'filled_avg_price') and alpaca_order.filled_avg_price else None
            )
            
        except Exception as e:
            error_msg = f"Failed to get order status from Alpaca: {str(e)}"
            self.logger.error(
                error_msg,
                extra={"order_id": order_id},
                exc_info=True
            )
            raise BrokerError(error_msg) from e
    
    def cancel_order(self, order_id: str) -> bool:
        """
        Cancel an order with Alpaca.
        
        Args:
            order_id: Alpaca order ID
            
        Returns:
            True if cancellation succeeded, False otherwise
            
        Raises:
            BrokerConnectionError: If connection to Alpaca fails
            BrokerError: For other Alpaca-related errors
        """
        try:
            # Attempt to cancel the order
            self.api.cancel_order(order_id)
            
            # Log success
            self.logger.info(f"Order {order_id} canceled successfully")
            
            return True
            
        except tradeapi.rest.APIError as e:
            # If order is already filled/canceled, that's not an error
            if hasattr(e, 'code') and e.code == 404:
                self.logger.warning(f"Order {order_id} not found for cancellation, may be already filled or canceled")
                return False
                
            # Other API errors
            error_msg = f"Alpaca API error canceling order: {str(e)}"
            self.logger.error(
                error_msg,
                extra={"order_id": order_id}
            )
            raise BrokerError(error_msg) from e
            
        except Exception as e:
            error_msg = f"Unexpected error canceling order with Alpaca: {str(e)}"
            self.logger.error(
                error_msg,
                extra={"order_id": order_id},
                exc_info=True
            )
            raise BrokerError(error_msg) from e