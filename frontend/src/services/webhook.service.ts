import { 
  WebhookConfig, 
  CreateWebhookConfigData, 
  UpdateWebhookConfigData,
  CreateWebhookResponse,
  UpdateWebhookResponse,
  DeleteWebhookResponse
} from '@/types/webhook';
import { webhookApi, ApiError, USE_API } from '@/services/api';

/**
 * Service for managing webhook configurations
 * This service provides CRUD operations for webhook configurations and
 * can use either the backend API or localStorage for data persistence.
 */
class WebhookService {
  private mockWebhooks: WebhookConfig[] = [];
  private readonly STORAGE_KEY = 'viewzenix_webhooks';

  constructor() {
    // Only load from storage if not using API
    if (!USE_API) {
      this.loadFromStorage();
    }
  }

  /**
   * Load webhooks from local storage
   * This initializes with a default webhook if storage is empty for demonstration purposes.
   * In a production environment, this would connect to a backend API.
   */
  private loadFromStorage(): void {
    if (typeof window === 'undefined') return; // Skip on server-side

    try {
      const storedData = localStorage.getItem(this.STORAGE_KEY);
      if (storedData) {
        this.mockWebhooks = JSON.parse(storedData);
      } else {
        // Initialize with default webhook if storage is empty (for demonstration)
        this.mockWebhooks = [
          {
            id: 'webhook-1',
            name: 'AAPL Trading Strategy',
            description: 'TradingView alerts for Apple stock',
            webhookUrl: 'https://api.viewzenix.com/webhook/user123/apple',
            securityToken: 'abc123xyz789',
            notificationPreferences: {
              email: true,
              browser: true,
              onSuccess: true,
              onFailure: true
            },
            isActive: true,
            createdAt: '2024-05-01T12:00:00Z',
            updatedAt: '2024-05-05T15:30:00Z'
          }
        ];
        this.saveToStorage();
      }
    } catch (error) {
      console.error('Failed to load webhooks from storage:', error);
      // Initialize with empty array in case of error
      this.mockWebhooks = [];
    }
  }

