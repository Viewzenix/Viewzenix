'use client';

import { 
  Box, 
  Heading, 
  Text, 
  Button, 
  Flex, 
  useDisclosure,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useWebhookRepository } from '@/hooks/useRepositories';
import { WebhookConfig } from '@/types';
import { AddIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import { WebhookList } from '@/components/features/webhook';

export default function WebhooksPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const webhookRepository = useWebhookRepository();
  const toast = useToast();

  useEffect(() => {
    loadWebhooks();
  }, []);

  const loadWebhooks = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await webhookRepository.findAllForCurrentUser();
      
      if (result.success) {
        setWebhooks(result.data);
      } else {
        setError(result.message || 'Failed to load webhook configurations');
      }
    } catch (err) {
      setError('An unexpected error occurred while loading webhooks');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteWebhook = async (id: string) => {
    try {
      const result = await webhookRepository.delete(id);
      
      if (result.success) {
        setWebhooks(webhooks.filter(webhook => webhook.id !== id));
        toast({
          title: 'Webhook deleted',
          description: 'The webhook configuration has been deleted successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Error',
          description: result.message || 'Failed to delete webhook configuration',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error(err);
    }
  };

  const handleToggleWebhook = async (id: string, isActive: boolean) => {
    try {
      const result = await webhookRepository.toggleStatus(id, { isActive: !isActive });
      
      if (result.success) {
        setWebhooks(webhooks.map(webhook => 
          webhook.id === id ? result.data : webhook
        ));
        
        toast({
          title: `Webhook ${!isActive ? 'activated' : 'deactivated'}`,
          description: `The webhook has been ${!isActive ? 'activated' : 'deactivated'} successfully.`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Error',
          description: result.message || 'Failed to update webhook status',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error(err);
    }
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h1" size="xl">Webhook Configurations</Heading>
        <Button 
          leftIcon={<AddIcon />} 
          colorScheme="brand" 
          as={Link} 
          href="/webhooks/new"
        >
          Create New
        </Button>
      </Flex>
      
      <Text mb={8}>
        Manage your TradingView webhook configurations. Each webhook provides a unique URL and security token for your TradingView alerts.
      </Text>
      
      {isLoading ? (
        <Flex justify="center" py={10}>
          <Spinner size="xl" />
        </Flex>
      ) : error ? (
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <Box>
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Box>
        </Alert>
      ) : webhooks.length === 0 ? (
        <Box 
          p={8} 
          textAlign="center" 
          borderRadius="md" 
          borderWidth="1px"
        >
          <Text fontSize="lg" mb={4}>You don't have any webhook configurations yet.</Text>
          <Button 
            colorScheme="brand" 
            as={Link} 
            href="/webhooks/new"
          >
            Create Your First Webhook
          </Button>
        </Box>
      ) : (
        <WebhookList 
          webhooks={webhooks}
          onDelete={handleDeleteWebhook}
          onToggleStatus={handleToggleWebhook}
        />
      )}
    </Box>
  );
}