import { Session, User } from '@supabase/supabase-js';

/**
 * User role for role-based access control
 */
export enum UserRole {
  ADMIN = 'admin',
  TRADER = 'trader',
  VIEWER = 'viewer',
}

/**
 * Extended user interface with role information
 */
export interface UserWithRole extends User {
  role?: UserRole;
  permissions?: string[];
}

/**
 * Auth state interface for the AuthContext
 */
export interface AuthState {
  session: Session | null;
  user: UserWithRole | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Auth actions interface for the AuthContext
 */
export interface AuthActions {
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (password: string) => Promise<{ error: Error | null }>;
  updateUser: (updates: any) => Promise<{ error: Error | null }>;
}

/**
 * Auth permission checking interface for RBAC
 */
export interface AuthPermissions {
  hasRole: (role: UserRole | UserRole[]) => boolean;
  hasPermission: (permission: string | string[]) => boolean;
}