// Clover roles mapping to our permission system
export const CLOVER_ROLES = {
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  EMPLOYEE: 'EMPLOYEE',
} as const;

export type CloverRole = keyof typeof CLOVER_ROLES;

// Mapping Clover roles to our system permissions
export const CLOVER_ROLE_PERMISSIONS = {
  [CLOVER_ROLES.OWNER]: {
    canManageRoles: true,
    canManageUsers: true,
    canViewTransactions: true,
    canProcessPayments: true,
    canManageSettings: true,
    canViewAnalytics: true,
    canOffRamp: true,
  },
  [CLOVER_ROLES.ADMIN]: {
    canManageRoles: true,
    canManageUsers: true,
    canViewTransactions: true,
    canProcessPayments: true,
    canManageSettings: true,
    canViewAnalytics: true,
    canOffRamp: true,
  },
  [CLOVER_ROLES.MANAGER]: {
    canManageRoles: false,
    canManageUsers: true,
    canViewTransactions: true,
    canProcessPayments: true,
    canManageSettings: false,
    canViewAnalytics: true,
    canOffRamp: false,
  },
  [CLOVER_ROLES.EMPLOYEE]: {
    canManageRoles: false,
    canManageUsers: false,
    canViewTransactions: true,
    canProcessPayments: true,
    canManageSettings: false,
    canViewAnalytics: false,
    canOffRamp: false,
  },
} as const;

// Helper to check if user has permission
export function hasPermission(role: CloverRole, permission: keyof typeof CLOVER_ROLE_PERMISSIONS[CloverRole]) {
  return CLOVER_ROLE_PERMISSIONS[role][permission];
}