import { useState, useEffect, useCallback } from 'react';
import { WebhookConfig, CreateWebhookConfigData, UpdateWebhookConfigData } from '@/types/webhook';
import { WebhookRepositoryFactory } from '@/repositories/webhook-repository-factory';
import { WebhookRepository } from '@/repositories/webhook.repository';
import { errorService } from '@/services/error';

/**
 * Data source type for webhooks
 */
export type WebhookDataSource = 'supabase' | 'api' | 'localStorage' | 'unknown';

/**
 * Hook for interacting with webhook data
 */
export function useWebhooks() {
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [repository, setRepository] = useState<WebhookRepository | null>(null);
  const [dataSource, setDataSource] = useState<WebhookDataSource>('unknown');
  
  /**
   * Initialize the repository
   */
  useEffect(() => {
    const initRepository = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const repo = await WebhookRepositoryFactory.getRepository();
        setRepository(repo);
        
        // Set data source
        const repoType = WebhookRepositoryFactory.getRepositoryType();
        setDataSource(repoType || 'unknown');
        
        // Load initial data
        const data = await repo.getAll();
        setWebhooks(data);
        
        setLoading(false);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to initialize webhook repository');
        setError(error);
        setLoading(false);
        errorService.logError('useWebhooks.initRepository', err);
      }
    };
    
    initRepository();
    
    // Cleanup
    return () => {
      // Any cleanup needed
    };
  }, []);
  
  /**
   * Subscribe to webhook changes
   */
  useEffect(() => {
    if (!repository) return;
    
    const unsubscribe = repository.subscribe((updatedWebhooks) => {
      setWebhooks(updatedWebhooks);
    });
    
    return () => {
      unsubscribe();
    };
  }, [repository]);
  
  /**
   * Refresh webhooks
   */
  const refreshWebhooks = useCallback(async () => {
    if (!repository) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const data = await repository.getAll();
      setWebhooks(data);
      
      setLoading(false);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to refresh webhooks');
      setError(error);
      setLoading(false);
      errorService.logError('useWebhooks.refreshWebhooks', err);
      errorService.showUserError('Failed to refresh webhooks');
    }
  }, [repository]);
  
  /**
   * Get a webhook by ID
   */
  const getWebhook = useCallback(async (id: string) => {
    if (!repository) return null;
    
    try {
      return await repository.getById(id);
    } catch (err) {
      errorService.logError('useWebhooks.getWebhook', err, { id });
      errorService.showUserError(`Failed to get webhook with ID ${id}`);
      return null;
    }
  }, [repository]);
  
  /**
   * Create a new webhook
   */
  const createWebhook = useCallback(async (data: CreateWebhookConfigData) => {
    if (!repository) throw new Error('Repository not initialized');
    
    try {
      setLoading(true);
      setError(null);
      
      const webhook = await repository.create(data);
      
      setLoading(false);
      return webhook;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create webhook');
      setError(error);
      setLoading(false);
      errorService.logError('useWebhooks.createWebhook', err, { data });
      errorService.showUserError('Failed to create webhook');
      throw error;
    }
  }, [repository]);
  
  /**
   * Update a webhook
   */
  const updateWebhook = useCallback(async (id: string, data: UpdateWebhookConfigData) => {
    if (!repository) throw new Error('Repository not initialized');
    
    try {
      setLoading(true);
      setError(null);
      
      const webhook = await repository.update(id, data);
      
      setLoading(false);
      return webhook;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(`Failed to update webhook with ID ${id}`);
      setError(error);
      setLoading(false);
      errorService.logError('useWebhooks.updateWebhook', err, { id, data });
      errorService.showUserError(`Failed to update webhook with ID ${id}`);
      throw error;
    }
  }, [repository]);
  
  /**
   * Delete a webhook
   */
  const deleteWebhook = useCallback(async (id: string) => {
    if (!repository) throw new Error('Repository not initialized');
    
    try {
      setLoading(true);
      setError(null);
      
      const success = await repository.delete(id);
      
      setLoading(false);
      return success;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(`Failed to delete webhook with ID ${id}`);
      setError(error);
      setLoading(false);
      errorService.logError('useWebhooks.deleteWebhook', err, { id });
      errorService.showUserError(`Failed to delete webhook with ID ${id}`);
      throw error;
    }
  }, [repository]);
  
  /**
   * Toggle webhook active status
   */
  const toggleWebhookActive = useCallback(async (id: string, isActive?: boolean) => {
    if (!repository) throw new Error('Repository not initialized');
    
    try {
      setLoading(true);
      setError(null);
      
      const webhook = await repository.toggleActive(id, isActive);
      
      setLoading(false);
      return webhook;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(`Failed to toggle webhook with ID ${id}`);
      setError(error);
      setLoading(false);
      errorService.logError('useWebhooks.toggleWebhookActive', err, { id, isActive });
      errorService.showUserError(`Failed to toggle webhook with ID ${id}`);
      throw error;
    }
  }, [repository]);
  
  return {
    webhooks,
    loading,
    error,
    dataSource,
    refreshWebhooks,
    getWebhook,
    createWebhook,
    updateWebhook,
    deleteWebhook,
    toggleWebhookActive,
  };
}