# Authentication Flow

## Overview
This document outlines the authentication flow implemented in the Viewzenix frontend, using Supabase for authentication with JWT tokens stored in HTTP-only cookies.

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

### 3. Authentication Hooks
- `useAuth()`: Direct access to auth context
- `useUser()`: Simplified user-focused wrapper

### 4. Auth Components
- `AuthForms.tsx`: Login, Signup, and Reset password forms
- `RoleBasedGuard.tsx`: Components for protecting routes/content by role or permission

## Authentication Flow

1. **Initial Page Load**:
   - Middleware checks for existing session cookies
   - If found, refreshes the token and sets the session

2. **User Login**:
   - User submits credentials via `AuthForm`
   - Supabase validates credentials and returns a session
   - Session is stored in HTTP-only cookies
   - Auth context is updated with user information

3. **Session Management**:
   - Session refreshing happens automatically via middleware
   - Auth context subscribes to auth state changes

4. **Role-Based Access Control**:
   - User roles and permissions are stored in Supabase user metadata
   - `RoleBasedGuard` and `PermissionGuard` components control access to protected UI
   - `useUser()` hook provides convenience methods for role/permission checks

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

## Usage Examples

### Protected Component

```tsx
import { RoleBasedGuard } from '@/components/common/RoleBasedGuard';
import { UserRole } from '@/types/auth';

const AdminDashboard = () => {
  return (
    <RoleBasedGuard allowedRoles={[UserRole.ADMIN]}>
      <div>Admin only content</div>
    </RoleBasedGuard>
  );
};
```

### Using Authentication Hooks

```tsx
import { useUser } from '@/hooks/useUser';

const ProfileSection = () => {
  const { user, isAdmin, hasPermission } = useUser();
  
  if (!user) return <div>Please log in</div>;
  
  return (
    <div>
      <h2>Welcome, {user.email}</h2>
      {isAdmin() && <div>Admin Controls</div>}
      {hasPermission('edit:webhooks') && <EditWebhooksButton />}
    </div>
  );
};
```