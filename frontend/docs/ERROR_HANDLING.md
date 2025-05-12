# Error Handling System

This document outlines the error handling system implemented in the Viewzenix frontend application. The system provides a centralized approach to handling errors, displaying error messages, and logging errors for debugging.

## Components

The error handling system consists of the following components:

### 1. Error Service

Located at `services/error/error.service.ts`, this service provides:

- Centralized error logging
- User notifications via toast messages
- Error categorization by severity and source
- Extensibility for external error monitoring services

### 2. Error Boundary

Located at `components/common/errors/ErrorBoundary.tsx`, this component:

- Catches JavaScript errors in the component tree
- Prevents the entire app from crashing
- Displays a fallback UI when errors occur
- Logs errors to the error service
- Provides a way to recover from errors

### 3. Error Fallback

Located at `components/common/errors/ErrorFallback.tsx`, this component:

- Displays a user-friendly error message
- Shows technical details in development mode
- Provides a "Try Again" button to reset the error boundary

## Usage

### Using the Error Service

```tsx
import { 
  notifyError, 
  notifyApiError, 
  notifyWarning, 
  notifyInfo,
  ErrorSeverity,
  ErrorSource,
  errorService
} from '@/services/error';

// Simple error notification
notifyError('Something went wrong');

// API-specific error with original error object
try {
  await fetchData();
} catch (error) {
  notifyApiError('Failed to fetch data', error);
}

// Warning notification
notifyWarning('Your session will expire soon');

// Info notification
notifyInfo('Changes saved successfully');

// Advanced usage with full control
errorService.handleError({
  message: 'Failed to process transaction',
  severity: ErrorSeverity.CRITICAL,
  source: ErrorSource.API,
  originalError: error,
  context: {
    path: '/dashboard/transactions',
    additionalData: { transactionId: '123' }
  }
}, {
  title: 'Transaction Error',
  duration: 10000,
  position: 'top'
});
```

### Using the Error Boundary

The main application is already wrapped with an ErrorBoundary in `app/providers.tsx`. For more granular error handling, you can wrap specific components:

```tsx
import { ErrorBoundary } from '@/components/common/errors';

const MyComponent = () => {
  return (
    <ErrorBoundary>
      <ComponentThatMightError />
    </ErrorBoundary>
  );
};
```

You can also provide a custom fallback UI:

```tsx
import { ErrorBoundary } from '@/components/common/errors';

const MyComponent = () => {
  return (
    <ErrorBoundary fallback={<MyCustomErrorUI />}>
      <ComponentThatMightError />
    </ErrorBoundary>
  );
};
```

## Error Severity Levels

The system defines four severity levels:

1. **INFO**: Informational messages that don't indicate problems
2. **WARNING**: Potential issues that don't prevent functionality
3. **ERROR**: Standard errors that impact functionality
4. **CRITICAL**: Severe errors that prevent core functionality

## Error Sources

Errors are categorized by source:

1. **UI**: Errors originating in the user interface
2. **API**: Errors from API calls
3. **AUTH**: Authentication/authorization errors
4. **UNKNOWN**: Errors with unidentified sources

## Development vs. Production

The error handling system behaves differently based on the environment:

- **Development**: Shows detailed error information including stack traces
- **Production**: Shows user-friendly messages without technical details

## Integration with External Services

The error service includes a placeholder for sending errors to external monitoring services like Sentry. To implement this:

1. Install the monitoring service SDK
2. Update the `sendToMonitoring` method in `error.service.ts`

## Best Practices

1. **Use specific error types**: Use the appropriate notification method based on the error type
2. **Include context**: Provide relevant context with errors to aid debugging
3. **Granular boundaries**: Use ErrorBoundary around specific components that might fail
4. **User-friendly messages**: Write error messages that users can understand
5. **Recovery options**: Provide ways for users to recover from errors