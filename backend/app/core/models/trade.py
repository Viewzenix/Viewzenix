"""
Trade model for the Viewzenix trading webhook platform.

This module defines the data models for representing trades.
"""
from dataclasses import dataclass
from enum import Enum
from typing import Optional


class AssetClass(Enum):
    """Asset class enumeration."""
    STOCK = "stock"
    CRYPTO = "crypto"
    FOREX = "forex"
    UNKNOWN = "unknown"


class OrderType(Enum):
    """Order type enumeration."""
    MARKET = "market"
    LIMIT = "limit"
    STOP = "stop"
    STOP_LIMIT = "stop_limit"


class OrderSide(Enum):
    """Order side enumeration."""
    BUY = "buy"
    SELL = "sell"


class TimeInForce(Enum):
    """Time in force enumeration."""
    DAY = "day"
    GTC = "gtc"  # Good Till Canceled
    IOC = "ioc"  # Immediate Or Cancel
    FOK = "fok"  # Fill Or Kill


@dataclass
class Trade:
    """
    Represents a normalized trade from a webhook payload.
    """
    symbol: str
    side: OrderSide
    asset_class: AssetClass
    order_type: OrderType = OrderType.MARKET
    quantity: Optional[float] = None
    price: Optional[float] = None
    stop_price: Optional[float] = None
    take_profit: Optional[float] = None
    stop_loss: Optional[float] = None
    time_in_force: TimeInForce = TimeInForce.DAY