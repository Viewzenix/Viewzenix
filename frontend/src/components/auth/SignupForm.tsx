'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Stack,
  Input,
  Field,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { Icon } from '@/components/ui/icons';

type SignupFormData = {
  email: string;
  password: string;
  confirmPassword: string;
};

export function SignupForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>();
  
  const password = watch('password', '');
  
  const handlePasswordVisibility = () => setShowPassword(!showPassword);

  const onSubmit = async (data: SignupFormData) => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Replace with real auth integration
      console.log('Signup attempt with:', data);
      
      // Simulate successful registration
      localStorage.setItem('isAuthenticated', 'true');
      
      // Redirect to dashboard after signup
      router.push('/');
    } catch (err) {
      setError('Signup failed. Please try again.');
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {error && (
        <Box color="red.500" mb={4} textAlign="center">
          {error}
        </Box>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack direction="column" gap={4}>
          <Field.Root invalid={Boolean(errors.email)}>
            <Field.Label>Email</Field.Label>
            <Input
              type="email"
              placeholder="your@email.com"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />
            {errors.email && (
              <Field.ErrorText>{errors.email.message?.toString()}</Field.ErrorText>
            )}
          </Field.Root>
          
          <Field.Root invalid={Boolean(errors.password)}>
            <Field.Label>Password</Field.Label>
            <InputGroup>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="********"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                })}
              />
              <InputRightElement width="3rem">
                <Button h="1.5rem" size="sm" onClick={handlePasswordVisibility}>
                  {showPassword ? <Icon name="view-off" /> : <Icon name="view" />}
                </Button>
              </InputRightElement>
            </InputGroup>
            {errors.password && (
              <Field.ErrorText>{errors.password.message?.toString()}</Field.ErrorText>
            )}
          </Field.Root>
          
          <Field.Root invalid={Boolean(errors.confirmPassword)}>
            <Field.Label>Confirm Password</Field.Label>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="********"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: value => value === password || 'Passwords do not match',
              })}
            />
            {errors.confirmPassword && (
              <Field.ErrorText>{errors.confirmPassword.message?.toString()}</Field.ErrorText>
            )}
          </Field.Root>
          
          <Button
            type="submit"
            colorPalette="blue"
            loading={loading}
            width="full"
            mt={4}
          >
            Create Account
          </Button>
        </Stack>
      </form>
    </Box>
  );
}