# Project Salvage Plan

## Documentation Cleanup (FIRST STEP)
[x]Developer must manually delete all files in /docs except:
- /docs/salvage/LOCKED_PRD.md
- /docs/salvage/SALVAGE_PLAN.md

## File Deletion Process
1. [x]Documentation Cleanup (as above)
2. During Implementation:
   - Move needed code from files to be deleted
   - Developer must manually delete old files immediately after moving needed code
   - Verify functionality after each deletion
   - Do not keep old files "just in case" - refer to git backup if needed

## Core Strategy
1. Keep existing integrations (Helio, Helius, Clover, Solana Pay, Privy)
2. Delete everything except core payment flow and database code
3. Simplify roles to Import from Clover
4. Focus on key functionality only

## Files to Keep

### Core Integration Files
```
src/lib/
  ├── helius/
  │   ├── client.ts     # Helius API integration
  │   └── config.ts     # Helius configuration
  ├── helio/
  │   ├── client.ts     # Helio API integration
  │   └── config.ts     # Helio configuration
  └── clover/
      ├── client.ts     # Clover API integration
      └── config.ts     # Clover configuration
```

### Payment Processing
```
src/app/api/
  ├── payments/
  │   └── route.ts      # Payment processing endpoint
  └── webhooks/
      ├── helius.ts     # Transaction monitoring
      └── helio.ts      # Off-ramp monitoring
```

### Database & Types
```
src/types/
  ├── transactions.ts   # Transaction types
  ├── merchants.ts      # Merchant types
  ├── users.ts         # User types
  └── transfers.ts     # Transfer types

src/db/
  ├── schema.ts        # Database schema
  └── client.ts        # Database client
```

### Core Components
```
src/components/
  ├── PaymentQR.tsx    # Solana Pay QR generation
  ├── Dashboard.tsx    # Simple dashboard
  ├── TransactionList.tsx
  └── WalletManager.tsx
```

### Authentication
```
src/app/api/auth/
  └── [...nextauth].ts # Basic auth configuration

src/components/
  └── PrivyProvider.tsx # Privy integration
```

## Files to Remove

1. All test infrastructure beyond basic component tests
2. Complex role system files
3. All NFT/token related code
4. Future feature implementations
5. Complex error handling systems
6. Extensive monitoring systems
7. Complex deployment configurations

## Specific Cleanup Tasks

1. **Simplify Role System**
   - Pulling roles from Clover API
   - Owner: Full access
   - Admin: Full access + off-ramp
   - Manager: Manage staff + transfers + transaction view
   - Employee: Process payments + view transactions
2. **Clean Database Schema**
   - Remove unused tables
   - Simplify to core tables from PRD
   - Remove unused fields
   - Update types to match

3. **Streamline API Routes**
   - Keep only essential endpoints
   - Remove complex validation
   - Simplify error handling
   - Focus on core payment flow

4. **Clean Frontend**
   - Remove complex UI components
   - Keep basic dashboard
   - Remove unused state management
   - Focus on essential flows

## Implementation Steps

1. **Backup Current Code**
   ```bash
   git checkout -b backup/full-implementation
   git add .
   git commit -m "Backup before cleanup"
   ```

2. **Create Clean Branch**
   ```bash
   git checkout -b cleanup/mvp
   ```

3. **Core Cleanup**
   - Remove identified files
   - Simplify remaining code
   - Update imports
   - Test core functionality

4. **Verify Integrations**
   - Test Clover connection
   - Verify Helius webhooks
   - Check Helio off-ramp
   - Validate Privy auth

5. **Deploy MVP**
   - Deploy to Helio
   - Test on devnet
   - Verify with test merchant
   - Monitor core functions

## Success Criteria
- Clean, working payment flow
- Successful transaction storage
- Basic dashboard functionality
- Working auth system
- Functional off-ramp

DO NOT ADD FEATURES BEYOND THIS SCOPE.