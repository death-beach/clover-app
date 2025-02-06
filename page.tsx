'use client'

import { usePrivy } from '@privy-io/react-auth'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { LoginScreen } from '@/components/auth/LoginScreen'
import { useUserRole } from '@/hooks/useUserRole'

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
    return <LoginScreen />
  }

  return <DashboardLayout userRole={role} />
}
