'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  Heading,
  FormErrorMessage,
  useToast,
} from '@chakra-ui/react';
import { useAuth } from '@/context/AuthContext';

interface SignupFormProps {
  onSuccess?: () => void;
  redirectUrl?: string;
}

/**
 * Signup form component
 * Handles user registration with email, password, and password confirmation
 */
export const SignupForm: React.FC<SignupFormProps> = ({
  onSuccess,
  redirectUrl,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    // Validate password strength
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    
    setIsLoading(true);

    try {
      const { error: signUpError } = await signUp(email, password);
      
      if (signUpError) {
        throw signUpError;
      }
      
      toast({
        title: 'Account created',
        description: 'Please check your email to confirm your account.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      // Handle successful signup
      if (onSuccess) {
        onSuccess();
      } else if (redirectUrl && typeof window !== 'undefined') {
        window.location.href = redirectUrl;
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during signup');
      console.error('Signup error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Box
      p={8}
      maxWidth="400px"
      borderWidth={1}
      borderRadius={8}
      boxShadow="lg"
      mx="auto"
    >
      <Box textAlign="center">
        <Heading size="lg" mb={6}>
          Sign Up
        </Heading>
      </Box>
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <FormControl id="email" isRequired>
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
            />
          </FormControl>
          
          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="new-password"
            />
          </FormControl>
          
          <FormControl 
            id="confirm-password" 
            isRequired 
            isInvalid={!!error && error.includes("match")}
          >
            <FormLabel>Confirm Password</FormLabel>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              autoComplete="new-password"
            />
            {error && error.includes("match") && (
              <FormErrorMessage>{error}</FormErrorMessage>
            )}
          </FormControl>
          
          {error && !error.includes("match") && (
            <Text color="red.500" fontSize="sm">
              {error}
            </Text>
          )}
          
          <Button
            colorScheme="blue"
            size="lg"
            type="submit"
            isLoading={isLoading}
            loadingText="Signing Up"
            w="100%"
            mt={4}
          >
            Sign Up
          </Button>
        </Stack>
      </form>
    </Box>
  );
};