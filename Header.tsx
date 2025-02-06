'use client'

import { type UserRole } from '@/types/roles'
import { useWallets } from '@privy-io/react-auth'

interface HeaderProps {
  onLogout: () => void
  userRole: UserRole
}

export function Header({ onLogout, userRole }: HeaderProps) {
  const { wallets } = useWallets()
  const mainWallet = wallets[0]

  return (
    <header className="bg-white shadow">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-900">
            {'Merchant Dashboard'}
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            {`Role: ${userRole}`}
          </div>

          {mainWallet && (
            <div className="text-sm text-gray-600">
              {`Wallet: ${mainWallet.address.slice(0, 6)}...${mainWallet.address.slice(-4)}`}
            </div>
          )}

          <button
            onClick={onLogout}
            className="rounded-md bg-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            {'Logout'}
          </button>
        </div>
      </div>
    </header>
  )
}
