# Project File Map

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

## Import Path Resolution Status
✓ Completed tsconfig.json path configuration
- Configured path aliases for all major directories
- Removed root app/ directory
- All imports now resolve from src/ directory

Path Aliases Configured:
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