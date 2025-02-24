'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCloverSession } from '@/providers/CloverSessionProvider';

export function useCloverAuth() {
  const router = useRouter();
  const { session, clearSession } = useCloverSession(); // Use session object
  const isLoading = false; // Stub - add real loading logic if needed
  const error = null; // Stub - add real error handling if needed

  const employee = session.employee; // Access from session
  const isAuthenticated = session.isAuthenticated;

  const logout = useCallback(async () => {
    try {
      await clearSession();
      router.push('/auth/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  }, [clearSession, router]);

  const refreshSession = useCallback(async () => {
    // Add refresh logic if needed, or leave empty
  }, []);

  return {
    employee,
    isAuthenticated,
    isLoading,
    error,
    logout,
    refreshSession,
  };
}