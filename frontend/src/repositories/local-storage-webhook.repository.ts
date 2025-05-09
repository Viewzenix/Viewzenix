import { WebhookConfig, CreateWebhookConfigData, UpdateWebhookConfigData } from '@/types/webhook';
import { WebhookRepository } from './webhook.repository';
import { errorService } from '@/services/error';
import { WEBHOOK_CONFIG } from '@/config/environment.config';

/**
 * LocalStorage implementation of the WebhookRepository interface
 * Used as a fallback when neither Supabase nor REST API are available
 */
export class LocalStorageWebhookRepository implements WebhookRepository {
  private webhooks: WebhookConfig[] = [];
  private webhooksSubscribers: Set<(webhooks: WebhookConfig[]) => void> = new Set();
  private readonly STORAGE_KEY = 'viewzenix_webhooks';
  
  constructor() {
    this.loadFromStorage();
  }
  
  /**
   * Check if browser environment is available
   */
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }
  
  /**
   * Load webhooks from localStorage
   */
  private loadFromStorage(): void {
    if (!this.isBrowser()) return;
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      this.webhooks = stored ? JSON.parse(stored) : [];
    } catch (error) {
      errorService.logError('LocalStorageWebhookRepository.loadFromStorage', error);
      this.webhooks = [];
    }
  }
  
  /**
   * Save webhooks to localStorage
   */
  private saveToStorage(): void {
    if (!this.isBrowser()) return;
    
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.webhooks));
    } catch (error) {
      errorService.logError('LocalStorageWebhookRepository.saveToStorage', error);
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
    return [...this.webhooks];
  }
  
  /**
   * Get a webhook configuration by ID
   */
  async getById(id: string): Promise<WebhookConfig | null> {
    const webhook = this.webhooks.find(w => w.id === id);
    return webhook || null;
  }
  
  /**
   * Create a new webhook configuration
   */
  async create(data: CreateWebhookConfigData): Promise<WebhookConfig> {
    const id = crypto.randomUUID();
    const webhookUrl = `${WEBHOOK_CONFIG.baseUrl}/${id}`;
    
    const webhook: WebhookConfig = {
      id,
      name: data.name,
      description: data.description || '',
      webhookUrl,
      securityToken: data.securityToken,
      notificationPreferences: data.notificationPreferences,
      isActive: data.isActive !== undefined ? data.isActive : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    this.webhooks.unshift(webhook);
    this.saveToStorage();
    this.notifySubscribers();
    
    return webhook;
  }
  
  /**
   * Update an existing webhook configuration
   */
  async update(id: string, data: UpdateWebhookConfigData): Promise<WebhookConfig> {
    const index = this.webhooks.findIndex(w => w.id === id);
    
    if (index === -1) {
      throw new Error(`Webhook with ID ${id} not found`);
    }
    
    const updatedWebhook: WebhookConfig = {
      ...this.webhooks[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    this.webhooks[index] = updatedWebhook;
    this.saveToStorage();
    this.notifySubscribers();
    
    return updatedWebhook;
  }
  
  /**
   * Delete a webhook configuration
   */
  async delete(id: string): Promise<boolean> {
    const initialLength = this.webhooks.length;
    this.webhooks = this.webhooks.filter(w => w.id !== id);
    
    if (this.webhooks.length === initialLength) {
      return false;
    }
    
    this.saveToStorage();
    this.notifySubscribers();
    return true;
  }
  
  /**
   * Toggle webhook active status
   */
  async toggleActive(id: string, isActive?: boolean): Promise<WebhookConfig> {
    const webhook = await this.getById(id);
    
    if (!webhook) {
      throw new Error(`Webhook with ID ${id} not found`);
    }
    
    const newIsActive = isActive !== undefined ? isActive : !webhook.isActive;
    
    return this.update(id, { isActive: newIsActive });
  }
  
  /**
   * Subscribe to webhook changes
   */
  subscribe(callback: (webhooks: WebhookConfig[]) => void): () => void {
    this.webhooksSubscribers.add(callback);
    callback([...this.webhooks]);
    
    return () => {
      this.webhooksSubscribers.delete(callback);
    };
  }
}