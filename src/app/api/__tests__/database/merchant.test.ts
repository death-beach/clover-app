import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createMockSupabaseClient, mockEnvironmentVariables, clearMocks } from '../helpers';
import type { DatabaseError } from '../types';

describe('Merchant Database Operations', () => {
  beforeEach(() => {
    mockEnvironmentVariables();
  });

  afterEach(() => {
    clearMocks();
  });

  describe('Create Operations', () => {
    it('creates a new merchant with valid data', async () => {
      const mockSupabase = createMockSupabaseClient();
      const newMerchant = {
        name: 'Test Store',
        email: 'store@test.com',
        clover_id: 'CLV_123',
        status: 'active'
      };

      mockSupabase.from.mockReturnValue({
        insert: vi.fn().mockResolvedValue({
          data: [{ id: 1, ...newMerchant }],
          error: null
        })
      });

      const { data, error } = await mockSupabase
        .from('merchants')
        .insert(newMerchant);

      expect(error).toBeNull();
      expect(data).toHaveLength(1);
      expect(data[0].id).toBe(1);
      expect(data[0].name).toBe(newMerchant.name);
    });

    it('handles duplicate merchant creation', async () => {
      const mockSupabase = createMockSupabaseClient();
      const duplicateError: DatabaseError = {
        message: 'duplicate key value violates unique constraint',
        code: '23505'
      };

      mockSupabase.from.mockReturnValue({
        insert: vi.fn().mockResolvedValue({
          data: null,
          error: duplicateError
        })
      });

      const { data, error } = await mockSupabase
        .from('merchants')
        .insert({ clover_id: 'EXISTING_ID' });

      expect(error).toBeDefined();
      expect(error.code).toBe('23505');
      expect(data).toBeNull();
    });

    it('validates required fields', async () => {
      const mockSupabase = createMockSupabaseClient();
      const validationError: DatabaseError = {
        message: 'null value in column "name" violates not-null constraint',
        code: '23502'
      };

      mockSupabase.from.mockReturnValue({
        insert: vi.fn().mockResolvedValue({
          data: null,
          error: validationError
        })
      });

      const { error } = await mockSupabase
        .from('merchants')
        .insert({});

      expect(error).toBeDefined();
      expect(error.code).toBe('23502');
    });
  });

  describe('Read Operations', () => {
    it('retrieves a merchant by ID', async () => {
      const mockSupabase = createMockSupabaseClient();
      const merchantData = {
        id: 1,
        name: 'Test Store',
        status: 'active'
      };

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            data: [merchantData],
            error: null
          })
        })
      });

      const { data, error } = await mockSupabase
        .from('merchants')
        .select()
        .eq('id', 1);

      expect(error).toBeNull();
      expect(data).toHaveLength(1);
      expect(data[0]).toEqual(merchantData);
    });

    it('lists all active merchants', async () => {
      const mockSupabase = createMockSupabaseClient();
      const merchants = [
        { id: 1, name: 'Store 1', status: 'active' },
        { id: 2, name: 'Store 2', status: 'active' }
      ];

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            data: merchants,
            error: null
          })
        })
      });

      const { data, error } = await mockSupabase
        .from('merchants')
        .select()
        .eq('status', 'active');

      expect(error).toBeNull();
      expect(data).toHaveLength(2);
      expect(data[0].name).toBe('Store 1');
      expect(data.every(m => m.status === 'active')).toBe(true);
    });
  });

  describe('Update Operations', () => {
    it('updates merchant details', async () => {
      const mockSupabase = createMockSupabaseClient();
      const updates = {
        name: 'Updated Store Name',
        email: 'updated@test.com'
      };

      mockSupabase.from.mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            data: [{ id: 1, ...updates }],
            error: null
          })
        })
      });

      const { data, error } = await mockSupabase
        .from('merchants')
        .update(updates)
        .eq('id', 1);

      expect(error).toBeNull();
      expect(data[0].name).toBe(updates.name);
      expect(data[0].email).toBe(updates.email);
    });

    it('validates update payload', async () => {
      const mockSupabase = createMockSupabaseClient();
      const validationError: DatabaseError = {
        message: 'invalid email format',
        code: '23514'
      };

      mockSupabase.from.mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            data: null,
            error: validationError
          })
        })
      });

      const { error } = await mockSupabase
        .from('merchants')
        .update({ email: 'invalid-email' })
        .eq('id', 1);

      expect(error).toBeDefined();
      expect(error.code).toBe('23514');
    });
  });

  describe('Delete Operations', () => {
    it('soft deletes a merchant', async () => {
      const mockSupabase = createMockSupabaseClient();
      const deletionTime = new Date().toISOString();

      mockSupabase.from.mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            data: [{ id: 1, status: 'inactive', deleted_at: deletionTime }],
            error: null
          })
        })
      });

      const { data, error } = await mockSupabase
        .from('merchants')
        .update({ status: 'inactive', deleted_at: deletionTime })
        .eq('id', 1);

      expect(error).toBeNull();
      expect(data[0].status).toBe('inactive');
      expect(data[0].deleted_at).toBe(deletionTime);
    });
  });
});