'use client';

import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { UserRole, UserWithRole } from '@/types/auth.types';

/**
 * Hook that provides user information and helper functions
 * This hook is a convenient wrapper around useAuth for user-specific functionality
 */
export function useUser() {
  const { user, isLoading, hasRole, hasPermission } = useContext(AuthContext);
  
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
  
  return {
    user: user as UserWithRole | null,
    isLoading,
    isAdmin,
    isTrader,
    isViewer,
    isAtLeastRole,
    hasRole,
    hasPermission,
  };
}