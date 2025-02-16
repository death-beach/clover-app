'use client'

import { useState, useEffect, useCallback } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { type Role } from './roles'
import { type PrivyUser, isPrivyUser } from './privy'

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

interface CachedRole {
  role: Role;
  timestamp: number;
}

// Type guard for Role
function isUserRole(role: string): role is Role {
  return ['admin', 'merchant', 'customer'].includes(role as Role)
}

// In-memory cache for roles
const roleCache = new Map<string, CachedRole>();

export interface User {
  id: string;
  role: Role;
  email: string;
  name: string;
  createdAt: Date;
  lastLogin: Date;
}

export interface UserSession {
  user: User | null;
  role: Role | null;
  isLoading: boolean;
  error?: Error;
}

export function useUserRole(): UserSession {
  const { user: privyUser, ready, authenticated, getAccessToken } = usePrivy()
  const [role, setRole] = useState<Role | null>(null)
  const [isLoadingRole, setIsLoadingRole] = useState(false)
  const [error, setError] = useState<Error | undefined>()

  // Check if cached role is still valid
  const isCacheValid = useCallback((cachedData: CachedRole): boolean => {
    return Date.now() - cachedData.timestamp < CACHE_DURATION
  }, [])

  // Get role from cache
  const getCachedRole = useCallback((userId: string): Role | null => {
    const cachedData = roleCache.get(userId)
    if (cachedData && isCacheValid(cachedData)) {
      return cachedData.role
    }
    return null
  }, [isCacheValid])

  // Set role in cache
  const setCachedRole = useCallback((userId: string, role: Role) => {
    roleCache.set(userId, {
      role,
      timestamp: Date.now()
    })
  }, [])

  useEffect(() => {
    let isMounted = true

    const fetchUserRole = async () => {
      // Only fetch if auth is ready, user is authenticated, and we have a user ID
      if (!ready || !authenticated || !privyUser?.id) {
        return
      }

      // Check cache first
      const cachedRole = getCachedRole(privyUser.id)
      if (cachedRole) {
        setRole(cachedRole)
        setError(undefined)
        return
      }

      setIsLoadingRole(true)

      try {
        const accessToken = await getAccessToken()
        const response = await fetch(`${API_ENDPOINT}/api/users/${privyUser.id}/role`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        })

        if (!isMounted) return

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`)
        }

        const data = await response.json()
        
        let userRole: Role = 'customer' // Default role
        
        if (data.role && isUserRole(data.role)) {
          userRole = data.role
        } else {
          console.warn(`Invalid role received from server: ${data.role}. Using default role.`)
        }

        setRole(userRole)
        setCachedRole(privyUser.id, userRole)
        setError(undefined)
      } catch (err) {
        if (!isMounted) return
        
        const errorMessage = err instanceof Error 
          ? err.message 
          : 'Failed to fetch user role'
        
        console.error('Role fetching error:', errorMessage)
        setError(new Error(errorMessage))
        
        // Set default role on error
        setRole('customer')
      } finally {
        if (isMounted) {
          setIsLoadingRole(false)
        }
      }
    }

    fetchUserRole()

    return () => {
      isMounted = false
    }
  }, [privyUser?.id, authenticated, ready, getAccessToken, getCachedRole, setCachedRole])

  // Ensure we have a valid Privy user before creating our user object
  const user = privyUser && isPrivyUser(privyUser) ? {
    id: privyUser.id,
    role: role || 'customer',
    email: privyUser.email?.address || '',
    name: privyUser.email?.address?.split('@')[0] || `User-${privyUser.id.slice(0, 8)}`,
    createdAt: new Date(privyUser?.createdAt || Date.now()),
    lastLogin: new Date()
  } : null

  return {
    user,
    role,
    isLoading: isLoadingRole || !ready,
    error
  }
}