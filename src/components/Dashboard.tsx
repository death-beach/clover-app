"use client";

export function Dashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-lg border p-4">
        <h2 className="font-semibold">Today's Sales</h2>
        <p className="text-2xl font-bold">$0.00</p>
      </div>
      <div className="rounded-lg border p-4">
        <h2 className="font-semibold">Pending Transfers</h2>
        <p className="text-2xl font-bold">0</p>
      </div>
      <div className="rounded-lg border p-4">
        <h2 className="font-semibold">USDC Balance</h2>
        <p className="text-2xl font-bold">0 USDC</p>
      </div>
      <div className="rounded-lg border p-4">
        <h2 className="font-semibold">Recent Transactions</h2>
        <p className="text-2xl font-bold">0</p>
      </div>
    </div>
  )
}