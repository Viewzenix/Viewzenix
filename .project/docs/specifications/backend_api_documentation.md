# Backend API Documentation

This document provides comprehensive information about the backend API endpoints, data models, authentication mechanisms, and error handling for the Viewzenix trading webhook platform.

---

## Authentication

### Supabase JWT Authentication

All `/webhooks` endpoints require Supabase JWT authentication using the `Authorization: Bearer <token>` header.

- **Validation**: Tokens are validated via `supabase.auth.api.get_user(token)`.
- **On Success**: Sets `g.user_id` to the authenticated Supabase user ID.
- **Error Responses**:
  - `401 UNAUTHORIZED`: Missing or invalid Authorization header.
  - `401 UNAUTHORIZED`: Invalid or expired token.

---

## Endpoints

### Webhook Configuration Management (`/webhooks`)

Base URL: `<API_BASE_URL>/webhooks`

#### GET /webhooks

- **Description**: Retrieve all webhook configurations for the authenticated user.
- **Authentication**: Supabase JWT (Bearer token).
- **Response** (200):

  ```json
  {
    "status": "success",
    "data": [ /* Array of WebhookConfig objects */ ]
  }
  ```

- **Error** (500 Server Error):

  ```json
  {
    "status": "error",
    "code": "SERVER_ERROR",
    "message": "An unexpected error occurred retrieving webhook configurations"
  }
  ```

#### GET /webhooks/{id}

- **Description**: Retrieve a specific webhook configuration by its UUID.
- **Path Parameter**:
  - `id` (string, UUID): Webhook configuration ID.
- **Authentication**: Supabase JWT.
- **Response** (200): Single WebhookConfig object.
- **Errors**:
  - `404 NOT_FOUND`: Configuration not found.
  - `500 SERVER_ERROR`: Unexpected server error.

#### POST /webhooks

- **Description**: Create a new webhook configuration.
- **Authentication**: Supabase JWT.
- **Request Body**:

  ```json
  {
    "name": "string",                     // required, 1-255 chars
    "securityToken": "string",            // required, 6-255 chars
    "description": "string",              // optional
    "notificationPreferences": {            // optional
      "email": boolean,
      "browser": boolean,
      "onSuccess": boolean,
      "onFailure": boolean
    },
    "isActive": boolean                     // optional, default true
  }
  ```

- **Response** (201):

  ```json
  {
    "status": "success",
    "data": { /* Created WebhookConfig object */ }
  }
  ```

- **Errors**:
  - `400 BAD_REQUEST`: Schema validation errors.
  - `401 UNAUTHORIZED`: User not authenticated.
  - `500 SERVER_ERROR`: Unexpected server error.

#### PUT /webhooks/{id}

- **Description**: Update an existing webhook configuration.
- **Path Parameter**:
  - `id` (string, UUID)
- **Authentication**: Supabase JWT.
- **Request Body**:

  ```json
  {
    "name": "string",
    "description": "string",
    "securityToken": "string",
    "notificationPreferences": { /* same shape as POST */ },
    "isActive": boolean
  }
  ```

- **Response** (200): Updated WebhookConfig object.
- **Errors**:
  - `400 BAD_REQUEST`, `404 NOT_FOUND`, `500 SERVER_ERROR`.

#### DELETE /webhooks/{id}

- **Description**: Delete a webhook configuration.
- **Path Parameter**:
  - `id` (string, UUID)
- **Authentication**: Supabase JWT.
- **Response** (200):

  ```json
  {
    "status": "success",
    "message": "Webhook configuration deleted successfully"
  }
  ```

- **Errors**:
  - `404 NOT_FOUND`, `500 SERVER_ERROR`.

#### PATCH /webhooks/{id}/toggle

- **Description**: Toggle the `isActive` status of a webhook configuration.
- **Path Parameter**:
  - `id` (string, UUID)
- **Authentication**: Supabase JWT.
- **Request Body**:

  ```json
  { "isActive": boolean }
  ```

- **Response** (200): Updated WebhookConfig object.
- **Errors**:
  - `400 BAD_REQUEST`, `404 NOT_FOUND`, `500 SERVER_ERROR`.

---

### TradingView Webhook Receiver (`/webhook`)

Base URL: `<API_BASE_URL>/webhook`

#### POST /webhook

- **Description**: Receive TradingView alerts and convert into orders.
- **Authentication**: Passphrase in request body (`passphrase`).
- **Request Body**:

  ```json
  {
    "passphrase": "string",                        // required
    "ticker": "string",                            // required
    "action": "BUY" | "SELL",                    // required
    "quantity": number,                              // optional
    "price": number,                                 // optional
    "order_type": "MARKET" | "LIMIT" | "STOP" | "STOP_LIMIT", // optional
    "stop_loss": number,                             // optional
    "take_profit": number,                           // optional
    "time_in_force": "DAY" | "GTC" | "IOC" | "FOK" // optional
  }
  ```

