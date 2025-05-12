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
  SUPABASE = 'supabase',
  DATABASE = 'database',
  UNKNOWN = 'unknown',
}

// Error codes for standardization
export enum ErrorCode {
  // Authentication errors
  INVALID_CREDENTIALS = 'auth/invalid-credentials',
  SESSION_EXPIRED = 'auth/session-expired',
  UNAUTHORIZED = 'auth/unauthorized',
  
  // Validation errors
  VALIDATION_ERROR = 'validation/error',
  
  // API errors
  API_UNAVAILABLE = 'api/unavailable',
  API_TIMEOUT = 'api/timeout',
  API_RESPONSE_ERROR = 'api/response-error',
  
  // Supabase errors
  SUPABASE_AUTH_ERROR = 'supabase/auth-error',
  SUPABASE_DATABASE_ERROR = 'supabase/database-error',
  SUPABASE_STORAGE_ERROR = 'supabase/storage-error',
  
  // Network errors
  NETWORK_ERROR = 'network/error',
  OFFLINE = 'network/offline',
  
  // Unknown
  UNKNOWN_ERROR = 'unknown/error',
}

/**
 * Custom application error class with enhanced features
 */
export class AppError extends Error {
  code: ErrorCode;
  severity: ErrorSeverity;
  source: ErrorSource;
  context?: ErrorContext;
  originalError?: Error | unknown;
  
  constructor(options: {
    message: string;
    code: ErrorCode;
    severity?: ErrorSeverity;
    source?: ErrorSource;
    context?: ErrorContext;
    originalError?: Error | unknown;
  }) {
    super(options.message);
    
    this.name = 'AppError';
    this.code = options.code;
    this.severity = options.severity || ErrorSeverity.ERROR;
    this.source = options.source || ErrorSource.UNKNOWN;
    this.context = options.context;
    this.originalError = options.originalError;
    
    // Capture stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
  
  /**
   * Static method to create an error from an unknown error
   */
  static fromUnknown(error: unknown, defaultMessage: string = 'An unexpected error occurred'): AppError {
    // If it's already an AppError, return it
    if (error instanceof AppError) {
      return error;
    }
    
    // For standard errors
    if (error instanceof Error) {
      return new AppError({
        message: error.message || defaultMessage,
        code: ErrorCode.UNKNOWN_ERROR,
        originalError: error,
      });
    }
    
    // For unknown objects
    return new AppError({
      message: typeof error === 'string' ? error : defaultMessage,
      code: ErrorCode.UNKNOWN_ERROR,
      originalError: error,
    });
  }
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
   * Handle an AppError instance
   */
  public handleAppError(error: AppError, options: ErrorNotificationOptions = {}): void {
    this.handleError({
      message: error.message,
      severity: error.severity,
      source: error.source,
      originalError: error.originalError || error,
      context: error.context,
    }, options);
  }
  
  /**
   * Handle an unknown error (converts to AppError first)
   */
  public handleUnknownError(
    error: unknown, 
    defaultMessage: string = 'An unexpected error occurred',
    options: ErrorNotificationOptions = {}
  ): void {
    const appError = AppError.fromUnknown(error, defaultMessage);
    this.handleAppError(appError, options);
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

// AppError convenience methods
export const createAppError = (options: {
  message: string;
  code: ErrorCode;
  severity?: ErrorSeverity;
  source?: ErrorSource;
  context?: ErrorContext;
  originalError?: Error | unknown;
}): AppError => {
  return new AppError(options);
};

export const handleAppError = (error: AppError, options: ErrorNotificationOptions = {}): void => {
  errorService.handleAppError(error, options);
};

export const handleUnknownError = (
  error: unknown,
  defaultMessage: string = 'An unexpected error occurred',
  options: ErrorNotificationOptions = {}
): void => {
  errorService.handleUnknownError(error, defaultMessage, options);
};

// Supabase specific error handlers
export const notifySupabaseError = (error: unknown, defaultMessage: string = 'Supabase operation failed'): void => {
  errorService.handleError({
    message: error instanceof Error ? error.message : defaultMessage,
    severity: ErrorSeverity.ERROR,
    source: ErrorSource.SUPABASE,
    originalError: error,
  });
};