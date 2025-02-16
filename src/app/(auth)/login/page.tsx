'use client'

import { useState, useEffect } from 'react'
import { PublicKey } from '@solana/web3.js'
import { signIn } from 'next-auth/react'
import axios from 'axios'

// Wallet providers configuration
const WALLET_PROVIDERS = {
  PHANTOM: 'phantom',
  SOLFLARE: 'solflare',
  LEDGER: 'ledger'
}

// Helius API configuration
const HELIUS_API_BASE_URL = process.env.NEXT_PUBLIC_HELIUS_API_URL || 'https://api.helius.xyz/v1'

declare global {
  interface Window {
    solana?: {
      connect(): Promise<{ publicKey: PublicKey }>;
      disconnect(): Promise<void>;
      publicKey: PublicKey;
      isPhantom?: boolean;
    };
    solflare?: {
      connect(): Promise<{ publicKey: PublicKey }>;
      disconnect(): Promise<void>;
      publicKey: PublicKey;
    };
  }
}

interface ErrorState {
  message: string;
  type: 'wallet' | 'connection' | 'email' | 'kyc' | null;
}

export default function LoginPage() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [error, setError] = useState<ErrorState>({ message: '', type: null })

  // Verify wallet with Helius
  const verifyWalletWithHelius = async (walletAddress: string): Promise<boolean> => {
    try {
      const response = await axios.get(`${HELIUS_API_BASE_URL}/wallet-activity`, {
        params: {
          api_key: process.env.NEXT_PUBLIC_HELIUS_API_KEY,
          walletAddress
        }
      })
      
      return response.status === 200
    } catch (error) {
      console.error('Helius wallet verification failed:', error)
      return false
    }
  }

  // Connect wallet handler
  const handleWalletConnection = async (provider: string) => {
    setIsConnecting(true)
    setSelectedProvider(provider)
    setError({ message: '', type: null })

    try {
      let publicKey: string;

      switch(provider) {
        case WALLET_PROVIDERS.PHANTOM:
          if (!window.solana?.isPhantom) {
            throw new Error('Phantom wallet not installed')
          }
          const phantomResponse = await window.solana.connect()
          publicKey = phantomResponse.publicKey.toString()
          break;

        case WALLET_PROVIDERS.SOLFLARE:
          if (!window.solflare) {
            throw new Error('Solflare wallet not installed')
          }
          const solflareResponse = await window.solflare.connect()
          publicKey = solflareResponse.publicKey.toString()
          break;

        default:
          throw new Error('Unsupported wallet provider')
      }

      // Verify wallet with Helius
      const isValidWallet = await verifyWalletWithHelius(publicKey)
      
      if (!isValidWallet) {
        throw new Error('Wallet verification failed')
      }

      await signIn('credentials', {
        walletAddress: publicKey,
        walletProvider: provider,
        callbackUrl: '/dashboard',
        redirect: true,
      })
    } catch (error) {
      console.error('Wallet connection failed:', error)
      setError({
        message: error instanceof Error ? error.message : 'Wallet connection failed',
        type: 'wallet'
      })
    } finally {
      setIsConnecting(false)
      setSelectedProvider(null)
    }
  }

  // Email login handler
  const handleEmailLogin = async () => {
    setError({ message: '', type: null })
    try {
      await signIn('email', { 
        callbackUrl: '/dashboard',
        redirect: true,
      })
    } catch (error) {
      console.error('Email login failed:', error)
      setError({
        message: error instanceof Error ? error.message : 'Email login failed',
        type: 'email'
      })
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white">
      <div className="w-full max-w-md space-y-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Clover POS Gateway
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access your merchant dashboard
          </p>
        </div>

        {error.message && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
            {error.message}
          </div>
        )}

        <div className="mt-8 space-y-4">
          {Object.values(WALLET_PROVIDERS).map((provider) => (
            <button
              key={provider}
              onClick={() => handleWalletConnection(provider)}
              disabled={isConnecting}
              className={`
                group relative flex w-full justify-center rounded-md 
                px-4 py-2 text-sm font-medium text-white 
                focus:outline-none focus:ring-2 focus:ring-offset-2
                ${selectedProvider === provider 
                  ? 'bg-blue-700' 
                  : 'bg-blue-600 hover:bg-blue-700'}
              `}
            >
              {isConnecting && selectedProvider === provider 
                ? 'Connecting...' 
                : `Connect with ${provider.charAt(0).toUpperCase() + provider.slice(1)}`}
            </button>
          ))}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">or</span>
            </div>
          </div>

          <button
            onClick={handleEmailLogin}
            className="group relative flex w-full justify-center rounded-md 
              bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 
              hover:bg-gray-200 focus:outline-none focus:ring-2 
              focus:ring-gray-500 focus:ring-offset-2"
          >
            Continue with Email
          </button>
        </div>

        <div className="mt-4 text-center text-xs text-gray-500">
          New merchants will need to complete KYC verification through Bridge.xyz
        </div>
      </div>
    </div>
  )
}