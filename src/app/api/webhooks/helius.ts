import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';

import { USDC_MINT } from '@/config/tokens';
import type { WebhookPayload, TokenTransfer } from '@/lib/helius/types';

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const body = req.body as WebhookPayload[];
    if (!body || !Array.isArray(body) || body.length === 0) {
      return res.status(400).json({ error: 'Invalid webhook payload' });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const event = body[0];
    const transfers = event.enriched.tokenTransfers as TokenTransfer[]; // Fixed: Use enriched.tokenTransfers
    if (transfers && transfers.length > 0) {
      for (const transfer of transfers) {
        if (transfer.mint === USDC_MINT) {
          const { error } = await supabase
            .from('transactions')
            .insert({
              merchant_id: 'unknown', // Placeholder since accountData isn’t used
              amount_usdc: transfer.amount / 1_000_000,
              status: 'completed',
              solana_signature: event.signature,
              created_at: new Date(event.timestamp * 1000).toISOString(),
            });

          if (error) {
            console.error('Supabase insert error:', error);
            return res.status(500).json({ error: 'Failed to log transaction' });
          }
        }
      }
    }

    return res.status(200).json({ message: 'Webhook processed' });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}