import { supabase } from '@/lib/db/supabase';
import { createPaymentLink } from '@/lib/solana-pay/createPaymentLink';

// Create a payment intent (now a Solana Pay link)
export async function createPaymentIntent({
  amount,
  recipient,
  merchantId,
}: {
  amount: number;
  recipient: string;
  merchantId: string;
}) {
  try {
    const { url, reference } = await createPaymentLink({
      amount,
      recipient,
      memo: `Payment for merchant ${merchantId}`,
    });

    // Store in Supabase
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        merchant_id: merchantId,
        amount: amount,
        status: 'pending',
        solana_reference: reference,
      })
      .select()
      .single();

    if (error) throw error;

    return { paymentIntentId: data.id, url };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}

// Fetch a payment intent status
export async function getPaymentIntent(paymentIntentId: string) {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', paymentIntentId)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error fetching payment intent:', error);
    throw error;
  }
}

// Stub for off-ramp (remove or implement later)
export async function createOffRamp({ amount, merchantId }: { amount: number; merchantId: string }) {
  try {
    // Placeholder - no Helio, implement with Solana Pay or another service later
    console.log('Off-ramp not implemented yet', { amount, merchantId });
    return { status: 'pending' };
  } catch (error) {
    console.error('Error creating off-ramp:', error);
    throw error;
  }
}