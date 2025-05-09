/**
 * WebhookService integration tests
 * 
 * These tests verify that the WebhookService correctly:
 * 1. Integrates with the backend API
 * 2. Falls back to localStorage when the API is unavailable
 * 3. Handles various error scenarios appropriately
 */

import { webhookService } from '../webhook.service';
import * as apiModule from '../api';
import { WebhookConfig } from '@/types/webhook';

// Mock the API module
jest.mock('../api', () => {
  const originalModule = jest.requireActual('../api');
  return {
    ...originalModule,
    USE_API: true,
    FORCE_LOCAL_STORAGE: false,
    webhookApi: {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    isApiAvailable: jest.fn().mockResolvedValue(true),
    ApiError: originalModule.ApiError,
  };
});

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] ?? null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('WebhookService', () => {
  // Sample webhook data for testing
  const sampleWebhook: WebhookConfig = {
    id: '123',
    name: 'Test Webhook',
    description: 'Test description',
    webhookUrl: 'https://api.viewzenix.com/webhook/123',
    securityToken: 'test-token',
    notificationPreferences: {
      email: true,
      browser: true,
      onSuccess: true,
      onFailure: true,
    },
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  };

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    localStorageMock.clear();
    
    // Reset API available status
    (apiModule.isApiAvailable as jest.Mock).mockResolvedValue(true);

    // Mock default API responses
    (apiModule.webhookApi.getAll as jest.Mock).mockResolvedValue([sampleWebhook]);
    (apiModule.webhookApi.getById as jest.Mock).mockResolvedValue(sampleWebhook);
    (apiModule.webhookApi.create as jest.Mock).mockResolvedValue({
      status: 'success',
      message: 'Webhook configuration created successfully',
      data: {
        webhook: sampleWebhook,
        success: true,
      },
    });
    (apiModule.webhookApi.update as jest.Mock).mockResolvedValue({
      status: 'success',
      message: 'Webhook configuration updated successfully',
      data: {
        webhook: { ...sampleWebhook, name: 'Updated Webhook' },
        success: true,
      },
    });
    (apiModule.webhookApi.delete as jest.Mock).mockResolvedValue({
      status: 'success',
      message: 'Webhook configuration deleted successfully',
      data: {
        id: '123',
        success: true,
      },
    });
  });

  describe('API Integration', () => {
    it('should get webhooks from API when available', async () => {
      // Set the service to use API
      (apiModule.USE_API as boolean) = true;
      (apiModule.FORCE_LOCAL_STORAGE as boolean) = false;
      
      // Wait for API availability check
      await webhookService.checkApiAvailability();
      
      // Get webhooks
      const result = await webhookService.getWebhooks();
      
      // Verify API was called
      expect(apiModule.webhookApi.getAll).toHaveBeenCalled();
      expect(result).toEqual([sampleWebhook]);
    });

    it('should get webhook by ID from API when available', async () => {
      // Set the service to use API
      (apiModule.USE_API as boolean) = true;
      (apiModule.FORCE_LOCAL_STORAGE as boolean) = false;
      
      // Wait for API availability check
      await webhookService.checkApiAvailability();
      
      // Get webhook by ID
      const result = await webhookService.getWebhookById('123');
      
      // Verify API was called
      expect(apiModule.webhookApi.getById).toHaveBeenCalledWith('123');
      expect(result).toEqual(sampleWebhook);
    });

    it('should create webhook via API when available', async () => {
      // Set the service to use API
      (apiModule.USE_API as boolean) = true;
      (apiModule.FORCE_LOCAL_STORAGE as boolean) = false;
      
      // Wait for API availability check
      await webhookService.checkApiAvailability();
      
      // Create webhook data
      const webhookData = {
        name: 'New Webhook',
        description: 'New webhook description',
        securityToken: 'new-token',
        notificationPreferences: {
          email: false,
          browser: true,
          onSuccess: true,
          onFailure: true,
        },
        isActive: true,
      };
      
      // Create webhook
      const result = await webhookService.createWebhook(webhookData);
      
      // Verify API was called
      expect(apiModule.webhookApi.create).toHaveBeenCalledWith(webhookData);
      expect(result.status).toBe('success');
      expect(result.data.success).toBe(true);
    });
  });

  describe('localStorage Fallback', () => {
    it('should fall back to localStorage when API is not available', async () => {
      // Set the service to use API but mark it as unavailable
      (apiModule.USE_API as boolean) = true;
      (apiModule.FORCE_LOCAL_STORAGE as boolean) = false;
      (apiModule.isApiAvailable as jest.Mock).mockResolvedValue(false);
      
      // Wait for API availability check
      await webhookService.checkApiAvailability();
      
      // Get webhooks
      await webhookService.getWebhooks();
      
      // Verify API was not called
      expect(apiModule.webhookApi.getAll).not.toHaveBeenCalled();
      
      // Verify localStorage was accessed
      expect(localStorageMock.getItem).toHaveBeenCalled();
    });

    it('should fall back to localStorage when API call fails', async () => {
      // Set the service to use API
      (apiModule.USE_API as boolean) = true;
      (apiModule.FORCE_LOCAL_STORAGE as boolean) = false;
      
      // Make the API call fail
      (apiModule.webhookApi.getAll as jest.Mock).mockRejectedValue(new Error('API error'));
      
      // Wait for API availability check
      await webhookService.checkApiAvailability();
      
      // Get webhooks
      await webhookService.getWebhooks();
      
      // Verify API was called but failed
      expect(apiModule.webhookApi.getAll).toHaveBeenCalled();
      
      // Verify localStorage was accessed as fallback
      expect(localStorageMock.getItem).toHaveBeenCalled();
    });

    it('should use localStorage when FORCE_LOCAL_STORAGE is true', async () => {
      // Set the service to use API but force localStorage
      (apiModule.USE_API as boolean) = true;
      (apiModule.FORCE_LOCAL_STORAGE as boolean) = true;
      
      // Wait for API availability check
      await webhookService.checkApiAvailability();
      
      // Get webhooks
      await webhookService.getWebhooks();
      
      // Verify API was not called
      expect(apiModule.webhookApi.getAll).not.toHaveBeenCalled();
      
      // Verify localStorage was accessed
      expect(localStorageMock.getItem).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 errors when getting webhook by ID', async () => {
      // Set the service to use API
      (apiModule.USE_API as boolean) = true;
      (apiModule.FORCE_LOCAL_STORAGE as boolean) = false;
      
      // Make the API call return 404
      (apiModule.webhookApi.getById as jest.Mock).mockRejectedValue(
        new apiModule.ApiError(404, 'Webhook not found', 'NOT_FOUND')
      );
      
      // Wait for API availability check
      await webhookService.checkApiAvailability();
      
      // Get webhook by ID should return null for 404
      const result = await webhookService.getWebhookById('123');
      expect(result).toBeNull();
    });

    it('should handle validation errors when creating webhook', async () => {
      // Set the service to use API
      (apiModule.USE_API as boolean) = true;
      (apiModule.FORCE_LOCAL_STORAGE as boolean) = false;
      
      // Wait for API availability check
      await webhookService.checkApiAvailability();
      
      // Creating webhook with missing required fields should throw error
      await expect(webhookService.createWebhook({} as any)).rejects.toThrow('Webhook name is required');
      
      // Verify API was not called due to validation
      expect(apiModule.webhookApi.create).not.toHaveBeenCalled();
    });
  });
}); 