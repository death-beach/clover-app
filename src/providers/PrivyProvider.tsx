"use client";

// builtin
import { useCallback } from 'react';

// external
import { PrivyProvider as BasePrivyProvider } from '@privy-io/react-auth';
import type { User } from '@privy-io/react-auth';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { clusterApiUrl } from '@solana/web3.js';

// internal
import { useRouter } from 'next/navigation';

const solanaNetwork = clusterApiUrl('mainnet-beta'); // Or 'devnet'
const wallets = [new PhantomWalletAdapter()];

export function PrivyProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleLogin = useCallback((user: User, isNewUser: boolean) => {
    console.log('User logged in:', JSON.stringify(user, null, 2), 'Is new user:', isNewUser);
    router.push('/dashboard');
  }, [router]);

  return (
    <ConnectionProvider endpoint={solanaNetwork}>
      <WalletProvider wallets={wallets} autoConnect>
        <BasePrivyProvider
          appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID as string}
          config={{
            loginMethods: ['email'],
            appearance: {
              theme: 'light',
              accentColor: '#4F46E5',
              logo: '/logo.png',
            },
            embeddedWallets: {
              createOnLogin: 'users-without-wallets',
            },
          }}
          onSuccess={handleLogin}
        >
          {children}
        </BasePrivyProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}