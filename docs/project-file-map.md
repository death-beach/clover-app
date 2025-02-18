# Project File Map

## Directory Structure Overview

### Source Code Organization (src/)

#### Core Application Directories
- `app/`: Next.js App Router directory containing page components and API routes. Handles routing and page-level components.
- `components/`: Reusable UI components that are shared across multiple features or pages.
- `features/`: Feature-specific modules containing all related components, hooks, and logic for a particular feature.
- `providers/`: Application-wide context providers and wrappers that manage global state and functionality.
- `contexts/`: React context definitions and their associated providers for state management.

#### Supporting Directories
- `hooks/`: Custom React hooks that encapsulate reusable stateful logic and component behavior.
- `utils/`: Utility functions and helper methods used throughout the application.
- `lib/`: Core library code, third-party service integrations, and shared functionality.
- `types/`: TypeScript type definitions, interfaces, and type utilities.
- `config/`: Application configuration files and environment-specific settings.
- `__tests__/`: Test files and testing utilities organized by feature or module.

### Root Directory Structure
- `docs/`: Project documentation, architecture details, and development guides.
- `scripts/`: Utility scripts for development, building, and deployment.
- `node_modules/`: External dependencies (managed by npm/yarn).
- Configuration Files:
  - `next.config.js`: Next.js configuration
  - `tsconfig.json`: TypeScript configuration
  - `jest.config.js`: Testing configuration
  - `helio.config.json`: Helio-specific settings

## Completed File Migrations

### Helius Integration Migration
1. **Helius Client**
   - Old Location: `src/helius/client.ts`
   - New Location: `src/lib/helius/client.ts`
   - Status: ✅ Migrated
   - Key Responsibilities:
     - Helius API interactions
     - Transaction enrichment
     - Webhook management

2. **Helius Configuration**
   - Old Location: `src/helius/config.ts`
   - New Location: `src/lib/helius/config.ts`
   - Status: ✅ Migrated
   - Key Responsibilities:
     - Environment configuration
     - API key management

3. **Helius Types**
   - Old Location: `src/helius/types.ts`
   - New Location: `src/lib/helius/types.ts`
   - Status: ✅ Migrated
   - Key Responsibilities:
     - Type definitions for Helius interactions
     - Transaction and transfer interfaces

### Webhook Migration
1. **Helius Webhook Handler**
   - Old Location: `src/pages/api/webhook/helius.ts`
   - New Location: `src/app/api/webhooks/helius.ts`
   - Status: ✅ Migrated
   - Key Responsibilities:
     - Webhook request handling
     - Transaction processing
     - USDC transfer validation

## Current Project Structure
```
src/
├── __tests__/
│   ├── auth/
│   │   └── AuthFlow.test.tsx
│   ├── utils/
│   │   └── test-utils.tsx
│   ├── api.test.ts
│   ├── deployment.test.ts
│   ├── helio.test.ts
│   ├── helius.test.ts
│   └── setup.ts
├── app/
│   ├── api/
│   │   └── webhooks/
│   │       └── helius.ts     # Webhook handler
│   ├── (dashboard)/
│   │   └── layout.tsx        # DashboardLayout
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx      # LoginScreen
│   └── page.tsx              # Root page
├── components/
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   ├── PrivyClientWrapper.tsx
│   └── error/                # Error handling components
├── config/
│   ├── helio.config.ts
│   ├── solana-pay.config.ts
│   └── tokens.ts
├── lib/
│   ├── helius/
│   │   ├── client.ts
│   │   ├── config.ts
│   │   ├── example.ts
│   │   └── types.ts
│   ├── blockchain/
│   │   ├── cache.ts
│   │   ├── rateLimiter.ts
│   │   └── retry.ts
│   └── logger.ts
├── types/
│   ├── UserRoles.ts
│   ├── roles.ts
│   ├── privy.ts
│   ├── helius.ts             # Helius API types
│   └── network.ts            # Network configuration types
├── providers/
│   └── provider.tsx
└── hooks/
    └── useNavigation.ts
```

## Import Path Resolution Implementation Plan

### Phase 4.1: Critical Fixes (Week 1)

