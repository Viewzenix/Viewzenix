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
  useToast
} from '@chakra-ui/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRightIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import { WebhookForm } from '@/components/features/webhook';
import { CreateWebhookConfigDto } from '@/types';
import { useWebhookRepository } from '@/hooks/useRepositories';

export default function NewWebhookPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const webhookRepository = useWebhookRepository();

  const handleSubmit = async (data: CreateWebhookConfigDto) => {
    setIsSubmitting(true);
    
    try {
      const result = await webhookRepository.create(data);
      
      if (result.success) {
        toast({
          title: 'Webhook created',
          description: 'Your webhook has been created successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        
        router.push('/webhooks');
      } else {
        toast({
          title: 'Error',
          description: result.message || 'Failed to create webhook',
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
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>New</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading as="h1" size="xl">Create New Webhook</Heading>
      </Flex>
      
      <Text mb={8}>
        Create a new webhook configuration to connect TradingView alerts to your trading system.
      </Text>
      
      <Card>
        <CardBody>
          <WebhookForm 
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </CardBody>
      </Card>
    </Box>
  );
}