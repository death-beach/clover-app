import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { config } from '@/config';

const createPaymentSchema = z.object({
  merchantId: z.string().uuid(),
  cloverOrderId: z.string(),
  amountUsd: z.number().positive(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { merchantId, cloverOrderId, amountUsd } = createPaymentSchema.parse(body);

    // 1. Get merchant details
    const { rows } = await sql`
      SELECT * FROM merchants 
      WHERE merchant_id = ${merchantId}
    `;
    const merchant = rows[0]; // Fix: Use rows array instead of destructuring

    if (!merchant) {
      return NextResponse.json(
        { error: 'Merchant not found' },
        { status: 404 }
      );
    }

    // 2. Create transaction record
    const { rows: transactionRows } = await sql`
      INSERT INTO transactions (
        merchant_id,
        clover_order_id,
        amount_usdc,
        amount_usd,
        status
      ) VALUES (
        ${merchantId},
        ${cloverOrderId},
        ${amountUsd}, -- Assuming 1:1 USDC:USD for now
        ${amountUsd},
        'pending'
      )
      RETURNING *
    `;
    const transaction = transactionRows[0]; // Same fix for transaction

    // 3. Generate Solana Pay URL
    const solanaPayUrl = new URL('solana:', merchant.main_wallet_address);
    solanaPayUrl.searchParams.set('amount', amountUsd.toString());
    solanaPayUrl.searchParams.set('reference', transaction.transaction_id);
    solanaPayUrl.searchParams.set('label', `Payment to ${merchant.business_name}`);
    solanaPayUrl.searchParams.set('message', `Order #${cloverOrderId}`);
    solanaPayUrl.searchParams.set('memo', transaction.transaction_id);

    return NextResponse.json({
      transactionId: transaction.transaction_id,
      paymentUrl: solanaPayUrl.toString(),
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}