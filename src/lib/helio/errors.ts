export class HelioError extends Error {
  constructor(
    message: string,
    public code: string,
    public status?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'HelioError';
  }
}

export class HelioAPIError extends HelioError {
  constructor(message: string, status: number, details?: any) {
    super(message, 'HELIO_API_ERROR', status, details);
    this.name = 'HelioAPIError';
  }
}

export class HelioValidationError extends HelioError {
  constructor(message: string, details?: any) {
    super(message, 'HELIO_VALIDATION_ERROR', 400, details);
    this.name = 'HelioValidationError';
  }
}

export class HelioInsufficientFundsError extends HelioError {
  constructor(message: string, details?: any) {
    super(message, 'HELIO_INSUFFICIENT_FUNDS', 400, details);
    this.name = 'HelioInsufficientFundsError';
  }
}

export class HelioTransactionError extends HelioError {
  constructor(message: string, details?: any) {
    super(message, 'HELIO_TRANSACTION_ERROR', 400, details);
    this.name = 'HelioTransactionError';
  }
}

export class HelioAuthenticationError extends HelioError {
  constructor(message: string = 'Authentication failed') {
    super(message, 'HELIO_AUTH_ERROR', 401);
    this.name = 'HelioAuthenticationError';
  }
}

export class HelioRateLimitError extends HelioError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 'HELIO_RATE_LIMIT', 429);
    this.name = 'HelioRateLimitError';
  }
}