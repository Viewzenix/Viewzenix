/**
 * Trade and order type definitions
 */

/**
 * Trading side (buy or sell)
 */
export enum OrderSide {
  BUY = 'BUY',
  SELL = 'SELL',
}

/**
 * Asset class types
 */
export enum AssetClass {
  STOCK = 'STOCK',
  CRYPTO = 'CRYPTO',
  FOREX = 'FOREX',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Order types
 */
export enum OrderType {
  MARKET = 'MARKET',
  LIMIT = 'LIMIT',
  STOP = 'STOP',
  STOP_LIMIT = 'STOP_LIMIT',
}

/**
 * Time in force options
 */
export enum TimeInForce {
  DAY = 'DAY',
  GTC = 'GTC', // Good 'til canceled
  IOC = 'IOC', // Immediate or cancel
  FOK = 'FOK', // Fill or kill
}

/**
 * Trade entity as received from TradingView webhook
 */
export interface Trade {
  /**
   * Trading symbol
   */
  symbol: string;
  
  /**
   * Buy or sell
   */
  side: OrderSide;
  
  /**
   * Asset class
   */
  assetClass: AssetClass;
  
  /**
   * Order type
   */
  orderType: OrderType;
  
  /**
   * Quantity to trade
   */
  quantity?: number;
  
  /**
   * Price for limit orders
   */
  price?: number;
  
  /**
   * Stop price for stop orders
   */
  stopPrice?: number;
  
  /**
   * Take profit level
   */
  takeProfit?: number;
  
  /**
   * Stop loss level
   */
  stopLoss?: number;
  
  /**
   * Time in force
   */
  timeInForce: TimeInForce;
  
  /**
   * Webhook configuration ID that triggered this trade
   */
  webhookConfigId: string;
  
  /**
   * User ID who owns this trade
   */
  userId: string;
  
  /**
   * Creation timestamp
   */
  createdAt: string;
}

/**
 * Order entity as sent to the broker
 */
export interface Order {
  /**
   * Unique identifier for the order
   */
  id: string;
  
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
   * Client-generated order ID
   */
  clientOrderId: string;
  
  /**
   * Take profit price
   */
  takeProfitPrice?: number;
  
  /**
   * Stop loss price
   */
  stopLossPrice?: number;
  
  /**
   * Creation timestamp
   */
  createdAt: string;
  
  /**
   * Trade ID that generated this order
   */
  tradeId: string;
  
  /**
   * User ID who owns this order
   */
  userId: string;
}

/**
 * Order status entity
 */
export interface OrderStatus {
  /**
   * Broker or simulated order ID
   */
  orderId: string;
  
  /**
   * Status description
   */
  status: string;
  
  /**
   * Trading symbol
   */
  symbol: string;
  
  /**
   * Buy or sell
   */
  side: OrderSide;
  
  /**
   * Quantity submitted
   */
  quantity: number;
  
  /**
   * Quantity filled
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
   * Whether this is a simulated order
   */
  isSimulated: boolean;
  
  /**
   * Order ID
   */
  orderId2: string;
  
  /**
   * User ID
   */
  userId: string;
  
  /**
   * Update timestamp
   */
  updatedAt: string;
}