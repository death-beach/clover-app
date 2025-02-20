"use client";

import { useAuth } from '@/hooks/useAuth';

export function LoginButton() {
  const { login, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <button className="btn btn-primary" disabled>Loading...</button>;
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <button 
      onClick={() => login()} 
      className="btn btn-primary"
    >
      Login
    </button>
  );
}