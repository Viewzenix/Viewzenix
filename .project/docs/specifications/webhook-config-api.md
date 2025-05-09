# Webhook Configuration API

## Overview

This document describes the Webhook Configuration API endpoints for the Viewzenix trading webhook platform. These endpoints enable frontend applications to create, read, update, and delete webhook configurations.

## Base URL

All endpoints are relative to the API base URL:

```
https://api.viewzenix.com
```

## Authentication

All API endpoints require authentication. Authentication method will be implemented in a future update.

## Data Models

### WebhookConfig

Represents a webhook configuration:

| Field | Type | Description |
|-------|------|-------------|
| id | string (UUID) | Unique identifier for the webhook configuration |
| name | string | User-friendly name for the webhook |
| description | string | Description of the webhook's purpose |
| webhookUrl | string | Webhook endpoint URL provided to TradingView |
| securityToken | string | Security token/passphrase for webhook authentication |
| notificationPreferences | object | Notification preferences for this webhook |
| isActive | boolean | Whether this webhook configuration is currently active |
| createdAt | string (ISO date) | Creation timestamp |
| updatedAt | string (ISO date) | Last update timestamp |

### NotificationPreferences

Represents notification preferences for a webhook:

| Field | Type | Description |
|-------|------|-------------|
| email | boolean | Send email notifications for webhook events |
| browser | boolean | Send browser notifications for webhook events |
| onSuccess | boolean | Send notifications on successful webhook execution |
| onFailure | boolean | Send notifications on webhook execution failure |

## Endpoints

### GET /webhooks

Retrieves all webhook configurations.

#### Response

```json
{
  "status": "success",
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "AAPL Trading Strategy",
      "description": "TradingView alerts for Apple stock",
      "webhookUrl": "https://api.viewzenix.com/webhook/123e4567-e89b-12d3-a456-426614174000",
      "securityToken": "abc123xyz789",
      "notificationPreferences": {
        "email": true,
        "browser": true,
        "onSuccess": true,
        "onFailure": true
      },
      "isActive": true,
      "createdAt": "2024-05-01T12:00:00Z",
      "updatedAt": "2024-05-05T15:30:00Z"
    }
  ]
}
```

### GET /webhooks/{id}

Retrieves a specific webhook configuration by ID.

#### Parameters

| Name | Located in | Description | Required | Schema |
|------|------------|-------------|----------|--------|
| id | path | UUID of the webhook configuration | Yes | string (UUID) |

#### Response

```json
{
  "status": "success",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "AAPL Trading Strategy",
    "description": "TradingView alerts for Apple stock",
    "webhookUrl": "https://api.viewzenix.com/webhook/123e4567-e89b-12d3-a456-426614174000",
    "securityToken": "abc123xyz789",
    "notificationPreferences": {
      "email": true,
      "browser": true,
      "onSuccess": true,
      "onFailure": true
    },
    "isActive": true,
    "createdAt": "2024-05-01T12:00:00Z",
    "updatedAt": "2024-05-05T15:30:00Z"
  }
}
```

### POST /webhooks

Creates a new webhook configuration.

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | User-friendly name for the webhook |
| description | string | No | Description of the webhook's purpose |
| securityToken | string | Yes | Security token/passphrase for webhook authentication |
| notificationPreferences | object | No | Notification preferences for this webhook |
| isActive | boolean | No | Whether this webhook configuration is active (default: true) |

Example:

```json
{
  "name": "AAPL Trading Strategy",
  "description": "TradingView alerts for Apple stock",
  "securityToken": "abc123xyz789",
  "notificationPreferences": {
    "email": true,
    "browser": true,
    "onSuccess": true,
    "onFailure": true
  },
  "isActive": true
}
```

#### Response

