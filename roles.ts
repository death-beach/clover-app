export type UserRole = 'trainee' | 'experienced' | 'lead' | 'manager' | 'owner'

export interface Permission {
  canViewSales: boolean
  canRequestTransfers: boolean
  canApproveTransfers: boolean
  canModifySettings: boolean
  canManageUsers: boolean
}

export const rolePermissions: Record<UserRole, Permission> = {
  trainee: {
    canViewSales: true,
    canRequestTransfers: true,
    canApproveTransfers: false,
    canModifySettings: false,
    canManageUsers: false,
  },
  experienced: {
    canViewSales: true,
    canRequestTransfers: true,
    canApproveTransfers: false,
    canModifySettings: false,
    canManageUsers: false,
  },
  lead: {
    canViewSales: true,
    canRequestTransfers: true,
    canApproveTransfers: true,
    canModifySettings: false,
    canManageUsers: false,
  },
  manager: {
    canViewSales: true,
    canRequestTransfers: true,
    canApproveTransfers: true,
    canModifySettings: true,
    canManageUsers: true,
  },
  owner: {
    canViewSales: true,
    canRequestTransfers: true,
    canApproveTransfers: true,
    canModifySettings: true,
    canManageUsers: true,
  },
}
