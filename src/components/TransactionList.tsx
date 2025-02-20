import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import type { Transaction } from '@/types/transactions'

export function TransactionList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(false)

  return (
    <Card>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Recent Transactions</h2>
          <div className="flex space-x-4">
            <input
              type="search"
              placeholder="Search transactions..."
              className="px-4 py-2 border rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
              onClick={() => {/* TODO: Implement export */}}
            >
              Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="pb-3">Date</th>
                <th className="pb-3">Order ID</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">Loading...</td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">No transactions found</td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="border-b">
                    <td className="py-3">{new Date(tx.timestamp).toLocaleDateString()}</td>
                    <td className="py-3">{tx.cloverOrderId}</td>
                    <td className="py-3">${tx.amountUsd.toFixed(2)}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        tx.status === 'completed' ? 'bg-green-100 text-green-800' :
                        tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => {/* TODO: Implement view details */}}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  )
}