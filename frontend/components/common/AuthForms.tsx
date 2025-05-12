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
  Flex,
} from '@chakra-ui/react';
import { useAuth } from '@/context/AuthContext';

interface AuthFormProps {
  type: 'login' | 'signup' | 'reset';
}

export const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp, resetPassword } = useAuth();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (type === 'signup') {
        if (password !== confirmPassword) {
          setError("Passwords don't match");
          setIsLoading(false);
          return;
        }

        const { error } = await signUp(email, password);
        if (error) throw error;
        
        toast({
          title: 'Account created.',
          description: 'Please check your email to confirm your account.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else if (type === 'login') {
        const { error } = await signIn(email, password);
        if (error) throw error;
        
        toast({
          title: 'Login successful',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else if (type === 'reset') {
        const { error } = await resetPassword(email);
        if (error) throw error;
        
        toast({
          title: 'Password reset email sent',
          description: 'Please check your email for password reset instructions.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const formTitle = type === 'login' ? 'Log In' : type === 'signup' ? 'Sign Up' : 'Reset Password';
  
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
          {formTitle}
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
            />
          </FormControl>
          
          {type !== 'reset' && (
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </FormControl>
          )}
          
          {type === 'signup' && (
            <FormControl id="confirm-password" isRequired isInvalid={!!error && error.includes('match')}>
              <FormLabel>Confirm Password</FormLabel>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
              />
              {error && error.includes('match') && (
                <FormErrorMessage>{error}</FormErrorMessage>
              )}
            </FormControl>
          )}
          
          {error && !error.includes('match') && (
            <Text color="red.500" fontSize="sm">
              {error}
            </Text>
          )}
          
          <Button
            colorScheme="blue"
            size="lg"
            type="submit"
            isLoading={isLoading}
            loadingText={type === 'login' ? 'Logging in' : type === 'signup' ? 'Signing up' : 'Sending reset email'}
            w="100%"
            mt={4}
          >
            {type === 'login' ? 'Log In' : type === 'signup' ? 'Sign Up' : 'Send Reset Email'}
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

/**
 * Component to render either Login or Signup form with ability to switch between them
 */
export const AuthFormToggle: React.FC = () => {
  const [formType, setFormType] = useState<'login' | 'signup'>('login');
  
  return (
    <Flex direction="column" align="center" maxW="400px" mx="auto" pt={8}>
      <AuthForm type={formType} />
      <Button 
        variant="link" 
        mt={4} 
        onClick={() => setFormType(formType === 'login' ? 'signup' : 'login')}
      >
        {formType === 'login' 
          ? "Don't have an account? Sign up" 
          : "Already have an account? Log in"}
      </Button>
    </Flex>
  );
};