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
    if (authSource === 'clover' && cloverEmployee?.role) {
      return cloverEmployee.role as CloverRole;
    }
    // Default to lowest permission role for non-Clover auth
    return CLOVER_ROLES.EMPLOYEE;
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