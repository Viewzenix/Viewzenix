'use client';

import { Box, Button, Container, Flex, Heading, SimpleGrid, Text, Card } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function DashboardPage() {
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

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    router.push('/auth/login');
  };

  if (loading) {
    return null;
  }

  return (
    <Box>
      <Box as="header" py={4} px={6} bg="white" _dark={{ bg: 'gray.800' }} boxShadow="sm">
        <Flex justify="space-between" align="center" maxW="container.xl" mx="auto">
          <Heading as="h1" size="lg">Viewzenix</Heading>
          <Button onClick={handleLogout} variant="ghost">Logout</Button>
        </Flex>
      </Box>

      <Container maxW="container.xl" py={8}>
        <Heading mb={6}>Dashboard</Heading>
        
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6} mb={8}>
          <DashboardCard 
            title="Webhook Setup" 
            description="Configure webhook endpoints for TradingView alerts"
            action={() => router.push('/webhook-setup')}
          />
          <DashboardCard 
            title="Broker Connections" 
            description="Manage your trading broker API connections"
            action={() => router.push('/brokers')}
          />
          <DashboardCard 
            title="Trading Bots" 
            description="Configure and monitor your automated trading bots"
            action={() => router.push('/bots')}
          />
        </SimpleGrid>
        
        <Box p={6} bg="white" _dark={{ bg: 'gray.800' }} borderRadius="md" boxShadow="sm">
          <Heading size="md" mb={4}>Recent Activity</Heading>
          <Text color="gray.500">No recent activity to display.</Text>
        </Box>
      </Container>
    </Box>
  );
}

function DashboardCard({ title, description, action }) {
  return (
    <Card.Root p={6} boxShadow="md" borderRadius="lg">
      <Card.Body>
        <Heading size="md" mb={2}>{title}</Heading>
        <Text mb={4} color="gray.600" _dark={{ color: 'gray.300' }}>{description}</Text>
        <Button onClick={action} colorPalette="blue" mt="auto">
          Configure
        </Button>
      </Card.Body>
    </Card.Root>
  );
}