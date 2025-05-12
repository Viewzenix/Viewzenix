import { BaseSupabaseRepository } from './base.repository';
import { WebhookRepository } from '@/repositories/interfaces/webhook.repository';
import {
  CreateWebhookConfigDto,
  ToggleWebhookStatusDto,
  UpdateWebhookConfigDto,
  WebhookConfig
} from '@/types/webhook.types';
import { RepositoryResult, RepositoryType, RepositoryVoidResult } from '@/types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Supabase implementation of WebhookRepository
 */
export class SupabaseWebhookRepository extends BaseSupabaseRepository<
  WebhookConfig,
  string,
  CreateWebhookConfigDto,
  UpdateWebhookConfigDto
> implements WebhookRepository {
  /**
   * Table name in Supabase
   */
  protected tableName = 'webhook_configs';
  
  /**
   * Webhook base URL for generating webhook URLs
   */
  private webhookBaseUrl = process.env.NEXT_PUBLIC_WEBHOOK_BASE_URL || 'https://api.viewzenix.com/webhook/';
  
  /**
   * Find all webhook configurations for the current user
   */
  public async findAllForCurrentUser(): Promise<RepositoryResult<WebhookConfig[]>> {
    try {
      const userId = await this.getCurrentUserId();
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('userId', userId)
        .order('createdAt', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return {
        success: true,
        data: data as WebhookConfig[],
        source: RepositoryType.SUPABASE,
      };
    } catch (error) {
      this.handleError('Error retrieving webhook configurations for current user', error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error retrieving webhook configurations'),
        source: RepositoryType.SUPABASE,
      };
    }
  }
  
  /**
   * Toggle the active status of a webhook configuration
   */
  public async toggleStatus(id: string, data: ToggleWebhookStatusDto): Promise<RepositoryResult<WebhookConfig>> {
    try {
      const { data: updatedData, error } = await this.client
        .from(this.tableName)
        .update({ isActive: data.isActive, updatedAt: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      if (!updatedData) {
        throw new Error(`Failed to toggle status for webhook with ID ${id}`);
      }
      
      return {
        success: true,
        data: updatedData as WebhookConfig,
        source: RepositoryType.SUPABASE,
      };
    } catch (error) {
      this.handleError(`Error toggling webhook status for ID ${id}`, error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error(`Unknown error toggling webhook status for ID ${id}`),
        source: RepositoryType.SUPABASE,
      };
    }
  }
  
  /**
   * Generate a secure token for a webhook configuration
   */
  public async generateSecureToken(): Promise<RepositoryResult<string>> {
    try {
      // Generate a UUID and remove hyphens for a secure token
      const token = uuidv4().replace(/-/g, '');
      
      return {
        success: true,
        data: token,
        source: RepositoryType.SUPABASE,
      };
    } catch (error) {
      this.handleError('Error generating secure token', error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error generating secure token'),
        source: RepositoryType.SUPABASE,
      };
    }
  }
  
  /**
   * Test a webhook configuration by sending a test signal
   */
  public async testWebhook(id: string): Promise<RepositoryResult<{ success: boolean; message: string }>> {
    try {
      // First, get the webhook to ensure it exists and get its details
      const { data: webhook, error: getError } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();
      
      if (getError) {
        throw getError;
      }
      
      if (!webhook) {
        throw new Error(`Webhook with ID ${id} not found`);
      }
      
      // Call the test webhook endpoint using Supabase functions
      // Note: This would typically be a custom Supabase Edge Function
      const { data, error } = await this.client.functions.invoke('test-webhook', {
        body: { webhookId: id },
      });
      
      if (error) {
        throw error;
      }
      
      return {
        success: true,
        data: {
          success: true,
          message: data?.message || `Test signal sent successfully to webhook ${webhook.name}`,
        },
        source: RepositoryType.SUPABASE,
      };
    } catch (error) {
      this.handleError(`Error testing webhook with ID ${id}`, error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error(`Unknown error testing webhook with ID ${id}`),
        source: RepositoryType.SUPABASE,
      };
    }
  }
  
  /**
   * Batch delete multiple webhook configurations
   */
  public async batchDelete(ids: string[]): Promise<RepositoryVoidResult> {
    try {
      const { error } = await this.client
        .from(this.tableName)
        .delete()
        .in('id', ids);
      
      if (error) {
        throw error;
      }
      
      return {
        success: true,
        source: RepositoryType.SUPABASE,
      };
    } catch (error) {
      this.handleError(`Error batch deleting webhooks with IDs: ${ids.join(', ')}`, error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error(`Unknown error batch deleting webhooks`),
        source: RepositoryType.SUPABASE,
      };
    }
  }
  
  /**
   * Find webhook configurations by name
   */
  public async findByName(name: string): Promise<RepositoryResult<WebhookConfig[]>> {
    try {
      const userId = await this.getCurrentUserId();
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('userId', userId)
        .ilike('name', `%${name}%`)
        .order('createdAt', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return {
        success: true,
        data: data as WebhookConfig[],
        source: RepositoryType.SUPABASE,
      };
    } catch (error) {
      this.handleError(`Error finding webhooks by name: ${name}`, error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error(`Unknown error finding webhooks by name`),
        source: RepositoryType.SUPABASE,
      };
    }
  }
  
  /**
   * Prepare data for create operation
   * Adds userId, webhookUrl, and timestamps
   */
  protected async prepareDataForCreate(data: CreateWebhookConfigDto): Promise<Record<string, unknown>> {
    const userId = await this.getCurrentUserId();
    
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    const now = new Date().toISOString();
    const id = uuidv4();
    
    return {
      ...data,
      id,
      userId,
      webhookUrl: `${this.webhookBaseUrl}${id}`,
      createdAt: now,
      updatedAt: now,
      notificationPreferences: {
        email: data.notificationPreferences?.email ?? false,
        browser: data.notificationPreferences?.browser ?? true,
        onSuccess: data.notificationPreferences?.onSuccess ?? false,
        onFailure: data.notificationPreferences?.onFailure ?? true,
      },
      isActive: data.isActive ?? true,
    };
  }
  
  /**
   * Prepare data for update operation
   * Adds updatedAt timestamp and handles nested notificationPreferences
   */
  protected prepareDataForUpdate(data: UpdateWebhookConfigDto): Record<string, unknown> {
    const result: Record<string, unknown> = {
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    // Handle nested notificationPreferences updates
    if (data.notificationPreferences) {
      result.notificationPreferences = data.notificationPreferences;
    }
    
    return result;
  }
}