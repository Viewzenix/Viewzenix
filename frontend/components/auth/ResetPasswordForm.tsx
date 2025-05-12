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
  useToast,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useAuth } from '@/context/AuthContext';

interface ResetPasswordFormProps {
  onSuccess?: () => void;
  redirectUrl?: string;
}

/**
 * Reset password form component
 * Handles password reset requests via email
 */
export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  onSuccess,
  redirectUrl,
}) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { resetPassword } = useAuth();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { error: resetError } = await resetPassword(email);
      
      if (resetError) {
        throw resetError;
      }
      
      setIsSubmitted(true);
      
      toast({
        title: 'Reset email sent',
        description: 'Please check your email for password reset instructions.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      // Handle successful reset request
      if (onSuccess) {
        onSuccess();
      } else if (redirectUrl && typeof window !== 'undefined') {
        window.location.href = redirectUrl;
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while sending the reset email');
      console.error('Password reset error:', err);
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
          Reset Password
        </Heading>
      </Box>
      
      {isSubmitted ? (
        <Alert status="success" borderRadius="md">
          <AlertIcon />
          We've sent password reset instructions to {email}.
          Please check your email.
        </Alert>
      ) : (
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
            
            {error && (
              <Text color="red.500" fontSize="sm">
                {error}
              </Text>
            )}
            
            <Button
              colorScheme="blue"
              size="lg"
              type="submit"
              isLoading={isLoading}
              loadingText="Sending Reset Email"
              w="100%"
              mt={4}
            >
              Send Reset Email
            </Button>
          </Stack>
        </form>
      )}
    </Box>
  );
};