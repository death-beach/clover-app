"use client";

import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold text-red-600 mb-4">404 - Dashboard Not Found</h1>
      <p className="text-gray-700 mb-6">The dashboard page could not be found.</p>
      <Link 
        href="/" 
        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
      >
        Return to Home
      </Link>
    </div>
  )
}