- **Responses**:
  - **200 OK** (Success):

    ```json
    {
      "status": "success",
      "message": "Order processed successfully",
      "request_id": "uuid",
      "order": {
        "id": "string",
        "status": "string",
        "symbol": "string",
        "side": "BUY" | "SELL",
        "quantity": number,
        "filled_quantity": number,
        "simulation_mode": boolean
      }
    }
    ```

  - **401 UNAUTHORIZED** (Invalid passphrase):

    ```json
    {
      "status": "error",
      "code": "INVALID_PASSPHRASE",
      "message": "Invalid passphrase"
    }
    ```

  - **400 BAD_REQUEST** (Trade or sizing errors):

    ```json
    { "status": "error", "code": "TRADE_ERROR", "message": "..." }
    ```

    ```json
    { "status": "error", "code": "ORDER_SIZING_ERROR", "message": "..." }
    ```

  - **502 BAD_GATEWAY** (Broker errors):

    ```json
    { "status": "error", "code": "BROKER_ERROR", "message": "..." }
    ```

  - **500 SERVER_ERROR**:

    ```json
    { "status": "error", "code": "SERVER_ERROR", "message": "An unexpected error occurred processing the webhook" }
    ```

---

### Health Check (`/health`)

Base URL: `<API_BASE_URL>/health`

#### GET /health

- **Description**: Health check endpoint (CORS-enabled).
- **Authentication**: None.
- **Response** (200):

  ```json
  { "status": "ok" }
  ```

---

## Data Models

### WebhookConfig

| Field                   | Type       | Description                                          |
|-------------------------|------------|------------------------------------------------------|
| id                      | UUID (str) | Unique webhook configuration ID                      |
| name                    | string     | Configuration name                                   |
| description             | string     | Optional description                                 |
| webhookUrl              | string     | Generated webhook URL                                |
| securityToken           | string     | Security token for client                            |
| notificationPreferences | JSON object| { email, browser, onSuccess, onFailure } booleans   |
| isActive                | boolean    | Active state                                         |
| createdAt               | ISO string | Timestamp of creation                                |
| updatedAt               | ISO string | Timestamp of last update                             |

### Trade

| Field         | Type               | Description                                    |
|---------------|--------------------|------------------------------------------------|
| symbol        | string             | Trading symbol                                 |
| side          | OrderSide enum     | BUY or SELL                                    |
| asset_class   | AssetClass enum    | STOCK, CRYPTO, FOREX, UNKNOWN                  |
| order_type    | OrderType enum     | MARKET, LIMIT, STOP, STOP_LIMIT                |
| quantity      | number (optional)  | Explicit quantity                              |
| price         | number (optional)  | Price for limit orders                         |
| stop_price    | number (optional)  | Stop price for stop orders                     |
| take_profit   | number (optional)  | Take profit level                              |
| stop_loss     | number (optional)  | Stop loss level                                |
| time_in_force | TimeInForce enum   | DAY, GTC, IOC, FOK                              |

### Order

| Field               | Type               | Description                              |
|---------------------|--------------------|------------------------------------------|
| symbol              | string             | Trading symbol                           |
| side                | OrderSide enum     | BUY or SELL                              |
| quantity            | number             | Number of units                          |
| order_type          | OrderType enum     | MARKET, LIMIT, etc.                      |
| price               | number (optional)  | Price for limit orders                   |
| stop_price          | number (optional)  | Stop price for stop orders               |
| time_in_force       | TimeInForce enum   | DAY, GTC, IOC, FOK                       |
| client_order_id     | string             | Client-generated order ID                |
| take_profit_price   | number (optional)  | Take profit price                        |
| stop_loss_price     | number (optional)  | Stop loss price                          |
| created_at          | datetime           | Order creation timestamp                 |

### OrderStatus

| Field               | Type               | Description                              |
|---------------------|--------------------|------------------------------------------|
| order_id            | string             | Broker or simulated order ID             |
| status              | string             | Order status description                 |
| symbol              | string             | Trading symbol                           |
| side                | OrderSide enum     | BUY or SELL                              |
| quantity            | number             | Quantity submitted                       |
| filled_quantity     | number             | Quantity filled                          |
| average_fill_price  | number (optional)  | Average fill price if available         |
| error_message       | string (optional)  | Error message if any                     |
| is_simulated        | boolean            | True if in simulation mode               |

---

## Configuration Variables

- `WEBHOOK_BASE_URL`        : Base URL for webhook generation.
- `WEBHOOK_PASSPHRASE`      : Passphrase for TradingView webhook endpoint.
- `SIMULATION_MODE`         : `true`/`false` to toggle order simulation.
- `POSITION_SIZING_METHOD`  : `fixed` | `percentage` | `risk`.
- `POSITION_SIZE_VALUE`     : Numeric value for sizing method.
- `DEFAULT_ORDER_QUANTITY`  : Fallback quantity for orders.

---

## Error Codes and Statuses

| HTTP Code | Identifier             | Description                                         |
|-----------|------------------------|-----------------------------------------------------|
| 200       | success                | Operation successful                                |
| 201       | success                | Resource created successfully                       |
| 400       | TRADE_ERROR            | Error in trade routing                              |
| 400       | ORDER_SIZING_ERROR     | Error in order sizing                               |
| 401       | UNAUTHORIZED           | Missing or invalid token or passphrase              |
| 401       | INVALID_PASSPHRASE     | Incorrect webhook passphrase                        |
| 404       | NOT_FOUND              | Resource not found                                  |
| 500       | SERVER_ERROR           | Unexpected server error                             |
| 502       | BROKER_ERROR           | Broker interaction error                            |

---
