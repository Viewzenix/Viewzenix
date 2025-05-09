import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box, Spinner, Flex } from '@chakra-ui/react';
import { authService } from '@/services/auth.service';

export default function HomePage() {
  const router = useRouter();
  
  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        const isAuthenticated = await authService.isAuthenticated();
        
        if (isAuthenticated) {
          router.push('/dashboard');
        } else {
          router.push('/auth');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/auth');
      }
    };
    
    checkAuthAndRedirect();
  }, [router]);
  
  return (
    <Flex height="100vh" align="center" justify="center">
      <Spinner size="xl" color="brand.500" />
    </Flex>
  );
}