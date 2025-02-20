'use client';

import { usePrivy } from '@privy-io/react-auth';

export default function WalletsPage() {
  const { user, authenticated } = usePrivy();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Connected Wallets</h1>
        <button className="btn btn-primary">
          Connect New Wallet
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Primary Wallet Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-medium">Primary Wallet</h3>
              <p className="text-sm text-gray-500 mt-1">
                {user?.wallet?.address ? 
                  `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}` : 
                  'No wallet connected'}
              </p>
            </div>
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
              Active
            </span>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">USDC Balance</span>
              <span className="font-medium">0.00 USDC</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">SOL Balance</span>
              <span className="font-medium">0.00 SOL</span>
            </div>
          </div>
          <div className="mt-6 flex space-x-3">
            <button className="btn btn-secondary btn-sm">
              View on Explorer
            </button>
            <button className="btn btn-secondary btn-sm">
              Copy Address
            </button>
          </div>
        </div>

        {/* Connected Wallets Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Other Connected Wallets</h3>
          <div className="text-sm text-gray-500">
            No additional wallets connected
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-lg shadow p-6 mt-6">
        <h3 className="text-lg font-medium mb-4">Recent Wallet Activity</h3>
        <div className="text-sm text-gray-500">
          No recent activity
        </div>
      </div>
    </div>
  );
}