/**
 * Webhook notification preferences
 */
export interface WebhookNotificationPreference {
  /** Send email notifications for webhook events */
  email: boolean;
  /** Send browser notifications for webhook events */
  browser: boolean;
  /** Send notifications on successful webhook execution */
  onSuccess: boolean;
  /** Send notifications on webhook execution failure */
  onFailure: boolean;
}

/**
 * Webhook configuration data
 */
export interface WebhookConfig {
  /** Unique identifier for the webhook configuration */
  id: string;
  /** User-friendly name for the webhook */
  name: string;
  /** Description of the webhook's purpose */
  description: string;
  /** Webhook endpoint URL provided to TradingView */
  webhookUrl: string;
  /** Security token/passphrase for webhook authentication */
  securityToken: string;
  /** Notification preferences for this webhook */
  notificationPreferences: WebhookNotificationPreference;
  /** Whether this webhook configuration is currently active */
  isActive: boolean;
  /** Creation timestamp */
  createdAt: string;
  /** Last update timestamp */
  updatedAt: string;
}

/**
 * Data required to create a new webhook configuration
 */
export type CreateWebhookConfigData = Omit<WebhookConfig, 'id' | 'webhookUrl' | 'createdAt' | 'updatedAt'>;

/**
 * Data required to update an existing webhook configuration
 */
export type UpdateWebhookConfigData = Partial<Omit<WebhookConfig, 'id' | 'webhookUrl' | 'createdAt' | 'updatedAt'>>;

/**
 * Response from webhook creation API
 */
export interface CreateWebhookResponse {
  /** The created webhook configuration */
  webhook: WebhookConfig;
  /** Success status */
  success: boolean;
}

/**
 * Response from webhook update API
 */
export interface UpdateWebhookResponse {
  /** The updated webhook configuration */
  webhook: WebhookConfig;
  /** Success status */
  success: boolean;
}

/**
 * Response from webhook deletion API
 */
export interface DeleteWebhookResponse {
  /** ID of the deleted webhook */
  id: string;
  /** Success status */
  success: boolean;
}