# Authentication Flow

## 🔍 Overview

The Viewzenix platform implements a secure authentication system using Supabase with JWT tokens stored in HTTP-only cookies. This approach provides robust security, role-based access control, and seamless integration with both frontend and backend services.

## 🏗️ Architecture

![Authentication Flow](./images/authentication-flow-diagram.png)

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

## 🧩 Key Components

### 1. Supabase Integration

The authentication system is built on Supabase Auth, which provides:

- Email/password authentication
- JWT token generation and validation
- Secure token storage in HTTP-only cookies
- Session management and refreshing

### 2. Auth Context

The AuthContext provides global authentication state:

```typescript
const AuthContext = createContext<AuthState & AuthActions & AuthPermissions>({
  session: null,
  user: null,
  isLoading: true,
  error: null,
  signUp: async () => ({ error: null }),
  signIn: async () => ({ error: null }),
  signOut: async () => ({ error: null }),
  // Additional methods and state...
});
```

This context makes authentication state and methods available throughout the application.

### 3. Auth Hooks

Custom hooks provide convenient access to authentication functionality:

- **useAuth()**: Access to auth state and methods
- **useUser()**: User-focused wrapper with convenience methods
- **usePermissions()**: RBAC utilities for permission checks

### 4. Role-Based Access Control

The authentication system implements RBAC with:

- **User Roles**: Admin, Trader, Viewer with hierarchical privileges
- **Permissions**: Specific actions a user can perform
- **Role Guards**: UI components that render based on user roles
- **Permission Checks**: Functions to verify user permissions

### 5. Route Protection

Routes are protected using:

- Server-side middleware for initial auth check
- Client-side guards for dynamic protection
- Redirection for unauthorized access

## 🔄 Authentication Flow

1. **Initial Page Load**:
   - Middleware checks for session cookie
   - If present, Supabase refreshes and validates the token
   - Auth context initializes with session data

2. **User Login**:
   - User submits credentials via login form
   - Supabase authenticates and returns session
   - Session stored in HTTP-only cookies
   - Auth context updated with user data
   - Redirect to protected content

3. **Session Management**:
   - Automatic token refreshing via middleware
   - Auth state updates when session changes
   - Session expiration handling

4. **Access Control**:
   - Role and permission checks in components
   - Protected routes with authentication requirements
   - UI elements conditionally rendered based on permissions

## 🔒 Security Considerations

The authentication architecture implements several security best practices:

- **HTTP-only Cookies**: Tokens are not accessible via JavaScript
- **CSRF Protection**: Built-in with Supabase
- **Role Validation**: Performed on both client and server
- **Short-Lived Tokens**: Regular token rotation
- **Secure Routes**: Server-side validation of protected routes

## 🛠️ Implementation

The authentication system is implemented across several directories:

```
frontend/
  ├── context/
  │   └── AuthContext.tsx       # Global authentication state
  │
  ├── hooks/
  │   ├── useAuth.ts            # Authentication hook
  │   ├── useUser.ts            # User information and helpers
  │   └── usePermissions.ts     # Permission utilities
  │
  ├── components/auth/
  │   ├── LoginForm.tsx         # Authentication form
  │   ├── SignupForm.tsx        # Registration form
  │   ├── RoleBasedGuard.tsx    # Role-based UI protection
  │   └── PermissionGuard.tsx   # Permission-based UI protection
  │
  ├── utils/supabase/
  │   ├── client.ts             # Browser Supabase client
  │   ├── server.ts             # Server-side Supabase client
  │   └── middleware.ts         # Auth middleware
  │
  └── app/
      └── middleware.ts         # Next.js route middleware
```

## 📚 Further Details

For detailed implementation guidelines, specific components, and code examples, refer to the comprehensive [Authentication Flow Documentation](../../frontend/docs/AUTH_FLOW.md) in the frontend documentation.