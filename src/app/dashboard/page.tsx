"use client";

import { Dashboard } from '@/components/Dashboard'
import { TransactionList } from '@/components/TransactionList'

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <Dashboard />
      <TransactionList />
    </div>
  )
}