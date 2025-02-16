import { describe, expect, test } from '@jest/globals';
import fetch from 'node-fetch';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

describe('Deployment Verification', () => {
  describe('Health Check', () => {
    test('health endpoint is accessible', async () => {
      const response = await fetch(`${BASE_URL}/api/health`);
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty('status', 'healthy');
    });
  });

  describe('Environment Configuration', () => {
    test('required environment variables are set', () => {
      const requiredEnvVars = [
        'NEXT_PUBLIC_HELIUS_API_KEY',
        'SOLANA_NETWORK',
        'NEXT_PUBLIC_APP_URL',
        'WEBHOOK_SECRET',
        'HELIO_API_KEY',
        'HELIO_API_URL'
      ];

      requiredEnvVars.forEach(envVar => {
        expect(process.env[envVar]).toBeDefined();
      });
    });
  });

  describe('API Endpoints', () => {
    test('webhook endpoint is accessible', async () => {
      const response = await fetch(`${BASE_URL}/api/webhook/helius`);
      // Should return 405 Method Not Allowed for GET requests
      expect(response.status).toBe(405);
    });
  });

  describe('Service Integration', () => {
    test('Helius RPC endpoint is accessible', async () => {
      const heliusRpc = `https://${process.env.SOLANA_NETWORK}.helius-rpc.com/${process.env.NEXT_PUBLIC_HELIUS_API_KEY}`;
      const response = await fetch(heliusRpc, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getHealth',
        }),
      });
      expect(response.status).toBe(200);
    });

    test('Helio API is accessible', async () => {
      const response = await fetch(`${process.env.HELIO_API_URL}/health`, {
        headers: {
          'Authorization': `Bearer ${process.env.HELIO_API_KEY}`
        }
      });
      expect(response.status).toBe(200);
    });
  });

  describe('Rate Limiting', () => {
    test('rate limiting is enforced', async () => {
      const requests = Array(60).fill(null).map(() => 
        fetch(`${BASE_URL}/api/health`)
      );
      
      const responses = await Promise.all(requests);
      const rateLimited = responses.some(r => r.status === 429);
      expect(rateLimited).toBe(true);
    });
  });
});