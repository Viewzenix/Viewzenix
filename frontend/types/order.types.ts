/**
 * Order type definitions
 * Re-exports Order and OrderStatus related types from trade.types
 */

import { 
  Order, 
  OrderStatus, 
  OrderSide, 
  OrderType, 
  TimeInForce 
} from './trade.types';

export { 
  Order, 
  OrderStatus, 
  OrderSide, 
  OrderType, 
  TimeInForce 
};

/**
 * Order creation data transfer object
 */
export interface CreateOrderDto {
  /**
   * Trading symbol
   */
  symbol: string;
  
  /**
   * Buy or sell
   */
  side: OrderSide;
  
  /**
   * Quantity to trade
   */
  quantity: number;
  
  /**
   * Order type
   */
  orderType: OrderType;
  
  /**
   * Price for limit orders
   */
  price?: number;
  
  /**
   * Stop price for stop orders
   */
  stopPrice?: number;
  
  /**
   * Time in force
   */
  timeInForce: TimeInForce;
  
  /**
   * Take profit price
   */
  takeProfitPrice?: number;
  
  /**
   * Stop loss price
   */
  stopLossPrice?: number;
  
  /**
   * Related trade ID
   */
  tradeId?: string;
}

/**
 * Order status update event
 */
export interface OrderStatusUpdate {
  /**
   * Order ID
   */
  orderId: string;
  
  /**
   * New status
   */
  status: string;
  
  /**
   * Updated filled quantity
   */
  filledQuantity: number;
  
  /**
   * Average fill price if available
   */
  averageFillPrice?: number;
  
  /**
   * Error message if any
   */
  errorMessage?: string;
  
  /**
   * Update timestamp
   */
  timestamp: string;
}