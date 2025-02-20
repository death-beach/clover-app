'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { PRIVY_CONFIG } from '@/config/privy';

export function useAuth() {
  const { 
    login, 
    logout, 
    authenticated, 
    user, 
    ready 
  } = usePrivy();
  const router = useRouter();

  const getUserRole = () => {
    if (!user?.metadata?.role) {
      return PRIVY_CONFIG.defaultRole;
    }
    return user.metadata.role;
  };

  const hasRole = (requiredRole: string) => {
    const userRole = getUserRole();
    const roleIndex = PRIVY_CONFIG.allowedRoles.indexOf(userRole);
    const requiredRoleIndex = PRIVY_CONFIG.allowedRoles.indexOf(requiredRole);
    
    return roleIndex >= requiredRoleIndex;
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return {
    login,
    logout: handleLogout,
    isAuthenticated: authenticated,
    isLoading: !ready,
    user,
    role: getUserRole(),
    hasRole,
  };
}