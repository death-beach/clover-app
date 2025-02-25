"use client";

import { PrivyProvider as BasePrivyProvider } from '@privy-io/react-auth';
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export function PrivyProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleLogin = useCallback((user: any) => {
    console.log('User logged in:', JSON.stringify(user, null, 2));
    router.push('/dashboard');
  }, [router]);

  const solanaConnectors = toSolanaWalletConnectors({
    shouldAutoConnect: true,
  });

  return (
    <BasePrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID as string}
      config={{
        loginMethods: ['email', 'wallet'],
        appearance: {
          theme: 'light',
          accentColor: '#4F46E5',
          logo: '/logo.png',
          walletChainType: 'solana-only', // Ensures Solana wallets
          walletList: ['phantom', 'solflare'], // Back to your original list
        },
        externalWallets: {
          solana: {
            connectors: solanaConnectors,
          },
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets', // No defaultChain needed
        },
        onSuccess: handleLogin,
        onError: (error: unknown) => {
          console.error('Privy authentication error:', error);
        },
      }}
    >
      {children}
    </BasePrivyProvider>
  );
}