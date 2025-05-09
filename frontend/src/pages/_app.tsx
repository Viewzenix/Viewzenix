import '@/styles/globals.css';
import type { AppProps } from 'next/app';

// Import MSW setup in development environment
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  require('@/mocks/setup');
}

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
} 