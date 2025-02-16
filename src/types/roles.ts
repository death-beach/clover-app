export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  CASHIER = 'CASHIER',
  TRAINEE = 'TRAINEE',
  VIEWER = 'VIEWER'
}

export interface RolePermissions {
  canViewTransactions: boolean;
  canProcessPayments: boolean;
  canManageUsers: boolean;
  canAccessSettings: boolean;
  canViewDashboard: boolean;
  canModifySettings: boolean;
  canViewReports: boolean;
  canExportData: boolean;
}

export type RolePermissionsMap = {
  [key in UserRole]: RolePermissions;
};

export const rolePermissions: RolePermissionsMap = {
  [UserRole.ADMIN]: {
    canViewTransactions: true,
    canProcessPayments: true,
    canManageUsers: true,
    canAccessSettings: true,
    canViewDashboard: true,
    canModifySettings: true,
    canViewReports: true,
    canExportData: true
  },
  [UserRole.MANAGER]: {
    canViewTransactions: true,
    canProcessPayments: true,
    canManageUsers: true,
    canAccessSettings: true,
    canViewDashboard: true,
    canModifySettings: false,
    canViewReports: true,
    canExportData: true
  },
  [UserRole.CASHIER]: {
    canViewTransactions: true,
    canProcessPayments: true,
    canManageUsers: false,
    canAccessSettings: false,
    canViewDashboard: true,
    canModifySettings: false,
    canViewReports: false,
    canExportData: false
  },
  [UserRole.TRAINEE]: {
    canViewTransactions: true,
    canProcessPayments: false,
    canManageUsers: false,
    canAccessSettings: false,
    canViewDashboard: true,
    canModifySettings: false,
    canViewReports: false,
    canExportData: false
  },
  [UserRole.VIEWER]: {
    canViewTransactions: true,
    canProcessPayments: false,
    canManageUsers: false,
    canAccessSettings: false,
    canViewDashboard: true,
    canModifySettings: false,
    canViewReports: false,
    canExportData: false
  }
};

export function hasRequiredRole(userRole: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy = [
    UserRole.VIEWER,
    UserRole.TRAINEE,
    UserRole.CASHIER,
    UserRole.MANAGER,
    UserRole.ADMIN
  ];
  
  const userRoleIndex = roleHierarchy.indexOf(userRole);
  const requiredRoleIndex = roleHierarchy.indexOf(requiredRole);
  
  return userRoleIndex >= requiredRoleIndex;
}

export function getPermissionsForRole(role: UserRole): RolePermissions {
  return rolePermissions[role];
}