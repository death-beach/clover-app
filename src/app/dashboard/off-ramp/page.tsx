'use client';

export default function OffRampPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-5">
        <h2 className="text-2xl font-semibold leading-7 text-gray-900">Off-Ramp</h2>
        <p className="mt-1 text-sm leading-6 text-gray-500">
          Manage your USDC to fiat conversions and withdrawals.
        </p>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-gray-900">Off-Ramp Dashboard</h3>
          <p className="mt-2 text-sm text-gray-500">
            Here you'll be able to convert USDC to fiat and manage withdrawals.
          </p>
        </div>
      </div>
    </div>
  );
}