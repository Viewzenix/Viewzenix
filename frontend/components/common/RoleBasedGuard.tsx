'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/auth';
import { Box, Text, Button } from '@chakra-ui/react';

interface RoleBasedGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallback?: ReactNode;
}

/**
 * Component that renders children only if the authenticated user has the required role
 * Otherwise, it renders a fallback component
 */
export const RoleBasedGuard: React.FC<RoleBasedGuardProps> = ({
  children,
  allowedRoles,
  fallback,
}) => {
  const { user, isLoading, hasRole } = useAuth();

  // If still loading auth state, don't render anything yet
  if (isLoading) {
    return null;
  }

  // If not authenticated, show login prompt
  if (!user) {
    const defaultFallback = (
      <Box p={6} textAlign="center">
        <Text mb={4}>Please log in to access this content</Text>
        <Button colorScheme="blue" href="/login" as="a">
          Log In
        </Button>
      </Box>
    );
    
    return <>{fallback || defaultFallback}</>;
  }

  // If user doesn't have required role, show unauthorized message
  if (!hasRole(allowedRoles)) {
    const defaultFallback = (
      <Box p={6} textAlign="center">
        <Text color="red.500">
          You don't have permission to access this content
        </Text>
      </Box>
    );
    
    return <>{fallback || defaultFallback}</>;
  }

  // User has proper role, render the protected content
  return <>{children}</>;
};

interface PermissionGuardProps {
  children: ReactNode;
  requiredPermissions: string[];
  fallback?: ReactNode;
  requireAll?: boolean; // If true, user must have all permissions; if false, any permission is sufficient
}

/**
 * Component that renders children only if the authenticated user has the required permission(s)
 * Otherwise, it renders a fallback component
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  requiredPermissions,
  fallback,
  requireAll = false,
}) => {
  const { user, isLoading, hasPermission } = useAuth();

  // If still loading auth state, don't render anything yet
  if (isLoading) {
    return null;
  }

  // If not authenticated, show login prompt
  if (!user) {
    const defaultFallback = (
      <Box p={6} textAlign="center">
        <Text mb={4}>Please log in to access this content</Text>
        <Button colorScheme="blue" href="/login" as="a">
          Log In
        </Button>
      </Box>
    );
    
    return <>{fallback || defaultFallback}</>;
  }

  // Check if user has the required permissions
  const hasRequiredPermissions = requireAll
    ? requiredPermissions.every(permission => hasPermission(permission))
    : requiredPermissions.some(permission => hasPermission(permission));

  // If user doesn't have required permissions, show unauthorized message
  if (!hasRequiredPermissions) {
    const defaultFallback = (
      <Box p={6} textAlign="center">
        <Text color="red.500">
          You don't have permission to access this content
        </Text>
      </Box>
    );
    
    return <>{fallback || defaultFallback}</>;
  }

  // User has proper permissions, render the protected content
  return <>{children}</>;
};