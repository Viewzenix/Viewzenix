'use client';

import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { AuthState, AuthActions, AuthPermissions } from '@/types/auth.types';

/**
 * Hook that provides authentication state and methods
 * This hook abstracts the context implementation details from components
 */
export function useAuth(): AuthState & AuthActions & AuthPermissions {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

/**
 * Helper method to handle redirection for authentication failures
 */
export function redirectToLogin(returnUrl?: string): void {
  if (typeof window === 'undefined') return;
  
  const loginUrl = returnUrl 
    ? `/login?returnUrl=${encodeURIComponent(returnUrl)}`
    : '/login';
    
  window.location.href = loginUrl;
}

/**
 * Helper method to handle redirection for authorization failures
 */
export function redirectToUnauthorized(message?: string): void {
  if (typeof window === 'undefined') return;
  
  const unauthorizedUrl = message
    ? `/unauthorized?message=${encodeURIComponent(message)}`
    : '/unauthorized';
    
  window.location.href = unauthorizedUrl;
}

/**
 * Session expiration handler
 * Use this method when a session has expired during an operation
 */
export function handleSessionExpired(): void {
  if (typeof window === 'undefined') return;
  
  // Clear any local state if needed
  sessionStorage.removeItem('last_route');
  
  // Store current path for returning after login
  const currentPath = window.location.pathname + window.location.search;
  sessionStorage.setItem('auth_redirect', currentPath);
  
  // Redirect to login
  redirectToLogin();
}