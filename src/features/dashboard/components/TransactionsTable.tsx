import { useMemo } from 'react'
import { useDashboard } from '../hooks/useDashboard'

export const TransactionsTable = () => {
  const { 
    transactions, 
    isTransactionsLoading, 
    transactionsError,
    canAccessDashboard 
  } = useDashboard()

  // Memoize table rows for performance
  const tableRows = useMemo(() => {
    return transactions.map(transaction => (
      <tr key={transaction.id}>
        <td>{transaction.date}</td>
        <td>${transaction.amount.toFixed(2)}</td>
        <td>
          <span 
            className={`badge badge-${transaction.status}`}
          >
            {transaction.status}
          </span>
        </td>
        <td>{transaction.type}</td>
      </tr>
    ))
  }, [transactions])

  // If user can't access dashboard, return null
  if (!canAccessDashboard) return null

  // Loading state
  if (isTransactionsLoading) {
    return <div>Loading transactions...</div>
  }

  // Error state
  if (transactionsError) {
    return (
      <div className="error">
        Failed to load transactions: {transactionsError.message}
      </div>
    )
  }

  // Empty state
  if (transactions.length === 0) {
    return <div>No transactions found.</div>
  }

  return (
    <table className="transactions-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Amount</th>
          <th>Status</th>
          <th>Type</th>
        </tr>
      </thead>
      <tbody>
        {tableRows}
      </tbody>
    </table>
  )
}