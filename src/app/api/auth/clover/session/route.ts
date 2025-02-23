import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { cookies } from 'next/headers';
import { getCloverAPIClient } from '@/lib/clover/api-client';

export async function GET() {
  try {
    const cloverSession = await getServerSession(authOptions);
    console.log('Clover Session:', cloverSession);

    const cookieStore = await cookies();
    const privyAddress = cookieStore.get('privy:address')?.value;
    console.log('Wallet Address:', privyAddress);
    console.log('All Cookies:', cookieStore.getAll());

    if (cloverSession) {
      const cloverClient = getCloverAPIClient();
      const isValid = await cloverClient.validateSession();
      console.log('Clover Session Valid:', isValid);
      if (isValid) {
        return NextResponse.json({ 
          type: 'clover',
          session: cloverSession 
        });
      }
    }

    if (privyAddress) {
      return NextResponse.json({
        type: 'wallet',
        session: { address: privyAddress }
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