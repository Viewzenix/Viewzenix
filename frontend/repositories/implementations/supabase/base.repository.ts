import { createClient } from '@/utils/supabase/client';
import {
  FilterParams,
  PaginatedData,
  PaginationMeta,
  PaginationParams,
  RepositoryResult,
  RepositoryType,
  RepositoryVoidResult
} from '@/types';
import { notifyApiError } from '@/services/error/error.service';
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Base repository implementation for Supabase
 * Provides common functionality for Supabase repositories
 * 
 * @template T - Entity type
 * @template ID - ID type (string, number, etc.)
 */
export abstract class BaseSupabaseRepository<T, ID, CreateDTO = Partial<T>, UpdateDTO = Partial<T>> {
  /**
   * Supabase client instance
   */
  protected client: SupabaseClient;
  
  /**
   * Table name in Supabase
   */
  protected abstract tableName: string;
  
  /**
   * ID field name
   */
  protected idField: string = 'id';
  
  /**
   * Constructor
   */
  constructor() {
    this.client = createClient();
  }
  
  /**
   * Get all entities with pagination and filtering
   */
  public async findAll(
    paginationParams?: PaginationParams,
    filterParams?: FilterParams
  ): Promise<RepositoryResult<PaginatedData<T>>> {
    try {
      const { page = 1, limit = 20, sortBy, sortDirection = 'asc' } = paginationParams || {};
      
      // Start building the query
      let query = this.client
        .from(this.tableName)
        .select('*', { count: 'exact' });
      
      // Apply filtering
      if (filterParams) {
        Object.entries(filterParams).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            // Handle different types of filters
            if (typeof value === 'string' && value.includes('%')) {
              // Use LIKE for pattern matching with % wildcard
              query = query.ilike(key, value);
            } else if (Array.isArray(value)) {
              // Use IN for array values
              query = query.in(key, value);
            } else {
              // Use equality for other values
              query = query.eq(key, value);
            }
          }
        });
      }
      
      // Apply pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      
      // Apply sorting
      if (sortBy) {
        query = query.order(sortBy, { ascending: sortDirection === 'asc' });
      }
      
      // Execute the query with pagination
      const { data, error, count } = await query.range(from, to);
      
      if (error) {
        throw error;
      }
      
      // Create pagination metadata
      const totalItems = count || 0;
      const meta: PaginationMeta = {
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
        itemsPerPage: limit,
      };
      
      return {
        success: true,
        data: {
          items: data as T[],
          meta,
        },
        source: RepositoryType.SUPABASE,
      };
    } catch (error) {
      this.handleError('Error retrieving entities', error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error retrieving entities'),
        source: RepositoryType.SUPABASE,
      };
    }
  }
  
  /**
   * Get an entity by ID
   */
  public async findById(id: ID): Promise<RepositoryResult<T>> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq(this.idField, id)
        .single();
      
      if (error) {
        throw error;
      }
      
      if (!data) {
        throw new Error(`Entity with ID ${String(id)} not found`);
      }
      
      return {
        success: true,
        data: data as T,
        source: RepositoryType.SUPABASE,
      };
    } catch (error) {
      this.handleError(`Error retrieving entity with ID ${String(id)}`, error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error(`Unknown error retrieving entity with ID ${String(id)}`),
        source: RepositoryType.SUPABASE,
      };
    }
  }
  
  /**
   * Create a new entity
   */
  public async create(data: CreateDTO): Promise<RepositoryResult<T>> {
    try {
      const { data: createdData, error } = await this.client
        .from(this.tableName)
        .insert(this.prepareDataForCreate(data))
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      if (!createdData) {
        throw new Error('Failed to create entity: no data returned');
      }
      
      return {
        success: true,
        data: createdData as T,
        source: RepositoryType.SUPABASE,
      };
    } catch (error) {
      this.handleError('Error creating entity', error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error creating entity'),
        source: RepositoryType.SUPABASE,
      };
    }
  }
  
  /**
   * Update an existing entity
   */
  public async update(id: ID, data: UpdateDTO): Promise<RepositoryResult<T>> {
    try {
      const { data: updatedData, error } = await this.client
        .from(this.tableName)
        .update(this.prepareDataForUpdate(data))
        .eq(this.idField, id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      if (!updatedData) {
        throw new Error(`Failed to update entity with ID ${String(id)}: no data returned`);
      }
      
      return {
        success: true,
        data: updatedData as T,
        source: RepositoryType.SUPABASE,
      };
    } catch (error) {
      this.handleError(`Error updating entity with ID ${String(id)}`, error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error(`Unknown error updating entity with ID ${String(id)}`),
        source: RepositoryType.SUPABASE,
      };
    }
  }
  
  /**
   * Delete an entity by ID
   */
  public async delete(id: ID): Promise<RepositoryVoidResult> {
    try {
      const { error } = await this.client
        .from(this.tableName)
        .delete()
        .eq(this.idField, id);
      
      if (error) {
        throw error;
      }
      
      return {
        success: true,
        source: RepositoryType.SUPABASE,
      };
    } catch (error) {
      this.handleError(`Error deleting entity with ID ${String(id)}`, error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error(`Unknown error deleting entity with ID ${String(id)}`),
        source: RepositoryType.SUPABASE,
      };
    }
  }
  
  /**
   * Check if an entity exists
   */
  public async exists(id: ID): Promise<RepositoryResult<boolean>> {
    try {
      const { count, error } = await this.client
        .from(this.tableName)
        .select('*', { count: 'exact', head: true })
        .eq(this.idField, id);
      
      if (error) {
        throw error;
      }
      
      return {
        success: true,
        data: Boolean(count && count > 0),
        source: RepositoryType.SUPABASE,
      };
    } catch (error) {
      this.handleError(`Error checking if entity with ID ${String(id)} exists`, error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error(`Unknown error checking if entity with ID ${String(id)} exists`),
        source: RepositoryType.SUPABASE,
      };
    }
  }
  
  /**
   * Count entities
   */
  public async count(filterParams?: FilterParams): Promise<RepositoryResult<number>> {
    try {
      let query = this.client
        .from(this.tableName)
        .select('*', { count: 'exact', head: true });
      
      // Apply filtering
      if (filterParams) {
        Object.entries(filterParams).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (typeof value === 'string' && value.includes('%')) {
              query = query.ilike(key, value);
            } else if (Array.isArray(value)) {
              query = query.in(key, value);
            } else {
              query = query.eq(key, value);
            }
          }
        });
      }
      
      const { count, error } = await query;
      
      if (error) {
        throw error;
      }
      
      return {
        success: true,
        data: count || 0,
        source: RepositoryType.SUPABASE,
      };
    } catch (error) {
      this.handleError('Error counting entities', error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error counting entities'),
        source: RepositoryType.SUPABASE,
      };
    }
  }
  
  /**
   * Check repository health
   */
  public async healthCheck(): Promise<RepositoryResult<boolean>> {
    try {
      // Ping the Supabase instance by running a simple query
      const { error } = await this.client.from(this.tableName).select('*', { count: 'exact', head: true }).limit(1);
      
      return {
        success: true,
        data: !error,
        source: RepositoryType.SUPABASE,
      };
    } catch (error) {
      this.handleError('Error checking repository health', error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error checking repository health'),
        source: RepositoryType.SUPABASE,
      };
    }
  }
  
  /**
   * Handle and log errors
   */
  protected handleError(message: string, error: unknown): void {
    notifyApiError(message, error, { additionalData: { tableName: this.tableName } });
  }
  
  /**
   * Prepare data for create operation
   * This method can be overridden by subclasses to transform or validate data
   */
  protected prepareDataForCreate(data: CreateDTO): Record<string, unknown> {
    return data as Record<string, unknown>;
  }
  
  /**
   * Prepare data for update operation
   * This method can be overridden by subclasses to transform or validate data
   */
  protected prepareDataForUpdate(data: UpdateDTO): Record<string, unknown> {
    return data as Record<string, unknown>;
  }
  
  /**
   * Helper method to get the current user ID
   */
  protected async getCurrentUserId(): Promise<string | null> {
    const { data: { session } } = await this.client.auth.getSession();
    return session?.user?.id || null;
  }
}