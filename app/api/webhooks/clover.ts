import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Log the incoming webhook
    console.log('Received Clover webhook')

    // Return 200 OK for webhook verification
    return NextResponse.json({ message: 'Webhook received' }, { status: 200 })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// Handle GET requests for webhook verification
export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Webhook endpoint active' }, { status: 200 })
}