```json
{
  "status": "success",
  "message": "Webhook configuration created successfully",
  "data": {
    "webhook": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "AAPL Trading Strategy",
      "description": "TradingView alerts for Apple stock",
      "webhookUrl": "https://api.viewzenix.com/webhook/123e4567-e89b-12d3-a456-426614174000",
      "securityToken": "abc123xyz789",
      "notificationPreferences": {
        "email": true,
        "browser": true,
        "onSuccess": true,
        "onFailure": true
      },
      "isActive": true,
      "createdAt": "2024-05-01T12:00:00Z",
      "updatedAt": "2024-05-01T12:00:00Z"
    },
    "success": true
  }
}
```

### PUT /webhooks/{id}

Updates an existing webhook configuration.

#### Parameters

| Name | Located in | Description | Required | Schema |
|------|------------|-------------|----------|--------|
| id | path | UUID of the webhook configuration | Yes | string (UUID) |

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | No | User-friendly name for the webhook |
| description | string | No | Description of the webhook's purpose |
| securityToken | string | No | Security token/passphrase for webhook authentication |
| notificationPreferences | object | No | Notification preferences for this webhook |
| isActive | boolean | No | Whether this webhook configuration is active |

Example:

```json
{
  "name": "Updated AAPL Strategy",
  "description": "Updated description",
  "isActive": false
}
```

#### Response

```json
{
  "status": "success",
  "message": "Webhook configuration updated successfully",
  "data": {
    "webhook": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Updated AAPL Strategy",
      "description": "Updated description",
      "webhookUrl": "https://api.viewzenix.com/webhook/123e4567-e89b-12d3-a456-426614174000",
      "securityToken": "abc123xyz789",
      "notificationPreferences": {
        "email": true,
        "browser": true,
        "onSuccess": true,
        "onFailure": true
      },
      "isActive": false,
      "createdAt": "2024-05-01T12:00:00Z",
      "updatedAt": "2024-05-05T15:30:00Z"
    },
    "success": true
  }
}
```

### DELETE /webhooks/{id}

Deletes a webhook configuration.

#### Parameters

| Name | Located in | Description | Required | Schema |
|------|------------|-------------|----------|--------|
| id | path | UUID of the webhook configuration | Yes | string (UUID) |

#### Response

```json
{
  "status": "success",
  "message": "Webhook configuration deleted successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "success": true
  }
}
```

## Error Responses

### 400 Bad Request

Returned when the request is invalid or fails validation.

```json
{
  "status": "error",
  "code": "VALIDATION_ERROR",
  "message": "Validation error",
  "details": {
    "field": "name",
    "error": "Field is required"
  }
}
```

### 404 Not Found

Returned when the requested resource is not found.

```json
{
  "status": "error",
  "code": "NOT_FOUND",
  "message": "Webhook configuration with id 123e4567-e89b-12d3-a456-426614174000 not found"
}
```

### 409 Conflict

Returned when there is a conflict with the current state of the resource.

```json
{
  "status": "error",
  "code": "INTEGRITY_ERROR",
  "message": "Webhook configuration with similar attributes already exists"
}
```

### 500 Server Error

Returned when an unexpected error occurs on the server.

```json
{
  "status": "error",
  "code": "SERVER_ERROR",
  "message": "An unexpected error occurred"
}
```

## Integration Notes

1. The webhookUrl is generated automatically by the backend and contains the webhook configuration ID.
2. The frontend should use the webhookUrl provided in the response to instruct users on setting up their TradingView alerts.
3. The securityToken is used to authenticate incoming webhooks and should be provided in the TradingView alert message JSON.
4. The notificationPreferences object controls how users are notified about webhook events.

## Implementation Examples

### Creating a Webhook Configuration

```javascript
const createWebhook = async (webhookData) => {
  const response = await fetch('https://api.viewzenix.com/webhooks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_TOKEN'
    },
    body: JSON.stringify(webhookData)
  });
  
  return await response.json();
};

// Example usage
const result = await createWebhook({
  name: "AAPL Trading Strategy",
  description: "TradingView alerts for Apple stock",
  securityToken: "abc123xyz789",
  notificationPreferences: {
    email: true,
    browser: true,
    onSuccess: true,
    onFailure: true
  }
});
```