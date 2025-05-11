'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CreateWebhookConfigData, WebhookConfig } from '@/types/webhook';
import { webhookService } from '@/services/webhook.service';
import {
  Box,
  Stack,
  Input,
  Textarea,
  Checkbox,
  Switch,
  Button,
  HStack,
  Text,
  Alert,
} from '@chakra-ui/react';

interface WebhookConfigFormProps {
  onSuccess?: (webhook: WebhookConfig) => void;
  onCancel?: () => void;
  defaultValues?: Partial<WebhookConfig>;
}

export function WebhookConfigForm({ onSuccess, onCancel, defaultValues }: WebhookConfigFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<CreateWebhookConfigData>({
    defaultValues: defaultValues || {
      name: '',
      description: '',
      securityToken: '',
      notificationPreferences: {
        email: true,
        browser: true,
        onSuccess: true,
        onFailure: true,
      },
      isActive: true,
    },
  });

  const [status, setStatus] = useState<{ type: 'error' | 'success'; message: string } | null>(null);
  const isEditMode = Boolean(defaultValues && defaultValues.id);

  const onSubmit = async (data: CreateWebhookConfigData) => {
    try {
      setStatus(null);
      let response;
      let msg;
      if (isEditMode && defaultValues?.id) {
        response = await webhookService.updateWebhook(defaultValues.id, data);
        msg = 'Webhook updated successfully!';
      } else {
        response = await webhookService.createWebhook(data);
        msg = 'Webhook created successfully!';
        if (!defaultValues) reset();
      }
      setStatus({ type: 'success', message: msg });
      onSuccess?.(response.data.webhook);
    } catch (e) {
      setStatus({ type: 'error', message: (e as Error).message });
    }
  };

  const generateSecurityToken = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 16; i++) {
      token += chars[Math.floor(Math.random() * chars.length)];
    }
    setValue('securityToken', token, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <Box bg="white" p={6} rounded="md" boxShadow="md">
      {status && (
        <Alert status={status.type} mb={4} rounded="md">
          <Text>{status.message}</Text>
        </Alert>
      )}
      <Stack as="form" spacing={4} onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <Input 
            id="name"
            placeholder="Webhook name" 
            {...register('name', { 
              required: 'Required', 
              maxLength: { value: 100, message: 'Max 100 chars' } 
            })} 
          />
          {errors.name && <div className="error-message">{errors.name.message}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <Textarea 
            id="description"
            placeholder="Description" 
            {...register('description', { 
              maxLength: { value: 500, message: 'Max 500 chars' } 
            })} 
          />
          {errors.description && <div className="error-message">{errors.description.message}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="securityToken">Security Token</label>
          <HStack>
            <Input 
              id="securityToken"
              placeholder="Secure token" 
              {...register('securityToken', { 
                required: 'Required', 
                minLength: { value: 8, message: 'Min 8 chars' } 
              })} 
            />
            <Button onClick={generateSecurityToken} size="sm" variant="outline">
              Generate
            </Button>
          </HStack>
          {errors.securityToken && <div className="error-message">{errors.securityToken.message}</div>}
        </div>
        
        <div className="form-group">
          <label>Notification Preferences</label>
          <HStack>
            <Checkbox {...register('notificationPreferences.email')}>Email</Checkbox>
            <Checkbox {...register('notificationPreferences.browser')}>Browser</Checkbox>
            <Checkbox {...register('notificationPreferences.onSuccess')}>On Success</Checkbox>
            <Checkbox {...register('notificationPreferences.onFailure')}>On Failure</Checkbox>
          </HStack>
        </div>
        
        <div className="form-group" style={{ display: 'flex', alignItems: 'center' }}>
          <label htmlFor="isActive" style={{ marginBottom: 0, marginRight: '10px' }}>
            Active
          </label>
          <Switch id="isActive" {...register('isActive')} />
        </div>
        
        <HStack spacing={4} pt={4}>
          <Button colorPalette="blue" type="submit" isLoading={isSubmitting ? true : undefined}>
            {isEditMode ? 'Update' : 'Create'}
          </Button>
          {onCancel && (
            <Button variant="outline" onClick={onCancel} disabled={isSubmitting ? true : undefined}>
              Cancel
            </Button>
          )}
        </HStack>
      </Stack>
    </Box>
  );
}