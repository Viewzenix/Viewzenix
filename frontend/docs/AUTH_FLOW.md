# Authentication Flow

## Overview
This document outlines the authentication flow implemented in the Viewzenix frontend, using Supabase for authentication with JWT tokens stored in HTTP-only cookies. The system supports role-based access control (RBAC) and granular permissions.

## Architecture

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │      │                 │
│  Next.js Client │<────>│  Supabase Auth  │<────>│  Backend API    │
│                 │      │                 │      │                 │
└─────────────────┘      └─────────────────┘      └─────────────────┘
        │                        │                        │
        │                        │                        │
        ▼                        ▼                        ▼
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │      │                 │
│   Auth Context  │      │  HTTP Cookies   │      │ Auth Middleware │
│                 │      │                 │      │                 │
└─────────────────┘      └─────────────────┘      └─────────────────┘
        │                                                 │
        │                                                 │
        ▼                                                 ▼
┌─────────────────┐                             ┌─────────────────┐
│                 │                             │                 │
│    Auth Hooks   │                             │ Route Protection│
│                 │                             │                 │
└─────────────────┘                             └─────────────────┘
```

## Key Components

### 1. Supabase Clients
- `utils/supabase/client.ts`: Browser client for client components
- `utils/supabase/server.ts`: Server client for server components and actions
- `utils/supabase/middleware.ts`: Middleware for refreshing sessions

### 2. Auth Context
- `context/AuthContext.tsx`: Global state provider for authentication
- Exposes user data, session, and auth methods
- Implements RBAC (Role-Based Access Control)
- Handles session refreshing and token management

### 3. Authentication Hooks
- `useAuth()`: Main hook for auth state and methods
- `useUser()`: User-focused wrapper with convenience methods
- `usePermissions()`: Permission checking and RBAC utilities

### 4. Auth Components
- `LoginForm.tsx`: Authentication form for user login
- `SignupForm.tsx`: Form for new user registration
- `ResetPasswordForm.tsx`: Form for password reset requests
- `RoleBasedGuard.tsx`: Component for role-based content protection
- `PermissionGuard.tsx`: Component for permission-based content protection

### 5. Route Protection
- `withAuth()`: Higher-Order Component (HOC) for protecting routes
- `withAdminAuth()`: HOC specifically for admin-only routes
- `withTraderAuth()`: HOC for trader-level access routes

## Authentication Flow

1. **Initial Page Load**:
   - Middleware checks for existing session cookies
   - If found, refreshes the token and sets the session
   - Auth context initializes and subscribes to auth state changes

2. **User Login**:
   - User submits credentials via `LoginForm`
   - Supabase validates credentials and returns a session
   - Session is stored in HTTP-only cookies
   - Auth context is updated with user information
   - Redirect to the originally requested page or dashboard

3. **Session Management**:
   - Session refreshing happens automatically via middleware
   - `updateSession` function refreshes tokens before expiration
   - Auth context subscribes to auth state changes via `onAuthStateChange`
   - Handles token refresh events with proper state updates

4. **Session Expiration**:
   - Session expiration is detected automatically
   - User is redirected to login with return URL
   - Original request path is preserved for post-login redirect
   - `handleSessionExpired` utility manages the expiration flow

5. **Role-Based Access Control**:
   - User roles and permissions are stored in Supabase user metadata
   - Roles hierarchy: Admin > Trader > Viewer
   - `RoleBasedGuard` and `PermissionGuard` components protect UI content
   - `withAuth` HOC protects entire routes and pages
   - Unauthorized access attempts redirect to appropriate error pages

## Security Considerations

- **JWT Storage**: Tokens are stored in HTTP-only cookies, not localStorage
- **CSRF Protection**: Configured by Supabase
- **Token Refresh**: Automatic via middleware
- **Expiration**: Sessions expire after the configured time period
- **Role Validation**: Roles are validated on both client and server side

## Implementation Notes

- Environment variables must be set:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

- Default user role is `viewer` with limited permissions
- Admin users need to be manually assigned in Supabase dashboard

## Permission System

The permission system is based on:

1. **User Roles**: Three primary roles with hierarchical privileges:
   - `ADMIN`: Complete system access
   - `TRADER`: Ability to manage trading configurations
   - `VIEWER`: Read-only access to own data

2. **Granular Permissions**: Specific actions a user can perform:
   - Format: `action:resource` (e.g., `edit:webhooks`)
   - Grouped into logical permission sets (e.g., `WEBHOOK_MANAGEMENT`)

3. **Permission Inheritance**: Higher roles inherit permissions from lower roles

The complete permission structure is defined in `hooks/usePermissions.ts`.

## Usage Examples

### Protected Component with Role-Based Guard

```tsx
import { RoleBasedGuard } from '@/components/auth';
import { UserRole } from '@/types/auth.types';

const AdminDashboard = () => {
  return (
    <RoleBasedGuard allowedRoles={[UserRole.ADMIN]}>
      <div>Admin only content</div>
    </RoleBasedGuard>
  );
};
```

### Protected Component with Permission Guard

```tsx
import { PermissionGuard } from '@/components/auth';

const WebhookConfigEditor = () => {
  return (
    <PermissionGuard requiredPermissions={['edit:webhooks']}>
      <div>Webhook editing interface</div>
    </PermissionGuard>
  );
};
```

### Protected Route with HOC

```tsx
import { withAuth } from '@/utils/auth';
import { UserRole } from '@/types/auth.types';

const AdminSettingsPage = () => {
  // Component implementation...
};

// Export with authentication wrapper
export default withAuth(AdminSettingsPage, {
  requireAuth: true,
  allowedRoles: [UserRole.ADMIN],
  requiredPermissions: ['configure:system'],
});
```

### Using Authentication Hooks

```tsx
import { useUser, usePermissions } from '@/hooks';

const ProfileSection = () => {
  const { user, isAdmin, getDisplayName, isEmailVerified } = useUser();
  const { canManageWebhooks, canManageBrokers } = usePermissions();
  
  if (!user) return <div>Please log in</div>;
  
  return (
    <div>
      <h2>Welcome, {getDisplayName()}</h2>
      {!isEmailVerified() && <div>Please verify your email</div>}
      {isAdmin() && <div>Admin Controls</div>}
      {canManageWebhooks() && <EditWebhooksButton />}
      {canManageBrokers() && <BrokerSettingsButton />}
    </div>
  );
};
```