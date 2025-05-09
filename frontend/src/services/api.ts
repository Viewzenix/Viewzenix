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
  GetWebhookResponse
} from '@/types/webhook';

/**
 * API client for making HTTP requests to the backend
 * This module provides a centralized place for handling API requests,
 * including error handling, authentication, and configuration.
 */

// Base API URL from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Flag to determine whether to use API or mock data
export const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true';

// Flag to force localStorage even if USE_API is true (for testing)
export const FORCE_LOCAL_STORAGE = process.env.NEXT_PUBLIC_FORCE_LOCAL_STORAGE === 'true';

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  status: number;
  code: string;
  details?: any;

  constructor(status: number, message: string, code: string = 'UNKNOWN_ERROR', details?: any) {
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
export async function isApiAvailable(): Promise<boolean> {
  if (!USE_API || FORCE_LOCAL_STORAGE) {
    return false;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Short timeout to quickly check availability
      signal: AbortSignal.timeout(2000),
    });
    
    return response.ok;
  } catch (error) {
    console.warn('API health check failed:', error);
    return false;
  }
}

/**
 * Base fetch function with error handling
 */
export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  
  const config = {
    ...options,
    headers,
  };
  
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
        data.code || 'UNKNOWN_ERROR'
      );
    }
    
    // Return the data (usually within the 'data' field of the response)
    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Handle network errors or JSON parsing errors
    throw new ApiError(
      500,
      error instanceof Error ? error.message : 'Network error',
      'NETWORK_ERROR',
      { originalError: error }
    );
  }
}

/**
 * Webhook API endpoints
 */
export const webhookApi = {
  /**
   * Get all webhook configurations
   * @returns List of webhook configurations
   */
  getAll: async (): Promise<WebhookConfig[]> => {
    const response = await fetchApi<GetAllWebhooksResponse>('/webhooks');
    return response.data;
  },
  
  /**
   * Get a specific webhook configuration by ID
   * @param id Webhook configuration ID
   * @returns Webhook configuration details
   */
  getById: async (id: string): Promise<WebhookConfig> => {
    const response = await fetchApi<GetWebhookResponse>(`/webhooks/${id}`);
    return response.data;
  },
  
  /**
   * Create a new webhook configuration
   * @param data Webhook configuration data
   * @returns Response containing the created webhook
   */
  create: async (data: CreateWebhookConfigData): Promise<CreateWebhookResponse> => {
    return fetchApi<CreateWebhookResponse>('/webhooks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  /**
   * Update an existing webhook configuration
   * @param id Webhook configuration ID
   * @param data Updated webhook configuration data
   * @returns Response containing the updated webhook
   */
  update: async (id: string, data: UpdateWebhookConfigData): Promise<UpdateWebhookResponse> => {
    return fetchApi<UpdateWebhookResponse>(`/webhooks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  /**
   * Delete a webhook configuration
   * @param id Webhook configuration ID
   * @returns Response confirming deletion
   */
  delete: async (id: string): Promise<DeleteWebhookResponse> => {
    return fetchApi<DeleteWebhookResponse>(`/webhooks/${id}`, {
      method: 'DELETE',
    });
  },
}; 