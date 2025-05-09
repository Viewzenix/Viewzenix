import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Stat,
  Flex,
  Button,
  Spinner,
  Alert
} from '@chakra-ui/react';
import { MainLayout } from '@/components/layout';
import { authService } from '@/services/auth.service';
import { webhookService } from '@/services/webhook.service';
import { WebhookConfig } from '@/types/webhook';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check authentication and load data
  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      try {
        // Check if user is authenticated
        const isAuthenticated = await authService.isAuthenticated();
        
        if (!isAuthenticated) {
          // Redirect to auth page if not authenticated
          router.push('/auth');
          return;
        }
        
        // Get user data
        const { user: userData } = await authService.getUser();
        setUser(userData);
        
        // Load webhooks
        const webhookData = await webhookService.getWebhooks();
        setWebhooks(webhookData);
      } catch (err) {
        console.error('Dashboard data loading error:', err);
        setError('Failed to load dashboard data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthAndLoadData();
  }, [router]);
  
  if (loading) {
    return (
      <Flex height="100vh" align="center" justify="center">
        <Spinner size="xl" color="brand.500" />
      </Flex>
    );
  }
  
  return (
    <MainLayout>
      <Container maxW="container.xl" py={8}>
        {error && (
          <Alert.Root status="error" mb={6}>
            <Alert.Icon />
            {error}
          </Alert.Root>
        )}
        
        <Heading size="lg" mb={6}>Dashboard</Heading>
        
        {/* Stats */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
          <Stat bg="white" p={5} borderRadius="lg" boxShadow="md">
            <Stat.Label>Total Webhooks</Stat.Label>
            <Stat.Number>{webhooks.length}</Stat.Number>
            <Stat.HelpText>Configured webhook endpoints</Stat.HelpText>
          </Stat>
          
          <Stat bg="white" p={5} borderRadius="lg" boxShadow="md">
            <Stat.Label>Active Webhooks</Stat.Label>
            <Stat.Number>
              {webhooks.filter(webhook => webhook.isActive).length}
            </Stat.Number>
            <Stat.HelpText>Currently receiving signals</Stat.HelpText>
          </Stat>
          
          <Stat bg="white" p={5} borderRadius="lg" boxShadow="md">
            <Stat.Label>Recent Signals</Stat.Label>
            <Stat.Number>0</Stat.Number>
            <Stat.HelpText>In the last 24 hours</Stat.HelpText>
          </Stat>
        </SimpleGrid>
        
        {/* Webhook list */}
        <Box bg="white" p={6} borderRadius="lg" boxShadow="md">
          <Flex justify="space-between" align="center" mb={4}>
            <Heading size="md">Your Webhooks</Heading>
            <Button colorPalette="brand" size="sm">
              Create Webhook
            </Button>
          </Flex>
          
          {webhooks.length === 0 ? (
            <Box py={8} textAlign="center">
              <Text color="gray.500">
                You don't have any webhooks configured yet.
              </Text>
              <Button mt={4} colorPalette="brand">
                Create Your First Webhook
              </Button>
            </Box>
          ) : (
            <Box>
              {/* Webhook list would go here */}
              <Text>Webhook list placeholder</Text>
            </Box>
          )}
        </Box>
      </Container>
    </MainLayout>
  );
}