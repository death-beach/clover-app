import { useMemo } from 'react'
import { useDashboardContext } from '../context/DashboardContext'
import { useAuth } from '@/hooks/auth/useAuth'
import type { UserRole } from '@/types/auth/roles'
import type { TransactionSummary } from '../types'
import { useApiRequest } from '@/hooks/api/useApiRequest'

export const useDashboard = () => {
  const dashboardContext = useDashboardContext()
  const { user } = useAuth()
  const { 
    fetch: fetchTransactions, 
    data: transactions, 
    isLoading: isTransactionsLoading, 
    error: transactionsError 
  } = useApiRequest<TransactionSummary[]>('/api/dashboard/transactions')

  // Role-based access control for dashboard features
  const canAccessDashboard = useMemo(() => {
    const allowedRoles: UserRole[] = [
      'ADMIN', 
      'MANAGER', 
      'CASHIER'
    ]
    return user && allowedRoles.includes(user.role)
  }, [user])

  // Filter transactions based on user role
  const filteredTransactions = useMemo(() => {
    if (!transactions) return []
    
    // Additional filtering logic based on user role
    switch (user?.role) {
      case 'ADMIN':
        return transactions
      case 'MANAGER':
        return transactions.filter(tx => 
          tx.status !== 'failed' && tx.amount > 0
        )
      case 'CASHIER':
        return transactions.filter(tx => 
          tx.status === 'pending' || tx.status === 'completed'
        )
      default:
        return []
    }
  }, [transactions, user])

  return {
    // Dashboard stats from context
    stats: dashboardContext.stats,
    isStatsLoading: dashboardContext.isLoading,
    statsError: dashboardContext.error,
    refreshStats: dashboardContext.refreshStats,

    // Transactions data
    transactions: filteredTransactions,
    isTransactionsLoading,
    transactionsError,
    fetchTransactions,

    // Access control
    canAccessDashboard,
    userRole: user?.role
  }
}