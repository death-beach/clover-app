import { sleep } from '../utils';

export interface RetryOptions {
  maxAttempts?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
}

export class RetryError extends Error {
  constructor(
    message: string,
    public attempts: number,
    public lastError: Error
  ) {
    super(message);
    this.name = 'RetryError';
  }
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffFactor = 2,
  } = options;

  let lastError: Error;
  let delay = initialDelay;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxAttempts) {
        throw new RetryError(
          `Operation failed after ${maxAttempts} attempts`,
          attempt,
          lastError
        );
      }

      // Calculate next delay with exponential backoff
      delay = Math.min(delay * backoffFactor, maxDelay);
      
      // Add some jitter to prevent thundering herd
      const jitter = Math.random() * 200;
      await sleep(delay + jitter);
    }
  }

  // This should never be reached due to the throw in the loop
  throw new Error('Unexpected retry error');
}