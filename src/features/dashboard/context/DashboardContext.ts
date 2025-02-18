import { createContext, useContext } from 'react'
import type { DashboardContextType } from '../types'

export const DashboardContext = createContext<DashboardContextType | null>(null)

export const useDashboardContext = () => {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error('useDashboardContext must be used within a DashboardProvider')
  }
  return context
}