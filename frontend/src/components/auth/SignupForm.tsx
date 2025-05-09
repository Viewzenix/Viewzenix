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

interface SignupFormProps {
  onSuccess?: () => void;
}

interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export function SignupForm({ onSuccess }: SignupFormProps) {
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors, isSubmitting } 
  } = useForm<SignupFormData>();
  
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const password = watch('password');
  
  const onSubmit = async (data: SignupFormData) => {
    try {
      setError(null);
      setSuccessMessage(null);
      
      const result = await authService.signUp(data.email, data.password);
      
      if (result.error) {
        setError(result.error.message);
        return;
      }
      
      setSuccessMessage('Your account has been created! You can now sign in.');
      
      if (result.session && onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Signup error:', err);
    }
  };
  
  return (
    <Box w="100%" maxW="400px" p={4}>
      <Stack direction="column" spacing={6} align="stretch">
        <Box textAlign="center">
          <Heading size="lg">Create Account</Heading>
          <Text mt={2} color="gray.600">Join Viewzenix trading platform</Text>
        </Box>
        
        {error && (
          <Alert.Root status="error" borderRadius="md">
            <Alert.Icon />
            {error}
          </Alert.Root>
        )}
        
        {successMessage && (
          <Alert.Root status="success" borderRadius="md">
            <Alert.Icon />
            {successMessage}
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
            
            <FormControl invalid={!!errors.confirmPassword}>
              <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: value => 
                    value === password || 'Passwords do not match',
                })}
              />
              <FormErrorMessage>
                {errors.confirmPassword && errors.confirmPassword.message}
              </FormErrorMessage>
            </FormControl>
            
            <Button 
              type="submit" 
              colorPalette="brand" 
              width="full" 
              mt={4} 
              loading={isSubmitting}
              loadingText="Creating Account"
            >
              Create Account
            </Button>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
}