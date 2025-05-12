import { BaseRepository } from './base.repository';
import { Order, OrderStatus, Trade } from '@/types/trade.types';
import { RepositoryResult } from '@/types/repository/repository.types';

/**
 * Repository interface for trade data
 */
export interface TradeRepository extends BaseRepository<Trade, string> {
  /**
   * Find all trades for the current user
   * 
   * @returns Promise with trades
   */
  findAllForCurrentUser(): Promise<RepositoryResult<Trade[]>>;
  
  /**
   * Find trades by symbol
   * 
   * @param symbol - Trading symbol
   * @returns Promise with matching trades
   */
  findBySymbol(symbol: string): Promise<RepositoryResult<Trade[]>>;
  
  /**
   * Find trades by webhook configuration ID
   * 
   * @param webhookConfigId - Webhook configuration ID
   * @returns Promise with matching trades
   */
  findByWebhookConfigId(webhookConfigId: string): Promise<RepositoryResult<Trade[]>>;
  
  /**
   * Get trade statistics for the current user
   * 
   * @returns Promise with trade statistics
   */
  getTradeStatistics(): Promise<RepositoryResult<{
    totalTrades: number;
    successfulTrades: number;
    failedTrades: number;
    pendingTrades: number;
  }>>;
}

/**
 * Repository interface for order data
 */
export interface OrderRepository extends BaseRepository<Order, string> {
  /**
   * Find all orders for the current user
   * 
   * @returns Promise with orders
   */
  findAllForCurrentUser(): Promise<RepositoryResult<Order[]>>;
  
  /**
   * Find orders by symbol
   * 
   * @param symbol - Trading symbol
   * @returns Promise with matching orders
   */
  findBySymbol(symbol: string): Promise<RepositoryResult<Order[]>>;
  
  /**
   * Find orders by trade ID
   * 
   * @param tradeId - Trade ID
   * @returns Promise with matching orders
   */
  findByTradeId(tradeId: string): Promise<RepositoryResult<Order[]>>;
  
  /**
   * Get order status
   * 
   * @param orderId - Order ID
   * @returns Promise with order status
   */
  getOrderStatus(orderId: string): Promise<RepositoryResult<OrderStatus>>;
  
  /**
   * Cancel an open order
   * 
   * @param orderId - Order ID
   * @returns Promise with the cancelled order
   */
  cancelOrder(orderId: string): Promise<RepositoryResult<Order>>;
}