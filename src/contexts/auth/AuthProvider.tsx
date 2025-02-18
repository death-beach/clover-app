import { useReducer, useCallback } from 'react'
import { usePrivy } from '@privy-io/react-auth'

import { AuthContext } from './AuthContext'
import type { AuthProviderProps, AuthState, LoginCredentials } from './types'
import type { User } from '@/types/auth'

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_ERROR'; payload: Error }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null }
    case 'LOGIN_SUCCESS':
      return { ...state, isLoading: false, user: action.payload }
    case 'LOGIN_ERROR':
      return { ...state, isLoading: false, error: action.payload }
    case 'LOGOUT':
      return { ...state, user: null }
    case 'UPDATE_USER':
      return { 
        ...state, 
        user: state.user ? { ...state.user, ...action.payload } : null 
      }
    default:
      return state
  }
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(authReducer, initialState)
  const { login: privyLogin, logout: privyLogout, user: privyUser } = usePrivy()

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: 'LOGIN_START' })
      await privyLogin()
      // Transform Privy user to our User type
      const user: User = {
        id: privyUser?.id || '',
        email: credentials.email,
        role: 'USER' // Default role, should be fetched from backend
      }
      dispatch({ type: 'LOGIN_SUCCESS', payload: user })
    } catch (error) {
      dispatch({ 
        type: 'LOGIN_ERROR', 
        payload: error instanceof Error ? error : new Error('Login failed') 
      })
      throw error
    }
  }, [privyLogin, privyUser])

  const logout = useCallback(async () => {
    try {
      await privyLogout()
      dispatch({ type: 'LOGOUT' })
    } catch (error) {
      console.error('Logout failed:', error)
      throw error
    }
  }, [privyLogout])

  const updateUser = useCallback(async (data: Partial<User>) => {
    dispatch({ type: 'UPDATE_USER', payload: data })
  }, [])

  const value = {
    ...state,
    login,
    logout,
    updateUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}