import { PrivyUser } from '@/types/privy'

export function convertPrivyUser(user: any): PrivyUser {
  return {
    id: user.id,
    email: user.email ? {
      address: user.email.address,
      verified: user.email.verified
    } : undefined,
    wallet: user.wallet ? {
      address: user.wallet.address,
      chainId: user.wallet.chainId
    } : undefined
  }
}