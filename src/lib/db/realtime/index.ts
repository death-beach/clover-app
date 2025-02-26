import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

import { supabase } from '../supabase';

// Define specific types for each table
interface Transaction {
  transaction_id: string;
  status: string;
  merchant_id: string;
  [key: string]: unknown;
}

interface Transfer {
  transfer_id: string;
  status: string;
  merchant_id: string;
  [key: string]: unknown;
}

interface Merchant {
  merchant_id: string;
  kyc_status: string;
  [key: string]: unknown;
}

// Use stricter typing to exclude {}
type TransactionChanges = RealtimePostgresChangesPayload<Transaction> & { new: Transaction; old?: Transaction };
type TransferChanges = RealtimePostgresChangesPayload<Transfer> & { new: Transfer; old?: Transfer };
type MerchantChanges = RealtimePostgresChangesPayload<Merchant> & { new: Merchant; old?: Merchant };

export const setupRealtimeSubscriptions = () => {
  const transactionSubscription = supabase
    .channel('transaction-changes')
    .on<Transaction>(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'transactions',
      },
      (payload: TransactionChanges) => { // Removed async since it's not needed here
        const { new: newRecord, old: oldRecord, eventType } = payload;
        switch (eventType) {
          case 'INSERT':
            console.log('New transaction:', newRecord);
            break;
          case 'UPDATE':
            if (newRecord.status !== oldRecord?.status) {
              console.log('Transaction status changed:', {
                id: newRecord.transaction_id,
                oldStatus: oldRecord?.status,
                newStatus: newRecord.status,
              });
            }
            break;
        }
      }
    )
    .subscribe();

  const transferSubscription = supabase
    .channel('transfer-changes')
    .on<Transfer>(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'transfers',
      },
      (payload: TransferChanges) => {
        const { new: newRecord, old: oldRecord, eventType } = payload;
        switch (eventType) {
          case 'INSERT':
            console.log('New transfer initiated:', newRecord);
            break;
          case 'UPDATE':
            if (newRecord.status !== oldRecord?.status) {
              console.log('Transfer status changed:', {
                id: newRecord.transfer_id,
                oldStatus: oldRecord?.status,
                newStatus: newRecord.status,
              });
            }
            break;
        }
      }
    )
    .subscribe();

  const merchantSubscription = supabase
    .channel('merchant-changes')
    .on<Merchant>(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'merchants',
        filter: 'kyc_status=neq.previous:kyc_status', // Verify this filter syntax with Supabase docs
      },
      (payload: MerchantChanges) => {
        const { new: newRecord, old: oldRecord } = payload;
        console.log('Merchant KYC status changed:', {
          id: newRecord.merchant_id,
          oldStatus: oldRecord.kyc_status,
          newStatus: newRecord.kyc_status,
        });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(transactionSubscription);
    supabase.removeChannel(transferSubscription);
    supabase.removeChannel(merchantSubscription);
  };
};

export const subscribeToTransactions = (merchantId?: string) => {
  const filter = merchantId ? { filter: `merchant_id=eq.${merchantId}` } : {};
  return supabase
    .channel('transaction-updates')
    .on<Transaction>(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'transactions',
        ...filter,
      },
      (payload: TransactionChanges) => {
        const { new: newRecord, eventType } = payload;
        return { type: eventType, data: newRecord };
      }
    )
    .subscribe();
};

export const subscribeToTransfers = (merchantId?: string) => {
  const filter = merchantId ? { filter: `merchant_id=eq.${merchantId}` } : {};
  return supabase
    .channel('transfer-updates')
    .on<Transfer>(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'transfers',
        ...filter,
      },
      (payload: TransferChanges) => {
        const { new: newRecord, eventType } = payload;
        return { type: eventType, data: newRecord };
      }
    )
    .subscribe();
};

export const subscribeToMerchantKYC = (merchantId: string) => {
  return supabase
    .channel('kyc-updates')
    .on<Merchant>(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'merchants',
        filter: `merchant_id=eq.${merchantId}`,
      },
      (payload: MerchantChanges) => {
        const { new: newRecord, eventType } = payload;
        return { type: eventType, data: newRecord };
      }
    )
    .subscribe();
};