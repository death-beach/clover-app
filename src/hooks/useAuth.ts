'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { PRIVY_CONFIG } from '@/config/privy';
import { useCloverAuth } from './useCloverAuth';
import { useState, useEffect } from 'react';
import { CLOVER_ROLES, type CloverRole } from '@/config/clover-roles';

export type AuthSource = 'privy' | 'clover' | null;

export function useAuth() {
  const router = useRouter();
  const [authSource, setAuthSource] = useState<AuthSource>(null);
  
  const { 
    login: privyLogin, 
    logout: privyLogout, 
    authenticated: privyAuthenticated, 
    user: privyUser, 
    ready: privyReady 
  } = usePrivy();

  const {
    isAuthenticated: cloverAuthenticated,
    isLoading: cloverLoading,
    employee: cloverEmployee,
    logout: cloverLogout,
    refreshSession: refreshCloverSession
  } = useCloverAuth();

  useEffect(() => {
    if (!privyReady) return;

    console.log('Privy Authenticated:', privyAuthenticated);
    console.log('Privy User:', privyUser);
    console.log('Wallet Address:', privyUser?.wallet?.address);

    if (privyAuthenticated && privyUser?.wallet?.address) {
      fetch('/api/set-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: privyUser.wallet.address }),
      })
        .then(() =>
          fetch('/api/auth/clover/session', { 
            credentials: 'include',
            headers: { 'Cookie': document.cookie } // Sync cookies
          })
            .then(res => res.json())
            .then(data => {
              console.log('Session Data:', data);
              setAuthSource('privy');
              router.push('/dashboard');
            })
        );
    } else if (cloverAuthenticated) {
      setAuthSource('clover');
    } else {
      fetch('/api/auth/clover/session', { credentials: 'include' })
        .then(res => res.json())
        .then(data => {
          if (data.type === 'clover') setAuthSource('clover');
        });
    }
  }, [privyAuthenticated, cloverAuthenticated, privyUser?.wallet?.address, privyReady, router]);

  const getUserRole = (): CloverRole => {
    if (authSource === 'privy') {
      return CLOVER_ROLES.OWNER;
    }
    if (authSource === 'clover' && cloverEmployee?.role) {
      return cloverEmployee.role as CloverRole;
    }
    return CLOVER_ROLES.OWNER;
  };

  const hasRole = (requiredRole: CloverRole): boolean => {
    const userRole = getUserRole();
    const roleHierarchy = Object.values(CLOVER_ROLES);
    const userRoleIndex = roleHierarchy.indexOf(userRole);
    const requiredRoleIndex = roleHierarchy.indexOf(requiredRole);
    return userRoleIndex <= requiredRoleIndex;
  };

  const handleLogout = async () => {
    if (authSource === 'privy') {
      await privyLogout();
      document.cookie = 'privy:address=; path=/; max-age=0';
    } else if (authSource === 'clover') {
      await cloverLogout();
    }
    setAuthSource(null);
    router.push('/');
  };

  const login = async (type: 'privy' | 'clover' = 'privy') => {
    if (type === 'privy') {
      await privyLogin();
    } else {
      router.push('/api/auth/clover/authorize');
    }
  };

  return {
    login,
    logout: handleLogout,
    isAuthenticated: privyAuthenticated || cloverAuthenticated,
    isLoading: !privyReady || cloverLoading,
    user: authSource === 'privy' ? privyUser : cloverEmployee,
    role: getUserRole(),
    hasRole,
    authSource,
    refreshSession: authSource === 'clover' ? refreshCloverSession : undefined,
  };
}