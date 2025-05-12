'use client';

import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import { UserRole, UserWithRole } from '@/types/auth.types';

/**
 * Hook that provides user information and helper functions
 * This hook is a convenient wrapper around useAuth for user-specific functionality
 */
export function useUser() {
  const { user, isLoading, session, error } = useAuth();
  const { hasRole, hasPermission } = usePermissions();
  
  /**
   * Check if the user is an admin
   */
  const isAdmin = (): boolean => {
    return hasRole(UserRole.ADMIN);
  };
  
  /**
   * Check if the user is a trader
   */
  const isTrader = (): boolean => {
    return hasRole(UserRole.TRADER);
  };
  
  /**
   * Check if the user is a viewer
   */
  const isViewer = (): boolean => {
    return hasRole(UserRole.VIEWER);
  };
  
  /**
   * Check if the user is at least a specific role
   * (admin > trader > viewer)
   */
  const isAtLeastRole = (minimumRole: UserRole): boolean => {
    const roleHierarchy = {
      [UserRole.ADMIN]: 3,
      [UserRole.TRADER]: 2,
      [UserRole.VIEWER]: 1,
    };
    
    if (!user || !user.role) return false;
    
    const userRoleValue = roleHierarchy[user.role] || 0;
    const minimumRoleValue = roleHierarchy[minimumRole] || 0;
    
    return userRoleValue >= minimumRoleValue;
  };
  
  /**
   * Check if the user is authenticated
   */
  const isAuthenticated = (): boolean => {
    return !!session && !!user;
  };
  
  /**
   * Get user display name (email or name if available)
   */
  const getDisplayName = (): string => {
    if (!user) return '';
    
    if (user.user_metadata?.name) {
      return user.user_metadata.name as string;
    }
    
    return user.email || '';
  };
  
  /**
   * Get user avatar URL if available
   */
  const getAvatarUrl = (): string | null => {
    if (!user) return null;
    
    return (user.user_metadata?.avatar_url as string) || null;
  };
  
  /**
   * Check if user has verified their email
   */
  const isEmailVerified = (): boolean => {
    if (!user) return false;
    
    // Handle different ways email verification might be stored
    return user.email_confirmed_at !== null || 
           (user.user_metadata?.email_verified === true);
  };
  
  return {
    user: user as UserWithRole | null,
    isLoading,
    error,
    isAdmin,
    isTrader,
    isViewer,
    isAtLeastRole,
    isAuthenticated,
    getDisplayName,
    getAvatarUrl,
    isEmailVerified,
    hasRole,
    hasPermission,
  };
}