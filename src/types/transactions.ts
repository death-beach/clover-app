export type TransactionStatus = 'pending' | 'completed' | 'failed'

export interface Transaction {
  id: string
  cloverOrderId: string
  solanaSignature: string
  amountUsdc: number
  amountUsd: number
  status: TransactionStatus
  timestamp: string
  merchantId: string
}