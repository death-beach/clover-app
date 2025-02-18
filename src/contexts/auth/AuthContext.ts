import { createContext } from 'react'

import type { User } from '@/types/auth'
import type { AuthContextType } from './types'

export const AuthContext = createContext<AuthContextType | null>(null)

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}