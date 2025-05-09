import { WebhookConfig, CreateWebhookConfigData, UpdateWebhookConfigData } from '@/types/webhook';
import { WebhookRepository } from './webhook.repository';
import { supabase } from '@/config/supabase.config';
import { DB_TABLES, DB_COLUMNS } from '@/constants/database';
import { Tables } from '@/types/supabase';
import { errorService } from '@/services/error';
import { RealtimeChannel } from '@supabase/supabase-js';
import { WEBHOOK_CONFIG } from '@/config/environment.config';

/**
 * Supabase implementation of the WebhookRepository interface
 */
export class SupabaseWebhookRepository implements WebhookRepository {
  private webhooks: WebhookConfig[] = [];
  private webhooksSubscribers: Set<(webhooks: WebhookConfig[]) => void> = new Set();
  private realtimeChannel: RealtimeChannel | null = null;
  
  constructor() {
    this.initRealtimeSubscription();
  }
  
  /**
   * Initialize Supabase real-time subscription
   */
  private initRealtimeSubscription(): void {
    this.realtimeChannel = supabase
      .channel('webhook-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: DB_TABLES.WEBHOOKS 
      }, () => this.refreshWebhooks())
      .subscribe();
  }
  
  /**
   * Refresh webhooks from Supabase
   */
  private async refreshWebhooks(): Promise<void> {
    try {
      const { data, error } = await supabase
        .from(DB_TABLES.WEBHOOKS)
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      this.webhooks = data.map(this.mapToWebhookConfig);
      this.notifySubscribers();
    } catch (error) {
      errorService.logError('SupabaseWebhookRepository.refreshWebhooks', error);
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
   * Map Supabase record to WebhookConfig
   */
  private mapToWebhookConfig(record: Tables<'webhook_configs'>): WebhookConfig {
    return {
      id: record.id,
      name: record.name,
      description: record.description || '',
      webhookUrl: record.webhook_url,
      securityToken: record.security_token,
      notificationPreferences: {
        email: record.notification_preferences.email,
        browser: record.notification_preferences.browser,
        onSuccess: record.notification_preferences.on_success,
        onFailure: record.notification_preferences.on_failure,
      },
      isActive: record.is_active,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
    };
  }
  
  /**
   * Map WebhookConfig to Supabase record format
   */
  private mapToSupabaseFormat(data: Partial<WebhookConfig>): any {
    const result: any = {};
    
    if (data.name !== undefined) result.name = data.name;
    if (data.description !== undefined) result.description = data.description;
    if (data.securityToken !== undefined) result.security_token = data.securityToken;
    if (data.isActive !== undefined) result.is_active = data.isActive;
    
    if (data.notificationPreferences) {
      result.notification_preferences = {
        email: data.notificationPreferences.email,
        browser: data.notificationPreferences.browser,
        on_success: data.notificationPreferences.onSuccess,
        on_failure: data.notificationPreferences.onFailure,
      };
    }
    
    return result;
  }
  
  /**
   * Get all webhook configurations
   */
  async getAll(): Promise<WebhookConfig[]> {
    try {
      const { data, error } = await supabase
        .from(DB_TABLES.WEBHOOKS)
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        errorService.logError('SupabaseWebhookRepository.getAll', error);
        throw new Error('Failed to fetch webhooks');
      }
      
      this.webhooks = data.map(this.mapToWebhookConfig);
      return this.webhooks;
    } catch (error) {
      errorService.logError('SupabaseWebhookRepository.getAll', error);
      throw new Error('Failed to fetch webhooks');
    }
  }
  
  /**
   * Get a webhook configuration by ID
   */
  async getById(id: string): Promise<WebhookConfig | null> {
    try {
      const { data, error } = await supabase
        .from(DB_TABLES.WEBHOOKS)
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        errorService.logError('SupabaseWebhookRepository.getById', error);
        throw new Error(`Failed to fetch webhook with ID ${id}`);
      }
      
      return this.mapToWebhookConfig(data);
    } catch (error) {
      errorService.logError('SupabaseWebhookRepository.getById', error, { id });
      throw new Error(`Failed to fetch webhook with ID ${id}`);
    }
  }
  
  /**
   * Create a new webhook configuration
   */
  async create(data: CreateWebhookConfigData): Promise<WebhookConfig> {
    try {
      const id = crypto.randomUUID();
      const webhookUrl = `${WEBHOOK_CONFIG.baseUrl}/${id}`;
      
      const record = {
        id,
        name: data.name,
        description: data.description,
        webhook_url: webhookUrl,
        security_token: data.securityToken,
        notification_preferences: {
          email: data.notificationPreferences.email,
          browser: data.notificationPreferences.browser,
          on_success: data.notificationPreferences.onSuccess,
          on_failure: data.notificationPreferences.onFailure,
        },
        is_active: data.isActive,
      };
      
      const { data: newRecord, error } = await supabase
        .from(DB_TABLES.WEBHOOKS)
        .insert(record)
        .select('*')
        .single();
        
      if (error) {
        errorService.logError('SupabaseWebhookRepository.create', error, { data });
        throw new Error('Failed to create webhook');
      }
      
      const webhook = this.mapToWebhookConfig(newRecord);
      await this.refreshWebhooks();
      return webhook;
    } catch (error) {
      errorService.logError('SupabaseWebhookRepository.create', error, { data });
      throw new Error('Failed to create webhook');
    }
  }
  
  /**
   * Update an existing webhook configuration
   */
  async update(id: string, data: UpdateWebhookConfigData): Promise<WebhookConfig> {
    try {
      const payload = {
        ...this.mapToSupabaseFormat(data),
        updated_at: new Date().toISOString()
      };
      
      const { data: updatedRecord, error } = await supabase
        .from(DB_TABLES.WEBHOOKS)
        .update(payload)
        .eq('id', id)
        .select('*')
        .single();
        
      if (error) {
        errorService.logError('SupabaseWebhookRepository.update', error, { id, data });
        throw new Error(`Failed to update webhook with ID ${id}`);
      }
      
      const webhook = this.mapToWebhookConfig(updatedRecord);
      await this.refreshWebhooks();
      return webhook;
    } catch (error) {
      errorService.logError('SupabaseWebhookRepository.update', error, { id, data });
      throw new Error(`Failed to update webhook with ID ${id}`);
    }
  }
  
  /**
   * Delete a webhook configuration
   */
  async delete(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from(DB_TABLES.WEBHOOKS)
        .delete()
        .eq('id', id);
        
      if (error) {
        errorService.logError('SupabaseWebhookRepository.delete', error, { id });
        throw new Error(`Failed to delete webhook with ID ${id}`);
      }
      
      await this.refreshWebhooks();
      return true;
    } catch (error) {
      errorService.logError('SupabaseWebhookRepository.delete', error, { id });
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
      
      const { data: updatedRecord, error } = await supabase
        .from(DB_TABLES.WEBHOOKS)
        .update({ 
          is_active: isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select('*')
        .single();
        
      if (error) {
        errorService.logError('SupabaseWebhookRepository.toggleActive', error, { id, isActive });
        throw new Error(`Failed to toggle webhook with ID ${id}`);
      }
      
      const webhook = this.mapToWebhookConfig(updatedRecord);
      await this.refreshWebhooks();
      return webhook;
    } catch (error) {
      errorService.logError('SupabaseWebhookRepository.toggleActive', error, { id, isActive });
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
    };
  }
}