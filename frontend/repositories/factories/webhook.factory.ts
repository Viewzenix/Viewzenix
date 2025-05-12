import { WebhookRepository } from '../interfaces/webhook.repository';
import { AbstractRepositoryFactory } from './repository.factory';
import { RepositoryType } from '@/types';
import { LocalStorageWebhookRepository } from '../implementations/local-storage/local-webhook.repository';
import { SupabaseWebhookRepository } from '../implementations/supabase/webhook.repository';
import { REPOSITORY_CONFIG } from '@/config/repository.config';

/**
 * Factory for creating WebhookRepository instances
 */
export class WebhookRepositoryFactory extends AbstractRepositoryFactory<WebhookRepository> {
  private static instance: WebhookRepositoryFactory;
  
  /**
   * Get the singleton instance
   */
  public static getInstance(): WebhookRepositoryFactory {
    if (!WebhookRepositoryFactory.instance) {
      WebhookRepositoryFactory.instance = new WebhookRepositoryFactory();
    }
    
    return WebhookRepositoryFactory.instance;
  }
  
  /**
   * Private constructor to prevent direct instantiation
   */
  private constructor() {
    super();
    this.createRepositories();
  }
  
  /**
   * Create all available repositories
   */
  protected createRepositories(): void {
    // Create the local storage implementation
    this.repositories.set(
      RepositoryType.LOCAL_STORAGE,
      new LocalStorageWebhookRepository()
    );
    
    // Create the Supabase implementation
    this.repositories.set(
      RepositoryType.SUPABASE,
      new SupabaseWebhookRepository()
    );
    
    // For now, REST implementation is a placeholder
    this.repositories.set(RepositoryType.REST, {} as WebhookRepository);
    
    // Set the default options from the repository config
    this.defaultOptions = REPOSITORY_CONFIG;
  }
}

/**
 * Helper function to get a webhook repository
 */
export function getWebhookRepository(): WebhookRepository {
  return WebhookRepositoryFactory.getInstance().create();
}