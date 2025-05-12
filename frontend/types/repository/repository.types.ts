/**
 * Repository types for data access abstraction
 */

/**
 * Available repository implementation types
 */
export enum RepositoryType {
  SUPABASE = 'supabase',
  REST = 'rest',
  LOCAL_STORAGE = 'localStorage',
}

/**
 * Repository factory configuration options
 */
export interface RepositoryOptions {
  /**
   * Preferred repository type (if not specified, will use the default order)
   */
  preferredType?: RepositoryType;
  
  /**
   * Whether to use fallback mechanisms if preferred repository fails
   * @default true
   */
  useFallback?: boolean;
  
  /**
   * Order of fallback repositories (if not specified, will use the default order)
   * @default [SUPABASE, REST, LOCAL_STORAGE]
   */
  fallbackOrder?: RepositoryType[];
  
  /**
   * Cache TTL in milliseconds
   * @default 5 minutes
   */
  cacheTtl?: number;
}

/**
 * Repository operation result with data
 */
export interface RepositoryResult<T> {
  /**
   * Whether the operation was successful
   */
  success: boolean;
  
  /**
   * Data returned from the operation (if successful)
   */
  data?: T;
  
  /**
   * Error from the operation (if unsuccessful)
   */
  error?: Error;
  
  /**
   * Repository type that fulfilled the request
   */
  source?: RepositoryType;
}

/**
 * Repository operation result without data
 */
export interface RepositoryVoidResult {
  /**
   * Whether the operation was successful
   */
  success: boolean;
  
  /**
   * Error from the operation (if unsuccessful)
   */
  error?: Error;
  
  /**
   * Repository type that fulfilled the request
   */
  source?: RepositoryType;
}

/**
 * Standard pagination parameters for repository queries
 */
export interface PaginationParams {
  /**
   * Page number (1-based)
   * @default 1
   */
  page?: number;
  
  /**
   * Number of items per page
   * @default 20
   */
  limit?: number;
  
  /**
   * Field to sort by
   */
  sortBy?: string;
  
  /**
   * Sort direction
   * @default 'asc'
   */
  sortDirection?: 'asc' | 'desc';
}

/**
 * Standard filtering parameters for repository queries
 */
export interface FilterParams {
  [key: string]: any;
}

/**
 * Pagination result metadata
 */
export interface PaginationMeta {
  /**
   * Current page
   */
  currentPage: number;
  
  /**
   * Total number of pages
   */
  totalPages: number;
  
  /**
   * Total number of items
   */
  totalItems: number;
  
  /**
   * Number of items per page
   */
  itemsPerPage: number;
}

/**
 * Response with paginated data
 */
export interface PaginatedData<T> {
  /**
   * Items for the current page
   */
  items: T[];
  
  /**
   * Pagination metadata
   */
  meta: PaginationMeta;
}

/**
 * Available provider status
 */
export enum ProviderStatus {
  AVAILABLE = 'available',
  UNAVAILABLE = 'unavailable',
  RATE_LIMITED = 'rateLimited',
  UNAUTHORIZED = 'unauthorized',
  UNKNOWN = 'unknown',
}

/**
 * Provider health check result
 */
export interface ProviderHealth {
  /**
   * Provider type
   */
  type: RepositoryType;
  
  /**
   * Provider status
   */
  status: ProviderStatus;
  
  /**
   * Latency in milliseconds
   */
  latencyMs?: number;
  
  /**
   * Error message if applicable
   */
  errorMessage?: string;
  
  /**
   * Timestamp of the health check
   */
  timestamp: Date;
}