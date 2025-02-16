import { describe, expect, test, jest, beforeEach } from '@jest/globals';
import { HelioClient } from '../lib/helio/client';
import { 
  HelioInsufficientFundsError,
  HelioValidationError,
  HelioTransactionError,
  HelioAuthenticationError,
  HelioRateLimitError
} from '../lib/helio/errors';

// Mock the fetch function
global.fetch = jest.fn();

describe('HelioClient', () => {
  let helioClient: HelioClient;

  beforeEach(() => {
    helioClient = new HelioClient({
      apiKey: 'test-api-key',
      apiUrl: 'https://api.test.helio.com'
    });
    // Clear all mocks before each test
    (global.fetch as jest.Mock).mockClear();
  });

  describe('initiateOfframp', () => {
    test('successfully initiates offramp', async () => {
      const mockResponse = {
        transactionId: 'tx123',
        status: 'PENDING',
        amount: 1000,
        fee: 10
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await helioClient.initiateOfframp({
        amount: 1000,
        currency: 'USD',
        destinationBank: 'TEST_BANK',
        accountNumber: '1234567890',
        accountName: 'John Doe'
      });

      expect(result).toEqual(mockResponse);
    });

    test('handles insufficient funds error', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          error: 'INSUFFICIENT_FUNDS',
          message: 'Not enough funds to complete transaction'
        })
      });

      await expect(helioClient.initiateOfframp({
        amount: 1000000,
        currency: 'USD',
        destinationBank: 'TEST_BANK',
        accountNumber: '1234567890',
        accountName: 'John Doe'
      })).rejects.toThrow(HelioInsufficientFundsError);
    });
  });

  describe('getOfframpStatus', () => {
    test('successfully retrieves offramp status', async () => {
      const mockResponse = {
        transactionId: 'tx123',
        status: 'COMPLETED',
        amount: 1000,
        completedAt: new Date().toISOString()
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await helioClient.getOfframpStatus('tx123');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getExchangeRates', () => {
    test('successfully retrieves exchange rates', async () => {
      const mockResponse = {
        USDC: {
          USD: 1.0,
          EUR: 0.85
        }
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await helioClient.getExchangeRates();
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Error Handling', () => {
    test('handles validation errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          error: 'VALIDATION_ERROR',
          message: 'Invalid input parameters'
        })
      });

      await expect(helioClient.initiateOfframp({
        amount: -1000, // Invalid amount
        currency: 'USD',
        destinationBank: 'TEST_BANK',
        accountNumber: '1234567890',
        accountName: 'John Doe'
      })).rejects.toThrow(HelioValidationError);
    });

    test('handles authentication errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({
          error: 'AUTHENTICATION_ERROR',
          message: 'Invalid API key'
        })
      });

      await expect(helioClient.getExchangeRates())
        .rejects.toThrow(HelioAuthenticationError);
    });

    test('handles rate limit errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 429,
        json: async () => ({
          error: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests'
        })
      });

      await expect(helioClient.getExchangeRates())
        .rejects.toThrow(HelioRateLimitError);
    });
  });
});