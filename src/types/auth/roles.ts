export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  CASHIER = 'CASHIER',
  TRAINEE = 'TRAINEE',
  VIEWER = 'VIEWER'
}

// Type guard for Role
export function isUserRole(role: string): role is UserRole {
  return Object.values(UserRole).includes(role as UserRole)
}