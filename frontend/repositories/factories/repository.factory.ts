import { ProviderHealth, RepositoryOptions, RepositoryType } from '@/types/repository/repository.types';

/**
 * Base repository factory interface
 * @template T - Repository interface type
 */
export interface RepositoryFactory<T> {
  /**
   * Create a repository instance
   * 
   * @param options - Repository options
   * @returns Repository instance
   */
  create(options?: RepositoryOptions): T;
  
  /**
   * Get all available repository implementations
   * 
   * @returns Map of repository types to implementations
   */
  getAvailableRepositories(): Map<RepositoryType, T>;
  
  /**
   * Get a specific repository implementation
   * 
   * @param type - Repository type
   * @returns Repository implementation or undefined if not available
   */
  getRepository(type: RepositoryType): T | undefined;
  
  /**
   * Check the health of all repository implementations
   * 
   * @returns Promise with health status for each implementation
   */
  checkHealth(): Promise<ProviderHealth[]>;
}

/**
 * Abstract repository factory implementation
 * @template T - Repository interface type
 */
export abstract class AbstractRepositoryFactory<T> implements RepositoryFactory<T> {
  /**
   * Map of repository types to implementations
   */
  protected repositories: Map<RepositoryType, T> = new Map();
  
  /**
   * Default repository options
   */
  protected defaultOptions: RepositoryOptions = {
    useFallback: true,
    fallbackOrder: [
      RepositoryType.SUPABASE,
      RepositoryType.REST,
      RepositoryType.LOCAL_STORAGE,
    ],
    cacheTtl: 300000, // 5 minutes
  };
  
  /**
   * Create all available repository implementations
   * This method should be implemented by subclasses to register repositories
   */
  protected abstract createRepositories(): void;
  
  /**
   * Check if a repository type is available
   * 
   * @param type - Repository type
   * @returns True if available
   */
  protected hasRepository(type: RepositoryType): boolean {
    return this.repositories.has(type);
  }
  
  /**
   * Get a repository implementation
   * 
   * @param type - Repository type
   * @returns Repository implementation or undefined
   */
  public getRepository(type: RepositoryType): T | undefined {
    return this.repositories.get(type);
  }
  
  /**
   * Get all available repository implementations
   * 
   * @returns Map of repository types to implementations
   */
  public getAvailableRepositories(): Map<RepositoryType, T> {
    return this.repositories;
  }
  
  /**
   * Create a repository instance based on options
   * 
   * @param options - Repository options
   * @returns Repository instance
   * @throws Error if no repositories are available
   */
  public create(options?: RepositoryOptions): T {
    const mergedOptions = { ...this.defaultOptions, ...options };
    
    // If a preferred type is specified and available, use it
    if (mergedOptions.preferredType && this.hasRepository(mergedOptions.preferredType)) {
      return this.getRepository(mergedOptions.preferredType)!;
    }
    
    // Otherwise, use the first available repository from the fallback order
    for (const type of mergedOptions.fallbackOrder!) {
      if (this.hasRepository(type)) {
        return this.getRepository(type)!;
      }
    }
    
    // If no repositories are available, throw an error
    throw new Error('No repository implementations available');
  }
  
  /**
   * Check the health of all repositories
   * 
   * @returns Promise with health status
   */
  public async checkHealth(): Promise<ProviderHealth[]> {
    const results: ProviderHealth[] = [];
    
    for (const [type, repo] of this.repositories.entries()) {
      // Repository must implement healthCheck method
      const anyRepo = repo as any;
      
      if (typeof anyRepo.healthCheck === 'function') {
        try {
          const startTime = Date.now();
          const result = await anyRepo.healthCheck();
          const endTime = Date.now();
          
          results.push({
            type,
            status: result.success ? 'available' : 'unavailable',
            latencyMs: endTime - startTime,
            errorMessage: result.error?.message,
            timestamp: new Date(),
          });
        } catch (error) {
          results.push({
            type,
            status: 'unavailable',
            errorMessage: (error as Error).message,
            timestamp: new Date(),
          });
        }
      }
    }
    
    return results;
  }
}