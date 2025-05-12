'use client';

import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from './ErrorFallback';
import { errorService, ErrorSeverity, ErrorSource } from '@/services/error';

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * ErrorBoundary component that wraps React's error boundary functionality
 * with our custom error handling service
 */
export const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ 
  children,
  fallback,
}) => {
  const handleError = (error: Error, info: { componentStack: string }) => {
    errorService.handleError({
      message: error.message,
      severity: ErrorSeverity.ERROR,
      source: ErrorSource.UI,
      originalError: error,
      context: {
        componentStack: info.componentStack,
        path: typeof window !== 'undefined' ? window.location.pathname : '',
      },
    });
  };

  return (
    <ReactErrorBoundary
      FallbackComponent={fallback ? () => <>{fallback}</> : ErrorFallback}
      onError={handleError}
    >
      {children}
    </ReactErrorBoundary>
  );
};