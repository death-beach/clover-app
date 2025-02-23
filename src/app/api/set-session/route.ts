import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { PublicKey } from '@solana/web3.js';

// Validation function for Solana addresses
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
  
  // Allow null for logout
  if (walletAddress !== null && !isValidSolanaAddress(walletAddress)) {
    return NextResponse.json(
      { success: false, error: 'Invalid Solana address' }, 
      { status: 400 }
    );
  }

  const cookieStore = cookies();
  await cookieStore.set('privy:address', walletAddress || '', {
    path: '/',
    maxAge: walletAddress ? 3600 : 0, // If logging out, expire immediately
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
  
  return NextResponse.json({ success: true });
}