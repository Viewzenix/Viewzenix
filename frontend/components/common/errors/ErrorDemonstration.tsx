'use client';

import { useState } from 'react';
import { Button, Box, VStack, Heading, Text, Divider, useColorModeValue } from '@chakra-ui/react';
import { ErrorBoundary } from './ErrorBoundary';
import { 
  notifyError, 
  notifyApiError, 
  notifyWarning, 
  notifyInfo,
  ErrorSeverity, 
  ErrorSource, 
  errorService 
} from '@/services/error';

/**
 * Component that demonstrates error handling capabilities of the app
 * This is for demonstration purposes only and would not be part of a production app
 */
export const ErrorDemonstration: React.FC = () => {
  return (
    <Box
      p={6}
      bg={useColorModeValue('gray.50', 'gray.700')}
      borderRadius="lg"
      mb={8}
    >
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading as="h3" size="md" mb={3}>Error Service Demonstration</Heading>
          <Text mb={3}>
            These buttons demonstrate the error notification system. No actual errors are thrown.
          </Text>
          
          <VStack align="start" spacing={3}>
            <Button 
              colorScheme="blue" 
              onClick={() => notifyInfo('This is an informational message')}
              size="sm"
            >
              Show Info Notification
            </Button>
            
            <Button 
              colorScheme="yellow" 
              onClick={() => notifyWarning('This is a warning message')}
              size="sm"
            >
              Show Warning Notification
            </Button>
            
            <Button 
              colorScheme="red" 
              onClick={() => notifyError('This is an error message')}
              size="sm"
            >
              Show Error Notification
            </Button>
            
            <Button 
              colorScheme="purple" 
              onClick={() => notifyApiError('Failed to fetch data from API')}
              size="sm"
            >
              Show API Error Notification
            </Button>
            
            <Button 
              colorScheme="orange" 
              onClick={() => errorService.handleError({
                message: 'Critical system error detected',
                severity: ErrorSeverity.CRITICAL,
                source: ErrorSource.UNKNOWN,
                context: { additionalData: { userId: '123', action: 'demo' } }
              })}
              size="sm"
            >
              Show Critical Error Notification
            </Button>
          </VStack>
        </Box>
        
        <Divider />
        
        <Box>
          <Heading as="h3" size="md" mb={3}>Error Boundary Demonstration</Heading>
          <Text mb={3}>
            These buttons demonstrate the error boundary by actually throwing errors.
            The error will be caught by the nearest ErrorBoundary.
          </Text>
          
          <VStack align="start" spacing={3}>
            <ErrorBoundary>
              <BuggyCounter />
            </ErrorBoundary>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

// A buggy counter that will throw after 5 counts
const BuggyCounter: React.FC = () => {
  const [count, setCount] = useState(0);
  
  const handleClick = () => {
    setCount(prevCount => prevCount + 1);
  };
  
  if (count === 5) {
    // Simulate a JavaScript error
    throw new Error('I crashed on purpose when counter reached 5!');
  }
  
  return (
    <Box>
      <Text mb={2}>
        Click the button to increment. At count=5, this component will crash
        and trigger the error boundary fallback UI.
      </Text>
      <Text mb={2}>Current count: {count}</Text>
      <Button onClick={handleClick} colorScheme="blue" size="sm">
        Increment Counter
      </Button>
    </Box>
  );
};