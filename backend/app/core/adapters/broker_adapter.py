"""
Broker adapter interface for the Viewzenix trading webhook platform.

This module defines the abstract base class for broker adapters.
"""
from abc import ABC, abstractmethod
from dataclasses import dataclass
from enum import Enum
from typing import Optional, Dict, Any


class OrderSide(Enum):
    """Order side enumeration."""
    BUY = "buy"
    SELL = "sell"


class OrderType(Enum):
    """Order type enumeration."""
    MARKET = "market"
    LIMIT = "limit"
    STOP = "stop"
    STOP_LIMIT = "stop_limit"


class TimeInForce(Enum):
    """Time in force enumeration."""
    DAY = "day"
    GTC = "gtc"  # Good Till Canceled
    IOC = "ioc"  # Immediate Or Cancel
    FOK = "fok"  # Fill Or Kill


@dataclass
class Order:
    """
    Represents an order ready to be submitted to a broker.
    """
    symbol: str
    side: OrderSide
    quantity: float
    order_type: OrderType = OrderType.MARKET
    price: Optional[float] = None
    stop_price: Optional[float] = None
    time_in_force: TimeInForce = TimeInForce.DAY
    client_order_id: str = None


@dataclass
class OrderStatus:
    """
    Represents the status of an order after submission to a broker.
    """
    order_id: str
    status: str
    symbol: str
    side: OrderSide
    quantity: float
    filled_quantity: float = 0.0
    average_fill_price: Optional[float] = None
    error_message: Optional[str] = None
    is_simulated: bool = False


class BrokerError(Exception):
    """Base class for broker-related errors."""
    pass


class BrokerConnectionError(BrokerError):
    """Error connecting to broker API."""
    pass


class OrderSubmissionError(BrokerError):
    """Error submitting order to broker."""
    pass


class BrokerAdapter(ABC):
    """Abstract base class for broker adapters."""
    
    @abstractmethod
    def submit_order(self, order: Order) -> OrderStatus:
        """
        Submit an order to the broker.
        
        Args:
            order: Order details to submit
            
        Returns:
            Order status from broker
            
        Raises:
            BrokerConnectionError: If connection to broker fails
            OrderSubmissionError: If order submission fails
            BrokerError: For other broker-related errors
        """
        pass
    
    @abstractmethod
    def get_order_status(self, order_id: str) -> OrderStatus:
        """
        Get the status of an order from the broker.
        
        Args:
            order_id: ID of order to check
            
        Returns:
            Current order status
            
        Raises:
            BrokerConnectionError: If connection to broker fails
            BrokerError: For other broker-related errors
        """
        pass
    
    @abstractmethod
    def cancel_order(self, order_id: str) -> bool:
        """
        Cancel an order with the broker.
        
        Args:
            order_id: ID of order to cancel
            
        Returns:
            True if cancellation succeeded, False otherwise
            
        Raises:
            BrokerConnectionError: If connection to broker fails
            BrokerError: For other broker-related errors
        """
        pass