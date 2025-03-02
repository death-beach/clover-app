import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = await cookies();
  cookieStore.delete('clover_access_token');
  cookieStore.delete('clover_refresh_token');
  cookieStore.delete('clover_merchant_id');
  return NextResponse.redirect('/');
}