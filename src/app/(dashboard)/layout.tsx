'use client'

import { usePrivy } from '@privy-io/react-auth'
import { type PrivyInterface } from '../../../types/privy'
import { Sidebar } from '../../../components/Sidebar'
import { Header } from '../../../components/Header'
import { type UserRole, type UserSession } from '../../../types/roles'
import { Suspense, ReactNode } from 'react'
import { useUserRole } from '../../../types/UserRoles'

interface DashboardLayoutProps {
  children?: ReactNode;
}

function LoadingSpinner() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
    </div>
  )
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isLoading } = useUserRole()

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <div>Please log in to access the dashboard</div>
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Suspense fallback={<LoadingSpinner />}>
        <Sidebar userRole={user.role} />
      </Suspense>
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <Suspense fallback={<LoadingSpinner />}>
          <Header user={user} />
        </Suspense>
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <div className="mx-auto max-w-7xl">
            <Suspense fallback={<LoadingSpinner />}>
              {children}
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  )
}