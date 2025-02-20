import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';
import { CloverOAuthService } from '@/lib/clover/oauth-service';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  
  const cookieStore = cookies();
  const storedState = cookieStore.get('clover_oauth_state')?.value;

  // Clear the state cookie
  cookieStore.delete('clover_oauth_state');

  // Handle errors
  if (error) {
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/auth/error?error=${error}`
    );
  }

  // Validate state parameter
  if (!state || !storedState || state !== storedState) {
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/auth/error?error=invalid_state`
    );
  }

  try {
    // Exchange code for tokens
    const tokens = await CloverOAuthService.exchangeCodeForTokens(code as string);
    
    // Set secure cookies with tokens and merchant info
    const response = NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard`);
    
    // Set access token cookie
    response.cookies.set('clover_access_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokens.expires_in,
    });

    // Set refresh token cookie
    response.cookies.set('clover_refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    // Set merchant ID cookie
    response.cookies.set('clover_merchant_id', tokens.merchant_id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    // If employee_id is present, set it too
    if (tokens.employee_id) {
      response.cookies.set('clover_employee_id', tokens.employee_id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60, // 30 days
      });
    }

    return response;
  } catch (error) {
    console.error('Error exchanging code for tokens:', error);
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/auth/error?error=token_exchange_failed`
    );
  }
}