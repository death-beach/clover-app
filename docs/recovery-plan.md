# Project Recovery Plan

## Current State Assessment
- Multiple files disconnected from Next.js structure
- Component hierarchy broken
- Role-based access control disconnected
- Files in root that should be in src/app structure

## Recovery Phases

### Phase 1: Documentation & Mapping
- [x] Read and understand documentation.md
- [x] Create comprehensive project file map
- [x] Create recovery-plan.md
- [x] Document all file movements needed (NO MOVING YET)
- [x] Map all component dependencies

### Detailed File Movement Plan

#### Stage 1: Type Definitions
These files have no incoming dependencies and should be moved first:

1. **roles.ts → src/types/roles.ts**
   - No incoming dependencies
   - Create types/ directory first
   - Will require updates in:
     * UserRoles.ts
     * provider.tsx
     * Header.tsx
     * Sidebar.tsx

2. **UserRoles.ts → src/types/UserRoles.ts**
   - Depends only on roles.ts
   - Must be moved after roles.ts
   - Will require updates in:
     * provider.tsx
     * DashboardLayout.tsx
     * Header.tsx
     * Sidebar.tsx
     * Protected route components

#### Stage 2: Provider Setup
Provider must be moved before components that depend on it:

3. **provider.tsx → src/providers/provider.tsx**
   - Depends on:
     * UserRoles.ts
     * roles.ts
   - Create providers/ directory first
   - Will require updates in:
     * DashboardLayout.tsx
     * Header.tsx
     * Sidebar.tsx
     * LoginScreen.tsx
     * All authenticated components

#### Stage 3: Core Components
Move components that others depend on:

4. **Header.tsx → src/components/Header.tsx**
   - Depends on:
     * UserRoles.ts
     * roles.ts
     * provider.tsx
   - Create components/ directory first
   - Used by DashboardLayout.tsx

5. **Sidebar.tsx → src/components/Sidebar.tsx**
   - Depends on:
     * UserRoles.ts
     * roles.ts
     * provider.tsx
   - Used by DashboardLayout.tsx

#### Stage 4: Layout and Pages
Move layout and page components last:

6. **DashboardLayout.tsx → src/app/(dashboard)/layout.tsx**
   - Depends on:
     * Header.tsx
     * Sidebar.tsx
     * provider.tsx
     * UserRoles.ts
   - Create directory structure:
     * src/app/
     * src/app/(dashboard)/

7. **LoginScreen.tsx → src/app/(auth)/login/page.tsx**
   - Depends on:
     * provider.tsx
     * roles.ts
   - Create directory structure:
     * src/app/(auth)/
     * src/app/(auth)/login/

8. **page.tsx → src/app/page.tsx**
   - Depends on:
     * provider.tsx
     * UserRoles.ts
   - Requires src/app/ directory

### Required Directory Structure Creation
```
src/
├── app/
│   ├── (dashboard)/
│   ├── (auth)/
│   │   └── login/
├── components/
├── types/
└── providers/
```

### Import Path Updates
After each move, imports must be updated to reflect new paths:

1. Relative path updates:
   ```typescript
   // Example: In DashboardLayout.tsx
   import { Header } from '../../components/Header'
   import { Sidebar } from '../../components/Sidebar'
   import { useAuth } from '../../providers/provider'
   ```

2. Type imports:
   ```typescript
   // Example: In components
   import { UserRole } from '../types/UserRoles'
   import { RolePermissions } from '../types/roles'
   ```

### Verification Steps After Each Move
1. Check file exists in new location
2. Verify all imports are updated
3. Confirm no duplicate files
4. Test affected components
5. Verify role-based access still works

### Phase 2: File Structure Recovery
Will execute the moves in the order specified above, following the detailed movement plan.

### Phase 3: Component Reconnection
1. Fix import statements after file moves
2. Restore role-based access control:
   - Reconnect UserRoles.ts references
   - Fix role permissions in components
   - Restore protected routes

### Phase 4: Integration Recovery
1. Verify Helius integration still works
2. Verify Helio integration still works
3. Test all blockchain utilities
4. Verify webhook handlers

### Phase 5: Testing & Verification
1. Test component hierarchy
2. Verify role-based access
3. Test protected routes
4. Verify API connections

## Implementation Notes
- NO FILES WILL BE MOVED without explicit confirmation
- Each phase requires verification before proceeding
- All changes will be documented
- Testing required after each step

## Recovery Progress Tracking
- [x] Phase 1 Complete
- [x] Phase 2 Complete
  - [x] Backup of existing src/types files
  - [x] Moved root roles.ts to src/types/
  - [x] Moved root privy.ts to src/types/
  - [x] Updated UserRoles.ts to use correct role system
  - [x] Moved and updated core components
    - [x] provider.tsx → src/providers/provider.tsx
    - [x] Header.tsx → src/components/Header.tsx
    - [x] Sidebar.tsx → src/components/Sidebar.tsx
    - [x] DashboardLayout.tsx → src/app/(dashboard)/layout.tsx
    - [x] LoginScreen.tsx → src/app/(auth)/login/page.tsx
    - [x] page.tsx → src/app/page.tsx
- [ ] Phase 3 Component Reconnection
- [ ] Phase 4 Integration Recovery
- [ ] Phase 5 Testing & Verification

## Recent Recovery Actions
- Completed comprehensive file structure migration
- Preserved authentication and role-based logic
- Updated import statements across components
- Prepared Next.js 13 App Router compatible structure
- Maintained type safety and error handling

## Next Immediate Steps
1. Validate Authentication Flow
   - Verify Privy authentication integration
   - Test login/logout mechanisms
   - Ensure role-based access control works

2. Component Interconnectivity
   - Verify imports and dependencies
   - Test component interactions
   - Ensure smooth navigation between pages

3. Error Handling and Type Safety
   - Review and refine error handling in authentication flow
   - Validate TypeScript type definitions
   - Ensure comprehensive error coverage

4. Environment and Configuration
   - Verify environment variable configurations
   - Test API integrations (Helius, Helio)
   - Validate webhook and RPC endpoint connections

## Critical Validation Checklist
- [ ] Authentication works across all entry points
- [ ] Role-based access control functional
- [ ] Navigation between pages seamless
- [ ] Error states properly handled
- [ ] Environment configurations correct
- [ ] API integrations operational

## Potential Risks and Mitigations
- Import path resolution issues
- Authentication flow interruptions
- Type system inconsistencies
- Environment configuration mismatches

## Recommended Validation Approach
1. Manual testing of critical user journeys
2. Comprehensive unit and integration tests
3. Staged rollout with feature flags
4. Continuous monitoring and logging

## Important Warnings
- Maintain strict adherence to type safety
- Preserve existing authentication logic
- Minimal changes to core business logic
- Comprehensive testing before each merge
- Document all changes and observations

Last Updated: 2024-02-15