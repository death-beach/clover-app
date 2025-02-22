import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import { createMockSupabaseClient, mockEnvironmentVariables, clearMocks } from '../helpers';
import { POST } from '../../webhooks/clover/route';
import { NextRequest } from 'next/server';

// Extend mock client
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
  const bodyStr = JSON.stringify(body);
  return {
    json: () => Promise.resolve(body),
    text: () => Promise.resolve(bodyStr),
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
    
    // Reset mock implementations
    extendedMockClient.from.mockImplementation((table) => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockResolvedValue({
        data: [{ id: 'mock-id', status: 'success' }],
        error: null
      }),
      update: vi.fn().mockResolvedValue({
        data: [{ id: 'mock-id', status: 'success' }],
        error: null
      }),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: { webhook_secret: 'webhook-secret', merchant_id: 'mock-merchant-id' },
        error: null
      })
    }));
  });

  afterEach(() => {
    clearMocks();
  });

  describe('Webhook Validation', () => {
    it('should validate webhook signature successfully', async () => {
      const mockSignature = 'valid-signature-hash';
      
      const mockResponse = {
        data: { webhook_secret: 'webhook-secret', merchant_id: 'mock-merchant-id' },
        error: null
      };

      const mockDb = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValueOnce(mockResponse)
      };

      extendedMockClient.from.mockImplementationOnce(() => mockDb);

      const request = createMockRequest(mockWebhookPayload, {
        'x-clover-signature': mockSignature,
        'x-clover-merchant-id': 'mock-merchant-id'
      });
      
      const response = await POST(request);
      const responseData = await response.json();
      
      expect(response.status).toBe(200);
      expect(extendedMockClient.from).toHaveBeenCalledWith('merchant_configs');
      expect(mockDb.select).toHaveBeenCalled();
      expect(mockDb.single).toHaveBeenCalled();
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
      // Mock merchant config check
      extendedMockClient.from.mockImplementationOnce(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValueOnce({
          data: { webhook_secret: 'webhook-secret' },
          error: null
        })
      }));
      // Mock order insert
      extendedMockClient.from.mockImplementationOnce(() => ({
        insert: vi.fn().mockResolvedValueOnce({
          data: [{ id: 'new-order-id', merchant_id: 'mock-merchant-id' }],
          error: null
        })
      }));

      const request = createMockRequest(mockWebhookPayload, {
        'x-clover-signature': 'valid-signature'
      });
      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.id).toBe('new-order-id');
    });

    it('should process payment events correctly', async () => {
      const paymentPayload = {
        merchantId: 'mock-merchant-id',
        type: 'PAYMENT_PROCESSED',
        data: { id: 'mock-payment-id' }
      };
      // Mock merchant config check
      extendedMockClient.from.mockImplementationOnce(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValueOnce({
          data: { webhook_secret: 'webhook-secret' },
          error: null
        })
      }));
      // Mock payment update
      extendedMockClient.from.mockImplementationOnce(() => ({
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockResolvedValueOnce({
          data: [{ status: 'paid', order_id: 'mock-payment-id' }],
          error: null
        })
      }));

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
        merchantId: 'mock-merchant-id',
        type: 'REFUND_ISSUED',
        data: { id: 'mock-refund-id' }
      };
      // Mock merchant config check
      extendedMockClient.from.mockImplementationOnce(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValueOnce({
          data: { webhook_secret: 'webhook-secret' },
          error: null
        })
      }));
      // Mock refund update
      extendedMockClient.from.mockImplementationOnce(() => ({
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockResolvedValueOnce({
          data: [{ status: 'refunded', order_id: 'mock-refund-id' }],
          error: null
        })
      }));

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
    it('handles database errors appropriately', async () => {
      extendedMockClient.from.mockImplementationOnce(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValueOnce({
          data: { webhook_secret: 'webhook-secret' },
          error: null
        })
      }));
      extendedMockClient.from.mockImplementationOnce(() => ({
        insert: vi.fn().mockResolvedValueOnce({
          data: null,
          error: { message: 'Database error' }
        })
      }));

      const request = createMockRequest(mockWebhookPayload, {
        'x-clover-signature': 'valid-signature'
      });
      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(500);
      expect(responseData.error).toBe('Database error');
      // No Retry-After expected in this path
      expect(response.headers.get('retry-after')).toBeNull();
    });

    it('should handle invalid merchant configuration', async () => {
      extendedMockClient.from.mockImplementationOnce(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValueOnce({
          data: null,
          error: null
        })
      }));

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