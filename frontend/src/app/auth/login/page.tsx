'use client';

import React from 'react';
import { Box, Container, Heading, Text, Button, Link } from '@chakra-ui/react';
import { LoginForm } from '@/components/auth';
import NextLink from 'next/link';

export default function LoginPage() {
  return (
    <Container maxW="md" py={12}>
      <Box p={8} bg="white" rounded="lg" boxShadow="lg">
        <Heading as="h1" size="lg" mb={6} textAlign="center">
          Log In to Viewzenix
        </Heading>
        
        <LoginForm />
        
        <Text mt={6} textAlign="center">
          Don&apos;t have an account?{' '}
          <Link as={NextLink} href="/auth/signup" color="blue.500">
            Sign up
          </Link>
        </Text>
      </Box>
    </Container>
  );
}