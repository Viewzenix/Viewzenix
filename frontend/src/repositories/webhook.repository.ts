import { WebhookConfig, CreateWebhookConfigData, UpdateWebhookConfigData } from '@/types/webhook';

/**
 * Repository interface for webhook operations
 * Defines a contract for all webhook repository implementations
 */
export interface WebhookRepository {
  /**
   * Get all webhook configurations
   */
  getAll(): Promise<WebhookConfig[]>;
  
  /**
   * Get a webhook configuration by ID
   * @param id Webhook configuration ID
   */
  getById(id: string): Promise<WebhookConfig | null>;
  
  /**
   * Create a new webhook configuration
   * @param data Webhook configuration data
   */
  create(data: CreateWebhookConfigData): Promise<WebhookConfig>;
  
  /**
   * Update an existing webhook configuration
   * @param id Webhook configuration ID
   * @param data Updated webhook configuration data
   */
  update(id: string, data: UpdateWebhookConfigData): Promise<WebhookConfig>;
  
  /**
   * Delete a webhook configuration
   * @param id Webhook configuration ID
   */
  delete(id: string): Promise<boolean>;
  
  /**
   * Toggle webhook active status
   * @param id Webhook configuration ID
   * @param isActive New active status (if not provided, will toggle current status)
   */
  toggleActive(id: string, isActive?: boolean): Promise<WebhookConfig>;
  
  /**
   * Subscribe to webhook changes
   * @param callback Function to call when webhooks change
   * @returns Unsubscribe function
   */
  subscribe(callback: (webhooks: WebhookConfig[]) => void): () => void;
}