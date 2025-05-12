'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';
import { AuthState, AuthActions, AuthPermissions, UserRole, UserWithRole } from '@/types/auth';

// Create a context with default values
const AuthContext = createContext<AuthState & AuthActions & AuthPermissions>({
  session: null,
  user: null,
  isLoading: true,
  error: null,
  signUp: async () => ({ error: null }),
  signIn: async () => ({ error: null }),
  signOut: async () => ({ error: null }),
  resetPassword: async () => ({ error: null }),
  updatePassword: async () => ({ error: null }),
  updateUser: async () => ({ error: null }),
  hasRole: () => false,
  hasPermission: () => false,
});

/**
 * Provider component that wraps your app and makes auth available to all children components
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    session: null,
    user: null,
    isLoading: true,
    error: null,
  });

  // Initialize Supabase client
  const supabase = createClient();
  
  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true }));
        
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (data.session) {
          const { data: userData } = await supabase.auth.getUser();
          
          // Retrieve role and permissions from user metadata
          let userWithRole: UserWithRole | null = null;
          
          if (userData?.user) {
            userWithRole = {
              ...userData.user,
              role: (userData.user.user_metadata?.role as UserRole) || UserRole.VIEWER,
              permissions: userData.user.user_metadata?.permissions || [],
            };
          }
          
          setState({
            session: data.session,
            user: userWithRole,
            isLoading: false,
            error: null,
          });
        } else {
          setState({
            session: null,
            user: null,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        setState({
          session: null,
          user: null,
          isLoading: false,
          error: error as Error,
        });
      }
    };

    getInitialSession();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          // Get user with role information
          const { data } = await supabase.auth.getUser();
          
          let userWithRole: UserWithRole | null = null;
          
          if (data?.user) {
            userWithRole = {
              ...data.user,
              role: (data.user.user_metadata?.role as UserRole) || UserRole.VIEWER,
              permissions: data.user.user_metadata?.permissions || [],
            };
          }
          
          setState({
            session,
            user: userWithRole,
            isLoading: false,
            error: null,
          });
        } else if (event === 'SIGNED_OUT') {
          setState({
            session: null,
            user: null,
            isLoading: false,
            error: null,
          });
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Authentication methods
  const signUp = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // By default, new users will be viewers
          data: {
            role: UserRole.VIEWER,
            permissions: ['view:own_data'],
          },
        },
      });
      setState(prev => ({ ...prev, isLoading: false, error: error }));
      return { error };
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false, error: error as Error }));
      return { error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      setState(prev => ({ ...prev, isLoading: false, error: error }));
      return { error };
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false, error: error as Error }));
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const { error } = await supabase.auth.signOut();
      setState(prev => ({ ...prev, isLoading: false, error: error }));
      return { error };
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false, error: error as Error }));
      return { error: error as Error };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      setState(prev => ({ ...prev, isLoading: false, error: error }));
      return { error };
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false, error: error as Error }));
      return { error: error as Error };
    }
  };

  const updatePassword = async (password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const { error } = await supabase.auth.updateUser({ password });
      setState(prev => ({ ...prev, isLoading: false, error: error }));
      return { error };
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false, error: error as Error }));
      return { error: error as Error };
    }
  };

  const updateUser = async (updates: any) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const { error } = await supabase.auth.updateUser(updates);
      setState(prev => ({ ...prev, isLoading: false, error: error }));
      return { error };
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false, error: error as Error }));
      return { error: error as Error };
    }
  };

  // Role-based access control helpers
  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!state.user || !state.user.role) return false;
    
    if (Array.isArray(role)) {
      return role.includes(state.user.role);
    }
    
    return state.user.role === role;
  };

  const hasPermission = (permission: string | string[]): boolean => {
    if (!state.user || !state.user.permissions) return false;
    
    if (Array.isArray(permission)) {
      return permission.some(p => state.user!.permissions!.includes(p));
    }
    
    return state.user.permissions.includes(permission);
  };

  const value = {
    ...state,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    updateUser,
    hasRole,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook that provides authentication state and methods
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};