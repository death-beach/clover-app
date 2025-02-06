'use client'

import { useMemo } from 'react'
import { type UserRole } from '@/types/roles'

export function useNavigation(role: UserRole) {
  const menuItems = useMemo(() => {
    const items = [
      { name: 'Dashboard', href: '/' },
      { name: 'Transactions', href: '/transactions' },
    ]

    if (role === 'manager' || role === 'owner') {
      items.push(
        { name: 'User Management', href: '/users' },
        { name: 'Wallet Settings', href: '/wallets' },
        { name: 'Off-Ramp Settings', href: '/off-ramp' }
      )
    }

    if (role === 'lead' || role === 'experienced') {
      items.push({ name: 'Transfer Requests', href: '/transfers' })
    }

    return items
  }, [role])

  return { menuItems }
}
