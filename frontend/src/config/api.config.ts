/**
 * API Configuration
 * 
 * This file contains configuration settings for API communication.
 * Values can be overridden by environment variables.
 */

/**
 * Base URL for API requests
 * Can be overridden with NEXT_PUBLIC_API_URL environment variable
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Flag to determine whether to use API or mock data
 * Can be overridden with NEXT_PUBLIC_USE_API environment variable
 */
export const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true';

/**
 * Flag to force localStorage even if USE_API is true (for testing)
 * Can be overridden with NEXT_PUBLIC_FORCE_LOCAL_STORAGE environment variable
 */
export const FORCE_LOCAL_STORAGE = process.env.NEXT_PUBLIC_FORCE_LOCAL_STORAGE === 'true';

/**
 * API request timeout in milliseconds
 * Can be overridden with NEXT_PUBLIC_API_TIMEOUT environment variable
 */
export const API_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000', 10);

/**
 * Maximum number of retry attempts for API requests
 * Can be overridden with NEXT_PUBLIC_API_MAX_RETRIES environment variable
 */
export const API_MAX_RETRIES = parseInt(process.env.NEXT_PUBLIC_API_MAX_RETRIES || '3', 10);

/**
 * API endpoints configuration
 */
export const API_ENDPOINTS = {
  health: '/health',
  webhooks: {
    base: '/webhooks',
    byId: (id: string) => `/webhooks/${id}`,
    toggle: (id: string) => `/webhooks/${id}/toggle`,
  }
};

/**
 * API response status codes
 */
export const API_STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  SERVER_ERROR: 500
};

/**
 * API error codes
 */
export const API_ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  SERVER_ERROR: 'SERVER_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
}; 