  /**
   * Save webhooks to local storage
   * This persists the current state of webhooks between page refreshes.
   */
  private saveToStorage(): void {
    if (typeof window === 'undefined') return; // Skip on server-side

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.mockWebhooks));
    } catch (error) {
      console.error('Failed to save webhooks to storage:', error);
      // If localStorage is not available or quota exceeded, we could implement a fallback
      // For example, using sessionStorage or notifying the user about the storage issue
    }
  }

  /**
   * Get all webhook configurations for the current user
   * @returns Promise resolving to array of webhook configurations
   */
  async getWebhooks(): Promise<WebhookConfig[]> {
    if (USE_API) {
      try {
        return await webhookApi.getAll();
      } catch (error) {
        console.error('Failed to fetch webhooks from API:', error);
        // Fallback to localStorage if API fails
        if (!this.mockWebhooks.length) {
          this.loadFromStorage();
        }
        return [...this.mockWebhooks];
      }
    }
    
    // Use localStorage data with simulated API delay
    await this.delay(800);
    return [...this.mockWebhooks];
  }

  /**
   * Get a specific webhook configuration by ID
   * @param id Webhook configuration ID
   * @returns Promise resolving to webhook configuration or null if not found
   */
  async getWebhookById(id: string): Promise<WebhookConfig | null> {
    if (!id) {
      throw new Error('Webhook ID is required');
    }

    if (USE_API) {
      try {
        return await webhookApi.getById(id);
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          return null;
        }
        console.error(`Failed to fetch webhook ${id} from API:`, error);
        // Fallback to localStorage if API fails
        if (!this.mockWebhooks.length) {
          this.loadFromStorage();
        }
        const webhook = this.mockWebhooks.find(w => w.id === id);
        return webhook ? { ...webhook } : null;
      }
    }
    
    // Use localStorage data with simulated API delay
    await this.delay(500);
    const webhook = this.mockWebhooks.find(w => w.id === id);
    return webhook ? { ...webhook } : null;
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

    if (USE_API) {
      try {
        return await webhookApi.create(data);
      } catch (error) {
        console.error('Failed to create webhook via API:', error);
        // If API fails, fall back to localStorage
        // but make it clear in logs this is a fallback
        console.warn('Falling back to localStorage for webhook creation');
        if (!this.mockWebhooks.length) {
          this.loadFromStorage();
        }
      }
    }
    
    // Use localStorage with simulated API delay
    await this.delay(1000);
    
    // Generate a new webhook with default values and provided data
    const newWebhook: WebhookConfig = {
      id: `webhook-${Date.now()}`,
      webhookUrl: `https://api.viewzenix.com/webhook/user123/${data.name.toLowerCase().replace(/\s+/g, '-')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data
    };
    
    // Add to mock data and persist
    this.mockWebhooks.push(newWebhook);
    this.saveToStorage();
    
    return {
      webhook: newWebhook,
      success: true
    };
  }

  /**
   * Update an existing webhook configuration
   * @param id Webhook configuration ID
   * @param data Updated webhook data
   * @returns Promise resolving to update response with the updated webhook
   */
  async updateWebhook(id: string, data: UpdateWebhookConfigData): Promise<UpdateWebhookResponse> {
    if (!id) {
      throw new Error('Webhook ID is required');
    }

    if (USE_API) {
      try {
        return await webhookApi.update(id, data);
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          throw new Error(`Webhook with ID ${id} not found`);
        }
        console.error(`Failed to update webhook ${id} via API:`, error);
        // If API fails, try to fall back to localStorage
        console.warn('Falling back to localStorage for webhook update');
        if (!this.mockWebhooks.length) {
          this.loadFromStorage();
        }
      }
    }
    
    // Use localStorage with simulated API delay
    await this.delay(800);
    
    // Find webhook index
    const index = this.mockWebhooks.findIndex(w => w.id === id);
    
    if (index === -1) {
      throw new Error(`Webhook with ID ${id} not found`);
    }
    
    // Update webhook
    const updatedWebhook: WebhookConfig = {
      ...this.mockWebhooks[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    // Update in mock data and persist
    this.mockWebhooks[index] = updatedWebhook;
    this.saveToStorage();
    
    return {
      webhook: updatedWebhook,
      success: true
    };
  }

  /**
   * Delete a webhook configuration
   * @param id Webhook configuration ID
   * @returns Promise resolving to delete response
   */
  async deleteWebhook(id: string): Promise<DeleteWebhookResponse> {
    if (!id) {
      throw new Error('Webhook ID is required');
    }

    if (USE_API) {
      try {
        return await webhookApi.delete(id);
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          throw new Error(`Webhook with ID ${id} not found`);
        }
        console.error(`Failed to delete webhook ${id} via API:`, error);
        // If API fails, try to fall back to localStorage
        console.warn('Falling back to localStorage for webhook deletion');
        if (!this.mockWebhooks.length) {
          this.loadFromStorage();
        }
      }
    }
    
    // Use localStorage with simulated API delay
    await this.delay(700);
    
    // Find webhook index
    const index = this.mockWebhooks.findIndex(w => w.id === id);
    
    if (index === -1) {
      throw new Error(`Webhook with ID ${id} not found`);
    }
    
    // Remove from mock data and persist
    this.mockWebhooks.splice(index, 1);
    this.saveToStorage();
    
    return {
      id,
      success: true
    };
  }

  /**
   * Toggle webhook active status
   * @param id Webhook configuration ID
   * @param isActive New active status
   * @returns Promise resolving to updated webhook
   */
  async toggleWebhookStatus(id: string, isActive: boolean): Promise<WebhookConfig> {
    if (!id) {
      throw new Error('Webhook ID is required');
    }

    if (USE_API) {
      try {
        return await webhookApi.toggleStatus(id, isActive);
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          throw new Error(`Webhook with ID ${id} not found`);
        }
        console.error(`Failed to toggle webhook ${id} status via API:`, error);
        // If API fails, try to fall back to localStorage
        console.warn('Falling back to localStorage for webhook status toggle');
        if (!this.mockWebhooks.length) {
          this.loadFromStorage();
        }
      }
    }
    
    // Use localStorage with simulated API delay
    await this.delay(500);
    
    // Find webhook index
    const index = this.mockWebhooks.findIndex(w => w.id === id);
    
    if (index === -1) {
      throw new Error(`Webhook with ID ${id} not found`);
    }
    
    // Update status
    const updatedWebhook: WebhookConfig = {
      ...this.mockWebhooks[index],
      isActive,
      updatedAt: new Date().toISOString()
    };
    
    // Update in mock data and persist
    this.mockWebhooks[index] = updatedWebhook;
    this.saveToStorage();
    
    return updatedWebhook;
  }

  /**
   * Clear all stored webhooks (useful for testing or reset)
   * @returns Promise resolving when all webhooks are cleared
   */
  async clearAllWebhooks(): Promise<void> {
    if (USE_API) {
      // This would require a backend endpoint that may not exist
      // For now, just clear the localStorage as a fallback
      console.warn('API does not support clearing all webhooks, using localStorage fallback');
    }
    
    // Simulate API delay
    await this.delay(500);
    
    this.mockWebhooks = [];
    this.saveToStorage();
  }

  /**
   * Helper to simulate API delay
   * @param ms Milliseconds to delay
   * @returns Promise that resolves after the delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const webhookService = new WebhookService();