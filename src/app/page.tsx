'use client'

import { usePrivy } from '@privy-io/react-auth'
import { DashboardLayout } from '../app/(dashboard)/layout'
import { LoginPage } from '../app/(auth)/login/page'
import { useUserRole } from '../types/UserRoles'

export default function Home() {
  const { ready, authenticated } = usePrivy()
  const { role, loading } = useUserRole()

  if (!ready || loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        {'Loading...'}
      </div>
    )
  }

  if (!authenticated) {
    return <LoginPage />
  }

  return <DashboardLayout />
}