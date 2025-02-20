import { type CloverRole } from '@/config/clover-roles';

export interface User {
  id: string;
  role: CloverRole;
  email: string;
  name: string;
  createdAt: Date;
  lastLogin: Date;
}

export interface UserSession {
  user: User | null;
  role: CloverRole | null;
  isLoading: boolean;
  error?: Error;
}

export interface PrivyUser {
  id: string
  email?: {
    address: string
    verified: boolean
  }
  createdAt?: string
}

export function isPrivyUser(user: any): user is PrivyUser {
  return (
    typeof user === 'object' &&
    user !== null &&
    typeof user.id === 'string' &&
    (!user.email || (
      typeof user.email === 'object' &&
      typeof user.email.address === 'string' &&
      typeof user.email.verified === 'boolean'
    ))
  )
}