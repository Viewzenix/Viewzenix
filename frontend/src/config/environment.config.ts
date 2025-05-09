/**
 * Environment Configuration
 * 
 * This file contains environment-specific configuration settings
 * that can be overridden with environment variables.
 */

/**
 * Environment type
 */
export type Environment = 'development' | 'staging' | 'production';

/**
 * Current environment
 */
export const ENVIRONMENT: Environment = 
  (process.env.NEXT_PUBLIC_ENVIRONMENT as Environment) || 'development';

/**
 * API configuration
 */
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000', 10),
  maxRetries: parseInt(process.env.NEXT_PUBLIC_API_MAX_RETRIES || '3', 10),
  useApi: process.env.NEXT_PUBLIC_USE_API === 'true',
  forceLocalStorage: process.env.NEXT_PUBLIC_FORCE_LOCAL_STORAGE === 'true',
};

/**
 * Supabase configuration
 */
export const SUPABASE_CONFIG = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
};

/**
 * Webhook configuration
 */
export const WEBHOOK_CONFIG = {
  baseUrl: getWebhookBaseUrl(),
};

/**
 * Application configuration
 */
export const APP_CONFIG = {
  name: 'Viewzenix',
  version: process.env.NEXT_PUBLIC_APP_VERSION || '0.1.0',
  environment: ENVIRONMENT,
};

/**
 * Get environment-specific webhook base URL
 */
function getWebhookBaseUrl(): string {
  // Use environment variable if available
  if (process.env.NEXT_PUBLIC_WEBHOOK_BASE_URL) {
    return process.env.NEXT_PUBLIC_WEBHOOK_BASE_URL;
  }
  
  // Otherwise, use environment-specific defaults
  switch (ENVIRONMENT) {
    case 'production':
      return 'https://api.viewzenix.com/webhook';
    case 'staging':
      return 'https://staging-api.viewzenix.com/webhook';
    case 'development':
    default:
      return 'http://localhost:5000/webhook';
  }
}

/**
 * Validate required configuration
 * @returns Whether all required configuration is present
 */
export function validateConfig(): { valid: boolean; missing: string[] } {
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ];
  
  const missing = requiredVars.filter(v => !process.env[v]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    return { valid: false, missing };
  }
  
  return { valid: true, missing: [] };
}

// Validate configuration in development
if (process.env.NODE_ENV === 'development') {
  const { valid, missing } = validateConfig();
  if (!valid) {
    console.warn(`Missing required environment variables: ${missing.join(', ')}`);
    console.warn('Some features may not work properly.');
  }
}