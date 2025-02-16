# Project File Map

## Current File Structure Analysis

### Root Level Files and Their Dependencies

1. **DashboardLayout.tsx**
   - Current Location: /DashboardLayout.tsx
   - Target Location: src/app/(dashboard)/layout.tsx
   - Dependencies:
     - Imports from: Header.tsx, Sidebar.tsx, provider.tsx
     - Uses types from: UserRoles.ts
     - Authentication check from: provider.tsx
   - Components that depend on it:
     - All dashboard pages
     - Protected route components

2. **Header.tsx**
   - Current Location: /Header.tsx
   - Target Location: src/components/Header.tsx
   - Dependencies:
     - Uses types from: UserRoles.ts, roles.ts
     - Authentication state from: provider.tsx
   - Components that depend on it:
     - DashboardLayout.tsx
     - Navigation components

3. **LoginScreen.tsx**
   - Current Location: /LoginScreen.tsx
   - Target Location: src/app/(auth)/login/page.tsx
   - Dependencies:
     - Authentication from: provider.tsx
     - Role definitions from: roles.ts
   - Used by:
     - Authentication flow
     - Protected routes redirect

4. **Sidebar.tsx**
   - Current Location: /Sidebar.tsx
   - Target Location: src/components/Sidebar.tsx
   - Dependencies:
     - Role permissions from: UserRoles.ts, roles.ts
     - Authentication state from: provider.tsx
   - Used by:
     - DashboardLayout.tsx

5. **UserRoles.ts**
   - Current Location: /UserRoles.ts
   - Target Location: src/types/UserRoles.ts
   - Dependencies:
     - Extends types from: roles.ts
   - Used by:
     - Header.tsx
     - Sidebar.tsx
     - DashboardLayout.tsx
     - provider.tsx
     - Protected route components

6. **provider.tsx**
   - Current Location: /provider.tsx
   - Target Location: src/providers/provider.tsx
   - Dependencies:
     - Types from: UserRoles.ts
     - Role definitions from: roles.ts
   - Used by:
     - All authenticated components
     - Role-based access control
     - Layout components

7. **roles.ts**
   - Current Location: /roles.ts
   - Target Location: src/types/roles.ts
   - Dependencies:
     - No direct dependencies
   - Used by:
     - UserRoles.ts
     - provider.tsx
     - Authentication components

8. **page.tsx**
   - Current Location: /page.tsx
   - Target Location: src/app/page.tsx
   - Dependencies:
     - Authentication check from: provider.tsx
     - Role verification from: UserRoles.ts
   - Entry point for the application

## Planned Destination Structure
```
src/
├── app/
│   ├── (dashboard)/
│   │   └── layout.tsx        # DashboardLayout.tsx
│   │       Dependencies:
│   │       - ../../components/Header
│   │       - ../../components/Sidebar
│   │       - ../../providers/provider
│   │       - ../../types/UserRoles
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx      # LoginScreen.tsx
│   │           Dependencies:
│   │           - ../../../providers/provider
│   │           - ../../../types/roles
│   └── page.tsx              # Root page
│       Dependencies:
│       - ../providers/provider
│       - ../types/UserRoles
├── components/
│   ├── Header.tsx
│   │   Dependencies:
│   │   - ../types/UserRoles
│   │   - ../types/roles
│   │   - ../providers/provider
│   └── Sidebar.tsx
│       Dependencies:
│       - ../types/UserRoles
│       - ../types/roles
│       - ../providers/provider
├── types/
│   ├── UserRoles.ts
│   │   Dependencies:
│   │   - ./roles
│   └── roles.ts
│       Dependencies: none
└── providers/
    └── provider.tsx
        Dependencies:
        - ../types/UserRoles
        - ../types/roles
```

## Component Hierarchy
```
provider.tsx
└── DashboardLayout.tsx
    ├── Header.tsx
    └── Sidebar.tsx
```

## Role-Based Access Control Flow
```
roles.ts
└── UserRoles.ts
    └── provider.tsx
        ├── Protected Routes
        ├── Header.tsx
        └── Sidebar.tsx
```

## Import Statement Updates Needed
After moving files, the following import updates will be required:

1. In DashboardLayout.tsx:
```typescript
// Old imports
import { Header } from '../Header'
import { Sidebar } from '../Sidebar'
import { useAuth } from '../provider'

// New imports
import { Header } from '../../components/Header'
import { Sidebar } from '../../components/Sidebar'
import { useAuth } from '../../providers/provider'
```

2. In Header.tsx and Sidebar.tsx:
```typescript
// Old imports
import { UserRole } from '../UserRoles'
import { RolePermissions } from '../roles'
import { useAuth } from '../provider'

// New imports
import { UserRole } from '../types/UserRoles'
import { RolePermissions } from '../types/roles'
import { useAuth } from '../providers/provider'
```

3. In provider.tsx:
```typescript
// Old imports
import { UserRole } from '../UserRoles'
import { RoleDefinition } from '../roles'

// New imports
import { UserRole } from '../types/UserRoles'
import { RoleDefinition } from '../types/roles'
```

## Critical Considerations
1. All moves must maintain the existing component hierarchy
2. Role-based access control must remain functional throughout
3. Import paths must be updated consistently
4. Authentication flow must remain unbroken
5. Protected routes must maintain their security

## Implementation Order
1. Move type definitions first (roles.ts, UserRoles.ts)
2. Move provider.tsx
3. Move components (Header.tsx, Sidebar.tsx)
4. Move layout and pages
5. Update all import statements
6. Verify component hierarchy
7. Test role-based access control

Last Updated: [Current Date]