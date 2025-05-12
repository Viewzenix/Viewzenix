'use client';

import { useMemo } from 'react';
import { 
  OrderRepository,
  TradeRepository,
  UserRepository,
  WebhookRepository 
} from '@/repositories/interfaces';
import { 
  createOrderRepository,
  createTradeRepository,
  createUserRepository,
  createWebhookRepository
} from '@/repositories/factories';

/**
 * Hook to get the webhook repository instance
 * 
 * @returns WebhookRepository instance
 */
export function useWebhookRepository(): WebhookRepository {
  return useMemo(() => createWebhookRepository(), []);
}

/**
 * Hook to get the trade repository instance
 * 
 * @returns TradeRepository instance
 */
export function useTradeRepository(): TradeRepository {
  return useMemo(() => createTradeRepository(), []);
}

/**
 * Hook to get the order repository instance
 * 
 * @returns OrderRepository instance
 */
export function useOrderRepository(): OrderRepository {
  return useMemo(() => createOrderRepository(), []);
}

/**
 * Hook to get the user repository instance
 * 
 * @returns UserRepository instance
 */
export function useUserRepository(): UserRepository {
  return useMemo(() => createUserRepository(), []);
}