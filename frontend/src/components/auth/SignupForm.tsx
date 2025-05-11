'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Stack,
  Input,
} from '@chakra-ui/react';

type SignupFormData = {
  email: string;
  password: string;
  confirmPassword: string;
};

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>();
  
  const password = watch('password', '');

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
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
      setIsLoading(false);
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
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="********"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: value => value === password || 'Passwords do not match',
              })}
            />
            {errors.confirmPassword && <div className="error-message">{errors.confirmPassword.message}</div>}
          </div>
          
          <Button
            type="submit"
            colorPalette="blue"
            isLoading={isLoading}
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