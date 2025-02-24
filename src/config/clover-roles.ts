export const CLOVER_ROLES = {
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  EMPLOYEE: 'EMPLOYEE',
} as const;

export type CloverRole = keyof typeof CLOVER_ROLES;

export const CLOVER_ROLE_PERMISSIONS = {
  OWNER: {
    canManageRoles: true,
    canManageUsers: true,
    canViewTransactions: true,
    canProcessPayments: true,
    canManageSettings: true,
    canViewAnalytics: true,
    canOffRamp: true,
    canViewSales: true,       // Add this
    canRequestTransfers: true, // Add if needed
    canApproveTransfers: true, // Add if needed
  },
  ADMIN: {
    canManageRoles: true,
    canManageUsers: true,
    canViewTransactions: true,
    canProcessPayments: true,
    canManageSettings: true,
    canViewAnalytics: true,
    canOffRamp: false,
    canViewSales: true,       // Add this
    canRequestTransfers: true, // Add if needed
    canApproveTransfers: true,// Add if needed
  },
  MANAGER: {
    canManageRoles: false,
    canManageUsers: false,
    canViewTransactions: true,
    canProcessPayments: true,
    canManageSettings: false,
    canViewAnalytics: true,
    canOffRamp: false,
    canViewSales: true,       // Add this
    canRequestTransfers: true, // Add if needed
    canApproveTransfers: true,// Add if needed
  },
  EMPLOYEE: {
    canManageRoles: false,
    canManageUsers: false,
    canViewTransactions: false,
    canProcessPayments: true,
    canManageSettings: false,
    canViewAnalytics: false,
    canOffRamp: false,
    canViewSales: false,      // Add this
    canRequestTransfers: false,// Add if needed
    canApproveTransfers: false,// Add if needed
  },
} as const;