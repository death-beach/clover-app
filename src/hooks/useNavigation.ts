'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { CLOVER_ROLES, type CloverRole, CLOVER_ROLE_PERMISSIONS } from '@/config/clover-roles';

export type MenuItem = {
  name: string;
  href: string;
  icon?: string;
  requiresPermission?: keyof typeof CLOVER_ROLE_PERMISSIONS.OWNER;
  description?: string;
};

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
    requiresPermission: 'canManageSettings', // Changed to match clover-roles.ts
    description: 'Configure system settings'
  }
];

export function useNavigation(role: CloverRole | undefined) {
  const pathname = usePathname();
  
  const menuItems = useMemo(() => {
    if (!role) return [];
    
    const permissions = CLOVER_ROLE_PERMISSIONS[role];
    
    return ALL_MENU_ITEMS.filter(item => {
      if (!item.requiresPermission) return true;
      return permissions[item.requiresPermission];
    });
  }, [role]);

  const currentItem = useMemo(() => {
    return menuItems.find(item => item.href === pathname);
  }, [menuItems, pathname]);

  return { 
    menuItems,
    currentItem
  };
}