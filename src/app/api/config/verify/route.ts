import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET() {
  const headersList = headers();
  const authHeader = headersList.get('authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const apiKey = authHeader.split(' ')[1];
  if (apiKey !== process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json(
      { error: 'Invalid API key' },
      { status: 401 }
    );
  }

  // Verify required environment variables
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'NEXT_PUBLIC_HELIUS_API_KEY',
    'CLOVER_API_KEY',
    'CLOVER_API_SECRET'
  ];

  const missingEnvVars = requiredEnvVars.filter(
    varName => !process.env[varName]
  );

  if (missingEnvVars.length > 0) {
    return NextResponse.json({
      status: 'error',
      missing: missingEnvVars
    }, { status: 500 });
  }

  return NextResponse.json({
    status: 'success',
    environment: process.env.NODE_ENV,
    config: {
      supabaseConfigured: true,
      heliusConfigured: true,
      cloverConfigured: true
    }
  });
}