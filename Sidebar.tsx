'use client'

import { type UserRole } from '@/types/roles'
import { useNavigation } from '@/hooks/useNavigation'
import Link from 'next/link'
import { rolePermissions } from '@/roles'

interface SidebarProps {
  userRole: UserRole
}

interface IconProps {
  name: string
  className?: string
}

function Icon({ name, className = '' }: IconProps) {
  // This is a simplified icon implementation
  // In a real app, you'd want to use a proper icon library
  return (
    <span 
      className={`material-icons-outlined ${className}`}
      aria-hidden="true"
    >
      {name}
    </span>
  )
}

export function Sidebar({ userRole }: SidebarProps) {
  const { menuItems, currentItem } = useNavigation(userRole)
  const permissions = rolePermissions[userRole]

  return (
    <div 
      className="hidden w-64 flex-shrink-0 bg-gray-800 md:block"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex h-full flex-col">
        {/* Logo/Brand Header */}
        <div className="flex h-16 flex-shrink-0 items-center justify-center bg-gray-900">
          <span className="text-xl font-bold text-white">{'Clover POS'}</span>
        </div>

        {/* Navigation Menu */}
        <div className="flex flex-1 flex-col overflow-y-auto">
          <nav className="flex-1 space-y-1 px-2 py-4">
            {menuItems.map((item) => {
              const isActive = currentItem?.href === item.href
              const requiresPermission = item.requiresPermission
              const hasPermission = !requiresPermission || permissions[requiresPermission]

              if (!hasPermission) return null

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    group flex items-center rounded-md px-2 py-2 text-sm font-medium
                    ${isActive 
                      ? 'bg-gray-900 text-white' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }
                  `}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.icon && (
                    <Icon
                      name={item.icon}
                      className={`
                        mr-3 h-6 w-6
                        ${isActive 
                          ? 'text-white' 
                          : 'text-gray-400 group-hover:text-gray-300'
                        }
                      `}
                    />
                  )}
                  <span className="flex-1">{item.name}</span>
                  {item.requiresPermission && (
                    <span 
                      className="ml-3 inline-block rounded-full bg-gray-700 px-2 py-0.5 text-xs text-gray-300"
                      title={`Requires ${item.requiresPermission} permission`}
                    >
                      {item.requiresPermission.replace('can', '')}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* User Role Badge */}
        <div className="flex-shrink-0 bg-gray-700 p-4">
          <div className="flex items-center">
            <div className="ml-3">
              <p className="text-sm font-medium text-white">
                {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
              </p>
              <p className="text-xs text-gray-300">
                {Object.entries(permissions)
                  .filter(([, value]) => value)
                  .length} Permissions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
