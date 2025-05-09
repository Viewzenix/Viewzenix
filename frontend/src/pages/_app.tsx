import '@/styles/globals.css';
import { ChakraProvider } from '@chakra-ui/react';
import system from '@/styles/theme';
import type { AppProps } from 'next/app';

// Import MSW setup in development environment
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  require('@/mocks/setup');
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider value={system}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}