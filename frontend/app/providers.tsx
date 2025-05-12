'use client';

import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '@/styles/theme';
import { AuthProvider } from '@/context/AuthContext';
import { ErrorBoundary } from '@/components/common/errors';

/**
 * Providers wrapper component for the application
 * Includes ChakraUI, Auth providers, and Error Boundary
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </AuthProvider>
    </ChakraProvider>
  );
}