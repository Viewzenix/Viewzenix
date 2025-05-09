/**
 * Database table names
 * 
 * This file defines constants for database table names to ensure consistency
 * between frontend and backend.
 */

/**
 * Database table names
 * Using 'webhook_configs' to match the Supabase edge function
 */
export const DB_TABLES = {
  WEBHOOKS: 'webhook_configs',
};

/**
 * Database column names 
 * Using snake_case to match Supabase conventions
 */
export const DB_COLUMNS = {
  WEBHOOKS: {
    ID: 'id',
    NAME: 'name',
    DESCRIPTION: 'description',
    WEBHOOK_URL: 'webhook_url',
    SECURITY_TOKEN: 'security_token',
    NOTIFICATION_PREFERENCES: 'notification_preferences',
    IS_ACTIVE: 'is_active',
    CREATED_AT: 'created_at',
    UPDATED_AT: 'updated_at',
  }
};