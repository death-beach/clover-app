'use client'

import { useUser } from './provider'
import { usePrivy } from '@privy-io/react-auth'

export function TestAuth() {
  const { user, isLoading, error, logout, refreshUser } = useUser()
  const { login } = usePrivy()

  if (isLoading) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-bold mb-2">Authentication Test</h2>
        <p>Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 rounded-lg">
        <h2 className="text-lg font-bold mb-2">Authentication Error</h2>
        <p className="text-red-600">{error.message}</p>
      </div>
    )
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-lg font-bold mb-4">Authentication Test Panel</h2>
      
      <div className="space-y-4">
        {/* User Status */}
        <div className="p-4 bg-gray-50 rounded">
          <h3 className="font-semibold mb-2">User Status</h3>
          <p>
            Status: <span className="font-mono">{user ? 'Authenticated' : 'Not Authenticated'}</span>
          </p>
        </div>

        {/* User Details */}
        {user && (
          <div className="p-4 bg-blue-50 rounded">
            <h3 className="font-semibold mb-2">User Details</h3>
            <pre className="bg-white p-2 rounded overflow-auto">
              {JSON.stringify(
                {
                  id: user.id,
                  email: user.email,
                  name: user.name,
                  role: user.role,
                  lastLogin: user.lastLogin.toISOString(),
                },
                null,
                2
              )}
            </pre>
          </div>
        )}

        {/* Actions */}
        <div className="p-4 bg-gray-50 rounded">
          <h3 className="font-semibold mb-2">Actions</h3>
          <div className="space-x-4">
            {!user && (
              <button
                onClick={() => login()}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Login
              </button>
            )}
            {user && (
              <>
                <button
                  onClick={() => refreshUser()}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Refresh User
                </button>
                <button
                  onClick={() => logout()}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>

        {/* Debug Info */}
        <div className="p-4 bg-gray-50 rounded">
          <h3 className="font-semibold mb-2">Debug Information</h3>
          <p className="text-sm text-gray-600">
            Component rendered at: {new Date().toISOString()}
          </p>
        </div>
      </div>
    </div>
  )
}