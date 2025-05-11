'use client';

import React from 'react';
import { Box, Container, Heading, Text, Button, Link } from '@chakra-ui/react';
import { SignupForm } from '@/components/auth';
import NextLink from 'next/link';

export default function SignupPage() {
  return (
    <Container maxW="md" py={12}>
      <Box p={8} bg="white" rounded="lg" boxShadow="lg">
        <Heading as="h1" size="lg" mb={6} textAlign="center">
          Create a Viewzenix Account
        </Heading>
        
        <SignupForm />
        
        <Text mt={6} textAlign="center">
          Already have an account?{' '}
          <Link as={NextLink} href="/auth/login" color="blue.500">
            Log in
          </Link>
        </Text>
      </Box>
    </Container>
  );
}