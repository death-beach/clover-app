import { withRetry } from '../blockchain/retry';
import { RateLimiter } from '../blockchain/rateLimiter';
import { logger } from '../logger';
import {
  HelioAPIError,
  HelioAuthenticationError,
  HelioInsufficientFundsError,
  HelioRateLimitError,
  HelioTransactionError,
  HelioValidationError
} from './errors';

interface HelioConfig {
  apiKey: string;
  apiUrl: string;
}

interface OfframpRequest {
  amount: number;
  currency: string;
  destinationBank: string;
  accountNumber: string;
  accountName: string;
}

export class HelioClient {
  private config: HelioConfig;
  private rateLimiter: RateLimiter;

  constructor(config: HelioConfig) {
    this.config = config;
    this.rateLimiter = new RateLimiter(1000, 30); // 30 requests per second
  }

  private async handleResponse(response: Response) {
    if (response.ok) {
      return await response.json();
    }

    const errorData = await response.json().catch(() => ({}));
    const message = errorData.message || 'An error occurred with Helio API';

    switch (response.status) {
      case 400:
        if (message.includes('insufficient funds')) {
          throw new HelioInsufficientFundsError(message, errorData);
        }
        if (message.includes('validation')) {
          throw new HelioValidationError(message, errorData);
        }
        if (message.includes('transaction')) {
          throw new HelioTransactionError(message, errorData);
        }
        throw new HelioAPIError(message, response.status, errorData);
      
      case 401:
        throw new HelioAuthenticationError(message);
      
      case 429:
        throw new HelioRateLimitError(message);
      
      default:
        throw new HelioAPIError(message, response.status, errorData);
    }
  }

  private async makeRequest(
    endpoint: string,
    method: string = 'GET',
    body?: any
  ) {
    await this.rateLimiter.acquire();

    try {
      const response = await withRetry(async () => {
        const result = await fetch(`${this.config.apiUrl}${endpoint}`, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.apiKey}`
          },
          body: body ? JSON.stringify(body) : undefined
        });

        return await this.handleResponse(result);
      }, {
        maxAttempts: 3,
        initialDelay: 1000,
        maxDelay: 5000,
        backoffFactor: 2,
      });

      return response;
    } catch (error) {
      logger.error('Helio API request failed', {
        endpoint,
        method,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  async initiateOfframp(request: OfframpRequest) {
    try {
      // Validate request
      if (!request.amount || request.amount <= 0) {
        throw new HelioValidationError('Invalid amount');
      }

      if (!request.currency || !request.destinationBank || 
          !request.accountNumber || !request.accountName) {
        throw new HelioValidationError('Missing required fields');
      }

      const response = await this.makeRequest('/offramp', 'POST', request);
      
      logger.info('Offramp initiated successfully', {
        amount: request.amount,
        currency: request.currency,
        transactionId: response.transactionId
      });

      return response;
    } catch (error) {
      if (error instanceof HelioError) {
        throw error;
      }
      
      logger.error('Unexpected error during offramp', {
        error: error instanceof Error ? error.message : 'Unknown error',
        request
      });
      
      throw new HelioAPIError(
        'Failed to initiate offramp',
        500,
        { originalError: error }
      );
    }
  }

  async getOfframpStatus(transactionId: string) {
    try {
      const response = await this.makeRequest(`/offramp/${transactionId}`);
      
      logger.info('Retrieved offramp status', {
        transactionId,
        status: response.status
      });

      return response;
    } catch (error) {
      if (error instanceof HelioError) {
        throw error;
      }

      logger.error('Failed to get offramp status', {
        transactionId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      throw new HelioAPIError(
        'Failed to get offramp status',
        500,
        { originalError: error }
      );
    }
  }

  async getExchangeRates() {
    try {
      const response = await this.makeRequest('/exchange-rates');
      
      logger.info('Retrieved exchange rates');
      
      return response;
    } catch (error) {
      if (error instanceof HelioError) {
        throw error;
      }

      logger.error('Failed to get exchange rates', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      throw new HelioAPIError(
        'Failed to get exchange rates',
        500,
        { originalError: error }
      );
    }
  }
}