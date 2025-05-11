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
} from '@chakra-ui/react';
import NextLink from 'next/link';

type LoginFormData = {
  email: string;
  password: string;
};

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
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
      setIsLoading(false);
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
        <Stack direction="column" spacing={4}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <Input
              id="email"
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
            {errors.email && <div className="error-message">{errors.email.message}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
              })}
            />
            {errors.password && <div className="error-message">{errors.password.message}</div>}
          </div>
          
          <Button
            type="submit"
            colorPalette="blue"
            isLoading={isLoading}
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