import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { 
  Box, 
  Container, 
  Flex, 
  Heading, 
  Text, 
  Image 
} from '@chakra-ui/react';
import { AuthTabs } from '@/components/auth';
import { authService } from '@/services/auth.service';

export default function AuthPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuthenticated = await authService.isAuthenticated();
        
        if (isAuthenticated) {
          // Redirect to dashboard if already authenticated
          router.push('/dashboard');
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);
  
  const handleAuthSuccess = () => {
    // Redirect to dashboard on successful authentication
    router.push('/dashboard');
  };
  
  if (loading) {
    return (
      <Flex minH="100vh" align="center" justify="center">
        {/* Replace with actual loading spinner */}
        <Box>Loading...</Box>
      </Flex>
    );
  }
  
  return (
    <Flex 
      minH="100vh" 
      direction={{ base: 'column', md: 'row' }}
    >
      {/* Left side - Auth form */}
      <Flex 
        flex={1} 
        align="center" 
        justify="center"
        p={8}
      >
        <Container maxW="md">
          <Box mb={8} textAlign="center">
            <Heading size="xl" mb={2}>Viewzenix</Heading>
            <Text fontSize="lg" color="gray.600">
              Trading Webhook Platform
            </Text>
          </Box>
          
          <AuthTabs onAuthSuccess={handleAuthSuccess} />
        </Container>
      </Flex>
      
      {/* Right side - Background image */}
      <Box 
        flex={1} 
        bg="brand.500" 
        display={{ base: 'none', md: 'block' }}
      >
        <Flex 
          height="100%" 
          align="center" 
          justify="center" 
          direction="column"
          p={8}
          color="white"
          textAlign="center"
        >
          <Heading size="lg" mb={4}>
            Automate Your Trading Strategy
          </Heading>
          <Text fontSize="md" mb={6}>
            Connect TradingView alerts to your broker accounts
            with our powerful webhook platform
          </Text>
          
          {/* Placeholder for an illustration or screenshot */}
          <Box 
            width="80%" 
            height="400px" 
            bg="rgba(255,255,255,0.1)" 
            borderRadius="lg"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text>Trading Dashboard Illustration</Text>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
}