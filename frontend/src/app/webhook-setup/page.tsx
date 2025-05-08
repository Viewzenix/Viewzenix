'use client'

import React, { useState, useEffect } from 'react'
import { WebhookConfigForm, WebhookCard } from '@/components/webhook'
import { webhookService } from '@/services/webhook.service'
import { WebhookConfig } from '@/types/webhook'
import { Button, StatusMessage } from '@/components/common'
import styles from './page.module.css'

export default function WebhookSetupPage() {
  // State for webhooks data
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for UI controls
  const [showForm, setShowForm] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<WebhookConfig | null>(null);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Fetch webhooks on component mount
  useEffect(() => {
    const fetchWebhooks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const webhooksData = await webhookService.getWebhooks();
        setWebhooks(webhooksData);
      } catch (err) {
        setError('Failed to load webhook configurations. Please try again later.');
        console.error('Error fetching webhooks:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWebhooks();
  }, []);

  // Handle webhook creation success
  const handleWebhookCreated = (webhook: WebhookConfig) => {
    setWebhooks(prevWebhooks => [...prevWebhooks, webhook]);
    setShowForm(false);
    setStatusMessage({
      type: 'success',
      message: 'Webhook configuration created successfully!'
    });
  };

  // Handle edit button click
  const handleEditWebhook = (webhook: WebhookConfig) => {
    setEditingWebhook(webhook);
    setShowForm(true);
  };

  // Handle webhook update success
  const handleWebhookUpdated = (updatedWebhook: WebhookConfig) => {
    setWebhooks(prevWebhooks => 
      prevWebhooks.map(webhook => 
        webhook.id === updatedWebhook.id ? updatedWebhook : webhook
      )
    );
    setEditingWebhook(null);
    setShowForm(false);
    setStatusMessage({
      type: 'success',
      message: 'Webhook configuration updated successfully!'
    });
  };

  // Handle cancel button click
  const handleCancelForm = () => {
    setShowForm(false);
    setEditingWebhook(null);
  };

  // Handle delete webhook
  const handleDeleteWebhook = async (id: string) => {
    // Simple confirmation
    if (!window.confirm('Are you sure you want to delete this webhook configuration?')) {
      return;
    }
    
    try {
      await webhookService.deleteWebhook(id);
      
      // Update state by removing the deleted webhook
      setWebhooks(prevWebhooks => prevWebhooks.filter(webhook => webhook.id !== id));
      
      setStatusMessage({
        type: 'success',
        message: 'Webhook configuration deleted successfully!'
      });
    } catch (err) {
      setStatusMessage({
        type: 'error',
        message: 'Failed to delete webhook configuration. Please try again.'
      });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Webhook Setup</h1>
          <p className={styles.subtitle}>Configure your TradingView webhook endpoints to receive trading signals.</p>
        </div>
        
        {!showForm && (
          <Button 
            onClick={() => setShowForm(true)}
            disabled={isLoading}
          >
            Create New Webhook
          </Button>
        )}
      </div>
      
      {statusMessage && (
        <StatusMessage
          type={statusMessage.type}
          message={statusMessage.message}
          onDismiss={() => setStatusMessage(null)}
        />
      )}
      
      {showForm ? (
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>
            {editingWebhook ? 'Edit Webhook Configuration' : 'Create New Webhook Configuration'}
          </h2>
          
          <WebhookConfigForm
            onSuccess={editingWebhook ? handleWebhookUpdated : handleWebhookCreated}
            onCancel={handleCancelForm}
            defaultValues={editingWebhook || undefined}
          />
        </div>
      ) : (
        <>
          <div className={styles.infoSection}>
            <h2 className={styles.sectionTitle}>Getting Started with Webhooks</h2>
            <div className={styles.infoCard}>
              <h3 className={styles.infoTitle}>How to Use Webhooks with TradingView</h3>
              <ol className={styles.instructionsList}>
                <li>Create a webhook configuration below to generate a unique webhook URL</li>
                <li>Set up an alert in TradingView and select "Webhook" as the alert action</li>
                <li>Enter your webhook URL from Viewzenix in the TradingView alert settings</li>
                <li>Include your security token in the alert message JSON body as <code>"passphrase": "your-token"</code></li>
                <li>Add any additional trading parameters needed for your strategy</li>
              </ol>
              
              <h3 className={styles.infoTitle}>Security Best Practices</h3>
              <ul className={styles.bestPracticesList}>
                <li>Use a strong, unique security token for each webhook</li>
                <li>Never share your webhook URLs or security tokens</li>
                <li>Regularly rotate your security tokens for enhanced security</li>
                <li>Review webhook activity logs regularly for any suspicious activity</li>
              </ul>
              
              <h3 className={styles.infoTitle}>Example TradingView Alert Message</h3>
              <div className={styles.codeBlock}>
                <pre>{`{
  "passphrase": "your-security-token",
  "ticker": "AAPL",
  "action": "BUY",
  "quantity": 10,
  "price": 150.50,
  "order_type": "MARKET",
  "stop_loss": 145.00,
  "take_profit": 160.00,
  "time_in_force": "DAY"
}`}</pre>
              </div>
            </div>
          </div>
          
          <div className={styles.webhooksSection}>
            <h2 className={styles.sectionTitle}>Your Webhook Configurations</h2>
            
            {isLoading ? (
              <div className={styles.loadingState}>Loading webhook configurations...</div>
            ) : error ? (
              <div className={styles.errorState}>{error}</div>
            ) : webhooks.length === 0 ? (
              <div className={styles.emptyState}>
                <p>You haven't created any webhook configurations yet.</p>
                <Button 
                  onClick={() => setShowForm(true)}
                  className={styles.emptyStateButton}
                >
                  Create Your First Webhook
                </Button>
              </div>
            ) : (
              <div className={styles.webhooksList}>
                {webhooks.map(webhook => (
                  <WebhookCard
                    key={webhook.id}
                    webhook={webhook}
                    onEdit={handleEditWebhook}
                    onDelete={handleDeleteWebhook}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}