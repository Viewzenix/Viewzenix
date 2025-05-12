import {
  FilterParams,
  PaginatedData,
  PaginationParams,
  RepositoryResult,
  RepositoryVoidResult
} from '@/types/repository/repository.types';

/**
 * Base repository interface with common CRUD operations
 * @template T - Entity type
 * @template ID - ID type (string, number, etc.)
 * @template CreateDTO - Data type for creating an entity
 * @template UpdateDTO - Data type for updating an entity
 */
export interface BaseRepository<T, ID, CreateDTO = Partial<T>, UpdateDTO = Partial<T>> {
  /**
   * Get all entities with optional pagination and filtering
   *
   * @param paginationParams - Pagination parameters
   * @param filterParams - Filtering parameters
   * @returns Promise with the entities
   */
  findAll(
    paginationParams?: PaginationParams,
    filterParams?: FilterParams,
  ): Promise<RepositoryResult<PaginatedData<T>>>;

  /**
   * Get an entity by ID
   *
   * @param id - Entity ID
   * @returns Promise with the entity if found
   */
  findById(id: ID): Promise<RepositoryResult<T>>;

  /**
   * Create a new entity
   *
   * @param data - Entity data
   * @returns Promise with the created entity
   */
  create(data: CreateDTO): Promise<RepositoryResult<T>>;

  /**
   * Update an existing entity
   *
   * @param id - Entity ID
   * @param data - Updated entity data
   * @returns Promise with the updated entity
   */
  update(id: ID, data: UpdateDTO): Promise<RepositoryResult<T>>;

  /**
   * Delete an entity by ID
   *
   * @param id - Entity ID
   * @returns Promise with void result
   */
  delete(id: ID): Promise<RepositoryVoidResult>;

  /**
   * Check if an entity exists
   *
   * @param id - Entity ID
   * @returns Promise with boolean result
   */
  exists(id: ID): Promise<RepositoryResult<boolean>>;

  /**
   * Count all entities matching the filter
   *
   * @param filterParams - Filtering parameters
   * @returns Promise with the count
   */
  count(filterParams?: FilterParams): Promise<RepositoryResult<number>>;

  /**
   * Check the health of the repository
   * 
   * @returns Promise with boolean indicating if the repository is available
   */
  healthCheck(): Promise<RepositoryResult<boolean>>;
}