import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { PublicKey } from '@solana/web3.js';

function isValidSolanaAddress(address: string): boolean {
  try {
    if (!address) return false;
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const { walletAddress } = await request.json();
  
  if (walletAddress !== null && !isValidSolanaAddress(walletAddress)) {
    return NextResponse.json(
      { success: false, error: 'Invalid Solana address' },
      { status: 400 }
    );
  }

  const cookieStore = await cookies();
  await cookieStore.set('privy:address', walletAddress || '', {
    path: '/',
    maxAge: walletAddress ? 3600 : 0,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
  
  return NextResponse.json({ success: true });
}