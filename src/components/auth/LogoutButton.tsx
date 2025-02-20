"use client";

import { useAuth } from '@/hooks/useAuth';

export function LogoutButton() {
  const { logout, isAuthenticated, isLoading } = useAuth();

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <button 
      onClick={logout} 
      className="btn btn-secondary"
    >
      Logout
    </button>
  );
}