import { useReducer, useCallback, useEffect } from 'react'
import { DashboardContext } from './DashboardContext'
import type { 
  DashboardProviderProps, 
  DashboardStats, 
  DashboardContextType 
} from '../types'
import { useApiRequest } from '@/hooks/api/useApiRequest'

type DashboardState = Pick<DashboardContextType, 'stats' | 'isLoading' | 'error'>

type DashboardAction = 
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: DashboardStats }
  | { type: 'FETCH_ERROR'; payload: Error }

const initialState: DashboardState = {
  stats: {
    totalTransactions: 0,
    totalRevenue: 0,
    pendingTransactions: 0
  },
  isLoading: false,
  error: null
}

const dashboardReducer = (state: DashboardState, action: DashboardAction): DashboardState => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, isLoading: true, error: null }
    case 'FETCH_SUCCESS':
      return { 
        ...state, 
        stats: action.payload, 
        isLoading: false, 
        error: null 
      }
    case 'FETCH_ERROR':
      return { 
        ...state, 
        isLoading: false, 
        error: action.payload 
      }
    default:
      return state
  }
}

export const DashboardProvider = ({ children }: DashboardProviderProps) => {
  const [state, dispatch] = useReducer(dashboardReducer, initialState)
  const { fetch, data, isLoading, error } = useApiRequest<DashboardStats>('/api/dashboard/stats')

  const refreshStats = useCallback(async () => {
    dispatch({ type: 'FETCH_START' })
    try {
      await fetch()
    } catch (err) {
      dispatch({ 
        type: 'FETCH_ERROR', 
        payload: err instanceof Error 
          ? err 
          : new Error('Failed to fetch dashboard stats') 
      })
    }
  }, [fetch])

  // Automatically fetch stats on mount
  useEffect(() => {
    refreshStats()
  }, [refreshStats])

  // Update state when data changes
  useEffect(() => {
    if (data) {
      dispatch({ type: 'FETCH_SUCCESS', payload: data })
    }
  }, [data])

  const value = {
    ...state,
    refreshStats
  }

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  )
}