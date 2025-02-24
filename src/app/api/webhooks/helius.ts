import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { config } from '@/config';
import { WebhookPayload, TokenTransfer } from '@/lib/helius/types'; // Correct path

export async function POST(req: NextRequest) {
  try {
    // 1. Verify webhook signature
    const signature = req.headers.get('x-signature');
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 401 }
      );
    }

    // TODO: Implement signature verification

    // 2. Parse webhook payload
    const body = await req.json() as WebhookPayload[];
    if (!body || !Array.isArray(body) || body.length === 0) {
      return NextResponse.json(
        { error: 'Invalid webhook payload' },
        { status: 400 }
      );
    }

    const event = body[0];
    const txSignature = event.signature;
    const accountKeys = event.accountData?.map(data => data.account) || [];
    const transfers = event.tokenTransfers as TokenTransfer[];
    const amount = transfers?.[0]?.amount / 1_000_000 || 0;

    // 3. Update transaction status
    const { rows } = await sql`
      UPDATE transactions
      SET 
        status = 'confirmed',
        solana_signature = ${txSignature}
      WHERE transaction_id = ${event.reference || transfers?.[0]?.reference}
      RETURNING *
    `;
    const transaction = rows[0];

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    // 4. Get merchant details
    const { rows: merchantRows } = await sql`
      SELECT * FROM merchants
      WHERE merchant_id = ${transaction.merchant_id}
    `;
    const merchant = merchantRows[0];

    // 5. Trigger off-ramp if auto-enabled
    // TODO: Implement Helio off-ramp integration

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}