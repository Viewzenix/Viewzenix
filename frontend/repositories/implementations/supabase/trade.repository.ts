import { BaseSupabaseRepository } from './base.repository';
import { TradeRepository } from '@/repositories/interfaces/trade.repository';
import { Trade } from '@/types/trade.types';
import { RepositoryResult, RepositoryType } from '@/types';

/**
 * Supabase implementation of TradeRepository
 */
export class SupabaseTradeRepository extends BaseSupabaseRepository<Trade, string> implements TradeRepository {
  /**
   * Table name in Supabase
   */
  protected tableName = 'trades';
  
  /**
   * Find all trades for the current user
   */
  public async findAllForCurrentUser(): Promise<RepositoryResult<Trade[]>> {
    try {
      const userId = await this.getCurrentUserId();
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('userId', userId)
        .order('createdAt', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return {
        success: true,
        data: data as Trade[],
        source: RepositoryType.SUPABASE,
      };
    } catch (error) {
      this.handleError('Error retrieving trades for current user', error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error retrieving trades'),
        source: RepositoryType.SUPABASE,
      };
    }
  }
  
  /**
   * Find trades by symbol
   */
  public async findBySymbol(symbol: string): Promise<RepositoryResult<Trade[]>> {
    try {
      const userId = await this.getCurrentUserId();
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('userId', userId)
        .eq('symbol', symbol)
        .order('createdAt', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return {
        success: true,
        data: data as Trade[],
        source: RepositoryType.SUPABASE,
      };
    } catch (error) {
      this.handleError(`Error finding trades for symbol: ${symbol}`, error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error(`Unknown error finding trades for symbol: ${symbol}`),
        source: RepositoryType.SUPABASE,
      };
    }
  }
  
  /**
   * Find trades by webhook configuration ID
   */
  public async findByWebhookConfigId(webhookConfigId: string): Promise<RepositoryResult<Trade[]>> {
    try {
      const userId = await this.getCurrentUserId();
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('userId', userId)
        .eq('webhookConfigId', webhookConfigId)
        .order('createdAt', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return {
        success: true,
        data: data as Trade[],
        source: RepositoryType.SUPABASE,
      };
    } catch (error) {
      this.handleError(`Error finding trades for webhook config ID: ${webhookConfigId}`, error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error(`Unknown error finding trades for webhook config ID: ${webhookConfigId}`),
        source: RepositoryType.SUPABASE,
      };
    }
  }
  
  /**
   * Get trade statistics for the current user
   */
  public async getTradeStatistics(): Promise<RepositoryResult<{
    totalTrades: number;
    successfulTrades: number;
    failedTrades: number;
    pendingTrades: number;
  }>> {
    try {
      const userId = await this.getCurrentUserId();
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      // Get all trades for the user
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('userId', userId);
      
      if (error) {
        throw error;
      }
      
      const trades = data as Trade[];
      const totalTrades = trades.length;
      
      // Calculate statistics
      // Note: The status field should be added to the Trade interface
      const successfulTrades = trades.filter(trade => (trade as any).status === 'completed').length;
      const failedTrades = trades.filter(trade => (trade as any).status === 'failed').length;
      const pendingTrades = trades.filter(trade => (trade as any).status === 'pending').length;
      
      return {
        success: true,
        data: {
          totalTrades,
          successfulTrades,
          failedTrades,
          pendingTrades,
        },
        source: RepositoryType.SUPABASE,
      };
    } catch (error) {
      this.handleError('Error retrieving trade statistics', error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error retrieving trade statistics'),
        source: RepositoryType.SUPABASE,
      };
    }
  }
}