#### 1. Break Circular Dependencies
```typescript
// Current Structure (To Be Fixed)
src/
├── providers/
│   └── AuthProvider.tsx      // imports useAuth
├── hooks/
│   └── useAuth.ts           // imports AuthProvider
└── components/
    └── Dashboard.tsx        // imports both
```

##### Implementation Steps:
1. Create Separate Context Files
```typescript
src/
├── contexts/
│   ├── auth/
│   │   ├── AuthContext.ts
│   │   ├── AuthProvider.tsx
│   │   └── types.ts
├── hooks/
│   └── auth/
│       └── useAuth.ts
└── components/
    └── Dashboard.tsx
```

2. Reorganize Type Definitions
```typescript
src/
└── types/
    ├── auth/
    │   ├── context.ts
    │   ├── hooks.ts
    │   └── index.ts
    └── api/
        ├── context.ts
        ├── hooks.ts
        └── index.ts
```

#### 2. Type System Reorganization
```typescript
// Current Structure (To Be Fixed)
src/
└── types/
    ├── UserRoles.ts
    ├── roles.ts
    ├── privy.ts
    └── helius.ts

// New Structure
src/
└── types/
    ├── auth/
    │   ├── roles.ts
    │   ├── permissions.ts
    │   └── index.ts
    ├── blockchain/
    │   ├── helius.ts
    │   ├── transactions.ts
    │   └── index.ts
    └── common/
        ├── utility-types.ts
        └── index.ts
```

### Phase 4.2: Structural Improvements (Week 2)

#### 1. Path Alias Implementation
```typescript
// tsconfig.json path aliases
{
  "paths": {
    "@/contexts/*": ["src/contexts/*"],
    "@/features/*": ["src/features/*"],
    "@/services/*": ["src/services/*"]
  }
}

// Example Usage
import { AuthContext } from '@/contexts/auth'
import { DashboardFeature } from '@/features/dashboard'
import { HeliusService } from '@/services/helius'
```

#### 2. Module Organization
```typescript
// Feature-based Structure
src/
└── features/
    ├── auth/
    │   ├── components/
    │   ├── hooks/
    │   ├── context/
    │   └── types/
    ├── dashboard/
    │   ├── components/
    │   ├── hooks/
    │   ├── context/
    │   └── types/
    └── transactions/
        ├── components/
        ├── hooks/
        ├── context/
        └── types/
```

### Phase 4.3: Tooling & Validation (Week 3)

#### 1. ESLint Configuration
```json
{
  "rules": {
    "import/order": [
      "error",
      {
        "groups": [
          ["builtin", "external"],
          "internal",
          ["parent", "sibling", "index"]
        ],
        "pathGroups": [
          {
            "pattern": "react",
            "group": "external",
            "position": "before"
          },
          {
            "pattern": "@/**",
            "group": "internal"
          }
        ],
        "newlines-between": "always"
      }
    ]
  }
}
```

#### 2. Build Process Updates
```typescript
// webpack.config.js circular dependency detection
module.exports = {
  plugins: [
    new CircularDependencyPlugin({
      exclude: /node_modules/,
      include: /src/,
      failOnError: true,
      allowAsyncCycles: false,
      cwd: process.cwd(),
    })
  ]
}
```

### Phase 4.4: Documentation & Standards (Week 4)

#### 1. Import Standards Documentation
```markdown
# Import Standards

## Order of Imports
1. React/Next.js imports
2. External library imports
3. Internal absolute imports
4. Internal relative imports
5. Type imports

## Type Import Rules
- Use type-only imports for types
- Group type imports together
- Use path aliases for type imports

## Path Alias Usage
- Use @/ prefix for src directory
- Use feature-based imports
- Avoid relative paths beyond one level
```

#### 2. Maintenance Guidelines
```markdown
# Maintenance Checklist

## Before Commit
1. Check for circular dependencies
2. Verify import ordering
3. Validate type imports
4. Run lint checks

## Code Review
1. Import pattern compliance
2. Type system consistency
3. Path alias usage
4. Module organization
```

## Implementation Timeline

