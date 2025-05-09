/**
 * Error Service
 * 
 * Centralized error handling and logging for the application.
 * Provides methods for logging errors and displaying user-friendly error messages.
 */

// Import toast implementation as needed
// For example, with Chakra UI:
import { useToast } from '@chakra-ui/react';

/**
 * Custom error class for application errors
 */
export class ApplicationError extends Error {
  code: string;
  details?: any;

  constructor(code: string, message: string, details?: any) {
    super(message);
    this.name = 'ApplicationError';
    this.code = code;
    this.details = details;
  }
}

/**
 * Error service for centralized error handling
 */
export class ErrorService {
  private static instance: ErrorService;
  private toast: any;

  /**
   * Private constructor for singleton pattern
   */
  private constructor() {
    // Initialize toast in a component context
    this.setToastFunction();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): ErrorService {
    if (!ErrorService.instance) {
      ErrorService.instance = new ErrorService();
    }
    return ErrorService.instance;
  }

  /**
   * Set the toast function for displaying errors
   * This needs to be called from a component context
   */
  public setToastFunction(): void {
    // This will be set properly in a React component
    if (typeof window !== 'undefined') {
      this.toast = (options: any) => {
        console.warn('Toast not initialized. Call setToastFunction from a component.');
        console.warn('Toast message:', options);
      };
    }
  }

  /**
   * Log an error
   * @param source Source of the error
   * @param error Error object
   * @param context Additional context information
   */
  public logError(source: string, error: unknown, context?: Record<string, any>): void {
    console.error(`[${source}]`, error, context);
    
    // Send to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      // TODO: Implement integration with monitoring service
      // e.g., Sentry, LogRocket, etc.
    }
  }

  /**
   * Show an error message to the user
   * @param message User-friendly error message
   * @param error Original error (will be logged but not shown to user)
   */
  public showUserError(message: string, error?: unknown): void {
    if (this.toast) {
      this.toast({
        title: 'Error',
        description: message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
    
    if (error) {
      this.logError('UserError', error);
    }
  }

  /**
   * Handle an API error
   * @param error API error
   * @param defaultMessage Default message if error doesn't have one
   */
  public handleApiError(error: any, defaultMessage = 'An error occurred. Please try again.'): void {
    const message = error?.message || defaultMessage;
    this.showUserError(message, error);
  }
}

// Export singleton instance
export const errorService = ErrorService.getInstance();