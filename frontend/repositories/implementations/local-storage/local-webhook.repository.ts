import { WebhookRepository } from '@/repositories/interfaces/webhook.repository';
import {
  CreateWebhookConfigDto,
  ToggleWebhookStatusDto,
  UpdateWebhookConfigDto,
  WebhookConfig
} from '@/types/webhook.types';
import {
  FilterParams,
  PaginatedData,
  PaginationMeta,
  PaginationParams,
  RepositoryResult,
  RepositoryType,
  RepositoryVoidResult
} from '@/types/repository/repository.types';
import { v4 as uuidv4 } from 'uuid';

/**
 * LocalStorage implementation of WebhookRepository
 */
export class LocalStorageWebhookRepository implements WebhookRepository {
  private readonly storageKey = 'viewzenix_webhooks';
  private readonly mockUserId = 'current_user_id'; // Simulate current user
  
  /**
   * Helper to get all webhooks from localStorage
   */
  private getAll(): WebhookConfig[] {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  }
  
  /**
   * Helper to save all webhooks to localStorage
   */
  private saveAll(webhooks: WebhookConfig[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(webhooks));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }
  
  /**
   * Helper to generate a webhook URL
   */
  private generateWebhookUrl(id: string): string {
    return `https://api.viewzenix.com/webhook/${id}`;
  }
  
  /**
   * Implementation of findAll with pagination and filtering
   */
  public async findAll(
    paginationParams?: PaginationParams,
    filterParams?: FilterParams
  ): Promise<RepositoryResult<PaginatedData<WebhookConfig>>> {
    try {
      const allWebhooks = this.getAll();
      
      // Apply filtering if provided
      let filteredWebhooks = allWebhooks;
      if (filterParams) {
        filteredWebhooks = allWebhooks.filter(webhook => {
          // Check each filter property
          return Object.entries(filterParams).every(([key, value]) => {
            if (key === 'name' && typeof value === 'string') {
              return webhook.name.toLowerCase().includes(value.toLowerCase());
            }
            if (key === 'isActive' && typeof value === 'boolean') {
              return webhook.isActive === value;
            }
            return true;
          });
        });
      }
      
      // Apply pagination
      const page = paginationParams?.page || 1;
      const limit = paginationParams?.limit || 20;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const paginatedWebhooks = filteredWebhooks.slice(startIndex, endIndex);
      
      // Create pagination metadata
      const meta: PaginationMeta = {
        currentPage: page,
        totalPages: Math.ceil(filteredWebhooks.length / limit),
        totalItems: filteredWebhooks.length,
        itemsPerPage: limit,
      };
      
      return {
        success: true,
        data: {
          items: paginatedWebhooks,
          meta,
        },
        source: RepositoryType.LOCAL_STORAGE,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error'),
        source: RepositoryType.LOCAL_STORAGE,
      };
    }
  }
  
  /**
   * Implementation of findById
   */
  public async findById(id: string): Promise<RepositoryResult<WebhookConfig>> {
    try {
      const webhooks = this.getAll();
      const webhook = webhooks.find(w => w.id === id);
      
      if (!webhook) {
        return {
          success: false,
          error: new Error(`Webhook with ID ${id} not found`),
          source: RepositoryType.LOCAL_STORAGE,
        };
      }
      
      return {
        success: true,
        data: webhook,
        source: RepositoryType.LOCAL_STORAGE,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error'),
        source: RepositoryType.LOCAL_STORAGE,
      };
    }
  }
  
  /**
   * Implementation of create
   */
  public async create(data: CreateWebhookConfigDto): Promise<RepositoryResult<WebhookConfig>> {
    try {
      const webhooks = this.getAll();
      
      // Generate a new webhook configuration
      const now = new Date().toISOString();
      const newId = uuidv4();
      
      const newWebhook: WebhookConfig = {
        id: newId,
        name: data.name,
        description: data.description || '',
        webhookUrl: this.generateWebhookUrl(newId),
        securityToken: data.securityToken,
        notificationPreferences: {
          email: data.notificationPreferences?.email ?? false,
          browser: data.notificationPreferences?.browser ?? true,
          onSuccess: data.notificationPreferences?.onSuccess ?? false,
          onFailure: data.notificationPreferences?.onFailure ?? true,
        },
        isActive: data.isActive ?? true,
        createdAt: now,
        updatedAt: now,
        userId: this.mockUserId,
      };
      
      webhooks.push(newWebhook);
      this.saveAll(webhooks);
      
      return {
        success: true,
        data: newWebhook,
        source: RepositoryType.LOCAL_STORAGE,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error'),
        source: RepositoryType.LOCAL_STORAGE,
      };
    }
  }
  
