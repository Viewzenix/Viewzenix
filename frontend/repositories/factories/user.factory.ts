import { UserRepository } from '../interfaces/user.repository';
import { AbstractRepositoryFactory } from './repository.factory';
import { RepositoryType } from '@/types';

/**
 * Factory for creating UserRepository instances
 */
export class UserRepositoryFactory extends AbstractRepositoryFactory<UserRepository> {
  private static instance: UserRepositoryFactory;
  
  /**
   * Get the singleton instance
   */
  public static getInstance(): UserRepositoryFactory {
    if (!UserRepositoryFactory.instance) {
      UserRepositoryFactory.instance = new UserRepositoryFactory();
    }
    
    return UserRepositoryFactory.instance;
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
    // These repository implementations will be created later
    
    // Example of how implementations will be added:
    // this.repositories.set(RepositoryType.SUPABASE, new SupabaseUserRepository());
    // this.repositories.set(RepositoryType.REST, new RestUserRepository());
    // this.repositories.set(RepositoryType.LOCAL_STORAGE, new LocalStorageUserRepository());
    
    // For now, we'll just create placeholders to indicate the structure
    this.repositories.set(RepositoryType.SUPABASE, {} as UserRepository);
    this.repositories.set(RepositoryType.REST, {} as UserRepository);
    this.repositories.set(RepositoryType.LOCAL_STORAGE, {} as UserRepository);
  }
}

/**
 * Helper function to get a user repository
 */
export function getUserRepository(): UserRepository {
  return UserRepositoryFactory.getInstance().create();
}