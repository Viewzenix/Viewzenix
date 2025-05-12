'use client';

import { useEffect } from 'react';
import { Box, Container, Heading } from '@chakra-ui/react';
import { AuthFormToggle } from '@/components/common/AuthForms';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { session, isLoading } = useAuth();
  const router = useRouter();
  
  // Redirect if already logged in
  useEffect(() => {
    if (session && !isLoading) {
      router.push('/dashboard');
    }
  }, [session, isLoading, router]);
  
  // If loading or already authenticated, show minimal content
  if (isLoading || session) {
    return (
      <Container maxW="container.md" py={10} centerContent>
        <Box textAlign="center">
          <Heading size="md">Please wait...</Heading>
        </Box>
      </Container>
    );
  }
  
  return (
    <Container maxW="container.md" py={10}>
      <Box textAlign="center" mb={10}>
        <Heading as="h1" size="xl">Viewzenix</Heading>
        <Heading as="h2" size="md" mt={2} fontWeight="medium" color="gray.600">
          Trading Webhook Platform
        </Heading>
      </Box>
      
      <AuthFormToggle />
    </Container>
  );
}