'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { PRIVY_CONFIG } from '@/config/privy';
import { useCloverAuth } from './useCloverAuth';
import { useState, useEffect } from 'react';

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

  const getUserRole = () => {
    if (authSource === 'privy') {
      if (!privyUser?.metadata?.role) {
        return PRIVY_CONFIG.defaultRole;
      }
      return privyUser.metadata.role;
    }
    if (authSource === 'clover' && cloverEmployee) {
      return cloverEmployee.role || 'merchant';
    }
    return PRIVY_CONFIG.defaultRole;
  };

  const hasRole = (requiredRole: string) => {
    const userRole = getUserRole();
    const roleIndex = PRIVY_CONFIG.allowedRoles.indexOf(userRole);
    const requiredRoleIndex = PRIVY_CONFIG.allowedRoles.indexOf(requiredRole);
    
    return roleIndex >= requiredRoleIndex;
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