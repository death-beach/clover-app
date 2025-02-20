export type KycStatus = 'pending' | 'approved' | 'rejected'

export interface Merchant {
  id: string
  cloverMerchantId: string
  businessName: string
  mainWalletAddress: string
  offrampWalletAddress: string
  kycStatus: KycStatus
}