'use client';

import { 
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Switch,
  VStack,
  Textarea,
  HStack,
  IconButton,
  InputGroup,
  InputRightElement,
  Tooltip,
  Divider,
  Text,
  Flex
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { 
  CreateWebhookConfigDto, 
  NotificationPreferences, 
  UpdateWebhookConfigDto, 
  WebhookConfig 
} from '@/types';
import { useWebhookRepository } from '@/hooks/useRepositories';
import { RefreshIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { NotificationPreferencesForm } from '../NotificationPreferencesForm';

interface WebhookFormProps {
  initialData?: WebhookConfig;
  onSubmit: (data: CreateWebhookConfigDto | UpdateWebhookConfigDto) => Promise<void>;
  isSubmitting: boolean;
}

export const WebhookForm: React.FC<WebhookFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [securityToken, setSecurityToken] = useState(initialData?.securityToken || '');
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences>(
    initialData?.notificationPreferences || {
      email: true,
      browser: true,
      onSuccess: false,
      onFailure: true
    }
  );
  const [showToken, setShowToken] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const webhookRepository = useWebhookRepository();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.length > 255) {
      newErrors.name = 'Name must be less than 255 characters';
    }
    
    if (!securityToken.trim()) {
      newErrors.securityToken = 'Security token is required';
    } else if (securityToken.length < 6) {
      newErrors.securityToken = 'Security token must be at least 6 characters';
    } else if (securityToken.length > 255) {
      newErrors.securityToken = 'Security token must be less than 255 characters';
    }
    
    if (description && description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const webhookData: CreateWebhookConfigDto | UpdateWebhookConfigDto = {
      name,
      securityToken,
      description: description || undefined,
      notificationPreferences,
      isActive
    };
    
    await onSubmit(webhookData);
  };

  const generateSecurityToken = async () => {
    try {
      const result = await webhookRepository.generateSecureToken();
      
      if (result.success) {
        setSecurityToken(result.data);
        setShowToken(true);
      }
    } catch (error) {
      console.error('Failed to generate security token:', error);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={6} align="stretch">
        <FormControl isInvalid={!!errors.name}>
          <FormLabel htmlFor="name">Name</FormLabel>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My TradingView Webhook"
            data-testid="webhook-name-input"
          />
          {errors.name ? (
            <FormErrorMessage>{errors.name}</FormErrorMessage>
          ) : (
            <FormHelperText>
              Give your webhook a descriptive name
            </FormHelperText>
          )}
        </FormControl>
        
        <FormControl>
          <FormLabel htmlFor="description">Description (Optional)</FormLabel>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="This webhook is for..."
            rows={3}
            data-testid="webhook-description-input"
          />
          {errors.description ? (
            <FormErrorMessage>{errors.description}</FormErrorMessage>
          ) : (
            <FormHelperText>
              Add details about this webhook's purpose
            </FormHelperText>
          )}
        </FormControl>
        
        <FormControl isInvalid={!!errors.securityToken}>
          <FormLabel htmlFor="securityToken">Security Token</FormLabel>
          <InputGroup>
            <Input
              id="securityToken"
              type={showToken ? 'text' : 'password'}
              value={securityToken}
              onChange={(e) => setSecurityToken(e.target.value)}
              placeholder="Security token for webhook validation"
              data-testid="webhook-token-input"
            />
            <InputRightElement width="4.5rem">
              <Tooltip label="Generate new token">
                <IconButton
                  aria-label="Generate new token"
                  icon={<RefreshIcon />}
                  size="sm"
                  onClick={generateSecurityToken}
                  mr={1}
                />
              </Tooltip>
              <Tooltip label={showToken ? "Hide token" : "Show token"}>
                <IconButton
                  aria-label={showToken ? "Hide token" : "Show token"}
                  icon={showToken ? <ViewOffIcon /> : <ViewIcon />}
                  size="sm"
                  onClick={() => setShowToken(!showToken)}
                />
              </Tooltip>
            </InputRightElement>
          </InputGroup>
          {errors.securityToken ? (
            <FormErrorMessage>{errors.securityToken}</FormErrorMessage>
          ) : (
            <FormHelperText>
              This token will be required in your TradingView alert messages for security
            </FormHelperText>
          )}
        </FormControl>
        
        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="isActive" mb="0">
            Active
          </FormLabel>
          <Switch
            id="isActive"
            isChecked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            colorScheme="green"
            data-testid="webhook-active-switch"
          />
          <FormHelperText ml={2}>
            {isActive ? 'Webhook is active and will process alerts' : 'Webhook is inactive and will not process alerts'}
          </FormHelperText>
        </FormControl>
        
        <Divider my={2} />
        
        <Box>
          <Text fontWeight="medium" mb={4}>Notification Preferences</Text>
          <NotificationPreferencesForm
            preferences={notificationPreferences}
            onChange={setNotificationPreferences}
          />
        </Box>

        <Flex justify="flex-end" mt={4}>
          <Button 
            type="submit" 
            colorScheme="brand" 
            isLoading={isSubmitting}
            loadingText="Saving"
            data-testid="webhook-submit-button"
          >
            {initialData ? 'Update Webhook' : 'Create Webhook'}
          </Button>
        </Flex>
      </VStack>
    </Box>
  );
};