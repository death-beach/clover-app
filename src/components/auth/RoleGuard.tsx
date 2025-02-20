import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { CloverRole } from '@/config/clover-roles';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: CloverRole[];
}

const RoleGuard: React.FC<RoleGuardProps> = ({ children, allowedRoles }) => {
  const router = useRouter();
  const { userRole, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && userRole && !allowedRoles.includes(userRole)) {
      router.push('/dashboard');
    }
  }, [userRole, isLoading, router, allowedRoles]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return userRole && allowedRoles.includes(userRole) ? <>{children}</> : null;
};

export default RoleGuard;