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

    // Clear stale Clover cookies on Privy login
    if (privyAddress && cloverToken) {
      cookieStore.delete('clover_access_token');
      cookieStore.delete('clover_merchant_id');
      cookieStore.delete('clover_refresh_token');
    }

    if (privyAddress) { // First login onboarding
      const supabase = createClient(
        process.env.SUPABASE_URL || '',
        process.env.SUPABASE_ANON_KEY || ''
      );
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