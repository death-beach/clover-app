import { TransactionStatus } from './transactions';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Utility types for common database operations
export type DbTransaction = Database['public']['Tables']['transactions']['Row'];
export type DbMerchant = Database['public']['Tables']['merchants']['Row'];

export type InsertTransaction = Database['public']['Tables']['transactions']['Insert'];
export type UpdateTransaction = Database['public']['Tables']['transactions']['Update'];
export type InsertMerchant = Database['public']['Tables']['merchants']['Insert'];
export type UpdateMerchant = Database['public']['Tables']['merchants']['Update'];

// Type guards for runtime type checking
export const isValidTransactionStatus = (status: string): status is TransactionStatus => {
  return ['pending', 'completed', 'failed'].includes(status);
};

export const isValidMerchant = (merchant: unknown): merchant is DbMerchant => {
  if (typeof merchant !== 'object' || merchant === null) return false;
  const m = merchant as Partial<DbMerchant>;
  return (
    typeof m.id === 'string' &&
    typeof m.clover_merchant_id === 'string' &&
    typeof m.business_name === 'string' &&
    typeof m.wallet_address === 'string' &&
    typeof m.created_at === 'string'
  );
};

export interface Database {
  public: {
    Tables: {
      merchants: {
        Row: {
          id: string
          clover_merchant_id: string
          business_name: string
          wallet_address: string
          created_at: string
        }
        Insert: {
          id?: string
          clover_merchant_id: string
          business_name: string
          wallet_address: string
          created_at?: string
        }
        Update: {
          id?: string
          clover_merchant_id?: string
          business_name?: string
          wallet_address?: string
          created_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          merchant_id: string
          amount: number
          status: string
          solana_signature: string | null
          clover_order_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          merchant_id: string
          amount: number
          status: string
          solana_signature?: string | null
          clover_order_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          merchant_id?: string
          amount?: number
          status?: string
          solana_signature?: string | null
          clover_order_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}