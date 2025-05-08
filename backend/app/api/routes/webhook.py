"""
Webhook endpoint for receiving TradingView alerts.

This module defines the webhook blueprint with endpoint to receive
trading signals from TradingView.
"""
from flask import Blueprint, request, jsonify, current_app
from typing import Dict, Any, Tuple
import uuid

from app.api.middlewares.validation import validate_schema
from app.utils.logging_bus import LoggingBus, sanitize_log_data
from app.core.services.trade_router import TradeRouter, TradeError
from app.core.services.order_engine import OrderEngine, OrderSizingError
from app.core.adapters.alpaca_adapter import AlpacaAdapter, BrokerError

# Create blueprint
webhook_bp = Blueprint('webhook', __name__, url_prefix='/webhook')

# Initialize logger
logger = LoggingBus(__name__)

# Webhook schema for validation
WEBHOOK_SCHEMA = {
    "type": "object",
    "required": ["passphrase", "ticker", "action"],
    "properties": {
        "passphrase": {"type": "string"},
        "ticker": {"type": "string"},
        "action": {"type": "string", "enum": ["BUY", "SELL"]},
        "quantity": {"type": "number"},
        "price": {"type": "number"},
        "order_type": {"type": "string", "enum": ["MARKET", "LIMIT", "STOP", "STOP_LIMIT"]},
        "stop_loss": {"type": "number"},
        "take_profit": {"type": "number"},
        "time_in_force": {"type": "string", "enum": ["DAY", "GTC", "IOC", "FOK"]}
    },
    "additionalProperties": True
}


@webhook_bp.route('', methods=['POST'])
@validate_schema(WEBHOOK_SCHEMA)
def receive_webhook() -> Tuple[Any, int]:
    """
    Receive and process a webhook from TradingView.
    
    Returns:
        JSON response with processing status
    """
    try:
        # Get request data
        payload = request.get_json()
        
        # Validate passphrase
        if not _validate_passphrase(payload.get('passphrase', '')):
            logger.warning(
                "Invalid passphrase in webhook", 
                extra={"ticker": payload.get("ticker")}
            )
            return jsonify({
                "status": "error",
                "code": "INVALID_PASSPHRASE",
                "message": "Invalid passphrase"
            }), 401
        
        # Generate request ID for tracking
        request_id = str(uuid.uuid4())
        
        # Log the webhook (sanitized)
        logger.info(
            f"Received webhook for {payload.get('ticker')}",
            extra={
                "request_id": request_id,
                "ticker": payload.get("ticker"),
                "action": payload.get("action"),
                "order_type": payload.get("order_type", "MARKET")
            }
        )
        
        # Initialize services
        trade_router = TradeRouter()
        broker_adapter = AlpacaAdapter()
        order_engine = OrderEngine(broker_adapter)
        
        # Process the webhook through our services
        trade = trade_router.process_webhook(payload)
        order_status = order_engine.process_trade(trade)
        
        # Prepare response based on order status
        response_data = {
            "status": "success",
            "message": "Order processed successfully",
            "request_id": request_id,
            "order": {
                "id": order_status.order_id,
                "status": order_status.status,
                "symbol": order_status.symbol,
                "side": order_status.side.value,
                "quantity": order_status.quantity,
                "filled_quantity": order_status.filled_quantity,
                "simulation_mode": order_status.is_simulated
            }
        }
        
        return jsonify(response_data), 200
        
    except TradeError as e:
        # Handle trade routing errors
        logger.error(f"Trade error: {str(e)}")
        return jsonify({
            "status": "error",
            "code": "TRADE_ERROR",
            "message": str(e)
        }), 400
        
    except OrderSizingError as e:
        # Handle order sizing errors
        logger.error(f"Order sizing error: {str(e)}")
        return jsonify({
            "status": "error",
            "code": "ORDER_SIZING_ERROR",
            "message": str(e)
        }), 400
        
    except BrokerError as e:
        # Handle broker-related errors
        logger.error(f"Broker error: {str(e)}")
        return jsonify({
            "status": "error",
            "code": "BROKER_ERROR",
            "message": str(e)
        }), 502  # Bad Gateway for broker issues
        
    except Exception as e:
        # Log the error
        logger.error(
            f"Error processing webhook: {str(e)}",
            exc_info=True
        )
        
        # Return error response
        return jsonify({
            "status": "error",
            "code": "SERVER_ERROR",
            "message": "An unexpected error occurred processing the webhook"
        }), 500


def _validate_passphrase(passphrase: str) -> bool:
    """
    Validate webhook passphrase.
    
    Args:
        passphrase: Passphrase from webhook payload
        
    Returns:
        True if passphrase is valid, False otherwise
    """
    expected = current_app.config.get('WEBHOOK_PASSPHRASE')
    return passphrase == expected 