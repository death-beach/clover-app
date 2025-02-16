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
- [ ] Document all file movements needed (NO MOVING YET)
- [ ] Map all component dependencies

### Project File Map
To ensure continuity across conversations, a comprehensive file map will be maintained in `docs/project-file-map.md`. 

CRITICAL PRE-CHANGE INSTRUCTIONS:
1. ALWAYS review `documentation.md` first
2. ALWAYS review `recovery-plan.md`
3. ALWAYS confirm EACH STEP with project owner
4. NO CHANGES will be made without explicit confirmation
5. Maintain a log of all proposed and confirmed changes

### Change Confirmation Protocol
Before ANY action:
- Explain the proposed change in detail
- Show exact files/code that will be modified
- Wait for explicit "YES, proceed" from project owner
- Document the change in recovery-plan.md after confirmation

### Phase 2: File Structure Recovery
Files to be moved (NOT MOVING YET, JUST PLANNING):
1. Root level files to move:
   - DashboardLayout.tsx → src/app/(dashboard)/layout.tsx
   - Header.tsx → src/components/Header.tsx
   - LoginScreen.tsx → src/app/(auth)/login/page.tsx
   - Sidebar.tsx → src/components/Sidebar.tsx
   - UserRoles.ts → src/types/UserRoles.ts
   - provider.tsx → src/providers/provider.tsx
   - roles.ts → src/types/roles.ts
   - page.tsx → src/app/page.tsx

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
- [ ] Phase 1 Complete
- [ ] Phase 2 Complete
- [ ] Phase 3 Complete
- [ ] Phase 4 Complete
- [ ] Phase 5 Complete

## Important Warnings
- DO NOT move files without explicit confirmation
- DO NOT rename components without discussion
- DO NOT modify role definitions without verification
- ALWAYS verify imports before saving changes

Last Updated: [Current Date]