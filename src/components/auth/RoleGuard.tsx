import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const RoleGuard: React.FC<RoleGuardProps> = ({ children, allowedRoles }) => {
  const router = useRouter();
  const { role, isLoading } = useAuth(); // Changed from userRole to role

  useEffect(() => {
    if (!isLoading && role && !allowedRoles.includes(role)) {
      router.push('/unauthorized');
    }
  }, [isLoading, role, allowedRoles, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default RoleGuard;