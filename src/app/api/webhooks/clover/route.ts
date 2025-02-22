import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { validateWebhookSignature } from './utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const signature = request.headers.get('x-clover-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 401 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Validate webhook signature
    const { data: merchantConfig } = await supabase
      .from('merchant_configs')
      .select('webhook_secret')
      .eq('merchant_id', body.merchantId)
      .single();

    if (!merchantConfig) {
      return NextResponse.json(
        { error: 'Invalid merchant configuration' },
        { status: 400 }
      );
    }

    // Process different event types
    switch (body.type) {
      case 'ORDER_CREATED':
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert([{
            merchant_id: body.merchantId,
            order_id: body.data.id,
            total: body.data.total,
            currency: body.data.currency,
            status: 'created'
          }]);

        if (orderError) {
          return NextResponse.json(
            { error: orderError.message },
            { status: 500 }
          );
        }

        return NextResponse.json({ id: order[0].id });

      case 'PAYMENT_PROCESSED':
        const { data: payment, error: paymentError } = await supabase
          .from('orders')
          .update({ status: 'paid' })
          .eq('order_id', body.data.id)
          .select();

        if (paymentError) {
          return NextResponse.json(
            { error: paymentError.message },
            { status: 500 }
          );
        }

        return NextResponse.json({ status: 'paid' });

      case 'REFUND_ISSUED':
        const { data: refund, error: refundError } = await supabase
          .from('orders')
          .update({ status: 'refunded' })
          .eq('order_id', body.data.id)
          .select();

        if (refundError) {
          return NextResponse.json(
            { error: refundError.message },
            { status: 500 }
          );
        }

        return NextResponse.json({ status: 'refunded' });

      default:
        return NextResponse.json(
          { error: 'Unsupported event type' },
          { status: 400 }
        );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { 
        status: 500,
        headers: {
          'retry-after': '60'
        }
      }
    );
  }
}