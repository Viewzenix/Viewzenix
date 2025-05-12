import { OrderRepository, TradeRepository } from '../interfaces/trade.repository';
import { AbstractRepositoryFactory } from './repository.factory';
import { RepositoryType } from '@/types';

/**
 * Factory for creating TradeRepository instances
 */
export class TradeRepositoryFactory extends AbstractRepositoryFactory<TradeRepository> {
  private static instance: TradeRepositoryFactory;
  
  /**
   * Get the singleton instance
   */
  public static getInstance(): TradeRepositoryFactory {
    if (!TradeRepositoryFactory.instance) {
      TradeRepositoryFactory.instance = new TradeRepositoryFactory();
    }
    
    return TradeRepositoryFactory.instance;
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
    // this.repositories.set(RepositoryType.SUPABASE, new SupabaseTradeRepository());
    // this.repositories.set(RepositoryType.REST, new RestTradeRepository());
    // this.repositories.set(RepositoryType.LOCAL_STORAGE, new LocalStorageTradeRepository());
    
    // For now, we'll just create placeholders to indicate the structure
    this.repositories.set(RepositoryType.SUPABASE, {} as TradeRepository);
    this.repositories.set(RepositoryType.REST, {} as TradeRepository);
    this.repositories.set(RepositoryType.LOCAL_STORAGE, {} as TradeRepository);
  }
}

/**
 * Factory for creating OrderRepository instances
 */
export class OrderRepositoryFactory extends AbstractRepositoryFactory<OrderRepository> {
  private static instance: OrderRepositoryFactory;
  
  /**
   * Get the singleton instance
   */
  public static getInstance(): OrderRepositoryFactory {
    if (!OrderRepositoryFactory.instance) {
      OrderRepositoryFactory.instance = new OrderRepositoryFactory();
    }
    
    return OrderRepositoryFactory.instance;
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
    // this.repositories.set(RepositoryType.SUPABASE, new SupabaseOrderRepository());
    // this.repositories.set(RepositoryType.REST, new RestOrderRepository());
    // this.repositories.set(RepositoryType.LOCAL_STORAGE, new LocalStorageOrderRepository());
    
    // For now, we'll just create placeholders to indicate the structure
    this.repositories.set(RepositoryType.SUPABASE, {} as OrderRepository);
    this.repositories.set(RepositoryType.REST, {} as OrderRepository);
    this.repositories.set(RepositoryType.LOCAL_STORAGE, {} as OrderRepository);
  }
}

/**
 * Helper function to get a trade repository
 */
export function getTradeRepository(): TradeRepository {
  return TradeRepositoryFactory.getInstance().create();
}

/**
 * Helper function to get an order repository
 */
export function getOrderRepository(): OrderRepository {
  return OrderRepositoryFactory.getInstance().create();
}