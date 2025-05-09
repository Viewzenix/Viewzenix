/**
 * Type definitions for Supabase database schema
 * This file defines the types that match our Supabase database structure
 */

export type Database = {
  public: {
    Tables: {
      webhooks: {
        Row: {
          id: string;
          name: string;
          description: string;
          webhook_url: string;
          security_token: string;
          notification_preferences: {
            email: boolean;
            browser: boolean;
            on_success: boolean;
            on_failure: boolean;
          };
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['webhooks']['Row'], 'id' | 'webhook_url' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Database['public']['Tables']['webhooks']['Row'], 'id' | 'webhook_url' | 'created_at'>>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
};

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']; 