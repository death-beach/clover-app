export type UserRole = 'trainee' | 'experienced' | 'lead' | 'manager' | 'owner'

export interface UserSession {
  user: {
    id: string
    role: UserRole
    email: string
    name: string
    createdAt: Date
    lastLogin: Date
  } | null
  role: UserRole | null
  isLoading: boolean
  error?: Error
}