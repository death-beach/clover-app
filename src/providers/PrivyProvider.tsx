"use client";

import { PrivyProvider as BasePrivyProvider } from '@privy-io/react-auth';
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { type PrivyUser } from '@/types/auth/user';

export function PrivyProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleLogin = useCallback((user: PrivyUser) => {
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
          walletChainType: 'solana-only', // Still helps external wallets
          walletList: ['detected_wallets'], // Phantom, Solflare, etc.
        },
        externalWallets: {
          solana: {
            connectors: solanaConnectors,
          },
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets'
        }
      }}
    >
      {children}
    </BasePrivyProvider>
  );
}