'use client'

import { useMemo } from 'react'
import { type UserRole, rolePermissions } from '@/types/roles'
import { usePathname } from 'next/navigation'

export type MenuItem = {
  name: string
  href: string
  icon?: string
  requiresPermission?: keyof typeof rolePermissions.owner
  description?: string
}

const ALL_MENU_ITEMS: MenuItem[] = [
  { 
    name: 'Dashboard', 
    href: '/',
    icon: 'home',
    description: 'Overview of your store'
  },
  { 
    name: 'Sales', 
    href: '/sales',
    icon: 'chart-bar',
    requiresPermission: 'canViewSales',
    description: 'View and manage sales'
  },
  { 
    name: 'Transfer Requests', 
    href: '/transfers',
    icon: 'arrow-path',
    requiresPermission: 'canRequestTransfers',
    description: 'Manage transfer requests'
  },
  { 
    name: 'Transfer Approvals', 
    href: '/approvals',
    icon: 'check-circle',
    requiresPermission: 'canApproveTransfers',
    description: 'Approve pending transfers'
  },
  { 
    name: 'User Management', 
    href: '/users',
    icon: 'users',
    requiresPermission: 'canManageUsers',
    description: 'Manage user accounts and roles'
  },
  { 
    name: 'Settings', 
    href: '/settings',
    icon: 'cog',
    requiresPermission: 'canModifySettings',
    description: 'Configure system settings'
  }
]

export function useNavigation(role: UserRole | undefined) {
  const pathname = usePathname()
  
  const menuItems = useMemo(() => {
    if (!role) return []
    
    const permissions = rolePermissions[role]
    
    return ALL_MENU_ITEMS.filter(item => {
      if (!item.requiresPermission) return true
      return permissions[item.requiresPermission]
    })
  }, [role])

  const currentItem = useMemo(() => {
    return menuItems.find(item => item.href === pathname)
  }, [menuItems, pathname])

  return { 
    menuItems,
    currentItem
  }
}