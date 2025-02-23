import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const cloverToken = cookieStore.get('clover_access_token')?.value;
    const privyAddress = cookieStore.get('privy:address')?.value;
    const cookieHeader = request.headers.get('cookie');

    console.log('Clover Token:', cloverToken);
    console.log('Privy Address:', privyAddress);
    console.log('Cookie Header:', cookieHeader);

    const supabase = createClient(
      process.env.SUPABASE_URL || '',
      process.env.SUPABASE_ANON_KEY || ''
    );

    if (privyAddress && !cloverToken) { // First login onboarding
      const { data: merchant } = await supabase
        .from('merchants')
        .select('clover_merchant_id')
        .eq('wallet_address', privyAddress)
        .single();

      return NextResponse.json({
        type: 'wallet',
        session: { 
          address: privyAddress,
          merchantId: merchant?.clover_merchant_id || 'pending'
        }
      });
    }

    if (cloverToken) { // Post-onboarding Clover login
      const { data: merchant } = await supabase
        .from('merchants')
        .select('wallet_address')
        .eq('clover_merchant_id', 'ACCC25YXXABZ1')
        .single();

      return NextResponse.json({
        type: 'clover',
        session: { 
          accessToken: cloverToken, 
          merchantId: 'ACCC25YXXABZ1',
          walletAddress: merchant?.wallet_address
        }
      });
    }

    return NextResponse.json(
      { error: 'No active session' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json(
      { error: 'Failed to check session' },
      { status: 500 }
    );
  }
}