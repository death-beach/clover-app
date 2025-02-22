import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import { createMockSupabaseClient, mockEnvironmentVariables, clearMocks } from '../helpers';
import { POST } from '../../webhooks/clover/route';
import { NextRequest } from 'next/server';

// Extend mock client with required methods
const extendedMockClient = {
  ...createMockSupabaseClient(),
  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  single: vi.fn()
};

// Mock Supabase client
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => extendedMockClient)
}));

// Mock NextRequest
const createMockRequest = (body: any, headers = {}) => {
  return {
    json: () => Promise.resolve(body),
    headers: {
      get: (name: string) => headers[name] || null
    }
  } as unknown as NextRequest;
};

describe('Clover Webhook Integration', () => {
  const mockWebhookPayload = {
    merchantId: 'mock-merchant-id',
    type: 'ORDER_CREATED',
    data: {
      id: 'mock-order-id',
      total: 1000,
      currency: 'USD'
    }
  };

  beforeEach(() => {
    mockEnvironmentVariables();
    vi.clearAllMocks();
  });

  afterEach(() => {
    clearMocks();
  });

  describe('Webhook Validation', () => {
    it('should validate webhook signature successfully', async () => {
      const mockSignature = 'valid-signature-hash';
      
      extendedMockClient.from.mockReturnValueOnce({
        select: vi.fn().mockResolvedValueOnce({
          data: { webhook_secret: 'webhook-secret' },
          error: null
        })
      });

      const request = createMockRequest(mockWebhookPayload, {
        'x-clover-signature': mockSignature
      });
      
      const response = await POST(request);
      const responseData = await response.json();
      
      expect(response.status).toBe(200);
      expect(extendedMockClient.from).toHaveBeenCalledWith('merchant_configs');
    });

    it('should reject missing signatures', async () => {
      const request = createMockRequest(mockWebhookPayload);
      
      const response = await POST(request);
      const responseData = await response.json();
      
      expect(response.status).toBe(401);
      expect(responseData.error).toBe('Missing signature');
    });

    it('should handle malformed payload appropriately', async () => {
      const malformedPayload = {
        merchantId: 'mock-merchant-id',
        // Missing required fields
      };

      const request = createMockRequest(malformedPayload, {
        'x-clover-signature': 'valid-signature'
      });
      
      const response = await POST(request);
      const responseData = await response.json();
      
      expect(response.status).toBe(400);
      expect(responseData.error).toBeDefined();
    });
  });

  describe('Event Processing', () => {
    it('should process order creation events correctly', async () => {
      const orderPayload = {
        ...mockWebhookPayload,
        type: 'ORDER_CREATED'
      };

      extendedMockClient.from.mockReturnValueOnce({
        select: vi.fn().mockResolvedValueOnce({
          data: { webhook_secret: 'webhook-secret' },
          error: null
        })
      }).mockReturnValueOnce({
        insert: vi.fn().mockResolvedValueOnce({
          data: [{ id: 'new-order-id' }],
          error: null
        })
      });

      const request = createMockRequest(orderPayload, {
        'x-clover-signature': 'valid-signature'
      });
      
      const response = await POST(request);
      const responseData = await response.json();
      
      expect(response.status).toBe(200);
      expect(responseData.id).toBe('new-order-id');
    });

    it('should process payment events correctly', async () => {
      const paymentPayload = {
        ...mockWebhookPayload,
        type: 'PAYMENT_PROCESSED',
        data: {
          ...mockWebhookPayload.data,
          paymentId: 'mock-payment-id'
        }
      };

      extendedMockClient.from.mockReturnValueOnce({
        select: vi.fn().mockResolvedValueOnce({
          data: { webhook_secret: 'webhook-secret' },
          error: null
        })
      }).mockReturnValueOnce({
        update: vi.fn().mockResolvedValueOnce({
          data: [{ status: 'paid' }],
          error: null
        })
      });

      const request = createMockRequest(paymentPayload, {
        'x-clover-signature': 'valid-signature'
      });
      
      const response = await POST(request);
      const responseData = await response.json();
      
      expect(response.status).toBe(200);
      expect(responseData.status).toBe('paid');
    });

    it('should process refund events correctly', async () => {
      const refundPayload = {
        ...mockWebhookPayload,
        type: 'REFUND_ISSUED',
        data: {
          ...mockWebhookPayload.data,
          refundId: 'mock-refund-id'
        }
      };

      extendedMockClient.from.mockReturnValueOnce({
        select: vi.fn().mockResolvedValueOnce({
          data: { webhook_secret: 'webhook-secret' },
          error: null
        })
      }).mockReturnValueOnce({
        update: vi.fn().mockResolvedValueOnce({
          data: [{ status: 'refunded' }],
          error: null
        })
      });

      const request = createMockRequest(refundPayload, {
        'x-clover-signature': 'valid-signature'
      });
      
      const response = await POST(request);
      const responseData = await response.json();
      
      expect(response.status).toBe(200);
      expect(responseData.status).toBe('refunded');
    });
  });

  describe('Error Handling', () => {
    it('should handle database errors appropriately', async () => {
      extendedMockClient.from.mockReturnValueOnce({
        select: vi.fn().mockResolvedValueOnce({
          data: { webhook_secret: 'webhook-secret' },
          error: null
        })
      }).mockReturnValueOnce({
        insert: vi.fn().mockRejectedValueOnce(new Error('Database error'))
      });

      const request = createMockRequest(mockWebhookPayload, {
        'x-clover-signature': 'valid-signature'
      });
      
      const response = await POST(request);
      const responseData = await response.json();
      
      expect(response.status).toBe(500);
      expect(response.headers.get('retry-after')).toBe('60');
    });

    it('should handle invalid merchant configuration', async () => {
      extendedMockClient.from.mockReturnValueOnce({
        select: vi.fn().mockResolvedValueOnce({
          data: null,
          error: null
        })
      });

      const request = createMockRequest(mockWebhookPayload, {
        'x-clover-signature': 'valid-signature'
      });
      
      const response = await POST(request);
      const responseData = await response.json();
      
      expect(response.status).toBe(400);
      expect(responseData.error).toBe('Invalid merchant configuration');
    });
  });
});