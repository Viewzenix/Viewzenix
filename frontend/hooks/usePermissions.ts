'use client';

import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/auth.types';

/**
 * Permission structure for the application
 * Maps roles to their associated permissions
 */
export const PERMISSIONS = {
  // Admin permissions
  [UserRole.ADMIN]: [
    'view:all_data',
    'view:own_data',
    'edit:webhooks',
    'delete:webhooks',
    'create:webhooks',
    'manage:users',
    'configure:brokers',
    'configure:system',
    'view:logs',
    'view:analytics',
  ],
  
  // Trader permissions
  [UserRole.TRADER]: [
    'view:own_data',
    'edit:webhooks',
    'delete:webhooks',
    'create:webhooks',
    'configure:brokers',
    'view:logs',
    'view:analytics',
  ],
  
  // Viewer permissions
  [UserRole.VIEWER]: [
    'view:own_data',
    'view:logs',
  ],
};

/**
 * Permission groups for common operations
 */
export const PERMISSION_GROUPS = {
  WEBHOOK_MANAGEMENT: ['create:webhooks', 'edit:webhooks', 'delete:webhooks'],
  BROKER_MANAGEMENT: ['configure:brokers'],
  ANALYTICS_ACCESS: ['view:analytics'],
  ADMIN_FUNCTIONS: ['manage:users', 'configure:system'],
};

/**
 * Hook for working with permissions
 * Provides methods to check user permissions and roles
 */
export function usePermissions() {
  const { user, hasRole, hasPermission } = useAuth();
  
  /**
   * Check if the user has all of the specified permissions
   */
  const hasAllPermissions = (permissions: string[]): boolean => {
    if (!user || !user.permissions) return false;
    return permissions.every(perm => user.permissions!.includes(perm));
  };
  
  /**
   * Check if the user has any of the specified permissions
   */
  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!user || !user.permissions) return false;
    return permissions.some(perm => user.permissions!.includes(perm));
  };
  
  /**
   * Check if the user has a specific permission group
   */
  const hasPermissionGroup = (group: keyof typeof PERMISSION_GROUPS): boolean => {
    const permissions = PERMISSION_GROUPS[group];
    return hasAnyPermission(permissions);
  };
  
  /**
   * Get all permissions for a specific role
   */
  const getPermissionsForRole = (role: UserRole): string[] => {
    return PERMISSIONS[role] || [];
  };
  
  /**
   * Get all permissions for the current user based on their role
   */
  const getCurrentUserPermissions = (): string[] => {
    if (!user || !user.role) return [];
    return getPermissionsForRole(user.role);
  };
  
  /**
   * Check if user can perform a specific action on webhooks
   */
  const canManageWebhooks = (): boolean => {
    return hasPermissionGroup('WEBHOOK_MANAGEMENT');
  };
  
  /**
   * Check if user can configure broker settings
   */
  const canManageBrokers = (): boolean => {
    return hasPermissionGroup('BROKER_MANAGEMENT');
  };
  
  /**
   * Check if user can access analytics
   */
  const canAccessAnalytics = (): boolean => {
    return hasPermissionGroup('ANALYTICS_ACCESS');
  };
  
  /**
   * Check if user can perform admin functions
   */
  const canPerformAdminFunctions = (): boolean => {
    return hasPermissionGroup('ADMIN_FUNCTIONS');
  };
  
  return {
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    hasPermissionGroup,
    getPermissionsForRole,
    getCurrentUserPermissions,
    canManageWebhooks,
    canManageBrokers,
    canAccessAnalytics,
    canPerformAdminFunctions,
    hasRole,
    userRole: user?.role,
  };
}