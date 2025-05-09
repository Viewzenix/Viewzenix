# Supabase Frontend Integration Guide

## Overview

This document provides guidance on integrating Supabase authentication and data services with the Viewzenix frontend application. The implementation includes user authentication, webhook management, and real-time features.

## Configuration Setup

### Environment Variables

Add the following environment variables to your frontend application:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Supabase Client Initialization

The Supabase client is initialized in `src/config/supabase.config.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const IS_SUPABASE_CONFIGURED = SUPABASE_URL !== '' && SUPABASE_ANON_KEY !== '';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      'x-application-name': 'viewzenix',
    },
  },
});
```

## Authentication Implementation

### Authentication Service

The authentication service (`src/services/auth.service.ts`) provides an interface for Supabase authentication operations:

- `signIn(email, password)`: Sign in with email and password
- `signUp(email, password)`: Register a new user
- `signOut()`: Sign out the current user
- `getSession()`: Get the current session
- `getJwtToken()`: Get the current JWT token for API requests
- `resetPassword(email)`: Send password reset email
- `updatePassword(password)`: Update the user's password
- `isAuthenticated()`: Check if a user is authenticated

### API Integration with Authentication

All API requests automatically include the authentication token:

```typescript
// In src/services/api.ts
private async getHeaders(): Promise<HeadersInit> {
  // Default headers
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  // Add auth token if available
  const token = await authService.getJwtToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}
```

## Webhook Management

### Webhook Service

The webhook service has been updated to use Supabase for data storage:

- It first checks if Supabase is configured and available
- If Supabase is available, it uses the Supabase client for CRUD operations
- If not, it falls back to localStorage or API calls

### Real-time Updates

Webhook configurations support real-time updates using Supabase's real-time features:

```typescript
// Initialize real-time subscription
this.realtimeChannel = supabase
  .channel('webhook-changes')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'webhooks' }, () => {
    this.refreshWebhooksFromSupabase();
  })
  .subscribe();
```

## User Interface Integration

### Login and Registration Forms

Authentication UI components should:

1. Use the `authService` for sign-in/sign-up operations
2. Handle error states from Supabase auth responses
3. Redirect to secure areas after successful authentication

### Protected Routes

Use authentication checks to protect routes:

```typescript
// Example protected route component
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);
  
  if (isLoading) return <LoadingScreen />;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};
```

## Error Handling

Handle Supabase-specific errors appropriately:

- Authentication errors (invalid credentials, expired sessions)
- Data access errors (permissions issues)
- Network and connectivity issues

## Testing

Test the integration with:

- Unit tests for authentication and data services
- Integration tests for the full authentication flow
- Mocking Supabase responses for consistent test results

## Further Considerations

1. **Session Management**: Handle session expiry and token refresh
2. **User Profile**: Add user profile management if needed
3. **Permission Control**: Add role-based access control for different user types
4. **Offline Support**: Consider strategies for offline operation

---

This integration guide should be updated as the implementation evolves.