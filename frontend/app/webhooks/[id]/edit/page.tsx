'use client';

import { 
  Box, 
  Heading, 
  Text, 
  Card, 
  CardBody, 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink,
  Flex,
  useToast,
  Alert,
  AlertIcon,
  Spinner
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronRightIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import { WebhookForm } from '@/components/features/webhook';
import { UpdateWebhookConfigDto, WebhookConfig } from '@/types';
import { useWebhookRepository } from '@/hooks/useRepositories';

export default function EditWebhookPage() {
  const params = useParams();
  const id = params.id as string;
  const [webhook, setWebhook] = useState<WebhookConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const toast = useToast();
  const webhookRepository = useWebhookRepository();

  useEffect(() => {
    if (id) {
      loadWebhook();
    }
  }, [id]);

  const loadWebhook = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await webhookRepository.findById(id);
      
      if (result.success) {
        setWebhook(result.data);
      } else {
        setError(result.message || 'Failed to load webhook configuration');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: UpdateWebhookConfigDto) => {
    setIsSubmitting(true);
    
    try {
      const result = await webhookRepository.update(id, data);
      
      if (result.success) {
        toast({
          title: 'Webhook updated',
          description: 'Your webhook has been updated successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        
        router.push(`/webhooks/${id}`);
      } else {
        toast({
          title: 'Error',
          description: result.message || 'Failed to update webhook',
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box>
      <Breadcrumb 
        spacing="8px" 
        separator={<ChevronRightIcon color="gray.500" />}
        mb={6}
      >
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} href="/webhooks">Webhooks</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} href={`/webhooks/${id}`}>{webhook?.name || id}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>Edit</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading as="h1" size="xl">Edit Webhook</Heading>
      </Flex>
      
      <Text mb={8}>
        Update your webhook configuration details and notification preferences.
      </Text>
      
      {isLoading ? (
        <Flex justify="center" py={10}>
          <Spinner size="xl" />
        </Flex>
      ) : error ? (
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <Box>
            <Text fontWeight="bold">Error</Text>
            <Text>{error}</Text>
          </Box>
        </Alert>
      ) : webhook ? (
        <Card>
          <CardBody>
            <WebhookForm 
              initialData={webhook}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </CardBody>
        </Card>
      ) : null}
    </Box>
  );
}