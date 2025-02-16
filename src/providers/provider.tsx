'use client'

import { PrivyProvider, usePrivy } from '@privy-io/react-auth'
import { createContext, useContext, type PropsWithChildren, useEffect, useState } from 'react'
import { type UserRole } from '../types/roles'
import { useUserRole } from '../types/UserRoles'

const PRIVY_APP_ID = 'cm5yjbh8z01lv6heoze3v3ep5'
const CLIENT_ID = 'client-WY5fRbUUsnYnSBnU7hp47apYGAdUgABi38uhK4PxBYLpx'

// Provider validation states
interface ProviderState {
  isInitialized: boolean
  hasError: boolean
  error?: Error
}

// User context types
interface UserContextState {
  isAuthenticated: boolean
  isLoading: boolean
  user: {
    id: string
    email?: string
    role: UserRole
    lastLogin: Date
    name?: string
  } | null
  error?: Error
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const UserContext = createContext<UserContextState | undefined>(undefined)

// Custom hook to use the user context
export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

function useProviderValidation() {
  const [providerState, setProviderState] = useState<ProviderState>({
    isInitialized: false,
    hasError: false
  })

  useEffect(() => {
    const validateProviders = async () => {
      try {
        // Validate Privy configuration
        if (!PRIVY_APP_ID || !CLIENT_ID) {
          throw new Error('Missing required Privy configuration')
        }

        // Validate environment
        if (typeof window === 'undefined') {
          throw new Error('Provider must be used in client-side environment')
        }

        // Check if all required providers are available
        const requiredApis = ['localStorage', 'indexedDB', 'fetch']
        const missingApis = requiredApis.filter(api => !(api in window))
        if (missingApis.length > 0) {
          throw new Error(`Missing required browser APIs: ${missingApis.join(', ')}`)
        }

        // Validate localStorage for session management
        try {
          localStorage.setItem('provider_test', 'test')
          localStorage.removeItem('provider_test')
        } catch (e) {
          throw new Error('localStorage is not available')
        }

        setProviderState({
          isInitialized: true,
          hasError: false
        })
      } catch (error) {
        setProviderState({
          isInitialized: false,
          hasError: true,
          error: error instanceof Error ? error : new Error('Unknown provider error')
        })
      }
    }

    validateProviders()
  }, [])

  return providerState
}

function UserProvider({ children }: PropsWithChildren) {
  const { user: privyUser, authenticated, logout: privyLogout } = usePrivy()
  const { user: roleUser, isLoading: isLoadingRole, error: roleError, role } = useUserRole()
  
  const [state, setState] = useState<Omit<UserContextState, 'logout' | 'refreshUser'>>({
    isAuthenticated: false,
    isLoading: true,
    user: null
  })

  // Sync Privy and role state
  useEffect(() => {
    if (!authenticated || !privyUser) {
      setState({
        isAuthenticated: false,
        isLoading: false,
        user: null
      })
      return
    }

    if (isLoadingRole) {
      setState(prev => ({ ...prev, isLoading: true }))
      return
    }

    if (roleError) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: roleError
      }))
      return
    }

    if (roleUser) {
      setState({
        isAuthenticated: true,
        isLoading: false,
        user: {
          id: roleUser.id,
          email: roleUser.email,
          role: roleUser.role,
          name: roleUser.name,
          lastLogin: roleUser.lastLogin
        }
      })
    }
  }, [authenticated, privyUser, roleUser, isLoadingRole, roleError])

  const logout = async () => {
    try {
      // Clear local storage
      localStorage.removeItem('user_session')
      
      // Logout from Privy
      await privyLogout()
      
      // Reset state
      setState({
        isAuthenticated: false,
        isLoading: false,
        user: null
      })
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error : new Error('Logout failed')
      }))
    }
  }

  const refreshUser = async () => {
    setState(prev => ({ ...prev, isLoading: true }))
    try {
      // Force a refresh of the role
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${privyUser?.id}/role`, {
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to refresh user role')
      }

      // The useUserRole hook will automatically pick up the new role
      // due to cache invalidation
      setState(prev => ({ ...prev, isLoading: false }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error : new Error('Failed to refresh user')
      }))
    }
  }

  const value: UserContextState = {
    ...state,
    logout,
    refreshUser
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function PrivyWrapper({ children }: PropsWithChildren) {
  const { isInitialized, hasError, error } = useProviderValidation()

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-red-600 text-xl font-semibold mb-2">
            Authentication Error
          </h2>
          <p className="text-gray-600">
            {error?.message || 'Failed to initialize authentication providers'}
          </p>
        </div>
      </div>
    )
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-600">
          Initializing authentication...
        </div>
      </div>
    )
  }

  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      clientId={CLIENT_ID}
      config={{
        loginMethods: ['email', 'wallet'],
        appearance: {
          theme: 'light',
          accentColor: '#FF5F7A',
          showWalletLoginFirst: false,
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      <UserProvider>
        {children}
      </UserProvider>
    </PrivyProvider>
  )
}