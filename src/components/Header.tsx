'use client'

import { type UserRole, rolePermissions } from '../types/roles'
import { useWallets } from '@privy-io/react-auth'
import { type PrivyUser } from '../types/privy'

interface HeaderProps {
  onLogout: () => void;
  userRole: UserRole;
  user: PrivyUser;
}

export function Header({ onLogout, userRole, user }: HeaderProps) {
  const { wallets, ready } = useWallets()
  const mainWallet = wallets?.[0]
  const permissions = rolePermissions[userRole]

  return (
    <header className="bg-white shadow" role="banner">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-900">
            {'Merchant Dashboard'}
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* User Information */}
          <div className="flex flex-col items-end">
            <div className="text-sm text-gray-600">
              {user.email?.address ?? 'No email'}
            </div>
            <div className="text-xs text-gray-500" role="status">
              {`Role: ${userRole.charAt(0).toUpperCase() + userRole.slice(1)}`}
            </div>
          </div>

          {/* Role-based Action Buttons */}
          <div className="flex items-center space-x-2">
            {permissions.canManageUsers && (
              <button
                className="rounded-md bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Manage Users"
              >
                {'Manage Users'}
              </button>
            )}
            {permissions.canModifySettings && (
              <button
                className="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                aria-label="Settings"
              >
                {'Settings'}
              </button>
            )}
          </div>

          {/* Wallet Information */}
          <div className="text-sm text-gray-600">
            {ready ? (
              <div className="text-gray-400">Loading wallet...</div>
            ) : mainWallet ? (
              <div role="status" aria-label="Connected wallet address">
                {`${mainWallet.address.slice(0, 6)}...${mainWallet.address.slice(-4)}`}
              </div>
            ) : (
              <div className="text-gray-400">No wallet connected</div>
            )}
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="rounded-md bg-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            aria-label="Logout"
          >
            {'Logout'}
          </button>
        </div>
      </div>
    </header>
  )
}