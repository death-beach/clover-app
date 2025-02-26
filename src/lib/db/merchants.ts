import type { Database } from '@/types/supabase';

import { supabase } from './supabase';

type Merchant = Database['public']['Tables']['merchants']['Row'];
type MerchantInsert = Database['public']['Tables']['merchants']['Insert'];
type MerchantUpdate = Database['public']['Tables']['merchants']['Update'];

export async function getMerchantById(id: string): Promise<Merchant | null> {
  const { data, error } = await supabase
    .from('merchants')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function getMerchantByCloverMerchantId(cloverMerchantId: string): Promise<Merchant | null> {
  const { data, error } = await supabase
    .from('merchants')
    .select('*')
    .eq('clover_merchant_id', cloverMerchantId)
    .single();

  if (error) throw error;
  return data;
}

export async function createMerchant(merchant: MerchantInsert): Promise<Merchant> {
  const { data, error } = await supabase
    .from('merchants')
    .insert(merchant)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateMerchant(id: string, updates: MerchantUpdate): Promise<Merchant> {
  const { data, error } = await supabase
    .from('merchants')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}