import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request) {
  const { walletAddress } = await request.json();
  cookies().set('privy:address', walletAddress, {
    path: '/',
    maxAge: 3600,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
  return NextResponse.json({ success: true });
}