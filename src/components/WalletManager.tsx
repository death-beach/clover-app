import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import type { Merchant } from '@/types/merchants'

export function WalletManager() {
  const [merchant, setMerchant] = useState<Merchant | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Sales Wallet</h2>
          {isLoading ? (
            <p>Loading...</p>
          ) : merchant ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <div className="mt-1 flex items-center space-x-2">
                  <input
                    type="text"
                    readOnly
                    value={merchant.mainWalletAddress}
                    className="flex-1 px-4 py-2 border rounded-md bg-gray-50"
                  />
                  <button
                    className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
                    onClick={() => {/* TODO: Implement copy */}}
                  >
                    Copy
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Balance</label>
                <p className="mt-1 text-2xl font-semibold">0.00 USDC</p>
              </div>
            </div>
          ) : (
            <p>No wallet configured</p>
          )}
        </div>
      </Card>

      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Off-Ramp Wallet</h2>
          {isLoading ? (
            <p>Loading...</p>
          ) : merchant ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <div className="mt-1 flex items-center space-x-2">
                  <input
                    type="text"
                    readOnly
                    value={merchant.offrampWalletAddress}
                    className="flex-1 px-4 py-2 border rounded-md bg-gray-50"
                  />
                  <button
                    className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
                    onClick={() => {/* TODO: Implement copy */}}
                  >
                    Copy
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Balance</label>
                <p className="mt-1 text-2xl font-semibold">0.00 USDC</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Off-Ramp Schedule</label>
                <select
                  className="mt-1 block w-full px-4 py-2 border rounded-md"
                  value="daily"
                  onChange={() => {/* TODO: Implement schedule change */}}
                >
                  <option value="manual">Manual</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
            </div>
          ) : (
            <p>No wallet configured</p>
          )}
        </div>
      </Card>
    </div>
  )
}