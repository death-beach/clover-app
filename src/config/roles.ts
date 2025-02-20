export const ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  CASHIER: 'CASHIER',
} as const;

export type Role = keyof typeof ROLES;

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: {
    canManageRoles: true,
    canManageUsers: true,
    canViewTransactions: true,
    canProcessPayments: true,
    canManageSettings: true,
    canViewAnalytics: true,
  },
  [ROLES.MANAGER]: {
    canManageRoles: true,
    canManageUsers: true,
    canViewTransactions: true,
    canProcessPayments: true,
    canManageSettings: false,
    canViewAnalytics: true,
  },
  [ROLES.CASHIER]: {
    canManageRoles: false,
    canManageUsers: false,
    canViewTransactions: true,
    canProcessPayments: true,
    canManageSettings: false,
    canViewAnalytics: false,
  },
} as const;