import { createClient } from '@supabase/supabase-js';

import { NextResponse } from 'next/server';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

const version = process.env.npm_package_version || '1.0.0';

export async function GET() {
  const timestamp = new Date().toISOString();
  
  try {
    const { data, error } = await supabase
      .from('merchants')
      .select('id')
      .limit(1);

    if (error) {
      return NextResponse.json(
        {
          status: 'unhealthy',
          timestamp,
          version,
          services: {
            api: 'online',
            supabase: 'disconnected',
            helius: 'connected',
            clover: 'connected'
          },
          error: error.message
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      status: 'operational',
      timestamp,
      version,
      services: {
        api: 'online',
        supabase: 'online',
        helius: 'connected',
        clover: 'connected'
      }
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp,
        version,
        services: {
          api: 'online',
          supabase: 'error',
          helius: 'connected',
          clover: 'connected'
        },
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 503 }
    );
  }
}