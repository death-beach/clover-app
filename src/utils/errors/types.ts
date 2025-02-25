// Custom error types for the application

export class PaymentError extends Error {
  constructor(
    message: string,
    public code: string,
    public status?: number,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'PaymentError';
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NetworkError extends Error {
  constructor(
    message: string,
    public status?: number,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class AuthenticationError extends Error {
  constructor(message: string = 'Authentication failed') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

// Error codes for payment-related errors
export const PaymentErrorCodes = {
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  INVALID_AMOUNT: 'INVALID_AMOUNT',
  EXPIRED_INTENT: 'EXPIRED_INTENT',
  OFFRAMP_FAILED: 'OFFRAMP_FAILED',
  INVALID_WALLET: 'INVALID_WALLET',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
} as const;