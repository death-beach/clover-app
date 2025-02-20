"use client";

import { DashboardOverview } from '@/components/DashboardOverview'
import { TransactionList } from '@/components/TransactionList'
import { ProtectedRoute } from '@/components/auth'

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="space-y-8">
        <DashboardOverview />
        <TransactionList />
      </div>
    </ProtectedRoute>
  )
}