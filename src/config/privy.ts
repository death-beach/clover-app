export const PRIVY_CONFIG = {
  appId: process.env.NEXT_PUBLIC_PRIVY_APP_ID,
  loginMethods: ['email', 'wallet'],
  defaultChain: 'solana:mainnet',
  supportedChains: ['solana:mainnet'],
  appearance: {
    theme: 'light',
    accentColor: '#4F46E5',
    logo: '/logo.png',
  },
  embeddedWallets: {
    createOnLogin: 'users-choice',
    noPromptOnSignature: false,
    solanaEnabled: true,
  },
  solana: {
    mainnet: {
      rpcUrl: process.env.SOLANA_RPC_URL
    }
  },
  walletConnectors: [
    {
      name: 'phantom',
      required: true
    },
    {
      name: 'solflare',
      required: true
    }
  ]
};