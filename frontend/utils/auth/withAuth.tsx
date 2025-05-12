'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth, redirectToLogin, redirectToUnauthorized } from '@/hooks/useAuth';
import { UserRole } from '@/types/auth.types';
import { Box, Spinner, Center, Text } from '@chakra-ui/react';

export interface WithAuthOptions {
  /** Required authentication */
  requireAuth?: boolean;
  
  /** Allowed user roles (if empty, any authenticated user is allowed) */
  allowedRoles?: UserRole[];
  
  /** Required permissions (if empty, no specific permissions required) */
  requiredPermissions?: string[];
  
  /** Whether all permissions are required or just any */
  requireAllPermissions?: boolean;
  
  /** Redirect path if authentication fails */
  loginRedirectPath?: string;
  
  /** Redirect path if authorization fails */
  unauthorizedRedirectPath?: string;
  
  /** Custom loading component */
  LoadingComponent?: React.ComponentType;
}

/**
 * Higher Order Component (HOC) to protect routes based on authentication and permissions
 * 
 * @param WrappedComponent The component to wrap with authentication
 * @param options Authentication and authorization options
 */
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithAuthOptions = {}
) {
  const {
    requireAuth = true,
    allowedRoles = [],
    requiredPermissions = [],
    requireAllPermissions = false,
    loginRedirectPath = '/login',
    unauthorizedRedirectPath = '/unauthorized',
    LoadingComponent,
  } = options;

  // Create the wrapped component
  const WithAuthComponent: React.FC<P> = (props) => {
    const { user, isLoading, hasRole, hasPermission } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
      // Don't check until loading is complete
      if (isLoading) return;

      // If authentication is required and user is not authenticated
      if (requireAuth && !user) {
        // Store the current URL for redirect after login
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('auth_redirect', pathname || '');
        }
        
        // Redirect to login
        router.push(`${loginRedirectPath}?returnUrl=${encodeURIComponent(pathname || '')}`);
        return;
      }

      // If user is authenticated but role check fails
      if (user && allowedRoles.length > 0 && !allowedRoles.some(role => hasRole(role))) {
        router.push(unauthorizedRedirectPath);
        return;
      }

      // If user is authenticated but permission check fails
      if (user && requiredPermissions.length > 0) {
        const hasRequiredPermissions = requireAllPermissions
          ? requiredPermissions.every(permission => hasPermission(permission))
          : requiredPermissions.some(permission => hasPermission(permission));

        if (!hasRequiredPermissions) {
          router.push(unauthorizedRedirectPath);
          return;
        }
      }
    }, [isLoading, user, router, pathname]);

    // Show loading state
    if (isLoading) {
      if (LoadingComponent) {
        return <LoadingComponent />;
      }
      
      return (
        <Center h="100vh">
          <Box textAlign="center">
            <Spinner size="xl" color="blue.500" mb={4} />
            <Text>Loading...</Text>
          </Box>
        </Center>
      );
    }

    // Authentication/authorization checks passed in useEffect,
    // or we're not requiring authentication
    if (!requireAuth || user) {
      return <WrappedComponent {...props} />;
    }

    // This should not normally be reached due to redirects in useEffect,
    // but it's here as a fallback
    return null;
  };

  // Set display name for debugging
  WithAuthComponent.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithAuthComponent;
}

/**
 * HOC specifically for admin-only routes
 */
export function withAdminAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: Omit<WithAuthOptions, 'requireAuth' | 'allowedRoles'> = {}
) {
  return withAuth(WrappedComponent, {
    ...options,
    requireAuth: true,
    allowedRoles: [UserRole.ADMIN],
  });
}

/**
 * HOC specifically for trader-level routes
 * (admins and traders can access)
 */
export function withTraderAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: Omit<WithAuthOptions, 'requireAuth' | 'allowedRoles'> = {}
) {
  return withAuth(WrappedComponent, {
    ...options,
    requireAuth: true,
    allowedRoles: [UserRole.ADMIN, UserRole.TRADER],
  });
}