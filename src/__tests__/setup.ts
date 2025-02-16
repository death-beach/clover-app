import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock environment variables
process.env.NEXT_PUBLIC_PRIVY_APP_ID = 'test-privy-app-id'

// Cleanup after each test
afterEach(() => {
  cleanup()
  jest.clearAllMocks()
})