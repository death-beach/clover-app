import type { ReactNode } from 'react'
import type { User } from '@/types/auth'

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  error: Error | null
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  updateUser: (data: Partial<User>) => Promise<void>
}

export interface AuthProviderProps {
  children: ReactNode
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  error: Error | null
}