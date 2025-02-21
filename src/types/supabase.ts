export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

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