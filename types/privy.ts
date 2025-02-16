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