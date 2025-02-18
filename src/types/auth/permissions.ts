export interface RolePermissions {
  canManageUsers: boolean;
  canModifySettings: boolean;
  canViewDashboard: boolean;
  canProcessPayments: boolean;
  canAccessReports: boolean;
  canTrainNewStaff: boolean;
}

export const rolePermissions: Record<UserRole, RolePermissions> = {
  [UserRole.ADMIN]: {
    canManageUsers: true,
    canModifySettings: true,
    canViewDashboard: true,
    canProcessPayments: true,
    canAccessReports: true,
    canTrainNewStaff: true
  },
  [UserRole.MANAGER]: {
    canManageUsers: false,
    canModifySettings: true,
    canViewDashboard: true,
    canProcessPayments: true,
    canAccessReports: true,
    canTrainNewStaff: true
  },
  [UserRole.CASHIER]: {
    canManageUsers: false,
    canModifySettings: false,
    canViewDashboard: true,
    canProcessPayments: true,
    canAccessReports: false,
    canTrainNewStaff: false
  },
  [UserRole.TRAINEE]: {
    canManageUsers: false,
    canModifySettings: false,
    canViewDashboard: true,
    canProcessPayments: false,
    canAccessReports: false,
    canTrainNewStaff: false
  },
  [UserRole.VIEWER]: {
    canManageUsers: false,
    canModifySettings: false,
    canViewDashboard: true,
    canProcessPayments: false,
    canAccessReports: false,
    canTrainNewStaff: false
  }
};