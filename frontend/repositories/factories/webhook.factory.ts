import { WebhookRepository } from '../interfaces/webhook.repository';
import { AbstractRepositoryFactory } from './repository.factory';
import { RepositoryType } from '@/types/repository/repository.types';
import { LocalStorageWebhookRepository } from '../implementations/local-storage/local-webhook.repository';

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
    
    // For now, Supabase and REST implementations are placeholders
    // In a real implementation, these would be actual implementations
    this.repositories.set(RepositoryType.SUPABASE, {} as WebhookRepository);
    this.repositories.set(RepositoryType.REST, {} as WebhookRepository);
    
    // Override the default fallback order to prioritize localStorage
    // for demonstration purposes
    this.defaultOptions.fallbackOrder = [
      RepositoryType.LOCAL_STORAGE,
      RepositoryType.SUPABASE,
      RepositoryType.REST,
    ];
  }
}

/**
 * Helper function to get a webhook repository
 */
export function getWebhookRepository(): WebhookRepository {
  return WebhookRepositoryFactory.getInstance().create();
}