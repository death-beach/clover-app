import { RolePermissionsMap } from '@/types/roles'

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