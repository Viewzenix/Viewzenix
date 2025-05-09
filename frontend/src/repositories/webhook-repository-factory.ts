import { WebhookRepository } from './webhook.repository';
import { SupabaseWebhookRepository } from './supabase-webhook.repository';
import { RestApiWebhookRepository } from './rest-api-webhook.repository';
import { LocalStorageWebhookRepository } from './local-storage-webhook.repository';
import { isSupabaseAvailable } from '@/config/supabase.config';
import { isApiAvailable } from '@/services/api';
import { USE_API, FORCE_LOCAL_STORAGE } from '@/config/api.config';

/**
 * Factory for creating the appropriate WebhookRepository implementation
 * based on available backends and configuration
 */
export class WebhookRepositoryFactory {
  private static instance: WebhookRepository | null = null;
  private static repositoryType: 'supabase' | 'api' | 'localStorage' | null = null;
  
  /**
   * Get the appropriate WebhookRepository implementation
   */
  static async getRepository(): Promise<WebhookRepository> {
    // Return cached instance if available
    if (WebhookRepositoryFactory.instance) {
      return WebhookRepositoryFactory.instance;
    }
    
    // Force localStorage if configured
    if (FORCE_LOCAL_STORAGE) {
      WebhookRepositoryFactory.repositoryType = 'localStorage';
      WebhookRepositoryFactory.instance = new LocalStorageWebhookRepository();
      console.info('Using LocalStorage repository (forced)');
      return WebhookRepositoryFactory.instance;
    }
    
    // Try Supabase first
    try {
      const supabaseAvailable = await isSupabaseAvailable();
      if (supabaseAvailable) {
        WebhookRepositoryFactory.repositoryType = 'supabase';
        WebhookRepositoryFactory.instance = new SupabaseWebhookRepository();
        console.info('Using Supabase repository');
        return WebhookRepositoryFactory.instance;
      }
    } catch (error) {
      console.warn('Error checking Supabase availability:', error);
    }
    
    // Try REST API if configured
    if (USE_API) {
      try {
        const apiAvailable = await isApiAvailable();
        if (apiAvailable) {
          WebhookRepositoryFactory.repositoryType = 'api';
          WebhookRepositoryFactory.instance = new RestApiWebhookRepository();
          console.info('Using REST API repository');
          return WebhookRepositoryFactory.instance;
        }
      } catch (error) {
        console.warn('Error checking API availability:', error);
      }
    }
    
    // Fall back to localStorage
    WebhookRepositoryFactory.repositoryType = 'localStorage';
    WebhookRepositoryFactory.instance = new LocalStorageWebhookRepository();
    console.info('Using LocalStorage repository (fallback)');
    return WebhookRepositoryFactory.instance;
  }
  
  /**
   * Get the current repository type
   */
  static getRepositoryType(): 'supabase' | 'api' | 'localStorage' | null {
    return WebhookRepositoryFactory.repositoryType;
  }
  
  /**
   * Reset the repository instance (for testing or when configuration changes)
   */
  static resetRepository(): void {
    WebhookRepositoryFactory.instance = null;
    WebhookRepositoryFactory.repositoryType = null;
  }
}