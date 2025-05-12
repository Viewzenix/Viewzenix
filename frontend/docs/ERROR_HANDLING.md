# Error Handling System

This document outlines the error handling system implemented in the Viewzenix frontend application. The system provides a centralized approach to handling errors, displaying error messages, and logging errors for debugging.

## Components

The error handling system consists of the following components:

### 1. Error Service

Located at `services/error/error.service.ts`, this service provides:

- Centralized error logging
- User notifications via toast messages
- Error categorization by severity and source
- AppError class for typed application errors
- Supabase-specific error handling
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

### 4. Specialized Error Components

Located in the `components/common/errors/` directory:

- `NotFoundError.tsx`: For 404 errors
- `AuthorizationError.tsx`: For 401/403 errors
- `NetworkError.tsx`: For network connectivity issues

### 5. Supabase Error Utilities

Located at `utils/errors/supabase.errors.ts`, these utilities provide:

- Mapping of Supabase error codes to user-friendly messages
- Helper functions for handling Supabase-specific errors
- Utilities to identify different types of Supabase errors

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
  ErrorCode,
  errorService,
  createAppError,
  handleAppError,
  handleUnknownError,
  notifySupabaseError
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

// Using AppError for typed errors
const appError = createAppError({
  message: 'Invalid webhook configuration',
  code: ErrorCode.VALIDATION_ERROR,
  severity: ErrorSeverity.ERROR,
  source: ErrorSource.UI
});
handleAppError(appError);

// Handling unknown errors
try {
  await someOperation();
} catch (error) {
  handleUnknownError(error, 'Failed to complete operation');
}

// Supabase-specific error
try {
  await supabaseClient.auth.signIn({ email, password });
} catch (error) {
  notifySupabaseError(error, 'Login failed');
}

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
4. **SUPABASE**: Errors from Supabase operations
5. **DATABASE**: Database-related errors
6. **UNKNOWN**: Errors with unidentified sources

## Development vs. Production

The error handling system behaves differently based on the environment:

- **Development**: Shows detailed error information including stack traces
- **Production**: Shows user-friendly messages without technical details

## Handling Supabase Errors

The application includes specialized utilities for handling Supabase errors:

```tsx
import { 
  handleSupabaseOperation,
  isSupabaseError,
  isSupabaseAuthError,
  isSessionExpiredError,
  isPermissionDeniedError,
  mapSupabaseError
} from '@/utils/errors';

// Using the wrapper function for Supabase operations
try {
  const result = await handleSupabaseOperation(
    () => supabaseClient.from('webhooks').select('*'),
    'Failed to fetch webhooks'
  );
  // Process result
} catch (error) {
  // This error is already an AppError with proper mapping
  handleAppError(error);
}

// Checking for specific Supabase error types
try {
  await supabaseClient.auth.signIn({ email, password });
} catch (error) {
  if (isSessionExpiredError(error)) {
    // Handle expired session specifically
    redirectToLogin();
  } else if (isPermissionDeniedError(error)) {
    // Handle permission issues
    showPermissionError();
  } else {
    // Handle other errors
    notifySupabaseError(error);
  }
}

// Manual mapping of Supabase errors to AppError
try {
  await supabaseClient.from('webhooks').insert(newWebhook);
} catch (error) {
  const appError = mapSupabaseError(error, 'Failed to create webhook');
  handleAppError(appError);
}
```

## AppError Class

The `AppError` class provides a standardized way to handle application errors:

```tsx
import { AppError, ErrorCode, ErrorSeverity, ErrorSource } from '@/services/error';

// Creating an AppError instance
const error = new AppError({
  message: 'Invalid configuration',
  code: ErrorCode.VALIDATION_ERROR,
  severity: ErrorSeverity.ERROR,
  source: ErrorSource.UI,
  context: {
    path: '/webhooks/create',
    additionalData: { field: 'name', value: '' }
  }
});

// Converting unknown errors to AppError
const unknownError = getSomeError();
const appError = AppError.fromUnknown(unknownError, 'An unexpected error occurred');
```

## Integration with External Services

The error service includes a placeholder for sending errors to external monitoring services like Sentry. To implement this:

1. Install the monitoring service SDK
2. Update the `sendToMonitoring` method in `error.service.ts`

## Best Practices

1. **Use specific error types**: Use the appropriate notification method based on the error type
2. **Include context**: Provide relevant context with errors to aid debugging
3. **Use AppError**: For better error typing and consistent handling
4. **Leverage Supabase helpers**: Use the Supabase error utilities for Supabase operations
5. **Granular boundaries**: Use ErrorBoundary around specific components that might fail
6. **User-friendly messages**: Write error messages that users can understand
7. **Recovery options**: Provide ways for users to recover from errors