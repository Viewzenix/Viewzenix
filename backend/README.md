# Viewzenix Backend

Backend server for the Viewzenix trading webhook platform. This service receives webhooks from TradingView and processes them for automated trading.

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
FLASK_ENV=development
SECRET_KEY=your-secret-key
WEBHOOK_PASSPHRASE=your-webhook-passphrase
```

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
  "message": "Webhook received successfully",
  "request_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

#### Error Response

```json
{
  "status": "error",
  "code": "INVALID_PASSPHRASE",
  "message": "Invalid passphrase"
}
```

## Testing

Run tests with pytest:

```bash
pytest
``` 