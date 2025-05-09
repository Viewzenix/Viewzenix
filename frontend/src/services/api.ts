import { 
  WebhookConfig, 
  CreateWebhookConfigData, 
  UpdateWebhookConfigData,
  CreateWebhookResponse,
  UpdateWebhookResponse,
  DeleteWebhookResponse
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

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
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
      throw new ApiError(
        response.status,
        data.error?.message || 'An unexpected error occurred',
        data.error
      );
    }
    
    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Handle network errors or JSON parsing errors
    throw new ApiError(
      500,
      error instanceof Error ? error.message : 'Network error',
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
    return fetchApi<WebhookConfig[]>('/api/webhooks');
  },
  
  /**
   * Get a specific webhook configuration by ID
   * @param id Webhook configuration ID
   * @returns Webhook configuration details
   */
  getById: async (id: string): Promise<WebhookConfig> => {
    return fetchApi<WebhookConfig>(`/api/webhooks/${id}`);
  },
  
  /**
   * Create a new webhook configuration
   * @param data Webhook configuration data
   * @returns Response containing the created webhook
   */
  create: async (data: CreateWebhookConfigData): Promise<CreateWebhookResponse> => {
    return fetchApi<CreateWebhookResponse>('/api/webhooks', {
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
    return fetchApi<UpdateWebhookResponse>(`/api/webhooks/${id}`, {
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
    return fetchApi<DeleteWebhookResponse>(`/api/webhooks/${id}`, {
      method: 'DELETE',
    });
  },
}; 