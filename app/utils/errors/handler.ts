import { PaymentError, NetworkError, ValidationError, AuthenticationError } from './types';

interface ErrorResponse {
  message: string;
  code?: string;
  details?: any;
}

// Function to log errors (can be expanded to use proper logging service)
const logError = (error: Error, context?: any) => {
  // In development, log to console
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      context,
    });
  }
  // TODO: In production, send to logging service
  // if (process.env.NODE_ENV === 'production') {
  //   // Send to logging service (e.g., Sentry, LogRocket, etc.)
  // }
};

// Main error handler function
export const handleError = (error: any): ErrorResponse => {
  logError(error);

  if (error instanceof PaymentError) {
    return {
      message: error.message,
      code: error.code,
      details: error.details,
    };
  }

  if (error instanceof ValidationError) {
    return {
      message: error.message,
      code: 'VALIDATION_ERROR',
      details: { field: error.field, ...error.details },
    };
  }

  if (error instanceof NetworkError) {
    return {
      message: 'Network error occurred. Please try again.',
      code: 'NETWORK_ERROR',
      details: { status: error.status },
    };
  }

  if (error instanceof AuthenticationError) {
    return {
      message: error.message,
      code: 'AUTH_ERROR',
    };
  }

  // Handle unexpected errors
  return {
    message: 'An unexpected error occurred. Please try again later.',
    code: 'INTERNAL_ERROR',
  };
};

// Utility function to handle API responses
export const handleApiResponse = async <T>(
  promise: Promise<T>
): Promise<[T | null, ErrorResponse | null]> => {
  try {
    const data = await promise;
    return [data, null];
  } catch (error) {
    const errorResponse = handleError(error);
    return [null, errorResponse];
  }
};

// Function to create user-friendly error messages
export const getUserFriendlyMessage = (error: ErrorResponse): string => {
  const messages: Record<string, string> = {
    INSUFFICIENT_FUNDS: 'Insufficient funds in the wallet.',
    PAYMENT_FAILED: 'Payment could not be processed. Please try again.',
    INVALID_AMOUNT: 'Invalid payment amount specified.',
    EXPIRED_INTENT: 'Payment session has expired. Please start again.',
    OFFRAMP_FAILED: 'Unable to process the off-ramp request.',
    INVALID_WALLET: 'Invalid wallet address provided.',
    RATE_LIMIT_EXCEEDED: 'Too many requests. Please wait a moment.',
    NETWORK_ERROR: 'Connection issue detected. Please check your internet connection.',
    AUTH_ERROR: 'Authentication failed. Please log in again.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    INTERNAL_ERROR: 'Something went wrong. Please try again later.',
  };

  return messages[error.code || ''] || error.message;
};