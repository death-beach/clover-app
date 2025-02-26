"use client";

// builtin
import { useCallback } from 'react';

// external
import { PrivyProvider as BasePrivyProvider } from '@privy-io/react-auth';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { clusterApiUrl } from '@solana/web3.js';

// internal
import { useRouter } from 'next/navigation';

import { type PrivyUser } from '@/types/auth/user';

const solanaNetwork = clusterApiUrl('mainnet-beta'); // Or 'devnet' if testing
const wallets = [new PhantomWalletAdapter()]; // Add more Solana wallets if needed

export function PrivyProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleLogin = useCallback((user: PrivyUser) => {
    console.log('User logged in:', JSON.stringify(user, null, 2));
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
          // Add this to control which wallets are shown
          walletList: ['phantom'],
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      <ConnectionProvider endpoint={solanaNetwork}>
        <WalletProvider wallets={wallets} autoConnect>
          {children}
        </WalletProvider>
      </ConnectionProvider>
    </BasePrivyProvider>
  );}