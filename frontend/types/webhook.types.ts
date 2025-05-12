/**
 * Webhook configuration type definitions
 */

/**
 * Notification preferences for webhook alerts
 */
export interface NotificationPreferences {
  /**
   * Whether to send email notifications
   */
  email: boolean;
  
  /**
   * Whether to send browser notifications
   */
  browser: boolean;
  
  /**
   * Whether to notify on successful webhook executions
   */
  onSuccess: boolean;
  
  /**
   * Whether to notify on failed webhook executions
   */
  onFailure: boolean;
}

/**
 * Webhook configuration entity
 */
export interface WebhookConfig {
  /**
   * Unique identifier for the webhook configuration
   */
  id: string;
  
  /**
   * User-friendly name for the webhook
   */
  name: string;
  
  /**
   * Optional description
   */
  description?: string;
  
  /**
   * Generated webhook URL to be used in TradingView
   */
  webhookUrl: string;
  
  /**
   * Security token for webhook validation
   */
  securityToken: string;
  
  /**
   * Notification preferences
   */
  notificationPreferences: NotificationPreferences;
  
  /**
   * Whether the webhook is active
   */
  isActive: boolean;
  
  /**
   * Creation timestamp
   */
  createdAt: string;
  
  /**
   * Last update timestamp
   */
  updatedAt: string;
  
  /**
   * Supabase user ID of the owner
   */
  userId: string;
}

/**
 * Data required to create a new webhook configuration
 */
export interface CreateWebhookConfigDto {
  /**
   * User-friendly name for the webhook
   */
  name: string;
  
  /**
   * Optional description
   */
  description?: string;
  
  /**
   * Security token for webhook validation
   */
  securityToken: string;
  
  /**
   * Notification preferences
   */
  notificationPreferences?: Partial<NotificationPreferences>;
  
  /**
   * Whether the webhook is active
   */
  isActive?: boolean;
}

/**
 * Data required to update an existing webhook configuration
 */
export interface UpdateWebhookConfigDto {
  /**
   * User-friendly name for the webhook
   */
  name?: string;
  
  /**
   * Optional description
   */
  description?: string;
  
  /**
   * Security token for webhook validation
   */
  securityToken?: string;
  
  /**
   * Notification preferences
   */
  notificationPreferences?: Partial<NotificationPreferences>;
  
  /**
   * Whether the webhook is active
   */
  isActive?: boolean;
}

/**
 * Toggle active status data
 */
export interface ToggleWebhookStatusDto {
  /**
   * Whether the webhook is active
   */
  isActive: boolean;
}