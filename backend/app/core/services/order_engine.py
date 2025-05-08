"""
Order engine service for the Viewzenix trading webhook platform.

This module defines the service for processing trades into orders.
"""
from typing import Dict, Any
import uuid
from flask import current_app
from datetime import datetime

from app.utils.logging_bus import LoggingBus
from app.core.models.trade import Trade
from app.core.models.order import Order, OrderStatus
from app.core.adapters.broker_adapter import BrokerAdapter


class OrderSizingError(Exception):
    """Error during order sizing calculation."""
    pass


class OrderEngine:
    """
    Service that processes trades into orders and submits them to brokers.
    """
    
    def __init__(self, broker_adapter: BrokerAdapter):
        """
        Initialize the order engine.
        
        Args:
            broker_adapter: Adapter for broker interaction
        """
        self.broker_adapter = broker_adapter
        self.logger = LoggingBus(__name__)
        self.simulation_mode = current_app.config.get('SIMULATION_MODE', True)
    
    def process_trade(self, trade: Trade) -> OrderStatus:
        """
        Process a trade into an order and submit to broker.
        
        Args:
            trade: Normalized trade to process
            
        Returns:
            OrderStatus from broker (or simulated)
            
        Raises:
            OrderSizingError: If order sizing fails
            BrokerConnectionError: If connection to broker fails
            OrderSubmissionError: If order submission fails
            BrokerError: For other broker-related errors
        """
        try:
            # Determine order size
            quantity = self._calculate_order_size(trade)
            
            # Create order
            order = Order(
                symbol=trade.symbol,
                side=trade.side,
                quantity=quantity,
                order_type=trade.order_type,
                price=trade.price,
                stop_price=trade.stop_price,
                time_in_force=trade.time_in_force,
                client_order_id=f"vzx-{uuid.uuid4()}",
                take_profit_price=trade.take_profit,
                stop_loss_price=trade.stop_loss,
                created_at=datetime.now()
            )
            
            # Log the order details
            self.logger.info(
                f"Created order for {order.quantity} {order.symbol}",
                extra={
                    "symbol": order.symbol,
                    "side": order.side.value,
                    "quantity": order.quantity,
                    "order_type": order.order_type.value,
                    "simulation_mode": self.simulation_mode
                }
            )
            
            # Submit order (or simulate)
            if self.simulation_mode:
                order_status = self._simulate_order_submission(order)
            else:
                order_status = self.broker_adapter.submit_order(order)
            
            return order_status
            
        except Exception as e:
            self.logger.error(
                f"Error processing trade: {str(e)}",
                extra={
                    "symbol": trade.symbol,
                    "side": trade.side.value
                },
                exc_info=True
            )
            raise
    
    def _calculate_order_size(self, trade: Trade) -> float:
        """
        Calculate the order size based on the trade and configuration.
        
        Args:
            trade: Trade to size
            
        Returns:
            Order quantity
            
        Raises:
            OrderSizingError: If order sizing fails
        """
        try:
            # If quantity is explicitly provided in the trade, use that
            if trade.quantity is not None:
                return float(trade.quantity)
            
            # Otherwise use configuration to determine sizing
            sizing_method = current_app.config.get('POSITION_SIZING_METHOD', 'fixed')
            sizing_value = float(current_app.config.get('POSITION_SIZE_VALUE', 1.0))
            
            if sizing_method == 'fixed':
                # Fixed number of shares/contracts/coins
                return sizing_value
            
            elif sizing_method == 'percentage':
                # Percentage of account - would need to get account value from broker
                # This is a simplified implementation
                account_value = 10000.0  # Example value, would come from broker in reality
                if trade.price:
                    return (account_value * sizing_value / 100) / trade.price
                else:
                    # If no price known, use fixed sizing as fallback
                    self.logger.warning(
                        "Price unknown for percentage sizing, falling back to fixed quantity",
                        extra={"symbol": trade.symbol}
                    )
                    return float(current_app.config.get('DEFAULT_ORDER_QUANTITY', 1))
            
            elif sizing_method == 'risk':
                # Risk-based sizing requires stop loss
                if not trade.stop_loss or not trade.price:
                    self.logger.warning(
                        "Missing price or stop loss for risk-based sizing, falling back to fixed quantity",
                        extra={"symbol": trade.symbol}
                    )
                    return float(current_app.config.get('DEFAULT_ORDER_QUANTITY', 1))
                
                # Calculate position size based on risk
                account_value = 10000.0  # Example value, would come from broker
                risk_amount = account_value * sizing_value / 100
                stop_distance = abs(trade.price - trade.stop_loss)
                
                if stop_distance > 0:
                    return risk_amount / stop_distance
                else:
                    # If stop is at the same price, use fixed sizing as fallback
                    self.logger.warning(
                        "Invalid stop distance for risk-based sizing, falling back to fixed quantity",
                        extra={"symbol": trade.symbol}
                    )
                    return float(current_app.config.get('DEFAULT_ORDER_QUANTITY', 1))
            
            else:
                # Default to fixed sizing
                self.logger.warning(
                    f"Unknown sizing method '{sizing_method}', using fixed quantity",
                    extra={"symbol": trade.symbol}
                )
                return float(current_app.config.get('DEFAULT_ORDER_QUANTITY', 1))
                
        except Exception as e:
            error_msg = f"Order sizing error: {str(e)}"
            self.logger.error(
                error_msg,
                extra={"symbol": trade.symbol},
                exc_info=True
            )
            raise OrderSizingError(error_msg) from e
    
    def _simulate_order_submission(self, order: Order) -> OrderStatus:
        """
        Simulate order submission for testing purposes.
        
        Args:
            order: Order to simulate
            
        Returns:
            Simulated order status
        """
        # Generate a simulated order ID
        simulated_order_id = f"sim-{uuid.uuid4()}"
        
        # Log the simulated order
        self.logger.info(
            f"SIMULATION: Order would be submitted: {order.side.value} {order.quantity} {order.symbol}",
            extra={
                "simulated_order_id": simulated_order_id,
                "symbol": order.symbol,
                "side": order.side.value,
                "quantity": order.quantity,
                "order_type": order.order_type.value
            }
        )
        
        # Return a simulated order status
        return OrderStatus(
            order_id=simulated_order_id,
            status="filled",  # Optimistically assume it would be filled
            symbol=order.symbol,
            side=order.side,
            quantity=order.quantity,
            filled_quantity=order.quantity,  # In simulation, assume 100% fill
            average_fill_price=order.price or 0.0,  # Use the limit price or 0 if market order
            is_simulated=True
        )