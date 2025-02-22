import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '../status/route';
import { createClient } from '@supabase/supabase-js';

// Mock environment variables
vi.stubEnv('npm_package_version', '1.0.0');

// Mock Supabase client
vi.mock('@supabase/supabase-js', () => {
  const mockClient = {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    limit: vi.fn().mockResolvedValue({ data: [{ id: 1 }], error: null }),
  };
  return { createClient: vi.fn(() => mockClient) };
});

describe('API Routes', () => {
  let mockClient: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockClient = (createClient as any)();
    mockClient.from.mockReturnThis();
    mockClient.select.mockReturnThis();
    mockClient.limit.mockResolvedValue({ data: [{ id: 1 }], error: null });
  });

  describe('GET /api/status', () => {
    it('should return 200 with operational status when Supabase is connected', async () => {
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        status: 'operational',
        timestamp: expect.any(String),
        version: '1.0.0',
        services: {
          api: 'online',
          supabase: 'online',
          helius: 'connected',
          clover: 'connected'
        }
      });
    });

    it('should return 503 when Supabase connection fails', async () => {
      mockClient.limit.mockResolvedValue({ 
        data: null, 
        error: { message: 'Database connection failed' } 
      });

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(503);
      expect(data).toEqual({
        status: 'unhealthy',
        timestamp: expect.any(String),
        version: '1.0.0',
        services: {
          api: 'online',
          supabase: 'disconnected',
          helius: 'connected',
          clover: 'connected'
        },
        error: 'Database connection failed'
      });
    });

    it('should include correct version information', async () => {
      const response = await GET();
      const data = await response.json();

      expect(data.version).toBe('1.0.0');
    });

    it('should handle unexpected Supabase errors gracefully', async () => {
      mockClient.limit.mockRejectedValue(
        new Error('Unexpected error')
      );

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(503);
      expect(data).toEqual({
        status: 'unhealthy',
        timestamp: expect.any(String),
        version: '1.0.0',
        services: {
          api: 'online',
          supabase: 'error',
          helius: 'connected',
          clover: 'connected'
        },
        error: 'Unexpected error'
      });
    });

    it('should properly chain Supabase query methods', async () => {
      await GET();

      expect(mockClient.from).toHaveBeenCalledWith('merchants');
      expect(mockClient.select).toHaveBeenCalledWith('id');
      expect(mockClient.limit).toHaveBeenCalledWith(1);
    });
  });
});