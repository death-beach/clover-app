import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { config } from '@/config';
import { WebhookPayload, TokenTransfer } from '@/lib/helius/types';

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get('x-signature');
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 401 }
      );
    }

    const body = await req.json() as WebhookPayload[];
    if (!body || !Array.isArray(body) || body.length === 0) {
      return NextResponse.json(
        { error: 'Invalid webhook payload' },
        { status: 400 }
      );
    }

    const event = body[0];
    const txSignature = event.signature;
    const transfers = event.enriched.tokenTransfers as TokenTransfer[];
    const amount = transfers?.[0]?.amount / 1_000_000 || 0;

    const { rows } = await sql`
      UPDATE transactions
      SET 
        status = 'confirmed',
        solana_signature = ${txSignature}
      WHERE solana_signature = ${txSignature}  -- Use signature as identifier
      RETURNING *
    `;
    const transaction = rows[0];

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    const { rows: merchantRows } = await sql`
      SELECT * FROM merchants
      WHERE merchant_id = ${transaction.merchant_id}
    `;
    const merchant = merchantRows[0];

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}