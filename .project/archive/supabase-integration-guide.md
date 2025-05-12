# Supabase Integration Guide

## Overview
This guide provides detailed information on how Supabase is integrated into the Viewzenix platform, covering authentication, data storage, and real-time functionality.

## Authentication

### Setup
The platform uses Supabase Authentication for user management. This is configured in `auth.service.ts`:

```typescript
import { supabase } from '@/config/supabase.config';
import { Session, User, AuthError } from '@supabase/supabase-js';

class AuthService {
  async signIn(email: string, password: string): Promise<{
    user: User | null;
    session: Session | null;
    error: AuthError | null;
  }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      return {
        user: data?.user || null,
        session: data?.session || null,
        error
      };
    } catch (error) {
      console.error('Sign in error:', error);
      return {
        user: null,
        session: null,
        error: error as AuthError
      };
    }
  }
  
  // Additional methods...
}
```

### JWT Management
The authentication service handles JWT tokens for API authorization:

```typescript
async getJwtToken(): Promise<string | null> {
  const { session } = await this.getSession();
  return session?.access_token || null;
}
```

These tokens are automatically included in API requests via the `api.ts` service.

## Database Integration

### Webhook Service
The webhook service integrates with Supabase for data storage and real-time updates:

```typescript
class WebhookService {
  private realtimeChannel: RealtimeChannel | null = null;
  
  // Initialize Supabase and real-time subscriptions
  private async initSupabase(): Promise<void> {
    if (!isBrowser()) return;
    this.supabaseAvailable = await isSupabaseAvailable();
    if (!this.supabaseAvailable) return;
    this.realtimeChannel = supabase
      .channel('webhook-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'webhooks' }, () => this.refreshWebhooksFromSupabase())
      .subscribe();
  }
}
```

### Data Models
Supabase tables are mapped to TypeScript interfaces for type safety:

```typescript
// Supabase webhook record structure
interface SupabaseWebhookRecord {
  id: string;
  name: string;
  description?: string;
  webhook_url: string;
  security_token: string;
  notification_preferences: {
    email: boolean;
    browser: boolean;
    on_success: boolean;
    on_failure: boolean;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Transformed to application model
interface WebhookConfig {
  id: string;
  name: string;
  description: string;
  webhookUrl: string;
  securityToken: string;
  notificationPreferences: WebhookNotificationPreference;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

## Configuration

### Environment Variables
Supabase requires the following environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

These should be set in `.env.local` for development and in your deployment environment for production.

### Client Initialization
The Supabase client is initialized in `supabase.config.ts`:

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

## Fallback Mechanisms
The platform implements fallback mechanisms for offline operation:

1. **API Availability Check**: The system checks if the API is available and falls back to local storage if not
2. **Supabase Availability Check**: Similar checks are performed for Supabase availability
3. **Data Persistence**: Data is cached in localStorage for offline access

```typescript
private shouldUseSupabase(): boolean {
  return isBrowser() && this.supabaseAvailable;
}

private shouldUseApi(): boolean {
  return isBrowser() && USE_API && this.apiAvailable && !FORCE_LOCAL_STORAGE && !this.shouldUseSupabase();
}
```

## UI Integration

### Authentication UI
The authentication UI is built with Chakra UI components:

- `LoginForm`: Handles user login with validation
- `SignupForm`: Handles user registration with validation
- `AuthTabs`: Provides a tabbed interface for switching between login and signup

### Protected Routes
Routes requiring authentication use the `authService.isAuthenticated()` method to check if the user is logged in:

```typescript
useEffect(() => {
  const checkAuth = async () => {
    try {
      const isAuthenticated = await authService.isAuthenticated();
      
      if (!isAuthenticated) {
        router.push('/auth');
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setLoading(false);
    }
  };
  
  checkAuth();
}, [router]);
```

## Best Practices

1. **Error Handling**: Always handle errors from Supabase operations
2. **Type Safety**: Use TypeScript interfaces for all Supabase data models
3. **Fallbacks**: Implement fallbacks for offline operation
4. **Security**: Never expose Supabase service keys in client code
5. **Real-time Updates**: Use Supabase real-time subscriptions for live data updates

## Troubleshooting

### Common Issues

1. **Authentication Errors**:
   - Check if Supabase URL and anon key are correctly set
   - Verify that the user exists in Supabase Auth

2. **Data Access Issues**:
   - Check Row Level Security (RLS) policies in Supabase
   - Verify that the user has the correct permissions

3. **Real-time Updates Not Working**:
   - Ensure the channel is properly subscribed
   - Check that the table has the `replica` capability enabled

## Resources

- [Supabase Documentation](https://supabase.io/docs)
- [Supabase JavaScript Client](https://supabase.io/docs/reference/javascript/introduction)
- [Supabase Auth Documentation](https://supabase.io/docs/guides/auth)