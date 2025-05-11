'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Stack,
  Input,
  Link,
  Text,
  Field,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { Icon } from '@/components/ui/icons';

type LoginFormData = {
  email: string;
  password: string;
};

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const handlePasswordVisibility = () => setShowPassword(!showPassword);

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Replace with real auth integration
      console.log('Login attempt with:', data);
      
      // Simulate successful login for now
      localStorage.setItem('isAuthenticated', 'true');
      
      // Redirect to dashboard after login
      router.push('/');
    } catch (err) {
      setError('Login failed. Please check your credentials and try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {error && (
        <Text color="red.500" mb={4} textAlign="center">
          {error}
        </Text>
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
          
          <Button
            type="submit"
            colorPalette="blue"
            loading={loading}
            width="full"
            mt={4}
          >
            Log In
          </Button>
        </Stack>
      </form>
      
      <Link as={NextLink} href="/auth/forgot-password">
        <Text mt={2} textAlign="right" fontSize="sm" color="blue.500">
          Forgot your password?
        </Text>
      </Link>
    </Box>
  );
}