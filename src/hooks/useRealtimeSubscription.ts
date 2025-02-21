import { useEffect } from 'react'
import { RealtimeChannel } from '@supabase/supabase-js'
import {
  subscribeToTransactions,
  subscribeToTransfers,
  subscribeToMerchantKYC,
} from '@/lib/db/realtime'

type SubscriptionType = 'transactions' | 'transfers' | 'kyc'

export const useRealtimeSubscription = (
  type: SubscriptionType,
  merchantId?: string,
  callback?: (data: any) => void
) => {
  useEffect(() => {
    let subscription: RealtimeChannel

    switch (type) {
      case 'transactions':
        subscription = subscribeToTransactions(merchantId)
        break
      case 'transfers':
        subscription = subscribeToTransfers(merchantId)
        break
      case 'kyc':
        if (!merchantId) {
          console.error('merchantId is required for KYC subscription')
          return
        }
        subscription = subscribeToMerchantKYC(merchantId)
        break
    }

    if (callback) {
      subscription.on('data', callback)
    }

    return () => {
      subscription.unsubscribe()
    }
  }, [type, merchantId, callback])
}