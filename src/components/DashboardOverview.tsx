import { Card } from '@/components/ui/Card'

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Today&apos;s Sales</h3>
            <p className="mt-2 text-3xl font-semibold">$0.00</p>
          </div>
        </Card>
        
        <Card>
          <div className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Pending Transfers</h3>
            <p className="mt-2 text-3xl font-semibold">0</p>
          </div>
        </Card>
        
        <Card>
          <div className="p-6">
            <h3 className="text-sm font-medium text-gray-500">USDC Balance</h3>
            <p className="mt-2 text-3xl font-semibold">0.00</p>
          </div>
        </Card>
      </div>
    </div>
  )
}