"""
Broker adapter interface for the Viewzenix trading webhook platform.

This module defines the abstract base class for broker adapters.
"""
from abc import ABC, abstractmethod
from app.core.models.order import Order, OrderStatus


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