'use client';

import { Box, Heading, Text, Button, Flex, Icon } from '@chakra-ui/react';
import { FiWifi, FiRefreshCw } from 'react-icons/fi';
import { useState } from 'react';

interface NetworkErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => Promise<void>;
}

/**
 * Component for displaying network connectivity errors
 */
export const NetworkError: React.FC<NetworkErrorProps> = ({
  title = 'Network Error',
  message = 'We are having trouble connecting to our servers. Please check your internet connection and try again.',
  onRetry,
}) => {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    if (!onRetry) {
      window.location.reload();
      return;
    }

    setIsRetrying(true);
    try {
      await onRetry();
    } catch (error) {
      console.error('Retry failed:', error);
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="70vh"
      px={4}
      textAlign="center"
    >
      <Icon as={FiWifi} boxSize={16} color="red.400" mb={4} />
      
      <Heading as="h1" size="xl" mb={4}>
        {title}
      </Heading>
      
      <Text fontSize="lg" mb={8} maxW="md">
        {message}
      </Text>
      
      <Button
        onClick={handleRetry}
        colorScheme="blue"
        size="lg"
        leftIcon={<FiRefreshCw />}
        isLoading={isRetrying}
        loadingText="Retrying"
      >
        Retry Connection
      </Button>
    </Flex>
  );
};