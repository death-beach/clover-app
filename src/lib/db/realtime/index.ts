import { supabase } from '../supabase'
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

type TransactionChanges = RealtimePostgresChangesPayload<{
  [key: string]: any
}>

export const setupRealtimeSubscriptions = () => {
  // Transaction status changes
  const transactionSubscription = supabase
    .channel('transaction-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'transactions',
      },
      async (payload: TransactionChanges) => {
        const { new: newRecord, old: oldRecord, eventType } = payload

        switch (eventType) {
          case 'INSERT':
            console.log('New transaction:', newRecord)
            // Handle new transaction
            break
          case 'UPDATE':
            if (newRecord.status !== oldRecord.status) {
              console.log('Transaction status changed:', {
                id: newRecord.transaction_id,
                oldStatus: oldRecord.status,
                newStatus: newRecord.status,
              })
              // Handle status change
            }
            break
        }
      }
    )
    .subscribe()

  // Transfer tracking (off-ramp)
  const transferSubscription = supabase
    .channel('transfer-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'transfers',
      },
      async (payload: TransactionChanges) => {
        const { new: newRecord, old: oldRecord, eventType } = payload

        switch (eventType) {
          case 'INSERT':
            console.log('New transfer initiated:', newRecord)
            // Handle new transfer
            break
          case 'UPDATE':
            if (newRecord.status !== oldRecord.status) {
              console.log('Transfer status changed:', {
                id: newRecord.transfer_id,
                oldStatus: oldRecord.status,
                newStatus: newRecord.status,
              })
              // Handle transfer status change
            }
            break
        }
      }
    )
    .subscribe()

  // Merchant KYC status changes
  const merchantSubscription = supabase
    .channel('merchant-changes')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'merchants',
        filter: 'kyc_status=neq.previous:kyc_status',
      },
      async (payload: TransactionChanges) => {
        const { new: newRecord, old: oldRecord } = payload
        console.log('Merchant KYC status changed:', {
          id: newRecord.merchant_id,
          oldStatus: oldRecord.kyc_status,
          newStatus: newRecord.kyc_status,
        })
        // Handle KYC status change
      }
    )
    .subscribe()

  // Return cleanup function
  return () => {
    supabase.removeChannel(transactionSubscription)
    supabase.removeChannel(transferSubscription)
    supabase.removeChannel(merchantSubscription)
  }
}

// Export individual subscription setup functions for granular control
export const subscribeToTransactions = (merchantId?: string) => {
  const filter = merchantId ? { filter: `merchant_id=eq.${merchantId}` } : {}
  
  return supabase
    .channel('transaction-updates')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'transactions',
        ...filter,
      },
      (payload: TransactionChanges) => {
        const { new: newRecord, eventType } = payload
        return { type: eventType, data: newRecord }
      }
    )
    .subscribe()
}

export const subscribeToTransfers = (merchantId?: string) => {
  const filter = merchantId ? { filter: `merchant_id=eq.${merchantId}` } : {}
  
  return supabase
    .channel('transfer-updates')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'transfers',
        ...filter,
      },
      (payload: TransactionChanges) => {
        const { new: newRecord, eventType } = payload
        return { type: eventType, data: newRecord }
      }
    )
    .subscribe()
}

export const subscribeToMerchantKYC = (merchantId: string) => {
  return supabase
    .channel('kyc-updates')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'merchants',
        filter: `merchant_id=eq.${merchantId}`,
      },
      (payload: TransactionChanges) => {
        const { new: newRecord, eventType } = payload
        return { type: eventType, data: newRecord }
      }
    )
    .subscribe()
}