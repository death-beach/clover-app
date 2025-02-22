import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET as getVerify } from '../config/verify/route';
import { GET as getStatus } from '../status/route';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Mock Next.js modules
vi.mock('next/server', () => {
  return {
    NextResponse: {
      json: (data: any, init?: any) => {
        return {
          status: init?.status || 200,
          json: async () => data
        };
      }
    }
  };
});

vi.mock('next/headers', () => ({
  headers: () => new Map([['authorization', 'Bearer test-key']])
}));

// Mock environment variables and headers
vi.mock('next/headers', () => ({
  headers: () => new Map([['authorization', 'Bearer test-key']])
}));

// Mock Supabase client
const mockSupabaseClient = {
  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  single: vi.fn(),
};

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => mockSupabaseClient
}));

describe('API Routes', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    
    // Reset environment variables
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key';
    process.env.NEXT_PUBLIC_HELIUS_API_KEY = 'test-helius-key';
    process.env.CLOVER_API_KEY = 'test-clover-key';
    process.env.CLOVER_API_SECRET = 'test-clover-secret';

    // Reset Supabase mock
    mockSupabase.single.mockReset();
    mockSupabase.data = null;
    mockSupabase.error = null;
  });

  describe('verify route', () => {
    it('should verify all required environment variables', async () => {
      const response = await getVerify();
      const data = await response.json();
      
      expect(data.status).toBe('success');
      expect(data.config.supabaseConfigured).toBe(true);
      expect(data.config.heliusConfigured).toBe(true);
      expect(data.config.cloverConfigured).toBe(true);
    });

    it('should fail if environment variables are missing', async () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      
      const response = await getVerify();
      const data = await response.json();
      
      expect(data.status).toBe('error');
      expect(data.missing).toContain('NEXT_PUBLIC_SUPABASE_URL');
    });

    it('should validate API key', async () => {
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'wrong-key';
      
      const response = await getVerify();
      const data = await response.json();
      
      expect(response.status).toBe(401);
      expect(data.error).toBe('Invalid API key');
    });

    it('should verify valid merchant configuration', async () => {
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: {
          id: 'test-merchant',
          name: 'Test Merchant',
          status: 'active',
          clover_id: 'CLOVER123',
        },
        error: null
      });

      const response = await getVerify();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.status).toBe('success');
      expect(data.merchant).toBeDefined();
      expect(data.merchant.id).toBe('test-merchant');
    });

    it('should handle invalid merchant ID', async () => {
      mockSupabase.single.mockResolvedValueOnce({
        data: null,
        error: null
      });

      const response = await getVerify();
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.status).toBe('error');
      expect(data.error).toBe('Merchant not found');
    });

    it('should handle database connection errors', async () => {
      mockSupabase.single.mockResolvedValueOnce({
        data: null,
        error: { message: 'Database connection error' }
      });

      const response = await getVerify();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.status).toBe('error');
      expect(data.error).toContain('Database error');
    });
  });

  describe('status route', () => {
    it('should return operational status', async () => {
      mockSupabase.single.mockResolvedValueOnce({
        data: { status: 'online' },
        error: null
      });

      const response = await getStatus();
      const data = await response.json();
      
      expect(data.status).toBe('operational');
      expect(data.services.api).toBe('online');
      expect(data.services.supabase).toBe('online');
      expect(data.services.helius).toBe('connected');
      expect(data.services.clover).toBe('connected');
      expect(data.timestamp).toBeDefined();
    });

    it('should handle payment status retrieval', async () => {
      const mockPayment = {
        id: 'payment123',
        status: 'completed',
        amount: 100,
        transaction_signature: 'sig123'
      };

      mockSupabase.single.mockResolvedValueOnce({
        data: mockPayment,
        error: null
      });

      const response = await getStatus();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.payment).toBeDefined();
      expect(data.payment.status).toBe('completed');
    });

    it('should handle invalid transaction ID', async () => {
      mockSupabase.single.mockResolvedValueOnce({
        data: null,
        error: null
      });

      const response = await getStatus();
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.status).toBe('error');
      expect(data.error).toBe('Transaction not found');
    });

    it('should handle database query errors', async () => {
      mockSupabase.single.mockResolvedValueOnce({
        data: null,
        error: { message: 'Database query failed' }
      });

      const response = await getStatus();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.status).toBe('error');
      expect(data.error).toContain('Database error');
    });

    it('should check transaction verification status', async () => {
      const mockTransaction = {
        id: 'tx123',
        status: 'verified',
        signature: 'sig123',
        confirmation_status: 'confirmed'
      };

      mockSupabase.single.mockResolvedValueOnce({
        data: mockTransaction,
        error: null
      });

      const response = await getStatus();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.transaction).toBeDefined();
      expect(data.transaction.status).toBe('verified');
      expect(data.transaction.confirmation_status).toBe('confirmed');
    });
  });
});