### Week 1: Critical Fixes
- Monday: Break auth circular dependencies
- Tuesday: Break API circular dependencies
- Wednesday: Break component circular dependencies
- Thursday: Reorganize type system
- Friday: Validation and testing

### Week 2: Structural Improvements
- Monday: Configure path aliases
- Tuesday: Update import paths
- Wednesday: Reorganize modules
- Thursday: Implement feature structure
- Friday: Validation and testing

### Week 3: Tooling & Validation
- Monday: Configure ESLint rules
- Tuesday: Set up build process checks
- Wednesday: Implement CI/CD checks
- Thursday: Add automated testing
- Friday: Validation and documentation

### Week 4: Documentation & Standards
- Monday: Create import standards
- Tuesday: Update project documentation
- Wednesday: Create maintenance guidelines
- Thursday: Team training
- Friday: Final review and launch

## Success Metrics

### Code Quality
- Zero circular dependencies
- Consistent import patterns
- Clean dependency graph
- Type-safe imports

### Build Process
- Faster build times
- No build warnings
- Smaller bundle sizes
- Clean webpack analysis

### Developer Experience
- Clear import structure
- Easy dependency tracking
- Automated validation
- Comprehensive documentation

Last Updated: 2024-02-16

### Path Aliases Configuration (Completed)
```json
{
  "paths": {
    "@/*": ["src/*"],
    "@/app/*": ["src/app/*"],
    "@/components/*": ["src/components/*"],
    "@/config/*": ["src/config/*"],
    "@/hooks/*": ["src/hooks/*"],
    "@/lib/*": ["src/lib/*"],
    "@/providers/*": ["src/providers/*"],
    "@/types/*": ["src/types/*"],
    "@/utils/*": ["src/utils/*"]
  }
}
```

## Recent Changes
1. Fixed useNavigation.ts:
   - Corrected import path from '@/roles' to '@/types/roles'
   - Added 'type' keyword to MenuItem export
   - Combined rolePermissions import

2. Fixed layout.tsx:
   - Replaced PrivyInterface with correct PrivyUser type
   - Removed unused UserSession type
   - Added 'type' keyword to ReactNode import

3. Type System Improvements:
   - Validated all type imports
   - Ensured consistent use of 'type' keyword
   - Removed unused type definitions
   - Fixed incorrect type references

## Pending Migrations

### Root App Directory Migration
Pending migrations from `/app`:
1. Configuration
   - `/app/config/sdk.ts` → `src/config/`
2. SDK Integration
   - `/app/lib/sdk.ts` → `src/lib/`
3. Utility Functions ✅
   - ✓ `/app/utils/` → `src/utils/`
   - Verified no duplicate implementations
   - Updated import references
4. Test Files
   - `/app/test/` → `src/app/__tests__/`
5. Layout and Page Files
   - ✓ Migrated `layout.tsx` to `src/app/layout.tsx`
   - ✓ Removed redundant `page.js` (existing implementation in src/app/page.tsx sufficient)
   - ✓ Verified routing configurations

## Next Recovery Phases

### Immediate Focus
1. Authentication Flow Validation
   - [ ] Role-based access control testing
   - [ ] Advanced error scenario testing

2. Integration Testing
   - [ ] Helius API integration tests
   - [ ] Helio service connection tests
   - [ ] Webhook and RPC endpoint validation
   - [ ] Environment configuration verification

3. Performance and Security
   - [ ] Load testing authentication endpoints
   - [ ] Security vulnerability assessment
   - [ ] Performance benchmarking
   - [ ] Continuous integration setup

## Validation Strategy
1. Automated Test Suite
   - Comprehensive unit tests
   - Integration testing
   - Error scenario validation
2. Manual User Journey Testing
3. Staged Rollout
   - Feature flag implementation
   - Gradual deployment
4. Continuous Monitoring

## Critical Validation Checklist
- [ ] Authentication flow testing
- [ ] Role-based access control
- [ ] Comprehensive error handling
- [ ] Smooth page navigation
- [ ] Environment configuration validation
- [ ] API integration verification
- [ ] Performance benchmarking
- [ ] Security vulnerability assessment

Last Updated: 2024-02-16