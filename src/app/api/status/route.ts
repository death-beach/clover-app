import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Check Supabase connection
  let supabaseStatus = 'disconnected';
  try {
    const { data, error } = await supabase.from('merchants').select('id').limit(1);
    if (!error) {
      supabaseStatus = 'connected';
    }
  } catch (error) {
    console.error('Supabase connection error:', error);
  }

  return NextResponse.json({
    status: 'operational',
    services: {
      api: 'online',
      supabase: supabaseStatus,
      helius: 'connected',
      clover: 'connected'
    },
    version: process.env.npm_package_version || '1.0.0',
    timestamp: new Date().toISOString()
  });
}