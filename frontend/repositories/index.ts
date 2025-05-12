/**
 * Export repository interfaces and factories for easy consumption
 */

// Export interfaces
export * from './interfaces';

// Export factories
export * from './factories';

/**
 * Main entry points for getting repositories
 */
import { getWebhookRepository } from './factories/webhook.factory';
import { getTradeRepository, getOrderRepository } from './factories/trade.factory';
import { getUserRepository } from './factories/user.factory';

export {
  getWebhookRepository,
  getTradeRepository,
  getOrderRepository,
  getUserRepository,
};