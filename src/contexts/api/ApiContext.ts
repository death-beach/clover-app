import { createContext, useContext } from 'react'
import type { ApiContextType } from './types'

export const ApiContext = createContext<ApiContextType | null>(null)

export const useApiContext = () => {
  const context = useContext(ApiContext)
  if (!context) {
    throw new Error('useApiContext must be used within an ApiProvider')
  }
  return context
}

// Utility type for creating typed API hooks
export type ApiHook<T> = () => {
  data: T | null
  isLoading: boolean
  error: Error | null
  fetch: (params?: any) => Promise<T>
}