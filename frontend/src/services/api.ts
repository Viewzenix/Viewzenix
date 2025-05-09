import { 
  WebhookConfig, 
  CreateWebhookConfigData, 
  UpdateWebhookConfigData,
  CreateWebhookResponse,
  UpdateWebhookResponse,
  DeleteWebhookResponse,
  ApiSuccessResponse,
  ApiErrorResponse,
  GetAllWebhooksResponse,
  GetWebhookResponse,
  ToggleWebhookResponse
} from '@/types/webhook';

import {
  API_BASE_URL,
  USE_API,
  FORCE_LOCAL_STORAGE,
  API_TIMEOUT,
  API_MAX_RETRIES,
  API_ENDPOINTS,
  API_STATUS_CODES,
  API_ERROR_CODES
} from '@/config/api.config';

import { camelToSnake, snakeToCamel, objectToCamelCase, objectToSnakeCase } from '@/utils/caseConversion';

/**
 * API client for making HTTP requests to the backend
 * This module provides a centralized place for handling API requests,
 * including error handling, authentication, and configuration.
 */

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  status: number;
  code: string;
  details?: any;

  constructor(status: number, message: string, code: string = API_ERROR_CODES.UNKNOWN_ERROR, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

/**
 * Check if the API server is available
 * @returns Promise resolving to boolean indicating if the API is available
 */
// Health check cache to avoid frequent calls
let cachedApiAvailable: boolean | null = null;
let cachedApiCheckTime: number | null = null;
const API_HEALTH_CHECK_TTL = 60 * 1000; // cache TTL in ms

export async function isApiAvailable(): Promise<boolean> {
  const now = Date.now();
  if (cachedApiAvailable !== null && cachedApiCheckTime && now - cachedApiCheckTime < API_HEALTH_CHECK_TTL) {
    return cachedApiAvailable;
  }

  if (!USE_API || FORCE_LOCAL_STORAGE) {
    return false;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.health}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(2000),
    });
    
    const isAvailable = response.ok;
      cachedApiAvailable = isAvailable;
      cachedApiCheckTime = now;
      return isAvailable;
  } catch (error) {
    cachedApiAvailable = false;
      cachedApiCheckTime = now;
      console.warn('API health check failed:', error);
      return false;
  }
}

/**
 * Retry a function with exponential backoff
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries: number = API_MAX_RETRIES,
  baseDelay: number = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error: unknown) {
    if (retries === 0) throw error;
    
    const delay = baseDelay * Math.pow(2, API_MAX_RETRIES - retries);
    await new Promise(resolve => setTimeout(resolve, delay));
    
    return retryWithBackoff(fn, retries - 1, baseDelay);
  }
}

/**
 * Base fetch function with error handling and case conversion
 */
export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit & { body?: any } = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  // Inject Authorization header if token is present
  const token = process.env.NEXT_PUBLIC_API_TOKEN || (typeof window !== 'undefined' ? localStorage.getItem('api_token') : null);
  if (token) {
    (headers as any)['Authorization'] = `Bearer ${token}`;
  }
  
  // Convert request body from camelCase to snake_case if present
  let body = options.body;
  if (body && typeof body === 'string') {
    try {
      const parsedBody = JSON.parse(body);
      body = JSON.stringify(objectToSnakeCase(parsedBody));
    } catch (e) {
      console.warn('Failed to parse and convert request body', e);
    }
  }
  
  const config = {
    ...options,
    headers,
    body,
    signal: AbortSignal.timeout(API_TIMEOUT)
  };
  
  return retryWithBackoff(async () => {
    try {
      const response = await fetch(url, config);
      
      // Parse the JSON response
      const data = await response.json();
      
      // Check if the request was successful
      if (!response.ok) {
        // Handle API error response format
        if (data.status === 'error') {
          throw new ApiError(
            response.status,
            data.message,
            data.code,
            data.details
          );
        }
        
        // Fallback for other error formats
        throw new ApiError(
          response.status,
          data.message || 'An unexpected error occurred',
          data.code || API_ERROR_CODES.UNKNOWN_ERROR
        );
      }
      
      // Convert response data from snake_case to camelCase
      return objectToCamelCase<T>(data);
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Handle network errors and timeouts
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiError(
            API_STATUS_CODES.SERVER_ERROR,
            'Request timed out',
            API_ERROR_CODES.NETWORK_ERROR
          );
        }
        
        throw new ApiError(
          API_STATUS_CODES.SERVER_ERROR,
          'Network error occurred',
          API_ERROR_CODES.NETWORK_ERROR,
          error
        );
      }
      
      throw new ApiError(
        API_STATUS_CODES.SERVER_ERROR,
        'Unknown error occurred',
        API_ERROR_CODES.UNKNOWN_ERROR,
        error
      );
    }
  });
}

/**
 * Webhook API methods
 */
export const webhookApi = {
  /**
   * Get all webhook configurations
   */
  getAll: async (): Promise<GetAllWebhooksResponse> => {
    return fetchApi<GetAllWebhooksResponse>(API_ENDPOINTS.webhooks.base);
  },

  /**
   * Get a specific webhook configuration
   */
  getById: async (id: string): Promise<GetWebhookResponse> => {
    return fetchApi<GetWebhookResponse>(API_ENDPOINTS.webhooks.byId(id));
  },

  /**
   * Create a new webhook configuration
   */
  create: async (data: CreateWebhookConfigData): Promise<CreateWebhookResponse> => {
    return fetchApi<CreateWebhookResponse>(API_ENDPOINTS.webhooks.base, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  /**
   * Update a webhook configuration
   */
  update: async (id: string, data: UpdateWebhookConfigData): Promise<UpdateWebhookResponse> => {
    return fetchApi<UpdateWebhookResponse>(API_ENDPOINTS.webhooks.byId(id), {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  /**
   * Delete a webhook configuration
   */
  delete: async (id: string): Promise<DeleteWebhookResponse> => {
    return fetchApi<DeleteWebhookResponse>(API_ENDPOINTS.webhooks.byId(id), {
      method: 'DELETE'
    });
  },

  /**
   * Toggle webhook active status
   */
  toggleActive: async (id: string): Promise<ToggleWebhookResponse> => {
    return fetchApi<ToggleWebhookResponse>(API_ENDPOINTS.webhooks.toggle(id), {
      method: 'POST'
    });
  }
}; 