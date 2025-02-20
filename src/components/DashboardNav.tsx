import { useAuth } from '@/hooks/useAuth';
import { CloverRole } from '@/config/clover-roles';
import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';

const DashboardNav = () => {
  const { logout } = usePrivy();
  const { userRole, merchantName } = useAuth();

  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      roles: [CloverRole.OWNER, CloverRole.ADMIN, CloverRole.MANAGER, CloverRole.EMPLOYEE],
    },
    {
      name: 'Transactions',
      href: '/dashboard/transactions',
      roles: [CloverRole.OWNER, CloverRole.ADMIN, CloverRole.MANAGER],
    },
    {
      name: 'Off-Ramp',
      href: '/dashboard/off-ramp',
      roles: [CloverRole.OWNER, CloverRole.ADMIN],
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      roles: [CloverRole.OWNER, CloverRole.ADMIN],
    },
  ];

  const filteredNavItems = navItems.filter(
    (item) => userRole && item.roles.includes(userRole)
  );

  return (
    <nav className="flex h-16 items-center justify-between bg-white px-4 shadow-sm">
      <div className="flex items-center space-x-4">
        <span className="text-lg font-semibold">{merchantName}</span>
        <div className="flex space-x-4">
          {filteredNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-gray-600 hover:text-gray-900"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
      <button
        onClick={logout}
        className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
      >
        Sign Out
      </button>
    </nav>
  );
};

export default DashboardNav;