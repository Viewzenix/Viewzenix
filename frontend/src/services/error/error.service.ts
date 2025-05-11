import { toaster } from '@/components/ui/toaster';

/**
 * Error service for handling and displaying errors
 */
export class ErrorService {
  /**
   * Display an error message using the toast system
   * @param message Error message to display
   * @param error Optional error object for logging
   */
  static showError(message: string, error?: any): void {
    toaster.create({
      title: 'Error',
      description: message,
      type: 'error',
      duration: 5000,
    });
    
    if (error) {
      console.error('Error details:', error);
    }
  }
  
  /**
   * Handle API errors and display appropriate messages
   * @param error Error from API call
   */
  static handleApiError(error: any): void {
    let message = 'An unexpected error occurred';
    
    if (error.response) {
      // Server responded with an error status
      const status = error.response.status;
      
      if (status === 401) {
        message = 'Authentication error. Please log in again.';
      } else if (status === 403) {
        message = 'You do not have permission to perform this action.';
      } else if (status === 404) {
        message = 'The requested resource was not found.';
      } else if (status >= 500) {
        message = 'Server error. Please try again later.';
      } else if (error.response.data?.message) {
        message = error.response.data.message;
      }
    } else if (error.request) {
      // Request was made but no response received
      message = 'No response from server. Please check your connection.';
    }
    
    this.showError(message, error);
  }
}