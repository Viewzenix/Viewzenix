import { 
  WebhookConfig, 
  CreateWebhookConfigData, 
  UpdateWebhookConfigData,
  CreateWebhookResponse,
  UpdateWebhookResponse,
  DeleteWebhookResponse
} from '@/types/webhook';
import { webhookApi, ApiError, isApiAvailable } from '@/services/api';
import { USE_API, FORCE_LOCAL_STORAGE } from '@/config/api.config';

/**
 * Check if code is running in a browser environment
 * @returns boolean indicating if window is defined (client-side)
 */
const isBrowser = () => typeof window !== 'undefined';

/**
 * Service for managing webhook configurations
 * This service provides CRUD operations for webhook configurations and
 * can use either the backend API or localStorage for data persistence.
 */
class WebhookService {
  private mockWebhooks: WebhookConfig[] = [];
  private readonly STORAGE_KEY = 'viewzenix_webhooks';
  private apiAvailable = false;

  constructor() {
    // Only initialize from localStorage if in browser environment
    if (isBrowser()) {
      this.loadFromStorage();
    }
    
    // Check API availability asynchronously (client-side only)
    if (isBrowser() && USE_API && !FORCE_LOCAL_STORAGE) {
      this.checkApiAvailability();
    }
  }

  /**
   * Check if the API is available
   * This is called automatically on initialization and can be called
   * manually to refresh the status.
   */
  async checkApiAvailability(): Promise<boolean> {
    try {
      this.apiAvailable = await isApiAvailable();
      return this.apiAvailable;
    } catch (error) {
      console.warn('Error checking API availability:', error);
      this.apiAvailable = false;
      return false;
    }
  }

