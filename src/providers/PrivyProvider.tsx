"use client";

import { PrivyProvider as BasePrivyProvider } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export function PrivyProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleLogin = useCallback((user: any) => {
    console.log('User logged in:', user.id);
    router.push('/dashboard');
  }, [router]);

  return (
    <BasePrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID as string}
      config={{
        loginMethods: ['email', 'wallet'],
        appearance: {
          theme: 'light',
          accentColor: '#4F46E5',
          logo: '/logo.png',
        },
        onSuccess: handleLogin,
        onError: (error) => {
          console.error('Privy authentication error:', error);
        },
      }}
    >
      {children}
    </BasePrivyProvider>
  );
}