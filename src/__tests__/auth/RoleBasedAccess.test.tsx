import { renderWithRoles, mockRoles, screen, waitFor } from '../utils/role-test-utils'
import { DashboardLayout } from '../../app/(dashboard)/layout'
import { Header } from '../../components/Header'
import { Sidebar } from '../../components/Sidebar'
import { UserRole } from '../../types/roles'

describe('Role-Based Access Control', () => {
  describe('DashboardLayout', () => {
    it('renders full dashboard for admin users', async () => {
      renderWithRoles(<DashboardLayout />, { user: mockRoles.admin })
      
      await waitFor(() => {
        expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument()
        expect(screen.getByTestId('admin-controls')).toBeInTheDocument()
        expect(screen.getByTestId('user-management')).toBeInTheDocument()
      })
    })

    it('renders limited dashboard for manager users', async () => {
      renderWithRoles(<DashboardLayout />, { user: mockRoles.manager })
      
      await waitFor(() => {
        expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument()
        expect(screen.getByTestId('transaction-management')).toBeInTheDocument()
        expect(screen.queryByTestId('admin-controls')).not.toBeInTheDocument()
      })
    })

    it('renders basic dashboard for cashier users', async () => {
      renderWithRoles(<DashboardLayout />, { user: mockRoles.cashier })
      
      await waitFor(() => {
        expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument()
        expect(screen.getByTestId('transaction-processing')).toBeInTheDocument()
        expect(screen.queryByTestId('user-management')).not.toBeInTheDocument()
      })
    })

    it('redirects unauthenticated users to login', async () => {
      renderWithRoles(<DashboardLayout />, { user: mockRoles.unauthenticated })
      
      await waitFor(() => {
        expect(screen.getByTestId('login-redirect')).toBeInTheDocument()
      })
    })
  })

  describe('Header Component', () => {
    it('shows all controls for admin users', () => {
      renderWithRoles(<Header />, { user: mockRoles.admin })
      
      expect(screen.getByTestId('settings-button')).toBeInTheDocument()
      expect(screen.getByTestId('user-management-button')).toBeInTheDocument()
      expect(screen.getByTestId('reports-button')).toBeInTheDocument()
    })

    it('shows limited controls for manager users', () => {
      renderWithRoles(<Header />, { user: mockRoles.manager })
      
      expect(screen.getByTestId('reports-button')).toBeInTheDocument()
      expect(screen.queryByTestId('user-management-button')).not.toBeInTheDocument()
    })

    it('shows basic controls for cashier users', () => {
      renderWithRoles(<Header />, { user: mockRoles.cashier })
      
      expect(screen.getByTestId('transaction-button')).toBeInTheDocument()
      expect(screen.queryByTestId('reports-button')).not.toBeInTheDocument()
    })
  })

  describe('Sidebar Navigation', () => {
    it('shows all navigation items for admin users', () => {
      renderWithRoles(<Sidebar />, { user: mockRoles.admin })
      
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
      expect(screen.getByText('User Management')).toBeInTheDocument()
      expect(screen.getByText('Settings')).toBeInTheDocument()
      expect(screen.getByText('Reports')).toBeInTheDocument()
    })

    it('shows permitted navigation items for manager users', () => {
      renderWithRoles(<Sidebar />, { user: mockRoles.manager })
      
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
      expect(screen.getByText('Reports')).toBeInTheDocument()
      expect(screen.queryByText('User Management')).not.toBeInTheDocument()
    })

    it('shows basic navigation items for cashier users', () => {
      renderWithRoles(<Sidebar />, { user: mockRoles.cashier })
      
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
      expect(screen.getByText('Transactions')).toBeInTheDocument()
      expect(screen.queryByText('Reports')).not.toBeInTheDocument()
    })
  })

  describe('Route Protection', () => {
    const protectedRoutes = [
      { path: '/admin', roles: [UserRole.ADMIN] },
      { path: '/reports', roles: [UserRole.ADMIN, UserRole.MANAGER] },
      { path: '/transactions', roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER] }
    ]

    protectedRoutes.forEach(route => {
      it(`protects ${route.path} route with correct role permissions`, () => {
        Object.values(mockRoles).forEach(user => {
          const hasAccess = route.roles.includes(user.role)
          renderWithRoles(<div data-testid="protected-content">Protected</div>, {
            user,
            routePermissions: route.roles
          })

          if (hasAccess && user.isAuthenticated) {
            expect(screen.getByTestId('protected-content')).toBeInTheDocument()
          } else {
            expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
          }
        })
      })
    })
  })

  describe('Error Handling', () => {
    it('handles unauthorized access attempts gracefully', async () => {
      renderWithRoles(<DashboardLayout />, {
        user: mockRoles.cashier,
        routePermissions: [UserRole.ADMIN]
      })

      await waitFor(() => {
        expect(screen.getByTestId('unauthorized-error')).toBeInTheDocument()
        expect(screen.getByText('Access Denied')).toBeInTheDocument()
      })
    })

    it('handles authentication errors appropriately', async () => {
      renderWithRoles(<DashboardLayout />, {
        user: { ...mockRoles.cashier, isAuthenticated: false }
      })

      await waitFor(() => {
        expect(screen.getByTestId('auth-error')).toBeInTheDocument()
        expect(screen.getByText('Please log in to continue')).toBeInTheDocument()
      })
    })
  })

  describe('Dynamic UI Elements', () => {
    it('renders role-specific UI elements correctly', () => {
      const { rerender } = renderWithRoles(<DashboardLayout />, { user: mockRoles.admin })
      expect(screen.getByTestId('admin-dashboard')).toBeInTheDocument()

      rerender(<DashboardLayout />)
      expect(screen.queryByTestId('admin-dashboard')).not.toBeInTheDocument()
      expect(screen.getByTestId('user-dashboard')).toBeInTheDocument()
    })

    it('updates UI when user role changes', async () => {
      const { rerender } = renderWithRoles(<DashboardLayout />, { user: mockRoles.cashier })
      expect(screen.getByTestId('cashier-view')).toBeInTheDocument()

      rerender(<DashboardLayout />)
      expect(screen.queryByTestId('cashier-view')).not.toBeInTheDocument()
      expect(screen.getByTestId('manager-view')).toBeInTheDocument()
    })
  })
})