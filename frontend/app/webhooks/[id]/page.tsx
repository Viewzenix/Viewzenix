'use client';

import {
  Box,
  Heading,
  Text,
  Button,
  Flex,
  Card,
  CardBody,
  CardHeader,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Spinner,
  Alert,
  AlertIcon,
  Badge,
  Divider,
  SimpleGrid,
  HStack,
  VStack,
  useClipboard,
  IconButton,
  Tooltip,
  useColorModeValue,
  Switch,
  useToast
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { WebhookConfig } from '@/types';
import { useWebhookRepository } from '@/hooks/useRepositories';
import { ChevronRightIcon, CopyIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { format } from 'date-fns';
import { WebhookDeleteConfirmation } from '@/components/features/webhook';

export default function WebhookDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [webhook, setWebhook] = useState<WebhookConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const webhookRepository = useWebhookRepository();
  const toast = useToast();
  
  const { hasCopied: hasUrlCopied, onCopy: onUrlCopy } = useClipboard(webhook?.webhookUrl || '');
  const { hasCopied: hasTokenCopied, onCopy: onTokenCopy } = useClipboard(webhook?.securityToken || '');
  
  const codeBoxBg = useColorModeValue('gray.100', 'gray.700');

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

  const handleDelete = async () => {
    try {
      const result = await webhookRepository.delete(id);
      
      if (result.success) {
        toast({
          title: 'Webhook deleted',
          description: 'The webhook configuration has been deleted successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        router.push('/webhooks');
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

  const handleToggleStatus = async () => {
    if (!webhook) return;
    
    try {
      const result = await webhookRepository.toggleStatus(id, { isActive: !webhook.isActive });
      
      if (result.success) {
        setWebhook(result.data);
        toast({
          title: `Webhook ${!webhook.isActive ? 'activated' : 'deactivated'}`,
          description: `The webhook has been ${!webhook.isActive ? 'activated' : 'deactivated'} successfully.`,
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

  const handleTestWebhook = async () => {
    try {
      const result = await webhookRepository.testWebhook(id);
      
      if (result.success) {
        toast({
          title: 'Test successful',
          description: result.data.message || 'Webhook test was successful',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Test failed',
          description: result.message || 'Webhook test failed',
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
          <BreadcrumbLink>{webhook?.name || id}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

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
        <>
          <Flex justify="space-between" align="center" mb={6} wrap="wrap" gap={4}>
            <Box>
              <HStack mb={2}>
                <Heading as="h1" size="xl">{webhook.name}</Heading>
                <Badge 
                  colorScheme={webhook.isActive ? 'green' : 'gray'}
                  variant="subtle"
                  px={2}
                  py={1}
                  borderRadius="full"
                >
                  {webhook.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </HStack>
              {webhook.description && (
                <Text color="gray.500" mt={1}>{webhook.description}</Text>
              )}
            </Box>
            
            <HStack spacing={4}>
              <Button 
                leftIcon={<EditIcon />} 
                as={Link} 
                href={`/webhooks/${id}/edit`}
                variant="outline"
              >
                Edit
              </Button>
              <Button 
                leftIcon={<DeleteIcon />} 
                colorScheme="red" 
                variant="outline"
                onClick={() => setDeleteDialogOpen(true)}
              >
                Delete
              </Button>
            </HStack>
          </Flex>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
            <Card>
              <CardHeader>
                <Heading size="md">Webhook Details</Heading>
              </CardHeader>
              <CardBody>
                <VStack align="stretch" spacing={4}>
                  <Box>
                    <Text fontWeight="bold" fontSize="sm" mb={1}>WEBHOOK URL</Text>
                    <Flex mb={4}>
                      <Box 
                        flex="1" 
                        bg={codeBoxBg} 
                        p={3} 
                        borderRadius="md" 
                        fontFamily="mono"
                        fontSize="sm"
                        overflow="auto"
                      >
                        {webhook.webhookUrl}
                      </Box>
                      <Tooltip label={hasUrlCopied ? "Copied!" : "Copy URL"}>
                        <IconButton
                          aria-label="Copy webhook URL"
                          icon={<CopyIcon />}
                          size="sm"
                          ml={2}
                          onClick={onUrlCopy}
                        />
                      </Tooltip>
                    </Flex>
                    
                    <Text fontWeight="bold" fontSize="sm" mb={1}>SECURITY TOKEN</Text>
                    <Flex>
                      <Box 
                        flex="1" 
                        bg={codeBoxBg} 
                        p={3} 
                        borderRadius="md" 
                        fontFamily="mono"
                        fontSize="sm"
                        overflow="auto"
                      >
                        {webhook.securityToken}
                      </Box>
                      <Tooltip label={hasTokenCopied ? "Copied!" : "Copy Token"}>
                        <IconButton
                          aria-label="Copy security token"
                          icon={<CopyIcon />}
                          size="sm"
                          ml={2}
                          onClick={onTokenCopy}
                        />
                      </Tooltip>
                    </Flex>
                  </Box>
                  
                  <Divider />
                  
                  <Box>
                    <SimpleGrid columns={2} spacingY={2}>
                      <Text fontWeight="bold">Status:</Text>
                      <Flex align="center">
                        <Switch 
                          isChecked={webhook.isActive} 
                          onChange={handleToggleStatus}
                          colorScheme="green"
                          size="sm"
                          mr={2}
                        />
                        <Text>{webhook.isActive ? 'Active' : 'Inactive'}</Text>
                      </Flex>
                      
                      <Text fontWeight="bold">Created:</Text>
                      <Text>{format(new Date(webhook.createdAt), 'MMMM d, yyyy')}</Text>
                      
                      <Text fontWeight="bold">Last Updated:</Text>
                      <Text>{format(new Date(webhook.updatedAt), 'MMMM d, yyyy')}</Text>
                    </SimpleGrid>
                  </Box>
                  
                  <Divider />
                  
                  <Box>
                    <Button 
                      colorScheme="brand" 
                      size="sm" 
                      onClick={handleTestWebhook}
                    >
                      Test Webhook
                    </Button>
                  </Box>
                </VStack>
              </CardBody>
            </Card>
            
            <Card>
              <CardHeader>
                <Heading size="md">Notification Preferences</Heading>
              </CardHeader>
              <CardBody>
                <SimpleGrid columns={2} spacingY={4}>
                  <Text fontWeight="bold">Email Notifications:</Text>
                  <Badge colorScheme={webhook.notificationPreferences.email ? 'green' : 'gray'}>
                    {webhook.notificationPreferences.email ? 'Enabled' : 'Disabled'}
                  </Badge>
                  
                  <Text fontWeight="bold">Browser Notifications:</Text>
                  <Badge colorScheme={webhook.notificationPreferences.browser ? 'green' : 'gray'}>
                    {webhook.notificationPreferences.browser ? 'Enabled' : 'Disabled'}
                  </Badge>
                  
                  <Text fontWeight="bold">On Success:</Text>
                  <Badge colorScheme={webhook.notificationPreferences.onSuccess ? 'green' : 'gray'}>
                    {webhook.notificationPreferences.onSuccess ? 'Notify' : 'Don\'t Notify'}
                  </Badge>
                  
                  <Text fontWeight="bold">On Failure:</Text>
                  <Badge colorScheme={webhook.notificationPreferences.onFailure ? 'green' : 'gray'}>
                    {webhook.notificationPreferences.onFailure ? 'Notify' : 'Don\'t Notify'}
                  </Badge>
                </SimpleGrid>
              </CardBody>
            </Card>
          </SimpleGrid>
          
          <Card mb={6}>
            <CardHeader>
              <Heading size="md">Usage Instructions</Heading>
            </CardHeader>
            <CardBody>
              <Text mb={4}>
                Use this webhook URL in your TradingView alert messages with the following format:
              </Text>
              
              <Box 
                bg={codeBoxBg} 
                p={4} 
                borderRadius="md" 
                fontFamily="mono"
                fontSize="sm"
                overflowX="auto"
                mb={4}
              >
                {`{
  "passphrase": "${webhook.securityToken}",
  "ticker": "{{ticker}}",
  "action": "{{strategy.order.action}}",
  "price": {{close}},
  "quantity": 10,
  "order_type": "MARKET",
  "time_in_force": "DAY"
}`}
              </Box>
              
              <Text fontSize="sm" color="gray.500">
                Customize the JSON payload according to your TradingView alert requirements. 
                The <strong>passphrase</strong> must match your security token exactly.
              </Text>
            </CardBody>
          </Card>
        </>
      ) : null}
      
      <WebhookDeleteConfirmation
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        webhookName={webhook?.name || ''}
      />
    </Box>
  );
}