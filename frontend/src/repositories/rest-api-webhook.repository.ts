import { WebhookConfig, CreateWebhookConfigData, UpdateWebhookConfigData } from '@/types/webhook';
import { WebhookRepository } from './webhook.repository';
import { webhookApi } from '@/services/api';
import { errorService } from '@/services/error';

/**
 * REST API implementation of the WebhookRepository interface
 */
export class RestApiWebhookRepository implements WebhookRepository {
  private webhooks: WebhookConfig[] = [];
  private webhooksSubscribers: Set<(webhooks: WebhookConfig[]) => void> = new Set();
  private pollingInterval: NodeJS.Timeout | null = null;
  private readonly POLLING_INTERVAL_MS = 10000; // 10 seconds
  
  constructor() {
    this.startPolling();
  }
  
  /**
   * Start polling for webhook changes
   */
  private startPolling(): void {
    if (typeof window !== 'undefined') {
      this.pollingInterval = setInterval(() => {
        this.refreshWebhooks();
      }, this.POLLING_INTERVAL_MS);
    }
  }
  
  /**
   * Stop polling for webhook changes
   */
  private stopPolling(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }
  
  /**
   * Refresh webhooks from API
   */
  private async refreshWebhooks(): Promise<void> {
    try {
      const response = await webhookApi.getAll();
      this.webhooks = response.data;
      this.notifySubscribers();
    } catch (error) {
      errorService.logError('RestApiWebhookRepository.refreshWebhooks', error);
    }
  }
  
  /**
   * Notify all subscribers of webhook changes
   */
  private notifySubscribers(): void {
    const snapshot = [...this.webhooks];
    this.webhooksSubscribers.forEach(callback => callback(snapshot));
  }
  
  /**
   * Get all webhook configurations
   */
  async getAll(): Promise<WebhookConfig[]> {
    try {
      const response = await webhookApi.getAll();
      this.webhooks = response.data;
      return this.webhooks;
    } catch (error) {
      errorService.logError('RestApiWebhookRepository.getAll', error);
      throw new Error('Failed to fetch webhooks');
    }
  }
  
  /**
   * Get a webhook configuration by ID
   */
  async getById(id: string): Promise<WebhookConfig | null> {
    try {
      const response = await webhookApi.getById(id);
      return response.data;
    } catch (error: any) {
      if (error.status === 404) {
        return null;
      }
      errorService.logError('RestApiWebhookRepository.getById', error, { id });
      throw new Error(`Failed to fetch webhook with ID ${id}`);
    }
  }
  
  /**
   * Create a new webhook configuration
   */
  async create(data: CreateWebhookConfigData): Promise<WebhookConfig> {
    try {
      const response = await webhookApi.create(data);
      const webhook = response.data.webhook;
      await this.refreshWebhooks();
      return webhook;
    } catch (error) {
      errorService.logError('RestApiWebhookRepository.create', error, { data });
      throw new Error('Failed to create webhook');
    }
  }
  
  /**
   * Update an existing webhook configuration
   */
  async update(id: string, data: UpdateWebhookConfigData): Promise<WebhookConfig> {
    try {
      const response = await webhookApi.update(id, data);
      const webhook = response.data.webhook;
      await this.refreshWebhooks();
      return webhook;
    } catch (error) {
      errorService.logError('RestApiWebhookRepository.update', error, { id, data });
      throw new Error(`Failed to update webhook with ID ${id}`);
    }
  }
  
  /**
   * Delete a webhook configuration
   */
  async delete(id: string): Promise<boolean> {
    try {
      const response = await webhookApi.delete(id);
      await this.refreshWebhooks();
      return response.data.success;
    } catch (error) {
      errorService.logError('RestApiWebhookRepository.delete', error, { id });
      throw new Error(`Failed to delete webhook with ID ${id}`);
    }
  }
  
  /**
   * Toggle webhook active status
   */
  async toggleActive(id: string, isActive?: boolean): Promise<WebhookConfig> {
    try {
      // If isActive is not provided, get the current status and toggle it
      if (isActive === undefined) {
        const webhook = await this.getById(id);
        if (!webhook) {
          throw new Error(`Webhook with ID ${id} not found`);
        }
        isActive = !webhook.isActive;
      }
      
      const response = await webhookApi.toggleActive(id, isActive);
      const webhook = response.data.webhook;
      await this.refreshWebhooks();
      return webhook;
    } catch (error) {
      errorService.logError('RestApiWebhookRepository.toggleActive', error, { id, isActive });
      throw new Error(`Failed to toggle webhook with ID ${id}`);
    }
  }
  
  /**
   * Subscribe to webhook changes
   */
  subscribe(callback: (webhooks: WebhookConfig[]) => void): () => void {
    this.webhooksSubscribers.add(callback);
    callback([...this.webhooks]);
    
    return () => {
      this.webhooksSubscribers.delete(callback);
      
      // Stop polling if there are no more subscribers
      if (this.webhooksSubscribers.size === 0) {
        this.stopPolling();
      }
    };
  }
}