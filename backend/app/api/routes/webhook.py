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
        
        # In a future implementation, this would call a service to process the webhook
        # For now, just acknowledge receipt
        return jsonify({
            "status": "success",
            "message": "Webhook received successfully",
            "request_id": request_id
        }), 200
        
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