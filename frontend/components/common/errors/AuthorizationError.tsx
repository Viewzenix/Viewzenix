'use client';

import { Box, Heading, Text, Button, Flex, Icon } from '@chakra-ui/react';
import { FiLock } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

interface AuthorizationErrorProps {
  title?: string;
  message?: string;
  showLoginButton?: boolean;
  showBackButton?: boolean;
}

/**
 * Component for displaying an authorization error (401/403)
 */
export const AuthorizationError: React.FC<AuthorizationErrorProps> = ({
  title = 'Access Denied',
  message = 'You do not have permission to access this resource.',
  showLoginButton = true,
  showBackButton = true,
}) => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
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
      <Icon as={FiLock} boxSize={16} color="red.400" mb={4} />
      
      <Heading as="h1" size="xl" mb={4}>
        {title}
      </Heading>
      
      <Text fontSize="lg" mb={8} maxW="md">
        {message}
      </Text>
      
      <Box>
        {showLoginButton && (
          <Button
            as="a"
            href="/login"
            colorScheme="blue"
            size="lg"
            mb={showBackButton ? 4 : 0}
            mr={showBackButton ? 4 : 0}
          >
            Log In
          </Button>
        )}
        
        {showBackButton && (
          <Button
            onClick={handleGoBack}
            variant="outline"
            size="lg"
          >
            Go Back
          </Button>
        )}
      </Box>
    </Flex>
  );
};