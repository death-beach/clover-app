import { useAuth } from '@/hooks/useAuth';
import { CloverRole } from '@/config/clover-roles';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: CloverRole[];
}

const RoleGuard: React.FC<RoleGuardProps> = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <div>Access Denied</div>;
  }

  return <>{children}</>;
};

export default RoleGuard;