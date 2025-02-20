'use client';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-5">
        <h2 className="text-2xl font-semibold leading-7 text-gray-900">Settings</h2>
        <p className="mt-1 text-sm leading-6 text-gray-500">
          Manage your account and application settings.
        </p>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl p-6">
        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-5">
            <h3 className="text-lg font-medium leading-6 text-gray-900">General Settings</h3>
            <p className="mt-2 text-sm text-gray-500">
              Configure your merchant account and payment preferences.
            </p>
          </div>

          <div className="border-b border-gray-200 pb-5">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Wallet Settings</h3>
            <p className="mt-2 text-sm text-gray-500">
              Manage your connected wallet and payment addresses.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">Notification Preferences</h3>
            <p className="mt-2 text-sm text-gray-500">
              Configure how and when you receive notifications.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}