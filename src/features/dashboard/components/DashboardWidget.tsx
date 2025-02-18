import { useMemo } from 'react'
import { useAuth } from '@/hooks/auth/useAuth'
import type { DashboardWidgetProps } from '../types'

export const DashboardWidget = ({ 
  title, 
  children, 
  role 
}: DashboardWidgetProps) => {
  const { user } = useAuth()

  // Check if user has permission to view the widget
  const canRender = useMemo(() => {
    // If no role specified, render for all
    if (!role) return true

    // Check if user's role is in the allowed roles
    return user && role.includes(user.role)
  }, [user, role])

  // If user doesn't have permission, return null
  if (!canRender) return null

  return (
    <div className="dashboard-widget">
      <div className="widget-header">
        <h3>{title}</h3>
      </div>
      <div className="widget-content">
        {children}
      </div>
    </div>
  )
}