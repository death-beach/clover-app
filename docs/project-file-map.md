# Project File Map

## Root Level Files
- DashboardLayout.tsx
- Header.tsx
- LoginScreen.tsx
- Sidebar.tsx
- UserRoles.ts
- provider.tsx
- roles.ts
- page.tsx

## Planned Destination Structure
```
src/
├── app/
│   ├── (dashboard)/
│   │   └── layout.tsx  # DashboardLayout.tsx
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx  # LoginScreen.tsx
│   └── page.tsx  # Root page
├── components/
│   ├── Header.tsx
│   └── Sidebar.tsx
├── types/
│   ├── UserRoles.ts
│   └── roles.ts
└── providers/
    └── provider.tsx
```

## Dependency Notes
- Verify all import statements after moves
- Check role-based access control references
- Ensure no broken component hierarchies

Last Updated: [Current Timestamp]