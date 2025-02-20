"use client";

import { LoginForm } from '@/components/auth'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'

export default function HomePage() {
  const { isAuthenticated, isLoading, authSource } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">USDC Payment Gateway</h1>
          <p className="mt-2 text-gray-600">Secure payments for Clover merchants</p>
          {authSource && (
            <p className="mt-1 text-sm text-gray-500">
              Connected via {authSource.charAt(0).toUpperCase() + authSource.slice(1)}
            </p>
          )}
        </div>
        
        <div className="mt-8 space-y-4">
          {isLoading ? (
            <div className="text-center">
              <p>Loading...</p>
            </div>
          ) : (
            <>
              <LoginForm />
              
              {isAuthenticated && (
                <div className="mt-4 text-center">
                  <Link 
                    href="/dashboard" 
                    className="text-indigo-600 hover:text-indigo-500"
                  >
                    Go to Dashboard
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}