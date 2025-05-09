import { supabase } from '@/config/supabase.config';
import { AuthError, Session, User } from '@supabase/supabase-js';

/**
 * Authentication service for handling Supabase auth operations
 */
class AuthService {
  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string): Promise<{
    user: User | null;
    session: Session | null;
    error: AuthError | null;
  }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      return {
        user: data?.user || null,
        session: data?.session || null,
        error
      };
    } catch (error) {
      console.error('Sign in error:', error);
      return {
        user: null,
        session: null,
        error: error as AuthError
      };
    }
  }

  /**
   * Sign up with email and password
   */
  async signUp(email: string, password: string): Promise<{
    user: User | null;
    session: Session | null;
    error: AuthError | null;
  }> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      
      return {
        user: data?.user || null,
        session: data?.session || null,
        error
      };
    } catch (error) {
      console.error('Sign up error:', error);
      return {
        user: null,
        session: null,
        error: error as AuthError
      };
    }
  }

  /**
   * Sign out the current user
   */
  async signOut(): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error: error as AuthError };
    }
  }

  /**
   * Get the current session
   */
  async getSession(): Promise<{
    session: Session | null;
    error: AuthError | null;
  }> {
    try {
      const { data, error } = await supabase.auth.getSession();
      return {
        session: data?.session || null,
        error
      };
    } catch (error) {
      console.error('Get session error:', error);
      return {
        session: null,
        error: error as AuthError
      };
    }
  }

  /**
   * Get the current user
   */
  async getUser(): Promise<{
    user: User | null;
    error: AuthError | null;
  }> {
    try {
      const { data, error } = await supabase.auth.getUser();
      return {
        user: data?.user || null,
        error
      };
    } catch (error) {
      console.error('Get user error:', error);
      return {
        user: null,
        error: error as AuthError
      };
    }
  }

  /**
   * Get the JWT token from the current session
   */
  async getJwtToken(): Promise<string | null> {
    const { session } = await this.getSession();
    return session?.access_token || null;
  }

  /**
   * Reset password
   */
  async resetPassword(email: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      return { error };
    } catch (error) {
      console.error('Reset password error:', error);
      return { error: error as AuthError };
    }
  }

  /**
   * Update user password
   */
  async updatePassword(password: string): Promise<{ 
    user: User | null;
    error: AuthError | null;
  }> {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password
      });
      
      return {
        user: data?.user || null,
        error
      };
    } catch (error) {
      console.error('Update password error:', error);
      return {
        user: null,
        error: error as AuthError
      };
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const { session } = await this.getSession();
    return session !== null;
  }
}

// Export as singleton
export const authService = new AuthService();