'use client'

import { usePrivy } from '@privy-io/react-auth'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { type UserRole } from '@/types/roles'

interface DashboardLayoutProps {
  userRole: UserRole
}

export function DashboardLayout({ userRole }: DashboardLayoutProps) {
  const { logout } = usePrivy()

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar userRole={userRole} />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onLogout={logout} userRole={userRole} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <div className="mx-auto max-w-7xl">
            {/* Dashboard content will be rendered here based on role */}
            <h1 className="text-2xl font-semibold text-gray-900">
              {'Dashboard'}
            </h1>
          </div>
        </main>
      </div>
    </div>
  )
}
