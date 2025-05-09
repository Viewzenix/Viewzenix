# API Integration Guide

## Overview

This document explains how the frontend application integrates with the backend API for webhook configuration management. The integration is designed to be flexible, allowing the application to work with both the API and localStorage as a fallback.

## Architecture

The API integration consists of several components:

1. **API Client (`src/services/api.ts`)**: A centralized module for making HTTP requests to the backend.
2. **WebhookService (`src/services/webhook.service.ts`)**: A service that uses the API client to manage webhook configurations.
3. **Environment Configuration (`/.env.local.example`)**: Configuration for API URLs and feature flags.
4. **Mock Server (`src/mocks/`)**: Mock API implementation for development and testing.

## API Client

The API client provides a standardized way to make HTTP requests to the backend API. It handles error handling, response parsing, and common configuration.

```typescript
// Example of making an API request
import { webhookApi } from '@/services/api';

// Get all webhooks
const webhooks = await webhookApi.getAll();

// Create a new webhook
const newWebhook = await webhookApi.create({
  name: 'My Webhook',
  securityToken: 'secret-token',
  // ...other properties
});
```

## WebhookService

The WebhookService provides a higher-level interface for managing webhook configurations. It can use either the backend API or localStorage for data persistence, depending on the environment configuration.

```typescript
// Example of using the WebhookService
import { webhookService } from '@/services/webhook.service';

// Get all webhooks
const webhooks = await webhookService.getWebhooks();

// Create a new webhook
const newWebhook = await webhookService.createWebhook({
  name: 'My Webhook',
  securityToken: 'secret-token',
  // ...other properties
});
```

## Environment Configuration

The API integration can be configured using environment variables in a `.env.local` file:

```
# API Configuration
# Set to 'true' to use backend API, 'false' to use localStorage
NEXT_PUBLIC_USE_API=false

# Base URL for API requests
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Copy the `.env.local.example` file to `.env.local` and modify it according to your environment.

## Mock Server (MSW)

The application uses Mock Service Worker (MSW) v2 to mock API responses during development and testing. This allows the frontend to work without a running backend or to test specific API scenarios.

### Setup

1. Install MSW:

```bash
npm install --save-dev msw
```

2. The mock server is automatically initialized in development mode through the setup in `_app.tsx`.

3. API handlers are defined in `src/mocks/handlers.ts`.

### Customizing Mock Responses

To customize the mock API responses, modify the handlers in `src/mocks/handlers.ts`:

```typescript
// Example of customizing a handler
http.get('/api/webhooks', () => {
  // Return custom data
  return HttpResponse.json([
    {
      id: '1',
      name: 'Custom Webhook',
      // ...other properties
    }
  ]);
});
```

## Error Handling

The API client provides standardized error handling through the `ApiError` class:

```typescript
try {
  const webhooks = await webhookApi.getAll();
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`API Error (${error.status}): ${error.message}`);
    // Handle specific error codes
    if (error.status === 401) {
      // Handle unauthorized
    } else if (error.status === 404) {
      // Handle not found
    }
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## Troubleshooting

### API Connection Issues

If you're having trouble connecting to the API:

1. Verify that the API server is running
2. Check your `.env.local` configuration
3. Verify network connectivity
4. Check browser console for CORS errors

### Using localStorage Instead of API

To use localStorage instead of the API (useful when backend is not available):

1. Set `NEXT_PUBLIC_USE_API=false` in your `.env.local` file
2. Restart the development server

## Future Improvements

Once the backend API is fully implemented (TASK-008), the following improvements will be made:

1. Update API endpoint paths to match the actual backend implementation
2. Add authentication token handling
3. Implement proper error handling for specific backend error codes
4. Update the data models to match the backend schema
5. Add additional API endpoints for webhook testing and monitoring 