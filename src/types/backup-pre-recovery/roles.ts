export interface RolePermissions {
  canManageUsers: boolean;
  canModifySettings: boolean;
  canViewDashboard: boolean;
  canProcessPayments: boolean;
}

export type Role = 'admin' | 'merchant' | 'customer';

export type RolePermissionsMap = {
  [key in Role]: RolePermissions;
};

export const rolePermissions: RolePermissionsMap = {
  admin: {
    canManageUsers: true,
    canModifySettings: true,
    canViewDashboard: true,
    canProcessPayments: true
  },
  merchant: {
    canManageUsers: false,
    canModifySettings: true,
    canViewDashboard: true,
    canProcessPayments: true
  },
  customer: {
    canManageUsers: false,
    canModifySettings: false,
    canViewDashboard: false,
    canProcessPayments: true
  }
}