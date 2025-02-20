"use client";

import { LoginButton, LogoutButton } from '@/components/auth'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">USDC Payment Gateway</h1>
          <p className="mt-2 text-gray-600">Secure payments for Clover merchants</p>
        </div>
        
        <div className="mt-8 space-y-4">
          <LoginButton />
          <LogoutButton />
          
          <div className="mt-4 text-center">
            <Link 
              href="/dashboard" 
              className="text-indigo-600 hover:text-indigo-500"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}