  /**
   * Implementation of update
   */
  public async update(id: string, data: UpdateWebhookConfigDto): Promise<RepositoryResult<WebhookConfig>> {
    try {
      const webhooks = this.getAll();
      const index = webhooks.findIndex(w => w.id === id);
      
      if (index === -1) {
        return {
          success: false,
          error: new Error(`Webhook with ID ${id} not found`),
          source: RepositoryType.LOCAL_STORAGE,
        };
      }
      
      // Update the webhook
      const updatedWebhook = {
        ...webhooks[index],
        ...data,
        notificationPreferences: {
          ...webhooks[index].notificationPreferences,
          ...data.notificationPreferences,
        },
        updatedAt: new Date().toISOString(),
      };
      
      webhooks[index] = updatedWebhook;
      this.saveAll(webhooks);
      
      return {
        success: true,
        data: updatedWebhook,
        source: RepositoryType.LOCAL_STORAGE,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error'),
        source: RepositoryType.LOCAL_STORAGE,
      };
    }
  }
  
  /**
   * Implementation of delete
   */
  public async delete(id: string): Promise<RepositoryVoidResult> {
    try {
      const webhooks = this.getAll();
      const index = webhooks.findIndex(w => w.id === id);
      
      if (index === -1) {
        return {
          success: false,
          error: new Error(`Webhook with ID ${id} not found`),
          source: RepositoryType.LOCAL_STORAGE,
        };
      }
      
      webhooks.splice(index, 1);
      this.saveAll(webhooks);
      
      return {
        success: true,
        source: RepositoryType.LOCAL_STORAGE,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error'),
        source: RepositoryType.LOCAL_STORAGE,
      };
    }
  }
  
  /**
   * Implementation of exists
   */
  public async exists(id: string): Promise<RepositoryResult<boolean>> {
    try {
      const webhooks = this.getAll();
      const exists = webhooks.some(w => w.id === id);
      
      return {
        success: true,
        data: exists,
        source: RepositoryType.LOCAL_STORAGE,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error'),
        source: RepositoryType.LOCAL_STORAGE,
      };
    }
  }
  
  /**
   * Implementation of count
   */
  public async count(filterParams?: FilterParams): Promise<RepositoryResult<number>> {
    try {
      const webhooks = this.getAll();
      
      // Apply filtering if provided
      let count = webhooks.length;
      if (filterParams) {
        count = webhooks.filter(webhook => {
          // Check each filter property
          return Object.entries(filterParams).every(([key, value]) => {
            if (key === 'name' && typeof value === 'string') {
              return webhook.name.toLowerCase().includes(value.toLowerCase());
            }
            if (key === 'isActive' && typeof value === 'boolean') {
              return webhook.isActive === value;
            }
            return true;
          });
        }).length;
      }
      
      return {
        success: true,
        data: count,
        source: RepositoryType.LOCAL_STORAGE,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error'),
        source: RepositoryType.LOCAL_STORAGE,
      };
    }
  }
  
