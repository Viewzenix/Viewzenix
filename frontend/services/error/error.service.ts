import { createStandaloneToast } from '@chakra-ui/react';
import theme from '@/styles/theme';

const { toast } = createStandaloneToast({ theme });

// Error severity levels
export enum ErrorSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

// Error source - where the error originated
export enum ErrorSource {
  UI = 'ui',
  API = 'api',
  AUTH = 'auth',
  UNKNOWN = 'unknown',
}

// Error notification options
export interface ErrorNotificationOptions {
  title?: string;
  duration?: number;
  isClosable?: boolean;
  position?: 'top' | 'top-right' | 'top-left' | 'bottom' | 'bottom-right' | 'bottom-left';
  showToast?: boolean;
}

// Error context - additional information to help with debugging
export interface ErrorContext {
  componentStack?: string;
  path?: string;
  additionalData?: Record<string, unknown>;
}

// Custom error interface
export interface ErrorDetails {
  message: string;
  severity: ErrorSeverity;
  source: ErrorSource;
  originalError?: Error | unknown;
  context?: ErrorContext;
}

/**
 * Centralized error service for handling application errors
 */
class ErrorService {
  /**
   * Log an error to the console and optionally show a toast notification
   */
  public handleError(details: ErrorDetails, options: ErrorNotificationOptions = {}): void {
    const { message, severity, source, originalError, context } = details;
    
    // Default options
    const defaultOptions = {
      title: this.getSeverityTitle(severity),
      duration: 5000,
      isClosable: true,
      position: 'top-right',
      showToast: true,
    };
    
    const notificationOptions = { ...defaultOptions, ...options };
    
    // Log to console for developers
    this.logToConsole({ message, severity, source, originalError, context });
    
    // Show user notification if enabled
    if (notificationOptions.showToast) {
      this.showToastNotification(message, severity, notificationOptions);
    }
    
    // Send to external monitoring service
    // This can be expanded when integrating with monitoring tools like Sentry
    this.sendToMonitoring({ message, severity, source, originalError, context });
  }
  
  /**
   * Show a toast notification for an error
   */
  private showToastNotification(
    message: string, 
    severity: ErrorSeverity,
    options: ErrorNotificationOptions
  ): void {
    const status = this.mapSeverityToStatus(severity);
    
    toast({
      title: options.title,
      description: message,
      status,
      duration: options.duration,
      isClosable: options.isClosable,
      position: options.position as any,
    });
  }
  
  /**
   * Log error details to the console
   */
  private logToConsole(details: ErrorDetails): void {
    const { message, severity, source, originalError, context } = details;
    
    // Create formatted console message
    const logPrefix = `[${source.toUpperCase()}][${severity.toUpperCase()}]`;
    
    switch (severity) {
      case ErrorSeverity.INFO:
        console.info(`${logPrefix} ${message}`, { originalError, context });
        break;
      case ErrorSeverity.WARNING:
        console.warn(`${logPrefix} ${message}`, { originalError, context });
        break;
      case ErrorSeverity.ERROR:
      case ErrorSeverity.CRITICAL:
        console.error(`${logPrefix} ${message}`, { originalError, context });
        break;
      default:
        console.log(`${logPrefix} ${message}`, { originalError, context });
    }
  }
  
  /**
   * Send error to external monitoring service (placeholder)
   * This method can be implemented when integrating with services like Sentry
   */
  private sendToMonitoring(details: ErrorDetails): void {
    // Integration point for external monitoring services
    // Example: Sentry.captureException(details.originalError, { extra: details })
  }
  
  /**
   * Map error severity to Chakra UI toast status
   */
  private mapSeverityToStatus(severity: ErrorSeverity): 'info' | 'warning' | 'error' | 'success' {
    switch (severity) {
      case ErrorSeverity.INFO:
        return 'info';
      case ErrorSeverity.WARNING:
        return 'warning';
      case ErrorSeverity.ERROR:
      case ErrorSeverity.CRITICAL:
        return 'error';
      default:
        return 'error';
    }
  }
  
  /**
   * Get title based on severity
   */
  private getSeverityTitle(severity: ErrorSeverity): string {
    switch (severity) {
      case ErrorSeverity.INFO:
        return 'Information';
      case ErrorSeverity.WARNING:
        return 'Warning';
      case ErrorSeverity.ERROR:
        return 'Error';
      case ErrorSeverity.CRITICAL:
        return 'Critical Error';
      default:
        return 'Error';
    }
  }
}

// Export singleton instance
export const errorService = new ErrorService();

// Convenience methods for common error types
export const notifyError = (message: string, originalError?: Error | unknown, context?: ErrorContext) => {
  errorService.handleError({
    message,
    severity: ErrorSeverity.ERROR,
    source: ErrorSource.UNKNOWN,
    originalError,
    context,
  });
};

export const notifyApiError = (message: string, originalError?: Error | unknown, context?: ErrorContext) => {
  errorService.handleError({
    message,
    severity: ErrorSeverity.ERROR,
    source: ErrorSource.API,
    originalError,
    context,
  });
};

export const notifyWarning = (message: string, context?: ErrorContext) => {
  errorService.handleError({
    message,
    severity: ErrorSeverity.WARNING,
    source: ErrorSource.UNKNOWN,
    context,
  });
};

export const notifyInfo = (message: string, context?: ErrorContext) => {
  errorService.handleError({
    message,
    severity: ErrorSeverity.INFO,
    source: ErrorSource.UNKNOWN,
    context,
  });
};