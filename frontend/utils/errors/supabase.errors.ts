import { 
  AppError, 
  ErrorCode, 
  ErrorSeverity, 
  ErrorSource, 
  ErrorContext 
} from '@/services/error/error.service';

/**
 * Supabase error codes and their corresponding messages
 */
export const SUPABASE_ERROR_CODES = {
  // Auth errors
  'auth/invalid-email': 'The email address is invalid.',
  'auth/email-already-in-use': 'The email address is already in use.',
  'auth/wrong-password': 'The password is invalid.',
  'auth/user-not-found': 'No user found with these credentials.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/weak-password': 'The password is too weak.',
  'auth/email-already-confirmed': 'Email is already confirmed.',
  'auth/invalid-phone-number': 'The phone number is invalid.',
  'auth/phone-already-in-use': 'The phone number is already in use.',
  'auth/provider-already-linked': 'The provider is already linked.',
  'auth/operation-not-allowed': 'This operation is not allowed.',
  'auth/expired-action-code': 'The action code has expired.',
  'auth/invalid-action-code': 'The action code is invalid.',
  'auth/invalid-verification-code': 'The verification code is invalid.',
  'auth/invalid-tenant-id': 'The tenant ID is invalid.',
  'auth/missing-android-pkg-name': 'Android package name is missing.',
  'auth/missing-continue-uri': 'Continue URL is missing.',
  'auth/missing-ios-bundle-id': 'iOS bundle ID is missing.',
  'auth/unauthorized-domain': 'The domain is not authorized.',
  'auth/invalid-continue-uri': 'Continue URL is invalid.',
  'auth/unauthorized-continue-uri': 'Continue URL is not authorized.',
  'auth/missing-email': 'Email is required.',
  'auth/missing-password': 'Password is required.',
  'auth/too-many-requests': 'Too many login attempts. Please try again later.',
  'auth/session-expired': 'Your session has expired. Please sign in again.',
  'auth/invalid-credential': 'The credential used is invalid or has expired.',

  // Database errors
  'database/not-found': 'The requested resource was not found.',
  'database/already-exists': 'The resource already exists.',
  'database/permission-denied': 'Permission denied to access this resource.',
  'database/constraint-violation': 'A constraint violation occurred.',
  'database/query-error': 'An error occurred while querying the database.',
  'database/timeout': 'The database operation timed out.',
  'database/rate-limit': 'Rate limit exceeded for database operations.',
  'database/foreign-key-violation': 'Foreign key constraint violation.',
  'database/unique-violation': 'Unique constraint violation.',
  'database/check-violation': 'Check constraint violation.',
  'database/not-null-violation': 'Not null constraint violation.',

  // Storage errors
  'storage/unauthorized': 'You are not authorized to access this storage object.',
  'storage/not-found': 'The storage object was not found.',
  'storage/quota-exceeded': 'Storage quota exceeded.',
  'storage/invalid-format': 'Invalid file format.',
  'storage/file-size-exceeded': 'File size exceeded.',
  'storage/canceled': 'The storage operation was canceled.',
  'storage/invalid-checksum': 'Invalid checksum.',
  'storage/object-already-exists': 'Storage object already exists.',

  // Network errors
  'network/no-internet': 'No internet connection.',
  'network/timeout': 'Request timed out.',
  'network/cors': 'CORS error. Cross-origin request blocked.',

  // Generic Supabase errors
  'supabase/unknown-error': 'An unknown Supabase error occurred.',
  'supabase/initialization-error': 'Failed to initialize Supabase client.',
  'supabase/extension-error': 'A Supabase extension error occurred.',
};

// Type for Supabase error response
export interface SupabaseErrorResponse {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
  error?: string;
  error_description?: string;
  statusCode?: number;
  status?: number;
}

/**
 * Determines if an error is from Supabase
 */
export function isSupabaseError(error: unknown): error is SupabaseErrorResponse {
  if (!error || typeof error !== 'object') return false;
  
  const err = error as any;
  
  // Check for Supabase error patterns
  return (
    err.code !== undefined || 
    err.error !== undefined || 
    err.error_description !== undefined ||
    (err.message && 
      (err.message.includes('supabase') || 
       err.message.includes('auth') || 
       err.message.includes('storage') || 
       err.message.includes('database')))
  );
}

/**
 * Maps a Supabase error to an AppError
 */
