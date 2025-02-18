import type { ReactNode } from 'react'
import type { UserRole } from '@/types/auth/roles'

export interface DashboardStats {
  totalTransactions: number
  totalRevenue: number
  pendingTransactions: number
}

export interface DashboardWidgetProps {
  title: string
  children: ReactNode
  role?: UserRole[]
}

export interface DashboardContextType {
  stats: DashboardStats
  isLoading: boolean
  error: Error | null
  refreshStats: () => Promise<void>
}

export interface DashboardProviderProps {
  children: ReactNode
}

export interface TransactionSummary {
  id: string
  date: string
  amount: number
  status: 'pending' | 'completed' | 'failed'
  type: 'deposit' | 'withdrawal' | 'transfer'
}