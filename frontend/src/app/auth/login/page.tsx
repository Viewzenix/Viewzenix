'use client';

import { Box, Button, Container, Heading, Link, Text } from '@chakra-ui/react';
import { LoginForm } from '@/components/auth/LoginForm';
import NextLink from 'next/link';

export default function LoginPage() {
  return (
    <Container maxW="md" py={12}>
      <Box p={8} bg="white" _dark={{ bg: 'gray.800' }} rounded="lg" boxShadow="lg">
        <Heading as="h1" size="lg" mb={6} textAlign="center">
          Log In to Viewzenix
        </Heading>
        
        <LoginForm />
        
        <Text mt={6} textAlign="center">
          Don&apos;t have an account?{' '}
          <Link as={NextLink} href="/auth/signup" colorPalette="blue">
            Sign up
          </Link>
        </Text>
      </Box>
    </Container>
  );
}