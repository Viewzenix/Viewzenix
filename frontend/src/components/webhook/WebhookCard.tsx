'use client'

import React, { useState, useCallback } from 'react';
import { WebhookConfig } from '@/types/webhook';
import { Button, StatusMessage } from '@/components/common';
import { webhookService } from '@/services/webhook.service';
import styles from './WebhookCard.module.css';

interface WebhookCardProps {
  webhook: WebhookConfig;
  onDelete: (id: string) => void;
  onEdit: (webhook: WebhookConfig) => void;
  onStatusChange?: (webhook: WebhookConfig) => void;
}

export function WebhookCard({ webhook, onDelete, onEdit, onStatusChange }: WebhookCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle keyboard events for accessibility
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggleActive();
    }
  }, []);

  // Toggle active status
  const handleToggleActive = useCallback(async () => {
    if (!webhook || !webhook.id) {
      setError('Invalid webhook configuration');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Use the correct method name that exists in the service
      const updatedWebhook = await webhookService.toggleWebhookActive(webhook.id, !webhook.isActive);
      
      // Use callback if provided, otherwise fallback to page reload
      if (onStatusChange) {
        onStatusChange(updatedWebhook);
      } else {
        // Fallback to reload for backwards compatibility
        if (typeof window !== 'undefined') {
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      }
    } catch (err) {
      console.error('Error toggling webhook status:', err);
      setError(err instanceof Error ? err.message : 'Failed to update webhook status');
    } finally {
      setIsLoading(false);
    }
  }, [webhook, onStatusChange]);

  // Copy webhook URL to clipboard
  const copyToClipboard = useCallback(() => {
    if (typeof navigator !== 'undefined' && webhook?.webhookUrl) {
      navigator.clipboard.writeText(webhook.webhookUrl).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      });
    }
  }, [webhook]);

  // Format datetime
  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }, []);

  // Early return if webhook is undefined
  if (!webhook) {
    return null;
  }

  return (
    <div className={styles.card}>
      {error && (
        <StatusMessage 
          type="error" 
          message={error} 
          onDismiss={() => setError(null)}
        />
      )}
      
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <h3 className={styles.title}>{webhook.name}</h3>
          <div 
            className={`${styles.statusBadge} ${webhook.isActive ? styles.active : styles.inactive}`}
            onClick={handleToggleActive}
            onKeyDown={handleKeyDown}
            title={`Click to ${webhook.isActive ? 'deactivate' : 'activate'} webhook`}
            role="button"
            tabIndex={0}
            style={{ cursor: loading ? 'wait' : 'pointer' }}
            aria-label={`Webhook is ${webhook.isActive ? 'active' : 'inactive'}. Click to ${webhook.isActive ? 'deactivate' : 'activate'}.`}
          >
            {loading ? 'Updating...' : webhook.isActive ? 'Active' : 'Inactive'}
          </div>
        </div>
        
        <div className={styles.actions}>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? 'Show less' : 'Show more'}
          >
            {isExpanded ? 'Show Less' : 'Show More'}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onEdit(webhook)}
            aria-label="Edit webhook"
          >
            Edit
          </Button>
          <Button 
            variant="danger" 
            size="sm" 
            onClick={() => onDelete(webhook.id)}
            aria-label="Delete webhook"
          >
            Delete
          </Button>
        </div>
      </div>

      <div className={styles.description}>
        {webhook.description || 'No description provided'}
      </div>

      <div className={styles.urlContainer}>
        <div className={styles.urlLabel}>Webhook URL:</div>
        <div className={styles.urlWrapper}>
          <div className={styles.url} title={webhook.webhookUrl}>
            {webhook.webhookUrl}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={copyToClipboard}
            aria-label="Copy webhook URL"
          >
            {isCopied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className={styles.expandedContent}>
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Security Token</h4>
            <div className={styles.securityToken}>
              <span className={styles.tokenMask}>••••••••••••</span>
              {webhook.securityToken.substring(webhook.securityToken.length - 4)}
            </div>
          </div>
          
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Notification Preferences</h4>
            <div className={styles.preferencesGrid}>
              <div className={styles.preference}>
                <span className={styles.preferenceLabel}>Email:</span>
                <span className={webhook.notificationPreferences.email ? styles.enabled : styles.disabled}>
                  {webhook.notificationPreferences.email ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className={styles.preference}>
                <span className={styles.preferenceLabel}>Browser:</span>
                <span className={webhook.notificationPreferences.browser ? styles.enabled : styles.disabled}>
                  {webhook.notificationPreferences.browser ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className={styles.preference}>
                <span className={styles.preferenceLabel}>On Success:</span>
                <span className={webhook.notificationPreferences.onSuccess ? styles.enabled : styles.disabled}>
                  {webhook.notificationPreferences.onSuccess ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className={styles.preference}>
                <span className={styles.preferenceLabel}>On Failure:</span>
                <span className={webhook.notificationPreferences.onFailure ? styles.enabled : styles.disabled}>
                  {webhook.notificationPreferences.onFailure ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
          </div>
          
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Timestamps</h4>
            <div className={styles.timestamps}>
              <div>Created: {formatDate(webhook.createdAt)}</div>
              <div>Last Updated: {formatDate(webhook.updatedAt)}</div>
            </div>
          </div>
          
          <div className={styles.toggleContainer}>
            <Button 
              variant={webhook.isActive ? 'danger' : 'primary'} 
              size="sm"
              onClick={handleToggleActive}
              loading={loading}
              disabled={loading}
            >
              {webhook.isActive ? 'Disable Webhook' : 'Enable Webhook'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}