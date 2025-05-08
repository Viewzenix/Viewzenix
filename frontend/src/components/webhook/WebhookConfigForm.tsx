'use client'

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  FormInput, 
  FormTextarea, 
  FormCheckbox, 
  Button, 
  StatusMessage,
  StatusType 
} from '@/components/common';
import { CreateWebhookConfigData, WebhookConfig } from '@/types/webhook';
import { webhookService } from '@/services/webhook.service';
import styles from './WebhookConfigForm.module.css';

interface WebhookConfigFormProps {
  onSuccess?: (webhook: WebhookConfig) => void;
  onCancel?: () => void;
  defaultValues?: Partial<CreateWebhookConfigData>;
}

export function WebhookConfigForm({ 
  onSuccess, 
  onCancel,
  defaultValues 
}: WebhookConfigFormProps) {
  // Form state using React Hook Form
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    reset 
  } = useForm<CreateWebhookConfigData>({
    defaultValues: defaultValues || {
      name: '',
      description: '',
      securityToken: '',
      notificationPreferences: {
        email: true,
        browser: true,
        onSuccess: true,
        onFailure: true
      },
      isActive: true
    }
  });

  // Status message state
  const [status, setStatus] = useState<{
    type: StatusType;
    message: string;
  } | null>(null);

  // Form submission handler
  const onSubmit = async (data: CreateWebhookConfigData) => {
    try {
      // Reset any previous status
      setStatus(null);
      
      // Call service to create webhook
      const response = await webhookService.createWebhook(data);
      
      // Show success message
      setStatus({
        type: 'success',
        message: 'Webhook configuration created successfully!'
      });
      
      // Reset form if not provided with default values (creation mode)
      if (!defaultValues) {
        reset();
      }
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess(response.webhook);
      }
    } catch (error) {
      // Show error message
      setStatus({
        type: 'error',
        message: error instanceof Error 
          ? error.message 
          : 'An unexpected error occurred. Please try again.'
      });
    }
  };

  // Generate a random security token
  const generateSecurityToken = () => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    
    // Generate a 16-character random token
    for (let i = 0; i < 16; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      token += charset[randomIndex];
    }
    
    // Set the value in the form
    const tokenInput = document.getElementById('input-security-token') as HTMLInputElement;
    if (tokenInput) {
      tokenInput.value = token;
    }
  };

  return (
    <div className={styles.formContainer}>
      {status && (
        <StatusMessage 
          type={status.type} 
          message={status.message} 
          onDismiss={() => setStatus(null)}
        />
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <FormInput
          label="Webhook Name"
          placeholder="e.g., AAPL Trading Strategy"
          {...register('name', {
            required: 'Webhook name is required',
            maxLength: {
              value: 100,
              message: 'Webhook name cannot exceed 100 characters'
            }
          })}
          error={errors.name?.message}
          helperText="A descriptive name for your webhook configuration"
        />
        
        <FormTextarea
          label="Description"
          placeholder="Describe what this webhook is used for..."
          {...register('description', {
            maxLength: {
              value: 500,
              message: 'Description cannot exceed 500 characters'
            }
          })}
          error={errors.description?.message}
          helperText="Optional description to help you identify this webhook"
        />
        
        <div className={styles.securityTokenContainer}>
          <FormInput
            label="Security Token / Passphrase"
            id="input-security-token"
            placeholder="Enter a secure passphrase..."
            {...register('securityToken', {
              required: 'Security token is required',
              minLength: {
                value: 8,
                message: 'Security token must be at least 8 characters'
              }
            })}
            error={errors.securityToken?.message}
            helperText="This token will be used to authenticate webhook requests from TradingView"
          />
          <Button 
            type="button" 
            variant="secondary" 
            size="sm" 
            className={styles.generateButton}
            onClick={generateSecurityToken}
          >
            Generate
          </Button>
        </div>
        
        <div className={styles.divider}>
          <span>Notification Preferences</span>
        </div>
        
        <div className={styles.checkboxGroup}>
          <FormCheckbox
            label="Email Notifications"
            {...register('notificationPreferences.email')}
            helperText="Receive email notifications for webhook events"
          />
          
          <FormCheckbox
            label="Browser Notifications"
            {...register('notificationPreferences.browser')}
            helperText="Receive browser notifications for webhook events"
          />
          
          <FormCheckbox
            label="Notify on Success"
            {...register('notificationPreferences.onSuccess')}
            helperText="Get notified when webhook execution succeeds"
          />
          
          <FormCheckbox
            label="Notify on Failure"
            {...register('notificationPreferences.onFailure')}
            helperText="Get notified when webhook execution fails"
          />
        </div>
        
        <FormCheckbox
          label="Active"
          {...register('isActive')}
          helperText="Webhook is enabled and will process incoming requests"
        />
        
        <div className={styles.formActions}>
          {onCancel && (
            <Button 
              type="button" 
              variant="secondary" 
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
          
          <Button 
            type="submit" 
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {defaultValues ? 'Update Webhook' : 'Create Webhook'}
          </Button>
        </div>
      </form>
    </div>
  );
}