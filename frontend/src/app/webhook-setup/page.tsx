'use client';

import { Box, Container, Heading, Text } from '@chakra-ui/react';
import { AppLayout } from '@/components/layout/AppLayout';
import { WebhookConfigForm } from '@/components/webhook/WebhookConfigForm';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function WebhookSetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  // Check authentication on page load
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      router.push('/auth/login');
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return null;
  }

  return (
    <AppLayout>
      <Container maxW="container.lg" py={8}>
        <Box mb={8}>
          <Heading as="h1" size="xl" mb={2}>
            Webhook Setup
          </Heading>
          <Text color="gray.600" _dark={{ color: 'gray.300' }}>
            Configure your webhook endpoint to receive trading signals from TradingView
          </Text>
        </Box>

        <WebhookConfigForm />
        
        <Box mt={12}>
          <Heading as="h2" size="md" mb={4}>
            How to Use Your Webhook
          </Heading>
          
          <Box 
            p={4} 
            bg="gray.50" 
            _dark={{ bg: 'gray.700' }} 
            borderRadius="md"
            fontSize="sm"
          >
            <Text mb={3}>
              <strong>Step 1:</strong> In TradingView, create a new alert for your indicator or strategy.
            </Text>
            <Text mb={3}>
              <strong>Step 2:</strong> In the alert dialog, select "Webhook URL" as the alert action.
            </Text>
            <Text mb={3}>
              <strong>Step 3:</strong> Copy and paste your webhook URL from above.
            </Text>
            <Text mb={3}>
              <strong>Step 4:</strong> In the message field, include your passphrase and trading parameters:
            </Text>
            <Box 
              as="pre" 
              p={3} 
              bg="gray.100" 
              _dark={{ bg: 'gray.800' }} 
              borderRadius="md" 
              overflowX="auto"
              mb={3}
            >
              {`{
  "passphrase": "YOUR_PASSPHRASE",
  "ticker": "{{ticker}}",
  "action": "{{strategy.order.action}}",
  "quantity": 10,
  "price": {{close}},
  "order_type": "MARKET"
}`}
            </Box>
            <Text>
              <strong>Step 5:</strong> Save your alert. When triggered, it will send the trading signal to Viewzenix.
            </Text>
          </Box>
        </Box>
      </Container>
    </AppLayout>
  );
}