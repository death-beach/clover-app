import { NextResponse } from 'next/server';
import { CloverOAuthService } from '@/lib/clover/oauth-service';
import { cookies } from 'next/headers';
import { randomBytes } from 'crypto';

export async function GET() {
  // Generate and store state parameter to prevent CSRF
  const state = randomBytes(32).toString('hex');
  const cookieStore = cookies();
  
  // Store state in cookie for validation
  cookieStore.set('clover_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 5, // 5 minutes
  });

  // Generate authorization URL
  const authUrl = CloverOAuthService.getAuthorizationUrl(state);

  // Redirect to Clover's authorization page
  return NextResponse.redirect(authUrl);
}