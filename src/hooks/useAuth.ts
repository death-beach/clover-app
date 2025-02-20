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
  
  // Privy Auth
  const { 
    login: privyLogin, 
    logout: privyLogout, 
    authenticated: privyAuthenticated, 
    user: privyUser, 
    ready: privyReady 
  } = usePrivy();

  // Clover Auth
  const {
    isAuthenticated: cloverAuthenticated,
    isLoading: cloverLoading,
    employee: cloverEmployee,
    logout: cloverLogout,
    refreshSession: refreshCloverSession
  } = useCloverAuth();

  // Track auth source
  useEffect(() => {
    if (privyAuthenticated) {
      setAuthSource('privy');
    } else if (cloverAuthenticated) {
      setAuthSource('clover');
    } else {
      setAuthSource(null);
    }
  }, [privyAuthenticated, cloverAuthenticated]);

  const getUserRole = (): CloverRole => {
    // During initial setup with Privy auth
    if (authSource === 'privy') {
      // Privy users are always OWNER during setup phase
      // as they're the ones configuring the merchant account
      return CLOVER_ROLES.OWNER;
    }

    // After setup, using Clover auth
    if (authSource === 'clover' && cloverEmployee?.role) {
      // Use the role directly from Clover's employee system
      return cloverEmployee.role as CloverRole;
    }

    // Fallback safety - should rarely hit this
    // Could also throw an error or redirect to setup
    return CLOVER_ROLES.OWNER;
  };

  const hasRole = (requiredRole: CloverRole): boolean => {
    const userRole = getUserRole();
    const roleHierarchy = Object.values(CLOVER_ROLES);
    const userRoleIndex = roleHierarchy.indexOf(userRole);
    const requiredRoleIndex = roleHierarchy.indexOf(requiredRole);
    
    return userRoleIndex <= requiredRoleIndex; // Lower index = higher permission in Clover
  };

  const handleLogout = async () => {
    if (authSource === 'privy') {
      await privyLogout();
    } else if (authSource === 'clover') {
      await cloverLogout();
    }
    router.push('/');
  };

  const login = async (type: 'privy' | 'clover' = 'privy') => {
    if (type === 'privy') {
      await privyLogin();
    } else {
      router.push('/api/auth/clover/login');
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