/**
 * Type declarations for modules without TypeScript definitions
 */

declare module '@supabase/supabase-js' {
  // Explicitly declare types that are used in our codebase
  export interface RealtimeChannel {
    on: (event: string, options: any, callback: Function) => RealtimeChannel;
    subscribe: () => RealtimeChannel;
  }
  
  export interface PostgrestError {
    code: string;
    message: string;
    details?: string;
    hint?: string;
  }
  
  export interface User {
    id: string;
    email?: string;
    aud: string;
    role?: string;
    app_metadata: any;
    user_metadata: any;
    created_at: string;
    updated_at: string;
  }
  
  export interface Session {
    access_token: string;
    refresh_token: string;
    expires_at: number;
    user: User;
  }
  
  export interface AuthError {
    message: string;
    status?: number;
  }
} 