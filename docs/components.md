# Component Documentation

## Navigation System

### useNavigation Hook

The `useNavigation` hook provides a dynamic and permission-based navigation system for the application.

#### Key Features
- Role-based menu item filtering
- Active page tracking
- Comprehensive menu item configuration
- Permission-based access control

#### Usage
```typescript
const { menuItems, currentItem } = useNavigation(userRole)
```

#### MenuItem Interface
```typescript
interface MenuItem {
  name: string
  href: string
  icon?: string
  requiresPermission?: keyof typeof rolePermissions.owner
  description?: string
}
```

### Sidebar Component

The Sidebar component provides a dynamic, role-based navigation interface.

#### Key Features
- Role-based menu item rendering
- Active page highlighting
- Permission badges
- User role display
- Accessibility-focused design

#### Props
```typescript
interface SidebarProps {
  userRole: UserRole
}
```

#### Rendering Logic
- Filters menu items based on user role permissions
- Displays icons for menu items
- Shows permission badges for restricted items
- Highlights current active page
- Displays user role and permission count

## ErrorBoundary Component

The ErrorBoundary component has been updated to provide better error handling and a more streamlined implementation. This component is used to catch and handle JavaScript errors that occur in child components.

### Key Changes
- Moved to a custom implementation instead of using a third-party library
- Simplified props interface using `FallbackComponent`
- Improved error state management
- Better TypeScript type safety

### Usage
```tsx
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { ErrorFallback } from '@/components/error/ErrorFallback';

<ErrorBoundary FallbackComponent={ErrorFallback}>
  <YourComponent />
</ErrorBoundary>
```

### Props
- `FallbackComponent`: A React component that will be rendered when an error occurs
- `children`: The components to be wrapped by the error boundary

## DashboardLayout Component

The DashboardLayout component provides a robust and type-safe implementation for the main application layout.

### Key Features
- Authentication state management
- Loading state handling
- Error boundary integration
- Role-based rendering
- Suspense for code splitting

### Usage
```tsx
import { DashboardLayout } from '@/components/layouts/DashboardLayout';

<DashboardLayout userRole={userRole}>
  <YourPageContent />
</DashboardLayout>
```

### Props
- `userRole`: The current user's role
- `children`: The page content to be rendered within the layout
- `onAuthError`: Optional error handling callback

### Loading States
Utilizes `ready` state from authentication to manage loading indicators, providing an accurate representation of the application's state.

### Error Handling
Integrated ErrorBoundary component for graceful error management and improved user experience.