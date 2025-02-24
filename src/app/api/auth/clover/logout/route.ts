import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  cookieStore.delete('clover_access_token');
  cookieStore.delete('clover_refresh_token');
  cookieStore.delete('clover_merchant_id');
  return NextResponse.redirect('/');
}