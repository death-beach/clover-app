import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { config } from '@/config';

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
    const body = await req.json();
    const { signature: txSignature, accountKeys, amount } = body;

    // 3. Update transaction status
    const [transaction] = await sql`
      UPDATE transactions
      SET 
        status = 'confirmed',
        solana_signature = ${txSignature}
      WHERE transaction_id = ${body.reference}
      RETURNING *
    `;

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    // 4. Get merchant details
    const [merchant] = await sql`
      SELECT * FROM merchants
      WHERE merchant_id = ${transaction.merchant_id}
    `;

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