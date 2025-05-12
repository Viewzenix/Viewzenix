'use client';

import { Box, Heading, Text, Button, Flex, Icon } from '@chakra-ui/react';
import { FiAlertTriangle } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

interface NotFoundErrorProps {
  title?: string;
  message?: string;
  showHomeButton?: boolean;
  showBackButton?: boolean;
}

/**
 * Component for displaying a 404 Not Found error page
 */
export const NotFoundError: React.FC<NotFoundErrorProps> = ({
  title = 'Page Not Found',
  message = 'The page you are looking for does not exist or has been moved.',
  showHomeButton = true,
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
      <Icon as={FiAlertTriangle} boxSize={16} color="orange.400" mb={4} />
      
      <Heading as="h1" size="xl" mb={4}>
        404 - {title}
      </Heading>
      
      <Text fontSize="lg" mb={8} maxW="md">
        {message}
      </Text>
      
      <Box>
        {showHomeButton && (
          <Button
            as="a"
            href="/"
            colorScheme="blue"
            size="lg"
            mb={showBackButton ? 4 : 0}
            mr={showBackButton ? 4 : 0}
          >
            Go to Homepage
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