import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCloverSession } from '@/providers/CloverSessionProvider';

export function useCloverAuth() {
  const router = useRouter();
  const { employee, isLoading, error, refreshSession } = useCloverSession();

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/auth/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }, [router]);

  return {
    isAuthenticated: !!employee,
    isLoading,
    error,
    employee,
    logout,
    refreshSession,
  };
}