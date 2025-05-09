# API Integration Guide

## Overview

This document explains how the frontend application integrates with the backend API for webhook configuration management. The integration is designed to be flexible, allowing the application to work with both the API and localStorage as a fallback.

## Architecture

The API integration consists of several components:

1. **API Client (`src/services/api.ts`)**: A centralized module for making HTTP requests to the backend.
2. **WebhookService (`src/services/webhook.service.ts`)**: A service that uses the API client to manage webhook configurations.
3. **Environment Configuration (`/.env.local.example`)**: Configuration for API URLs and feature flags.

## API Client

The API client provides a standardized way to make HTTP requests to the backend API. It handles error handling, authentication, and request/response formatting.

Key features:
- Custom error handling with the `ApiError` class
- Typed API endpoints for webhook operations
- Automatic JSON parsing and error detection
- Support for all HTTP methods (GET, POST, PUT, PATCH, DELETE)

Usage example:
```typescript
import { api } from '@/services/api';

// Make a GET request
const data = await api.get<MyDataType>('/endpoint');

// Make a POST request
const result = await api.post<MyResponseType>('/endpoint', { key: 'value' });
```

## WebhookService

The WebhookService provides CRUD operations for webhook configurations. It can use either the backend API or localStorage for data persistence, depending on the `NEXT_PUBLIC_USE_API` environment variable.

Key features:
- Seamless transition between API and localStorage
- Fallback to localStorage if the API fails
- Consistent interface for both data sources
- Type safety through TypeScript interfaces

## Environment Configuration

The application uses environment variables to configure the API integration. These variables control whether the application uses the real backend API or falls back to localStorage for data persistence.

### Configuration Files

Next.js supports different environment files for different environments:

- `.env.local`: Local overrides (not checked into git)
- `.env.development`: Development environment (used with `npm run dev`)
- `.env.production`: Production environment (used with `npm run build` and `npm run start`)

### Required Variables

| Variable | Description | Default | Example |
|---|---|---|---|
| `NEXT_PUBLIC_USE_API` | Whether to use the backend API | `false` | `true` |
| `NEXT_PUBLIC_API_URL` | Base URL for API requests | `http://localhost:5000` | `https://api.viewzenix.com` |

### Usage

1. Copy `.env.local.example` to `.env.local`
2. Set the environment variables according to your needs
3. Restart the development server

Example `.env.local` file:
```
NEXT_PUBLIC_USE_API=true
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Testing

When testing the API integration, consider the following scenarios:

1. **API Available**: Set `NEXT_PUBLIC_USE_API=true` to test with the real API.
2. **API Unavailable**: Set `NEXT_PUBLIC_USE_API=false` to test with localStorage.
3. **API Errors**: Test how the application handles API errors by simulating server errors.

## Known Limitations

1. The current implementation assumes the backend API endpoints follow a specific structure.
2. The API client does not yet support authentication.
3. Some advanced features (like paging and filtering) are not yet implemented.

## Future Improvements

1. Add authentication to the API client
2. Support paging and filtering for larger datasets
3. Add retry logic for failed requests
4. Implement request caching for improved performance
5. Add websocket support for real-time updates

## Related Files

- `src/services/api.ts`: API client implementation
- `src/services/webhook.service.ts`: WebhookService implementation
- `src/types/webhook.ts`: Type definitions for webhook data
- `.env.local.example`: Example environment configuration 