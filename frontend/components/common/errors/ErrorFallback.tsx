'use client';

import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  Icon,
  useColorModeValue,
  Code,
  Collapse,
  Flex,
} from '@chakra-ui/react';
import { WarningIcon, RepeatIcon } from '@chakra-ui/icons';
import { FallbackProps } from 'react-error-boundary';
import { useState } from 'react';

/**
 * Default error fallback component
 * Displays when an error is caught by the ErrorBoundary
 */
export const ErrorFallback: React.FC<FallbackProps> = ({ 
  error, 
  resetErrorBoundary 
}) => {
  const [showDetails, setShowDetails] = useState(false);
  
  const bgColor = useColorModeValue('red.50', 'rgba(200, 30, 30, 0.1)');
  const borderColor = useColorModeValue('red.500', 'red.300');
  const headingColor = useColorModeValue('red.600', 'red.300');

  return (
    <Box
      p={8}
      bg={bgColor}
      borderRadius="md"
      borderLeft="4px"
      borderColor={borderColor}
      m={4}
      role="alert"
    >
      <VStack spacing={4} align="start">
        <Flex alignItems="center" w="full">
          <Icon as={WarningIcon} color={headingColor} boxSize={6} mr={2} />
          <Heading as="h2" size="md" color={headingColor}>
            Something went wrong
          </Heading>
        </Flex>

        <Text fontSize="md">
          We've encountered an error while rendering this page. 
          {process.env.NODE_ENV !== 'production' 
            ? ' See details below for more information.' 
            : ''}
        </Text>

        {process.env.NODE_ENV !== 'production' && (
          <>
            <Button 
              size="sm" 
              variant="outline" 
              colorScheme="red" 
              onClick={() => setShowDetails(!showDetails)}
              leftIcon={showDetails ? <Icon as={WarningIcon} /> : <Icon as={WarningIcon} />}
            >
              {showDetails ? 'Hide Technical Details' : 'Show Technical Details'}
            </Button>

            <Collapse in={showDetails} animateOpacity>
              <Box w="full">
                <Text fontWeight="bold" mb={2}>Error Message:</Text>
                <Code p={2} borderRadius="md" w="full" display="block" whiteSpace="pre-wrap">
                  {error.message}
                </Code>

                {error.stack && (
                  <>
                    <Text fontWeight="bold" mt={4} mb={2}>Stack Trace:</Text>
                    <Code p={2} borderRadius="md" fontSize="xs" w="full" display="block" whiteSpace="pre-wrap" maxH="200px" overflow="auto">
                      {error.stack}
                    </Code>
                  </>
                )}
              </Box>
            </Collapse>
          </>
        )}

        <Button
          colorScheme="blue"
          leftIcon={<RepeatIcon />}
          onClick={resetErrorBoundary}
          mt={2}
        >
          Try Again
        </Button>
      </VStack>
    </Box>
  );
};