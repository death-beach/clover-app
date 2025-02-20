'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCloverSession } from '@/providers/CloverSessionProvider';
import { hasPermission } from '@/config/clover-roles';

const navigation = [
  { name: 'Overview', href: '/dashboard' },
  { name: 'Transactions', href: '/dashboard/transactions' },
  { name: 'Wallets', href: '/dashboard/wallets' },
];

const adminNavigation = [
  { name: 'Settings', href: '/dashboard/settings' },
];

export function DashboardNav() {
  const pathname = usePathname();
  const { employee, isLoading } = useCloverSession();

  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 h-16" />;
  }

  if (!employee) {
    return null;
  }

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">Clover USDC</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${
                    pathname === item.href
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  {item.name}
                </Link>
              ))}
              {hasPermission(employee.role, 'canManageSettings') && 
                adminNavigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`${
                      pathname === item.href
                        ? 'border-indigo-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    {item.name}
                  </Link>
                ))
              }
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">{employee.name}</span>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {employee.role}
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}