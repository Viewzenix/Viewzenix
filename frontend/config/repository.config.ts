import { RepositoryType } from '@/types';

/**
 * Repository mode configuration
 * 
 * This determines which repository implementation to use.
 * Options:
 * - 'supabase': Use Supabase for data storage (default for production)
 * - 'local-storage': Use localStorage for data storage (for development/testing)
 * - 'rest': Use REST API for data storage (fallback)
 */
export const REPOSITORY_MODE = (process.env.NEXT_PUBLIC_REPOSITORY_MODE || 'supabase') as RepositoryType;

/**
 * Repository fallback order configuration
 * 
 * This determines the order in which to try different repository implementations
 * if the preferred repository is not available.
 */
export const REPOSITORY_FALLBACK_ORDER: RepositoryType[] = [
  RepositoryType.SUPABASE,
  RepositoryType.REST,
  RepositoryType.LOCAL_STORAGE,
];

/**
 * Helper to determine if we should use Supabase
 */
export const isSupabaseMode = () => REPOSITORY_MODE === RepositoryType.SUPABASE;

/**
 * Helper to determine if we should use localStorage
 */
export const isLocalStorageMode = () => REPOSITORY_MODE === RepositoryType.LOCAL_STORAGE;

/**
 * Helper to determine if we should use REST
 */
export const isRestMode = () => REPOSITORY_MODE === RepositoryType.REST;

/**
 * Repository configuration options
 */
export const REPOSITORY_CONFIG = {
  /**
   * Whether to use fallback repositories if the preferred repository is not available
   */
  useFallback: true,
  
  /**
   * Cache time-to-live in milliseconds (5 minutes)
   */
  cacheTtl: 5 * 60 * 1000,
  
  /**
   * Preferred repository type
   */
  preferredType: REPOSITORY_MODE,
  
  /**
   * Fallback order
   */
  fallbackOrder: REPOSITORY_FALLBACK_ORDER,
};