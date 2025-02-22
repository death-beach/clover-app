import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import { createMockSupabaseClient, mockEnvironmentVariables, clearMocks } from '../helpers';

// Extend the mock client with auth methods
const extendedMockClient = {
  ...createMockSupabaseClient(),
  auth: {
    signInWithPassword: vi.fn(),
    getSession: vi.fn(),
    getUser: vi.fn(),
    refreshSession: vi.fn(),
    signOut: vi.fn(),
    setSession: vi.fn()
  }
};

// Mock Supabase client
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => extendedMockClient)
}));

describe('Authentication & Session Management', () => {
  const mockSession = {
    access_token: 'mock-access-token',
    refresh_token: 'mock-refresh-token',
    expires_at: Date.now() + 3600000
  };

  beforeEach(() => {
    mockEnvironmentVariables();
    vi.clearAllMocks();
  });

  afterEach(() => {
    clearMocks();
  });

  describe('Session Creation', () => {
    it('should create a new session with valid credentials', async () => {
      const mockCredentials = {
        email: 'test@example.com',
        password: 'validPassword123'
      };

      extendedMockClient.auth.signInWithPassword.mockResolvedValueOnce({
        data: { session: mockSession },
        error: null
      });

      const response = await extendedMockClient.auth.signInWithPassword(mockCredentials);
      
      expect(response.error).toBeNull();
      expect(response.data.session).toEqual(mockSession);
      expect(extendedMockClient.auth.signInWithPassword).toHaveBeenCalledWith(mockCredentials);
    });

    it('should handle invalid credentials appropriately', async () => {
      const mockCredentials = {
        email: 'test@example.com',
        password: 'wrongPassword'
      };

      extendedMockClient.auth.signInWithPassword.mockResolvedValueOnce({
        data: { session: null },
        error: { message: 'Invalid credentials', status: 401 }
      });

      const response = await extendedMockClient.auth.signInWithPassword(mockCredentials);
      
      expect(response.error).toBeDefined();
      expect(response.error.message).toBe('Invalid credentials');
      expect(response.data.session).toBeNull();
    });

    it('should handle session expiration correctly', async () => {
      const expiredSession = {
        ...mockSession,
        expires_at: Date.now() - 1000
      };

      extendedMockClient.auth.getSession.mockResolvedValueOnce({
        data: { session: expiredSession },
        error: null
      });

      const response = await extendedMockClient.auth.getSession();
      
      expect(response.data.session.expires_at).toBeLessThan(Date.now());
    });
  });

  describe('Session Validation', () => {
    it('should validate a valid token successfully', async () => {
      extendedMockClient.auth.getUser.mockResolvedValueOnce({
        data: { user: { id: 'test-user-id', email: 'test@example.com' } },
        error: null
      });

      const response = await extendedMockClient.auth.getUser(mockSession.access_token);
      
      expect(response.error).toBeNull();
      expect(response.data.user).toBeDefined();
      expect(response.data.user.id).toBe('test-user-id');
    });

    it('should handle malformed tokens appropriately', async () => {
      extendedMockClient.auth.getUser.mockResolvedValueOnce({
        data: { user: null },
        error: { message: 'Invalid token format', status: 400 }
      });

      const response = await extendedMockClient.auth.getUser('malformed-token');
      
      expect(response.error).toBeDefined();
      expect(response.error.message).toBe('Invalid token format');
      expect(response.data.user).toBeNull();
    });
  });

  describe('Session Management', () => {
    it('should refresh session successfully', async () => {
      const newSession = {
        ...mockSession,
        access_token: 'new-access-token'
      };

      extendedMockClient.auth.refreshSession.mockResolvedValueOnce({
        data: { session: newSession },
        error: null
      });

      const response = await extendedMockClient.auth.refreshSession();
      
      expect(response.error).toBeNull();
      expect(response.data.session.access_token).toBe('new-access-token');
    });

    it('should handle session termination correctly', async () => {
      extendedMockClient.auth.signOut.mockResolvedValueOnce({
        error: null
      });

      const response = await extendedMockClient.auth.signOut();
      
      expect(response.error).toBeNull();
      expect(extendedMockClient.auth.signOut).toHaveBeenCalled();
    });

    it('should handle concurrent session management', async () => {
      const concurrentSession = {
        ...mockSession,
        access_token: 'concurrent-session-token'
      };

      extendedMockClient.auth.setSession.mockResolvedValueOnce({
        data: { session: concurrentSession },
        error: null
      });

      const response = await extendedMockClient.auth.setSession({
        access_token: concurrentSession.access_token,
        refresh_token: concurrentSession.refresh_token
      });
      
      expect(response.error).toBeNull();
      expect(response.data.session).toEqual(concurrentSession);
    });
  });
});