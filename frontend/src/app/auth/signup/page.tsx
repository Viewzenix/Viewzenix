'use client';

import { Box, Button, Container, Heading, Link, Text } from '@chakra-ui/react';
import { SignupForm } from '@/components/auth/SignupForm';
import NextLink from 'next/link';

export default function SignupPage() {
  return (
    <Container maxW="md" py={12}>
      <Box p={8} bg="white" _dark={{ bg: 'gray.800' }} rounded="lg" boxShadow="lg">
        <Heading as="h1" size="lg" mb={6} textAlign="center">
          Create a Viewzenix Account
        </Heading>
        
        <SignupForm />
        
        <Text mt={6} textAlign="center">
          Already have an account?{' '}
          <Link as={NextLink} href="/auth/login" colorPalette="blue">
            Log in
          </Link>
        </Text>
      </Box>
    </Container>
  );
}