import { randomBytes } from 'crypto';

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { CloverOAuthService } from '@/lib/clover/oauth-service';

export async function GET() {
  const state = randomBytes(32).toString('hex');
  const cookieStore = await cookies(); // Await cookies() too

  await cookieStore.set('clover_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 5,
  });

  const authUrl = CloverOAuthService.getAuthorizationUrl(state);
  console.log('Redirecting to:', authUrl); // Debug

  return NextResponse.redirect(authUrl);
}