  /**
   * Load webhooks from local storage
   * This initializes with a default webhook if storage is empty
   */
  private loadFromStorage(): void {
    // Skip if not in browser environment
    if (!isBrowser()) {
      return;
    }

    try {
      const storedWebhooks = localStorage.getItem(this.STORAGE_KEY);
      
      if (storedWebhooks) {
        this.mockWebhooks = JSON.parse(storedWebhooks);
      } else {
        // Initialize with a default webhook if none exist
        const defaultWebhook: WebhookConfig = {
          id: '1',
          name: 'Default Webhook',
          description: 'Default webhook configuration',
          webhookUrl: 'https://api.viewzenix.com/webhook/1',
          securityToken: 'your-secret-token',
          notificationPreferences: {
            email: false,
            browser: true,
            onSuccess: true,
            onFailure: true
          },
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        this.mockWebhooks = [defaultWebhook];
        this.saveToStorage();
      }
    } catch (error) {
      console.error('Error loading webhooks from localStorage:', error);
      // Reset to default state
      this.mockWebhooks = [];
    }
  }

  /**
   * Save webhooks to local storage
   */
  private saveToStorage(): void {
    // Skip if not in browser environment
    if (!isBrowser()) {
      return;
    }

    try {
      localStorage.setItem(
        this.STORAGE_KEY, 
        JSON.stringify(this.mockWebhooks)
      );
    } catch (error) {
      console.error('Error saving webhooks to localStorage:', error);
    }
  }

  /**
   * Check if we should use the API or localStorage
   * This checks both the USE_API flag and the API availability
   */
  private shouldUseApi(): boolean {
    return isBrowser() && USE_API && this.apiAvailable && !FORCE_LOCAL_STORAGE;
  }

  /**
   * Get all webhook configurations
   * @returns Promise resolving to array of webhook configurations
   */
  async getWebhooks(): Promise<WebhookConfig[]> {
    if (this.shouldUseApi()) {
      try {
        const response = await webhookApi.getAll();
        return response.data;
      } catch (error) {
        console.error('Failed to fetch webhooks via API:', error);
        // If API fails, fall back to localStorage
        console.warn('Falling back to localStorage for webhook retrieval');
        return this.mockWebhooks;
      }
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.mockWebhooks];
  }

  /**
   * Get a specific webhook configuration by ID
   * @param id Webhook configuration ID
   * @returns Promise resolving to webhook configuration or null if not found
   */
  async getWebhookById(id: string): Promise<WebhookConfig | null> {
    if (this.shouldUseApi()) {
      try {
        const response = await webhookApi.getById(id);
        return response.data;
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          return null;
        }
        
        console.error('Failed to fetch webhook via API:', error);
        // If API fails, fall back to localStorage
        console.warn('Falling back to localStorage for webhook retrieval');
      }
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const webhook = this.mockWebhooks.find(w => w.id === id);
    return webhook || null;
  }

  /**
   * Create a new webhook configuration
   * @param data Webhook configuration data
   * @returns Promise resolving to create response with the new webhook
   */
  async createWebhook(data: CreateWebhookConfigData): Promise<CreateWebhookResponse> {
    if (!data.name) {
      throw new Error('Webhook name is required');
    }

    if (!data.securityToken) {
      throw new Error('Security token is required');
    }

    if (this.shouldUseApi()) {
      try {
        return await webhookApi.create(data);
      } catch (error) {
        console.error('Failed to create webhook via API:', error);
        // If API fails, fall back to localStorage
        console.warn('Falling back to localStorage for webhook creation');
      }
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Use localStorage with simulated API creation
    const id = String(this.mockWebhooks.length + 1);
    const webhook: WebhookConfig = {
      ...data,
      id,
      webhookUrl: `https://api.viewzenix.com/webhook/${id}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.mockWebhooks.push(webhook);
    this.saveToStorage();
    
    return {
      status: 'success',
      message: 'Webhook configuration created successfully',
      data: {
        webhook,
        success: true
      }
    };
  }

  /**
   * Update an existing webhook configuration
   * @param id Webhook configuration ID
   * @param data Updated webhook configuration data
   * @returns Promise resolving to update response with the updated webhook
   */
  async updateWebhook(id: string, data: UpdateWebhookConfigData): Promise<UpdateWebhookResponse> {
    if (this.shouldUseApi()) {
      try {
        return await webhookApi.update(id, data);
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          throw new Error(`Webhook with ID ${id} not found`);
        }
        
        console.error('Failed to update webhook via API:', error);
        // If API fails, fall back to localStorage
        console.warn('Falling back to localStorage for webhook update');
      }
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Use localStorage with simulated API update
    const index = this.mockWebhooks.findIndex(w => w.id === id);
    
    if (index === -1) {
      throw new Error(`Webhook with ID ${id} not found`);
    }
    
    const updatedWebhook: WebhookConfig = {
      ...this.mockWebhooks[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    this.mockWebhooks[index] = updatedWebhook;
    this.saveToStorage();
    
    return {
      status: 'success',
      message: 'Webhook configuration updated successfully',
      data: {
        webhook: updatedWebhook,
        success: true
      }
    };
  }

  /**
   * Delete a webhook configuration
   * @param id Webhook configuration ID
   * @returns Promise resolving to delete response
   */
  async deleteWebhook(id: string): Promise<DeleteWebhookResponse> {
    if (this.shouldUseApi()) {
      try {
        return await webhookApi.delete(id);
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          throw new Error(`Webhook with ID ${id} not found`);
        }
        
        console.error('Failed to delete webhook via API:', error);
        // If API fails, fall back to localStorage
        console.warn('Falling back to localStorage for webhook deletion');
      }
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Use localStorage with simulated API deletion
    const index = this.mockWebhooks.findIndex(w => w.id === id);
    
    if (index === -1) {
      throw new Error(`Webhook with ID ${id} not found`);
    }
    
    this.mockWebhooks.splice(index, 1);
    this.saveToStorage();
    
    return {
      status: 'success',
      message: 'Webhook configuration deleted successfully',
      data: {
        id,
        success: true
      }
    };
  }

  /**
   * Toggle a webhook's active status
   * @param id Webhook configuration ID
   * @param isActive New active status
   * @returns Promise resolving to updated webhook
   */
  async toggleWebhookActive(id: string, isActive: boolean): Promise<WebhookConfig> {
    if (this.shouldUseApi()) {
      try {
        const response = await webhookApi.toggleActive(id);
        return response.data.webhook;
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          throw new Error(`Webhook with ID ${id} not found`);
        }
        console.error('Failed to toggle webhook status via API:', error);
        console.warn('Falling back to localStorage for webhook status toggle');
      }
    }
    
    // Fall back to using the update method with localStorage
    const response = await this.updateWebhook(id, { isActive });
    return response.data.webhook;
  }


  /**
   * Toggle a webhook's active status (alias for toggleWebhookActive)
   * @param id Webhook configuration ID
   * @param isActive New active status
   * @returns Promise resolving to updated webhook
   */
  async toggleWebhookStatus(id: string, isActive: boolean): Promise<WebhookConfig> {
    return this.toggleWebhookActive(id, isActive);
  }

  /**
   * Update a webhook's notification preferences
   * @param id Webhook configuration ID
   * @param preferences New notification preferences
   * @returns Promise resolving to updated webhook
   */
  async updateNotificationPreferences(
    id: string, 
    preferences: Partial<WebhookConfig['notificationPreferences']>
  ): Promise<WebhookConfig> {
    const currentWebhook = await this.getWebhookById(id);
    if (!currentWebhook) {
      throw new Error(`Webhook with ID ${id} not found`);
    }

    // Merge current and new preferences, ensuring all required fields are present
    const updatedPreferences: WebhookConfig['notificationPreferences'] = {
      ...currentWebhook.notificationPreferences,
      ...preferences
    };

    const response = await this.updateWebhook(id, { 
      notificationPreferences: updatedPreferences
    });
    
    return response.data.webhook;
  }
}

// Export a singleton instance
export const webhookService = new WebhookService();