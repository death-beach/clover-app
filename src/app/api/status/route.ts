import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'operational',
    services: {
      api: 'online',
      helio: 'connected',
      helius: 'connected',
      clover: 'connected'
    },
    version: process.env.npm_package_version || '1.0.0',
    timestamp: new Date().toISOString()
  });
}