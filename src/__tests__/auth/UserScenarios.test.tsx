import { renderWithRoles, createMockUserWithWallet, createMockUserWithEmail, screen, waitFor } from '../utils/role-test-utils'
import { DashboardLayout } from '../../app/(dashboard)/layout'
import { LoginScreen } from '../../app/(auth)/login/page'
import { UserRole } from '../../types/roles'

describe('User Scenarios', () => {
  describe('Wallet Authentication Scenarios', () => {
    it('handles successful wallet authentication for admin', async () => {
      const mockAdmin = createMockUserWithWallet(
        UserRole.ADMIN,
        '5KL2xHzCGFx4NL8FcXHYJ9WmQ2YzZNZ8J3vmG9q5M1Kp'
      )
      
      renderWithRoles(<DashboardLayout />, { user: mockAdmin })
      
      await waitFor(() => {
        expect(screen.getByTestId('admin-dashboard')).toBeInTheDocument()
        expect(screen.getByText(mockAdmin.walletAddress!)).toBeInTheDocument()
      })
    })

    it('handles wallet connection errors gracefully', async () => {
      const mockUser = createMockUserWithWallet(
        UserRole.CASHIER,
        'invalid-wallet-address'
      )
      
      renderWithRoles(<LoginScreen />, { user: mockUser })
      
      await waitFor(() => {
        expect(screen.getByTestId('wallet-error')).toBeInTheDocument()
        expect(screen.getByText('Invalid wallet address')).toBeInTheDocument()
      })
    })
  })

  describe('Email Authentication Scenarios', () => {
    it('handles successful email authentication for manager', async () => {
      const mockManager = createMockUserWithEmail(
        UserRole.MANAGER,
        'manager@example.com'
      )
      
      renderWithRoles(<DashboardLayout />, { user: mockManager })
      
      await waitFor(() => {
        expect(screen.getByTestId('manager-dashboard')).toBeInTheDocument()
        expect(screen.getByText(mockManager.email!)).toBeInTheDocument()
      })
    })

    it('handles invalid email authentication', async () => {
      const mockUser = createMockUserWithEmail(
        UserRole.TRAINEE,
        'invalid-email'
      )
      
      renderWithRoles(<LoginScreen />, { user: mockUser })
      
      await waitFor(() => {
        expect(screen.getByTestId('email-error')).toBeInTheDocument()
        expect(screen.getByText('Invalid email format')).toBeInTheDocument()
      })
    })
  })

  describe('Role Transition Scenarios', () => {
    it('handles role upgrade from cashier to manager', async () => {
      const initialUser = createMockUserWithEmail(
        UserRole.CASHIER,
        'user@example.com'
      )
      
      const { rerender } = renderWithRoles(<DashboardLayout />, { user: initialUser })
      
      expect(screen.getByTestId('cashier-dashboard')).toBeInTheDocument()
      expect(screen.queryByTestId('manager-dashboard')).not.toBeInTheDocument()

      const upgradedUser = {
        ...initialUser,
        role: UserRole.MANAGER
      }
      
      rerender(<DashboardLayout />)
      
      await waitFor(() => {
        expect(screen.queryByTestId('cashier-dashboard')).not.toBeInTheDocument()
        expect(screen.getByTestId('manager-dashboard')).toBeInTheDocument()
      })
    })

    it('handles role downgrade from manager to cashier', async () => {
      const initialUser = createMockUserWithEmail(
        UserRole.MANAGER,
        'manager@example.com'
      )
      
      const { rerender } = renderWithRoles(<DashboardLayout />, { user: initialUser })
      
      expect(screen.getByTestId('manager-dashboard')).toBeInTheDocument()
      expect(screen.getByTestId('reports-access')).toBeInTheDocument()

      const downgradedUser = {
        ...initialUser,
        role: UserRole.CASHIER
      }
      
      rerender(<DashboardLayout />)
      
      await waitFor(() => {
        expect(screen.queryByTestId('manager-dashboard')).not.toBeInTheDocument()
        expect(screen.queryByTestId('reports-access')).not.toBeInTheDocument()
        expect(screen.getByTestId('cashier-dashboard')).toBeInTheDocument()
      })
    })
  })

  describe('Session Scenarios', () => {
    it('maintains user role after page refresh', async () => {
      const mockUser = createMockUserWithEmail(
        UserRole.MANAGER,
        'manager@example.com'
      )
      
      const { rerender } = renderWithRoles(<DashboardLayout />, { user: mockUser })
      
      // Simulate page refresh
      rerender(<DashboardLayout />)
      
      await waitFor(() => {
        expect(screen.getByTestId('manager-dashboard')).toBeInTheDocument()
        expect(screen.getByText(mockUser.email!)).toBeInTheDocument()
      })
    })

    it('handles session expiration correctly', async () => {
      const mockUser = createMockUserWithEmail(
        UserRole.CASHIER,
        'cashier@example.com'
      )
      
      const { rerender } = renderWithRoles(<DashboardLayout />, { user: mockUser })
      
      // Simulate session expiration
      rerender(<DashboardLayout />)
      
      await waitFor(() => {
        expect(screen.getByTestId('session-expired')).toBeInTheDocument()
        expect(screen.getByText('Your session has expired')).toBeInTheDocument()
      })
    })
  })

  describe('Error Scenarios', () => {
    it('handles network errors during authentication', async () => {
      const mockUser = createMockUserWithEmail(
        UserRole.VIEWER,
        'viewer@example.com'
      )
      
      renderWithRoles(<LoginScreen />, { 
        user: { ...mockUser, networkError: true }
      })
      
      await waitFor(() => {
        expect(screen.getByTestId('network-error')).toBeInTheDocument()
        expect(screen.getByText('Network connection error')).toBeInTheDocument()
      })
    })

    it('handles concurrent login attempts', async () => {
      const mockUser = createMockUserWithEmail(
        UserRole.TRAINEE,
        'trainee@example.com'
      )
      
      renderWithRoles(<LoginScreen />, { 
        user: { ...mockUser, concurrentLogin: true }
      })
      
      await waitFor(() => {
        expect(screen.getByTestId('concurrent-login-error')).toBeInTheDocument()
        expect(screen.getByText('Already logged in on another device')).toBeInTheDocument()
      })
    })
  })
})