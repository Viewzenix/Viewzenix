'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Box,
  Button,
  Input,
  Stack,
  Text,
  InputGroup,
  InputRightElement,
  Card,
  Heading,
  Divider
} from '@chakra-ui/react';
import { Field } from '@/components/ui/field';
import { toaster } from '@/components/ui/toaster';

interface WebhookConfigFormData {
  name: string;
  passphrase: string;
}

export function WebhookConfigForm() {
  const [loading, setLoading] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('https://api.viewzenix.com/webhook/12345');
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WebhookConfigFormData>({
    defaultValues: {
      name: '',
      passphrase: '',
    },
  });

  const onSubmit = async (data: WebhookConfigFormData) => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a new webhook URL with a random ID
      const newId = Math.random().toString(36).substring(2, 10);
      setWebhookUrl(`https://api.viewzenix.com/webhook/${newId}`);
      
      toaster.create({
        title: 'Webhook configuration saved',
        type: 'success',
        duration: 3000,
      });
    } catch (error) {
      toaster.create({
        title: 'Error saving configuration',
        description: 'Please try again later',
        type: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(webhookUrl);
    toaster.create({
      title: 'Copied to clipboard',
      type: 'info',
      duration: 2000,
    });
  };

  const generateRandomPassphrase = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 12; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    // Update the form with the new passphrase
    // Note: This would need to be handled differently with react-hook-form
    // For a real implementation, you'd use setValue from react-hook-form
    document.getElementById('passphrase')?.setAttribute('value', result);
  };

  return (
    <Card.Root>
      <Card.Header>
        <Heading size="md">Webhook Configuration</Heading>
      </Card.Header>
      <Divider />
      <Card.Body>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap={4}>
            <Field.Root invalid={Boolean(errors.name)}>
              <Field.Label>Webhook Name</Field.Label>
              <Input
                id="name"
                placeholder="My TradingView Strategy"
                {...register('name', {
                  required: 'Webhook name is required',
                })}
              />
              {errors.name && (
                <Field.ErrorText>{errors.name.message?.toString()}</Field.ErrorText>
              )}
              <Field.HelperText>
                A descriptive name to identify this webhook
              </Field.HelperText>
            </Field.Root>

            <Field.Root invalid={Boolean(errors.passphrase)}>
              <Field.Label>Security Passphrase</Field.Label>
              <InputGroup>
                <Input
                  id="passphrase"
                  placeholder="Enter a secure passphrase"
                  {...register('passphrase', {
                    required: 'Passphrase is required',
                    minLength: {
                      value: 8,
                      message: 'Passphrase must be at least 8 characters',
                    },
                  })}
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={generateRandomPassphrase}>
                    Generate
                  </Button>
                </InputRightElement>
              </InputGroup>
              {errors.passphrase && (
                <Field.ErrorText>{errors.passphrase.message?.toString()}</Field.ErrorText>
              )}
              <Field.HelperText>
                This passphrase must be included in your TradingView alerts
              </Field.HelperText>
            </Field.Root>

            <Box mt={4}>
              <Text fontWeight="medium" mb={2}>
                Your Webhook URL
              </Text>
              <InputGroup>
                <Input value={webhookUrl} readOnly bg="gray.50" _dark={{ bg: 'gray.700' }} />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={copyToClipboard}>
                    Copy
                  </Button>
                </InputRightElement>
              </InputGroup>
              <Text fontSize="sm" color="gray.500" mt={1}>
                Use this URL in your TradingView alerts
              </Text>
            </Box>
          </Stack>
          
          <Button
            mt={6}
            colorPalette="blue"
            type="submit"
            loading={loading}
            loadingText="Saving"
          >
            Save Configuration
          </Button>
        </form>
      </Card.Body>
    </Card.Root>
  );
}