# Viewzenix Backend

Backend server for the Viewzenix trading webhook platform. This service receives webhooks from TradingView and processes them for automated trading through broker APIs.

## Setup

### Prerequisites

- Python 3.9+
- pip

### Installation

1. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

2. Activate the virtual environment:
   - Windows:
     ```bash
     venv\Scripts\activate
     ```
   - macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Configuration

Create a `.env` file in the backend directory with the following variables:

```
# Flask settings
FLASK_ENV=development
SECRET_KEY=your-secret-key

# Application settings
WEBHOOK_PASSPHRASE=your-webhook-passphrase
PORT=5000

# Logging
LOG_LEVEL=DEBUG

# Alpaca API settings
ALPACA_API_KEY=your-alpaca-api-key
ALPACA_API_SECRET=your-alpaca-api-secret
ALPACA_API_URL=https://paper-api.alpaca.markets

# Order processing settings
SIMULATION_MODE=True
DEFAULT_ORDER_QUANTITY=1
POSITION_SIZING_METHOD=fixed  # fixed, percentage, risk
POSITION_SIZE_VALUE=1.0
```

> **Note:** By default, the application runs in simulation mode, which means no actual orders will be placed. Set `SIMULATION_MODE=False` to enable real trading.

## Running the Application

Start the development server:

```bash
python run.py
```

The API will be available at http://localhost:5000

## API Endpoints

### Webhook Endpoint

- **URL**: `/webhook`
- **Method**: `POST`
- **Content-Type**: `application/json`
- **Description**: Receives webhook notifications from TradingView

#### Request Body

```json
{
  "passphrase": "your-webhook-passphrase",
  "ticker": "AAPL",
  "action": "BUY",
  "quantity": 10,
  "price": 150.50,
  "order_type": "MARKET",
  "stop_loss": 145.00,
  "take_profit": 160.00,
  "time_in_force": "DAY"
}
```

#### Success Response

```json
{
  "status": "success",
  "message": "Order processed successfully",
  "request_id": "550e8400-e29b-41d4-a716-446655440000",
  "order": {
    "id": "order-id-from-broker",
    "status": "filled",
    "symbol": "AAPL",
    "side": "buy",
    "quantity": 10,
    "filled_quantity": 10,
    "simulation_mode": true
  }
}
```

#### Error Responses

**Invalid Passphrase:**
```json
{
  "status": "error",
  "code": "INVALID_PASSPHRASE",
  "message": "Invalid passphrase"
}
```

**Trade Error:**
```json
{
  "status": "error",
  "code": "TRADE_ERROR",
  "message": "Invalid symbol: XYZ"
}
```

**Order Sizing Error:**
```json
{
  "status": "error",
  "code": "ORDER_SIZING_ERROR",
  "message": "Failed to calculate order size"
}
```

**Broker Error:**
```json
{
  "status": "error",
  "code": "BROKER_ERROR",
  "message": "Failed to connect to broker API"
}
```

## Testing

Run tests with pytest:

```bash
pytest
```

### Testing with Simulation Mode

The backend includes a simulation mode that allows you to test the webhook processing without placing actual orders. This is enabled by default and can be controlled via the `SIMULATION_MODE` environment variable.

To test the webhook endpoint with a simulated order:

1. Ensure `SIMULATION_MODE=True` in your `.env` file
2. Send a test webhook payload to the endpoint
3. Check the response and logs to see how the order would have been processed

## Architecture

The backend follows a layered architecture:

1. **API Layer** - Receives webhooks and handles HTTP requests
2. **Service Layer**:
   - **Trade Router** - Classifies and normalizes trade information
   - **Order Engine** - Processes trades into orders and handles sizing
3. **Adapter Layer** - Connects to external broker APIs (Alpaca)
4. **Model Layer** - Defines data structures for trades and orders

## Broker Support

Currently supported brokers:
- **Alpaca** - For stocks and crypto trading

To add support for additional brokers, implement the `BrokerAdapter` interface in a new adapter class.