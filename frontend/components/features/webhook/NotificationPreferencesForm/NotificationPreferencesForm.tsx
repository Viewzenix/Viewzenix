'use client';

import {
  Box,
  FormControl,
  FormLabel,
  Switch,
  SimpleGrid,
  Divider,
  Text,
  VStack,
  HStack
} from '@chakra-ui/react';
import { NotificationPreferences } from '@/types';

interface NotificationPreferencesFormProps {
  preferences: NotificationPreferences;
  onChange: (preferences: NotificationPreferences) => void;
}

export const NotificationPreferencesForm: React.FC<NotificationPreferencesFormProps> = ({
  preferences,
  onChange
}) => {
  const handleChange = (key: keyof NotificationPreferences, value: boolean) => {
    onChange({
      ...preferences,
      [key]: value
    });
  };

  return (
    <VStack spacing={4} align="stretch">
      <Box>
        <Text fontWeight="medium" mb={2}>Notification Channels</Text>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <FormControl display="flex" alignItems="center">
            <Switch
              id="email-notifications"
              isChecked={preferences.email}
              onChange={(e) => handleChange('email', e.target.checked)}
              colorScheme="blue"
              mr={3}
              data-testid="email-notifications-switch"
            />
            <FormLabel htmlFor="email-notifications" mb="0">
              Email Notifications
            </FormLabel>
          </FormControl>
          
          <FormControl display="flex" alignItems="center">
            <Switch
              id="browser-notifications"
              isChecked={preferences.browser}
              onChange={(e) => handleChange('browser', e.target.checked)}
              colorScheme="purple"
              mr={3}
              data-testid="browser-notifications-switch"
            />
            <FormLabel htmlFor="browser-notifications" mb="0">
              Browser Notifications
            </FormLabel>
          </FormControl>
        </SimpleGrid>
      </Box>
      
      <Divider />
      
      <Box>
        <Text fontWeight="medium" mb={2}>Notification Events</Text>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <FormControl display="flex" alignItems="center">
            <Switch
              id="on-success"
              isChecked={preferences.onSuccess}
              onChange={(e) => handleChange('onSuccess', e.target.checked)}
              colorScheme="green"
              mr={3}
              data-testid="on-success-switch"
            />
            <FormLabel htmlFor="on-success" mb="0">
              On Successful Execution
            </FormLabel>
          </FormControl>
          
          <FormControl display="flex" alignItems="center">
            <Switch
              id="on-failure"
              isChecked={preferences.onFailure}
              onChange={(e) => handleChange('onFailure', e.target.checked)}
              colorScheme="red"
              mr={3}
              data-testid="on-failure-switch"
            />
            <FormLabel htmlFor="on-failure" mb="0">
              On Execution Failure
            </FormLabel>
          </FormControl>
        </SimpleGrid>
      </Box>
    </VStack>
  );
};