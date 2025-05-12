import { BaseSupabaseRepository } from './base.repository';
import { OrderRepository } from '@/repositories/interfaces/trade.repository';
import { Order, OrderStatus } from '@/types/order.types';
import { RepositoryResult, RepositoryType } from '@/types';

/**
 * Supabase implementation of OrderRepository
 */
export class SupabaseOrderRepository extends BaseSupabaseRepository<Order, string> implements OrderRepository {
  /**
   * Table name in Supabase
   */
  protected tableName = 'orders';
  
  /**
   * Table name for order status in Supabase
   */
  private orderStatusTable = 'order_statuses';
  
  /**
   * Find all orders for the current user
   */
  public async findAllForCurrentUser(): Promise<RepositoryResult<Order[]>> {
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
        data: data as Order[],
        source: RepositoryType.SUPABASE,
      };
    } catch (error) {
      this.handleError('Error retrieving orders for current user', error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error retrieving orders'),
        source: RepositoryType.SUPABASE,
      };
    }
  }
  
  /**
   * Find orders by symbol
   */
  public async findBySymbol(symbol: string): Promise<RepositoryResult<Order[]>> {
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
        data: data as Order[],
        source: RepositoryType.SUPABASE,
      };
    } catch (error) {
      this.handleError(`Error finding orders for symbol: ${symbol}`, error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error(`Unknown error finding orders for symbol: ${symbol}`),
        source: RepositoryType.SUPABASE,
      };
    }
  }
  
  /**
   * Find orders by trade ID
   */
  public async findByTradeId(tradeId: string): Promise<RepositoryResult<Order[]>> {
    try {
      const userId = await this.getCurrentUserId();
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('userId', userId)
        .eq('tradeId', tradeId)
        .order('createdAt', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return {
        success: true,
        data: data as Order[],
        source: RepositoryType.SUPABASE,
      };
    } catch (error) {
      this.handleError(`Error finding orders for trade ID: ${tradeId}`, error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error(`Unknown error finding orders for trade ID: ${tradeId}`),
        source: RepositoryType.SUPABASE,
      };
    }
  }
  
  /**
   * Get order status
   */
  public async getOrderStatus(orderId: string): Promise<RepositoryResult<OrderStatus>> {
    try {
      const { data, error } = await this.client
        .from(this.orderStatusTable)
        .select('*')
        .eq('orderId', orderId)
        .order('updatedAt', { ascending: false })
        .limit(1)
        .single();
      
      if (error) {
        throw error;
      }
      
      if (!data) {
        throw new Error(`Order status not found for order ID: ${orderId}`);
      }
      
      return {
        success: true,
        data: data as OrderStatus,
        source: RepositoryType.SUPABASE,
      };
    } catch (error) {
      this.handleError(`Error retrieving order status for order ID: ${orderId}`, error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error(`Unknown error retrieving order status for order ID: ${orderId}`),
        source: RepositoryType.SUPABASE,
      };
    }
  }
  
  /**
   * Cancel an open order
   */
  public async cancelOrder(orderId: string): Promise<RepositoryResult<Order>> {
    try {
      const userId = await this.getCurrentUserId();
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      // First, check if the order exists and belongs to the user
      const { data: orderData, error: orderError } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('id', orderId)
        .eq('userId', userId)
        .single();
      
      if (orderError) {
        throw orderError;
      }
      
      if (!orderData) {
        throw new Error(`Order with ID ${orderId} not found or does not belong to the current user`);
      }
      
      // Call the cancel order function
      // Note: This would typically be a custom Supabase Edge Function
      const { data, error } = await this.client.functions.invoke('cancel-order', {
        body: { orderId },
      });
      
      if (error) {
        throw error;
      }
      
      // Get the updated order
      const { data: updatedOrder, error: getError } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('id', orderId)
        .single();
      
      if (getError) {
        throw getError;
      }
      
      if (!updatedOrder) {
        throw new Error(`Failed to retrieve updated order after cancellation`);
      }
      
      return {
        success: true,
        data: updatedOrder as Order,
        source: RepositoryType.SUPABASE,
      };
    } catch (error) {
      this.handleError(`Error cancelling order with ID: ${orderId}`, error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error(`Unknown error cancelling order with ID: ${orderId}`),
        source: RepositoryType.SUPABASE,
      };
    }
  }
}