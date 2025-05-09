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
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    // Add auth token if available
    // 'Authorization': `Bearer ${getAuthToken()}`,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    let data;
    try {
      data = await response.json();
    } catch (error) {
      data = null;
    }

    if (!response.ok) {
      throw new ApiError(
        response.status,
        data?.message || response.statusText,
        data
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network errors, CORS issues, etc.
    console.error('API request failed:', error);
    throw new ApiError(
      0, 
      'Network error or server unreachable. Please check your connection and try again.',
      null
    );
  }
}

/**
 * HTTP methods wrapped around fetchApi
 */
export const api = {
  get: <T>(endpoint: string, options?: RequestInit) => 
    fetchApi<T>(endpoint, { ...options, method: 'GET' }),
  
  post: <T>(endpoint: string, data: any, options?: RequestInit) =>
    fetchApi<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  put: <T>(endpoint: string, data: any, options?: RequestInit) =>
    fetchApi<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  patch: <T>(endpoint: string, data: any, options?: RequestInit) =>
    fetchApi<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  
  delete: <T>(endpoint: string, options?: RequestInit) =>
    fetchApi<T>(endpoint, { ...options, method: 'DELETE' }),
};

/**
 * API endpoints for webhook configuration
 * These endpoints are provisional and should be updated
 * once the backend implementation is complete.
 */
export const webhookApi = {
  getAll: () => api.get<WebhookConfig[]>('/api/webhook-configs'),
  
  getById: (id: string) => api.get<WebhookConfig>(`/api/webhook-configs/${id}`),
  
  create: (data: CreateWebhookConfigData) => 
    api.post<CreateWebhookResponse>('/api/webhook-configs', data),
  
  update: (id: string, data: UpdateWebhookConfigData) => 
    api.put<UpdateWebhookResponse>(`/api/webhook-configs/${id}`, data),
  
  delete: (id: string) => 
    api.delete<DeleteWebhookResponse>(`/api/webhook-configs/${id}`),
  
  toggleStatus: (id: string, isActive: boolean) => 
    api.patch<WebhookConfig>(`/api/webhook-configs/${id}/status`, { isActive }),
}; 