import { useState } from 'react';
import { 
  Box, 
  Button, 
  FormControl, 
  FormLabel, 
  Input, 
  VStack, 
  FormErrorMessage, 
  Alert, 
  AlertIcon, 
  Heading, 
  Text 
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { authService } from '@/services/auth.service';

interface LoginFormProps {
  onSuccess?: () => void;
}

interface LoginFormData {
  email: string;
  password: string;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<LoginFormData>();
  
  const [error, setError] = useState<string | null>(null);
  
  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null);
      const result = await authService.signIn(data.email, data.password);
      
      if (result.error) {
        setError(result.error.message);
        return;
      }
      
      if (result.user && onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    }
  };
  
  return (
    <Box w="100%" maxW="400px" p={4}>
      <Stack direction="column" spacing={6} align="stretch">
        <Box textAlign="center">
          <Heading size="lg">Sign In</Heading>
          <Text mt={2} color="gray.600">Access your Viewzenix dashboard</Text>
        </Box>
        
        {error && (
          <Alert.Root status="error" borderRadius="md">
            <Alert.Icon />
            {error}
          </Alert.Root>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack direction="column" spacing={4}>
            <FormControl invalid={!!errors.email}>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
              />
              <FormErrorMessage>
                {errors.email && errors.email.message}
              </FormErrorMessage>
            </FormControl>
            
            <FormControl invalid={!!errors.password}>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                })}
              />
              <FormErrorMessage>
                {errors.password && errors.password.message}
              </FormErrorMessage>
            </FormControl>
            
            <Button 
              type="submit" 
              colorPalette="brand" 
              width="full" 
              mt={4} 
              loading={isSubmitting}
              loadingText="Signing In"
            >
              Sign In
            </Button>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
}