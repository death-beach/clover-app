import { describe, expect, test, jest, beforeEach } from '@jest/globals';
import { HeliusClient } from '../helius/client';
import { Network } from '../types/network';

// Mock the fetch function
global.fetch = jest.fn();

describe('HeliusClient', () => {
  let heliusClient: HeliusClient;

  beforeEach(() => {
    heliusClient = new HeliusClient({
      apiKey: 'test-api-key',
      network: Network.MAINNET,
      webhookUrl: 'https://test.com/api/webhook/helius',
      rpcEndpoint: 'https://mainnet.helius-rpc.com/test-api-key'
    });
    // Clear all mocks before each test
    (global.fetch as jest.Mock).mockClear();
  });

  describe('getEnrichedTransaction', () => {
    test('successfully retrieves enriched transaction', async () => {
      const mockResponse = {
        signature: 'tx123',
        type: 'TRANSFER',
        timestamp: Date.now(),
        fee: 5000,
        status: 'confirmed'
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await heliusClient.getEnrichedTransaction('tx123');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getTokenTransfers', () => {
    test('successfully retrieves token transfers', async () => {
      const mockResponse = {
        signature: 'tx123',
        tokenTransfers: [{
          fromUserAccount: 'sender',
          toUserAccount: 'receiver',
          amount: 1000000,
          mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
        }]
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await heliusClient.getTokenTransfers('tx123');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('createWebhook', () => {
    test('successfully creates webhook', async () => {
      const mockResponse = {
        webhookId: 'webhook123',
        url: 'https://test.com/api/webhook/helius',
        accountAddresses: ['address1', 'address2'],
        type: 'enhanced'
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await heliusClient.createWebhook(
        'https://test.com/api/webhook/helius',
        ['address1', 'address2']
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Error Handling', () => {
    test('handles API errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({
          error: 'Internal Server Error'
        })
      });

      await expect(heliusClient.getEnrichedTransaction('tx123'))
        .rejects.toThrow('Failed to fetch enriched transaction');
    });

    test('handles rate limiting', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 429,
        json: async () => ({
          error: 'Rate limit exceeded'
        })
      });

      await expect(heliusClient.getEnrichedTransaction('tx123'))
        .rejects.toThrow('Rate limit exceeded');
    });
  });

  describe('Caching', () => {
    test('caches enriched transaction data', async () => {
      const mockResponse = {
        signature: 'tx123',
        type: 'TRANSFER',
        timestamp: Date.now()
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      // First call should hit the API
      await heliusClient.getEnrichedTransaction('tx123');
      // Second call should use cache
      await heliusClient.getEnrichedTransaction('tx123');

      // Fetch should only be called once due to caching
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });
});