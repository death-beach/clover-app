import { TestAuth } from '@/TestAuth'

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Authentication Test Page</h1>
        <TestAuth />
      </div>
    </div>
  )
}