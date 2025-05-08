"""
Order model for the Viewzenix trading webhook platform.

This module defines the data models for representing orders.
"""
from dataclasses import dataclass
from typing import Optional
from datetime import datetime
import uuid

from app.core.models.trade import OrderSide, OrderType, TimeInForce


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
    take_profit_price: Optional[float] = None
    stop_loss_price: Optional[float] = None
    created_at: datetime = None
    
    def __post_init__(self):
        """Initialize default values after instance creation."""
        if not self.client_order_id:
            self.client_order_id = str(uuid.uuid4())
        
        if not self.created_at:
            self.created_at = datetime.now()


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