export function mapSupabaseError(error: unknown, defaultMessage: string = 'Supabase operation failed'): AppError {
  // If already an AppError, return it
  if (error instanceof AppError) {
    return error;
  }
  
  // If not a Supabase error, create a generic error
  if (!isSupabaseError(error)) {
    return new AppError({
      message: error instanceof Error ? error.message : defaultMessage,
      code: ErrorCode.SUPABASE_AUTH_ERROR,
      source: ErrorSource.SUPABASE,
      severity: ErrorSeverity.ERROR,
      originalError: error,
    });
  }
  
  // Cast to Supabase error response
  const supabaseError = error as SupabaseErrorResponse;
  
  // Extract information from error
  const statusCode = supabaseError.statusCode || supabaseError.status;
  const errorCode = supabaseError.code || '';
  const errorMessage = 
    supabaseError.message || 
    supabaseError.error_description || 
    supabaseError.error || 
    defaultMessage;
  
  // Determine error type based on code or message
  let appErrorCode = ErrorCode.SUPABASE_AUTH_ERROR;
  let errorSource = ErrorSource.SUPABASE;
  
  // Authentication errors
  if (
    errorCode.includes('auth') || 
    errorMessage.toLowerCase().includes('auth') ||
    errorMessage.toLowerCase().includes('login') ||
    errorMessage.toLowerCase().includes('password') ||
    errorMessage.toLowerCase().includes('session') ||
    (statusCode && (statusCode === 401 || statusCode === 403))
  ) {
    appErrorCode = ErrorCode.SUPABASE_AUTH_ERROR;
    errorSource = ErrorSource.AUTH;
  } 
  // Database errors
  else if (
    errorCode.includes('db') || 
    errorCode.includes('database') ||
    errorMessage.toLowerCase().includes('database') ||
    errorMessage.toLowerCase().includes('query') ||
    errorMessage.toLowerCase().includes('sql')
  ) {
    appErrorCode = ErrorCode.SUPABASE_DATABASE_ERROR;
    errorSource = ErrorSource.DATABASE;
  } 
  // Storage errors
  else if (
    errorCode.includes('storage') ||
    errorMessage.toLowerCase().includes('storage') ||
    errorMessage.toLowerCase().includes('file') ||
    errorMessage.toLowerCase().includes('upload')
  ) {
    appErrorCode = ErrorCode.SUPABASE_STORAGE_ERROR;
    errorSource = ErrorSource.SUPABASE;
  }

  // Create context with additional information
  const context: ErrorContext = {
    additionalData: {
      supabaseErrorCode: errorCode,
      supabaseErrorHint: supabaseError.hint,
      supabaseErrorDetails: supabaseError.details,
      statusCode: statusCode,
    }
  };

  // Look up a more specific message if available
  let userFriendlyMessage = errorMessage;
  Object.entries(SUPABASE_ERROR_CODES).forEach(([code, message]) => {
    if (
      errorCode === code || 
      errorCode.includes(code) || 
      errorMessage.toLowerCase().includes(code.split('/')[1])
    ) {
      userFriendlyMessage = message;
    }
  });

  // Create AppError
  return new AppError({
    message: userFriendlyMessage,
    code: appErrorCode,
    source: errorSource,
    severity: 
      statusCode && statusCode >= 500 
        ? ErrorSeverity.CRITICAL 
        : ErrorSeverity.ERROR,
    context,
    originalError: error,
  });
}

/**
 * Utility function to handle Supabase errors with proper mapping and notification
 */
export async function handleSupabaseOperation<T>(
  operation: () => Promise<T>,
  errorMessage: string = 'Operation failed'
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    // Convert to AppError
    const appError = mapSupabaseError(error, errorMessage);
    
    // Re-throw the mapped error
    throw appError;
  }
}

/**
 * Checks if the error is a specific type of Supabase error
 */
export function isSupabaseAuthError(error: unknown): boolean {
  if (!isSupabaseError(error)) return false;
  
  const supabaseError = error as SupabaseErrorResponse;
  
  return (
    (supabaseError.code && supabaseError.code.includes('auth')) ||
    (supabaseError.message && supabaseError.message.toLowerCase().includes('auth')) ||
    (supabaseError.error && supabaseError.error.toLowerCase().includes('auth')) ||
    (supabaseError.statusCode === 401 || supabaseError.status === 401 || 
     supabaseError.statusCode === 403 || supabaseError.status === 403)
  );
}

/**
 * Checks if the error is a Supabase session expiration error
 */
export function isSessionExpiredError(error: unknown): boolean {
  if (!isSupabaseError(error)) return false;
  
  const supabaseError = error as SupabaseErrorResponse;
  
  return (
    (supabaseError.code === 'auth/session-expired') ||
    (supabaseError.message && (
      supabaseError.message.toLowerCase().includes('session expired') ||
      supabaseError.message.toLowerCase().includes('session has expired')
    )) ||
    (supabaseError.error_description && (
      supabaseError.error_description.toLowerCase().includes('session expired') ||
      supabaseError.error_description.toLowerCase().includes('session has expired')
    ))
  );
}

/**
 * Checks if the error is a Supabase permission denied error
 */
export function isPermissionDeniedError(error: unknown): boolean {
  if (!isSupabaseError(error)) return false;
  
  const supabaseError = error as SupabaseErrorResponse;
  
  return (
    (supabaseError.code === 'database/permission-denied') ||
    (supabaseError.statusCode === 403 || supabaseError.status === 403) ||
    (supabaseError.message && (
      supabaseError.message.toLowerCase().includes('permission denied') ||
      supabaseError.message.toLowerCase().includes('not authorized')
    ))
  );
}