  /**
   * Implementation of healthCheck
   */
  public async healthCheck(): Promise<RepositoryResult<boolean>> {
    try {
      // Check if localStorage is available
      const testKey = '_test_localStorage_';
      localStorage.setItem(testKey, 'test');
      const testValue = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);
      
      const isAvailable = testValue === 'test';
      
      return {
        success: true,
        data: isAvailable,
        source: RepositoryType.LOCAL_STORAGE,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('localStorage not available'),
        source: RepositoryType.LOCAL_STORAGE,
      };
    }
  }
  
  /**
   * Implementation of findAllForCurrentUser
   */
  public async findAllForCurrentUser(): Promise<RepositoryResult<WebhookConfig[]>> {
    try {
      const allWebhooks = this.getAll();
      const userWebhooks = allWebhooks.filter(w => w.userId === this.mockUserId);
      
      return {
        success: true,
        data: userWebhooks,
        source: RepositoryType.LOCAL_STORAGE,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error'),
        source: RepositoryType.LOCAL_STORAGE,
      };
    }
  }
  
  /**
   * Implementation of toggleStatus
   */
  public async toggleStatus(id: string, data: ToggleWebhookStatusDto): Promise<RepositoryResult<WebhookConfig>> {
    try {
      const webhooks = this.getAll();
      const index = webhooks.findIndex(w => w.id === id);
      
      if (index === -1) {
        return {
          success: false,
          error: new Error(`Webhook with ID ${id} not found`),
          source: RepositoryType.LOCAL_STORAGE,
        };
      }
      
      // Update the active status
      webhooks[index] = {
        ...webhooks[index],
        isActive: data.isActive,
        updatedAt: new Date().toISOString(),
      };
      
      this.saveAll(webhooks);
      
      return {
        success: true,
        data: webhooks[index],
        source: RepositoryType.LOCAL_STORAGE,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error'),
        source: RepositoryType.LOCAL_STORAGE,
      };
    }
  }
  
  /**
   * Implementation of generateSecureToken
   */
  public async generateSecureToken(): Promise<RepositoryResult<string>> {
    try {
      // Generate a random secure token (in a real app, use a more secure method)
      const token = Math.random().toString(36).substring(2, 15) + 
                   Math.random().toString(36).substring(2, 15);
      
      return {
        success: true,
        data: token,
        source: RepositoryType.LOCAL_STORAGE,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error'),
        source: RepositoryType.LOCAL_STORAGE,
      };
    }
  }
  
  /**
   * Implementation of testWebhook
   */
  public async testWebhook(id: string): Promise<RepositoryResult<{ success: boolean; message: string }>> {
    try {
      const webhooks = this.getAll();
      const webhook = webhooks.find(w => w.id === id);
      
      if (!webhook) {
        return {
          success: false,
          error: new Error(`Webhook with ID ${id} not found`),
          source: RepositoryType.LOCAL_STORAGE,
        };
      }
      
      // Simulate a test (in a real app, this would actually send a test signal)
      return {
        success: true,
        data: {
          success: true,
          message: `Test signal sent successfully to webhook ${webhook.name}`,
        },
        source: RepositoryType.LOCAL_STORAGE,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error'),
        source: RepositoryType.LOCAL_STORAGE,
      };
    }
  }
  
  /**
   * Implementation of batchDelete
   */
  public async batchDelete(ids: string[]): Promise<RepositoryVoidResult> {
    try {
      let webhooks = this.getAll();
      const originalCount = webhooks.length;
      
      // Remove webhooks with matching IDs
      webhooks = webhooks.filter(w => !ids.includes(w.id));
      
      if (webhooks.length === originalCount) {
        return {
          success: false,
          error: new Error('No webhooks found with the provided IDs'),
          source: RepositoryType.LOCAL_STORAGE,
        };
      }
      
      this.saveAll(webhooks);
      
      return {
        success: true,
        source: RepositoryType.LOCAL_STORAGE,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error'),
        source: RepositoryType.LOCAL_STORAGE,
      };
    }
  }
  
  /**
   * Implementation of findByName
   */
  public async findByName(name: string): Promise<RepositoryResult<WebhookConfig[]>> {
    try {
      const webhooks = this.getAll();
      const matchingWebhooks = webhooks.filter(w => 
        w.name.toLowerCase().includes(name.toLowerCase()) &&
        w.userId === this.mockUserId
      );
      
      return {
        success: true,
        data: matchingWebhooks,
        source: RepositoryType.LOCAL_STORAGE,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error'),
        source: RepositoryType.LOCAL_STORAGE,
      };
    }
  }
}