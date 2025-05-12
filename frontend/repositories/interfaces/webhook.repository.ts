import { BaseRepository } from './base.repository';
import {
  CreateWebhookConfigDto,
  ToggleWebhookStatusDto,
  UpdateWebhookConfigDto,
  WebhookConfig
} from '@/types/webhook.types';
import { RepositoryResult, RepositoryVoidResult } from '@/types/repository/repository.types';

/**
 * Repository interface for webhook configurations
 */
export interface WebhookRepository extends BaseRepository<WebhookConfig, string, CreateWebhookConfigDto, UpdateWebhookConfigDto> {
  /**
   * Find all webhook configurations for the current user
   * 
   * @returns Promise with webhook configurations
   */
  findAllForCurrentUser(): Promise<RepositoryResult<WebhookConfig[]>>;
  
  /**
   * Toggle the active status of a webhook configuration
   * 
   * @param id - Webhook configuration ID
   * @param data - Toggle status data
   * @returns Promise with the updated webhook configuration
   */
  toggleStatus(id: string, data: ToggleWebhookStatusDto): Promise<RepositoryResult<WebhookConfig>>;
  
  /**
   * Generate a secure token for a webhook configuration
   * 
   * @returns Promise with the generated token
   */
  generateSecureToken(): Promise<RepositoryResult<string>>;
  
  /**
   * Test a webhook configuration by sending a test signal
   * 
   * @param id - Webhook configuration ID
   * @returns Promise with the test result
   */
  testWebhook(id: string): Promise<RepositoryResult<{ success: boolean; message: string }>>;
  
  /**
   * Batch delete multiple webhook configurations
   * 
   * @param ids - Array of webhook configuration IDs
   * @returns Promise with void result
   */
  batchDelete(ids: string[]): Promise<RepositoryVoidResult>;
  
  /**
   * Find webhook configurations by name
   * 
   * @param name - Name to search for
   * @returns Promise with matching webhook configurations
   */
  findByName(name: string): Promise<RepositoryResult<WebhookConfig[]>>;
}