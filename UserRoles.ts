'use client'

import { useState, useEffect } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { type UserRole } from '@/types/roles'

export function useUserRole() {
  const { user } = usePrivy()
  const [role, setRole] = useState<UserRole>('trainee')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        // TODO: Implement role fetching from backend
        // For now, default to trainee
        setRole('trainee')
      } catch (error) {
        console.error('Failed to fetch user role:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserRole()
  }, [user])

  return { role, loading }
}
