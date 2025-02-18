import { useCallback } from 'react'
import { useAuthContext } from '@/contexts/auth/AuthContext'
import type { User } from '@/types/auth'
import type { LoginCredentials } from '@/contexts/auth/types'

export const useAuth = () => {
  const context = useAuthContext()

  const hasRole = useCallback((requiredRole: string) => {
    if (!context.user) return false
    return context.user.role === requiredRole
  }, [context.user])

  const hasPermission = useCallback((permission: string) => {
    if (!context.user) return false
    // Implement permission check based on role
    return true // TODO: Implement actual permission check
  }, [context.user])

  return {
    ...context,
    hasRole,
    hasPermission
  }
}

// Export type for better DX
export type UseAuthReturn = ReturnType<typeof useAuth>