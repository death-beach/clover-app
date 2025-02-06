'use client'

import { type UserRole } from '@/types/roles'
import { useNavigation } from '@/hooks/useNavigation'

interface SidebarProps {
  userRole: UserRole
}

export function Sidebar({ userRole }: SidebarProps) {
  const { menuItems } = useNavigation(userRole)

  return (
    <div className="hidden w-64 flex-shrink-0 bg-gray-800 md:block">
      <div className="flex h-full flex-col">
        <div className="flex h-16 flex-shrink-0 items-center justify-center bg-gray-900">
          <span className="text-xl font-bold text-white">{'Clover POS'}</span>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto">
          <nav className="flex-1 space-y-1 px-2 py-4">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                {item.name}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}
