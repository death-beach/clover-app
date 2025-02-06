'use client'

import { usePrivy } from '@privy-io/react-auth'
import { useState } from 'react'

export function LoginScreen() {
  const { login, createWallet } = usePrivy()
  const [isCreatingWallet, setIsCreatingWallet] = useState(false)

  const handleCreateWallet = async () => {
    setIsCreatingWallet(true)
    try {
      await createWallet()
      // After wallet creation, trigger login flow
      await login()
    } catch (error) {
      console.error('Failed to create wallet:', error)
    } finally {
      setIsCreatingWallet(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white">
      <div className="w-full max-w-md space-y-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            {'Clover POS Gateway'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {'Sign in to access your merchant dashboard'}
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <button
            onClick={login}
            className="group relative flex w-full justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {'Connect Existing Wallet'}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">{'or'}</span>
            </div>
          </div>

          <button
            onClick={handleCreateWallet}
            disabled={isCreatingWallet}
            className="group relative flex w-full justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-green-400"
          >
            {isCreatingWallet ? 'Creating Wallet...' : 'Create New Wallet'}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">{'or'}</span>
            </div>
          </div>

          <button
            onClick={() => login({ loginMethods: ['email'] })}
            className="group relative flex w-full justify-center rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            {'Continue with Email'}
          </button>
        </div>

        <div className="mt-4 text-center text-xs text-gray-500">
          {'New users without a wallet will have one automatically created'}
        </div>
      </div>
    </div>
  )
}
