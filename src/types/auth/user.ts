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

export function isPrivyUser(user: unknown): user is PrivyUser {
  return (
    typeof user === 'object' &&
    user !== null &&
    typeof (user as PrivyUser).id === 'string' &&
    (!(user as PrivyUser).email || (
      typeof (user as PrivyUser).email === 'object' &&
      (user as PrivyUser).email !== null &&
      typeof ((user as PrivyUser).email?.address) === 'string' &&
      typeof ((user as PrivyUser).email?.verified) === 'boolean'
    ))
  )
}