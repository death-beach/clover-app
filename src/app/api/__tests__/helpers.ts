import { vi } from 'vitest';
import type { DatabaseError } from './types';

export const createMockSupabaseClient = () => {
  const mockClient = {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    limit: vi.fn().mockResolvedValue({ data: [{ id: 1 }], error: null }),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
  };
  return mockClient;
};

export const createDatabaseError = (message: string, code?: string): DatabaseError => ({
  message,
  code,
  details: `Test error: ${message}`
});

export const mockEnvironmentVariables = () => {
  vi.stubEnv('npm_package_version', '1.0.0');
  vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://test.supabase.co');
  vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'test-key');
};

export const clearMocks = () => {
  vi.clearAllMocks();
  vi.unstubAllEnvs();
};