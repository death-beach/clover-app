"use client";

import { PrivyProvider as BasePrivyProvider } from '@privy-io/react-auth';
import { PRIVY_CONFIG } from '@/config/privy';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export function PrivyProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleLogin = useCallback((user: any) => {
    console.log('User logged in:', user.id);
    router.push('/dashboard');
  }, [router]);

  const handleLogout = useCallback(() => {
    console.log('User logged out');
    router.push('/');
  }, [router]);

  return (
    <BasePrivyProvider
      appId={PRIVY_CONFIG.appId as string}
      config={{
        loginMethods: PRIVY_CONFIG.loginMethods,
        appearance: PRIVY_CONFIG.appearance,
        onSuccess: handleLogin,
        onLogout: handleLogout,
        onError: (error) => {
          console.error('Privy authentication error:', error);
        },
      }}
    >
      {children}
    </BasePrivyProvider>
  );
}