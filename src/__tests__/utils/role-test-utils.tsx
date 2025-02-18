import { render as rtlRender } from '@testing-library/react'
import type { UserRole } from '@/types/roles'
import { rolePermissions } from '@/types/roles'
import { AuthProvider } from '@/providers/provider'
import { ErrorBoundary } from '@/components/error/ErrorBoundary'
import { ErrorFallback } from './test-utils'

// Mock user data interface
interface MockUser {
  role: UserRole
  isAuthenticated: boolean
  email?: string
  walletAddress?: string
}

// Default mock user with VIEWER role
const defaultMockUser: MockUser = {
  role: UserRole.VIEWER,
  isAuthenticated: true,
}

// Interface for render options
interface RenderOptions {
  user?: Partial<MockUser>
  routePermissions?: UserRole[]
}

// Custom render function for role-based testing
export function renderWithRoles(
  ui: React.ReactElement,
  { user = {}, routePermissions = [] }: RenderOptions = {}
) {
  // Merge default user with provided user data
  const mockUser = { ...defaultMockUser, ...user }

  // Create mock auth provider
  const MockAuthProvider = ({ children }: { children: React.ReactNode }) => {
    return (
      <AuthProvider
        initialUser={mockUser}
        routePermissions={routePermissions}
      >
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          {children}
        </ErrorBoundary>
      </AuthProvider>
    )
  }

  return {
    user: mockUser,
    ...rtlRender(ui, { wrapper: MockAuthProvider }),
  }
}

// Mock roles for testing
export const mockRoles = {
  admin: { 
    role: UserRole.ADMIN, 
    isAuthenticated: true,
    permissions: rolePermissions[UserRole.ADMIN]
  },
  manager: { 
    role: UserRole.MANAGER, 
    isAuthenticated: true,
    permissions: rolePermissions[UserRole.MANAGER]
  },
  cashier: { 
    role: UserRole.CASHIER, 
    isAuthenticated: true,
    permissions: rolePermissions[UserRole.CASHIER]
  },
  trainee: { 
    role: UserRole.TRAINEE, 
    isAuthenticated: true,
    permissions: rolePermissions[UserRole.TRAINEE]
  },
  viewer: { 
    role: UserRole.VIEWER, 
    isAuthenticated: true,
    permissions: rolePermissions[UserRole.VIEWER]
  },
  unauthenticated: { 
    role: UserRole.VIEWER, 
    isAuthenticated: false,
    permissions: rolePermissions[UserRole.VIEWER]
  },
}

// Helper to create a mock user with wallet
export const createMockUserWithWallet = (role: UserRole, walletAddress: string): MockUser => ({
  role,
  isAuthenticated: true,
  walletAddress,
})

// Helper to create a mock user with email
export const createMockUserWithEmail = (role: UserRole, email: string): MockUser => ({
  role,
  isAuthenticated: true,
  email,
})

// Re-export everything from testing library
export * from '@testing-library/react'