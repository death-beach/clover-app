"use client";

// builtin
import { useEffect } from 'react';

// external
import { useLogin, usePrivy } from '@privy-io/react-auth';

// internal
import { useAuth } from '@/hooks/useAuth';

export default function HomePage() {
  const { user } = usePrivy();
  const { login } = useLogin({
    onComplete: () => {},
    onError: (error) => console.error('Login error:', error),
  });
  const { logout } = useAuth();

  useEffect(() => {
    async function checkSession() {
      const res = await fetch('/api/auth/clover/session');
      console.log('Session Data:', await res.json());
    }
    checkSession();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-4">
      {user ? (
        <button
          className="rounded-full bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          onClick={logout}
        >
          Log Out
        </button>
      ) : (
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to Clover App</h1>
          <button
            className="rounded-full bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            onClick={login}
          >
            Login
          </button>
        </div>
      )}
    </main>
  );
}