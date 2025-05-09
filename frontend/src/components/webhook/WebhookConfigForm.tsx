'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CreateWebhookConfigData, WebhookConfig } from '@/types/webhook';
import { webhookService } from '@/services/webhook.service';
import {
  Box,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Checkbox,
  Switch,
  Button,
  Alert,
  AlertIcon,
  FormErrorMessage,
  HStack,
  Text,
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
          <AlertIcon />
          <Text>{status.message}</Text>
        </Alert>
      )}
      <Stack as="form" spacing={4} onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={!!errors.name}>
          <FormLabel>Name</FormLabel>
          <Input placeholder="Webhook name" {...register('name', { required: 'Required', maxLength: { value: 100, message: 'Max 100 chars' } })} />
          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.description}>
          <FormLabel>Description</FormLabel>
          <Textarea placeholder="Description" {...register('description', { maxLength: { value: 500, message: 'Max 500 chars' } })} />
          <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.securityToken}>
          <FormLabel>Security Token</FormLabel>
          <HStack>
            <Input placeholder="Secure token" {...register('securityToken', { required: 'Required', minLength: { value: 8, message: 'Min 8 chars' } })} />
            <Button onClick={generateSecurityToken} size="sm" variant="outline">
              Generate
            </Button>
          </HStack>
          <FormErrorMessage>{errors.securityToken?.message}</FormErrorMessage>
        </FormControl>
        <FormControl>
          <FormLabel>Notification Preferences</FormLabel>
          <HStack>
            <Checkbox {...register('notificationPreferences.email')}>Email</Checkbox>
            <Checkbox {...register('notificationPreferences.browser')}>Browser</Checkbox>
            <Checkbox {...register('notificationPreferences.onSuccess')}>On Success</Checkbox>
            <Checkbox {...register('notificationPreferences.onFailure')}>On Failure</Checkbox>
          </HStack>
        </FormControl>
        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="isActive" mb="0">
            Active
          </FormLabel>
          <Switch id="isActive" {...register('isActive')} />
        </FormControl>
        <HStack spacing={4} pt={4}>
          <Button colorScheme="brand" type="submit" isLoading={isSubmitting}>
            {isEditMode ? 'Update' : 'Create'}
          </Button>
          {onCancel && (
            <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
          )}
        </HStack>
      </Stack>
    </Box>
  );
}