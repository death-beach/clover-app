"use client";

// builtin
import { useCallback } from 'react';

// external
import { PrivyProvider as BasePrivyProvider } from '@privy-io/react-auth';
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana'; // Test this
import type { User } from '@privy-io/react-auth';

// internal
import { useRouter } from 'next/navigation';

const solanaConnectors = toSolanaWalletConnectors({
  shouldAutoConnect: true,
});

export function PrivyProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleLogin = useCallback((user: User, isNewUser: boolean) => {
    console.log('User logged in:', JSON.stringify(user, null, 2), 'Is new user:', isNewUser);
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
          walletList: ['phantom'],
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
        externalWallets: {
          solana: {
            connectors: solanaConnectors,
          },
        },
      }}
      onSuccess={handleLogin}
    >
      {children}
    </BasePrivyProvider>
  );
}