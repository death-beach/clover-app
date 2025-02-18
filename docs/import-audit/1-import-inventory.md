# Comprehensive Import Inventory

## Overview
This document catalogs all import statements across the project, organized by directory and file type. The inventory helps identify patterns, issues, and dependencies in our import structure.

## Directory Structure Analysis

### /src/__tests__/

#### Integration Tests

##### api.test.ts
```typescript
// React/Testing imports:
import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { render, screen, waitFor } from '@testing-library/react'

// Component/Hook imports:
import { useApi } from '@/hooks/useApi'
import { ApiProvider } from '@/providers/ApiProvider'

// Type imports:
import type { ApiResponse } from '@/types/api'

Import issues:
- Mixed import styles (some grouped, some individual)
- Inconsistent use of type imports
```

##### deployment.test.ts
```typescript
// Testing imports:
import { describe, it, expect } from '@jest/globals'

// Utility imports:
import { validateDeployment } from '@/utils/deployment'
import { getEnvironmentConfig } from '@/config/environment'

Import issues:
- Relative path used for utility import
- Inconsistent path alias usage
```

##### helio.test.ts
```typescript
// Testing imports:
import { describe, it, expect, beforeAll, afterEach } from '@jest/globals'

// Service imports:
import { HelioClient } from '@/lib/helio/client'
import { mockHelioResponses } from '../utils/mocks/helio'

// Type imports:
import type { HelioConfig } from '@/types/helio'

Import issues:
- Mixed use of relative and absolute paths
- Type import inconsistency
```

##### helius.test.ts
```typescript
// Testing imports:
import { describe, it, expect, beforeAll } from '@jest/globals'

// Service imports:
import { HeliusClient } from '@/lib/helius/client'
import { mockWebhookData } from '../utils/mocks/helius'

// Type imports:
import type { WebhookResponse } from '@/types/helius'

Import issues:
- Inconsistent mock data import paths
- Mixed import grouping styles
```

##### validation.test.ts
```typescript
// Testing imports:
import { describe, it, expect } from '@jest/globals'

// Utility imports:
import { validateInput } from '@/utils/validation'
import { testData } from './utils/testData'

Import issues:
- Inconsistent path usage for test utilities
- Missing type imports
```

#### Auth Tests

##### /auth/AuthFlow.test.tsx
```typescript
// React/Testing imports:
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach } from '@jest/globals'

// Component imports:
import { AuthFlow } from '@/components/auth/AuthFlow'
import { AuthProvider } from '@/providers/AuthProvider'

// Utility imports:
import { mockUser } from '../utils/mocks/user'
import { setupAuthTest } from '../utils/setup'

// Type imports:
import type { User } from '@/types/auth'

Import issues:
- Mixed use of relative/absolute paths
- Inconsistent import grouping
- Type import inconsistency
```

#### Test Utilities

##### /utils/setup.ts
```typescript
// React imports:
import { ReactNode } from 'react'

// Testing imports:
import { render } from '@testing-library/react'

// Provider imports:
import { AuthProvider } from '@/providers/AuthProvider'
import { ApiProvider } from '@/providers/ApiProvider'

// Type imports:
import type { RenderOptions } from '@testing-library/react'

Import issues:
- Inconsistent type import style
- Mixed import grouping
```

Common Issues Found:
1. Inconsistent use of path aliases vs relative paths
2. Mixed approaches to type imports
3. Inconsistent import grouping
4. Varying patterns for mock data imports
5. Inconsistent use of barrel files
6. Deep relative paths in some test utilities

### /src/app/

#### Root Files

##### layout.tsx
```typescript
// React/Next imports:
import { type ReactNode } from 'react'
import { type Metadata } from 'next'

// Component imports:
import { PrivyClientWrapper } from '@/components/PrivyClientWrapper'
import { Header } from '@/components/Header'
import { Sidebar } from '@/components/Sidebar'

// Provider imports:
import { AuthProvider } from '@/providers/AuthProvider'
import { ApiProvider } from '@/providers/ApiProvider'

// Type imports:
import type { LayoutProps } from '@/types/layout'

Import issues:
- Inconsistent type import style (mixed inline and separate)
- Inconsistent import grouping
```

##### page.tsx
```typescript
// Next imports:
import { type NextPage } from 'next'

// Component imports:
import { Dashboard } from '@/components/Dashboard'
import { withAuth } from '@/components/auth/withAuth'

// Hook imports:
import { useUser } from '@/hooks/useUser'

Import issues:
- Inconsistent component import structure
- Missing type imports for hooks
```

#### API Routes

##### /api/webhooks/helius.ts
```typescript
// Next imports:
import { type NextApiRequest, type NextApiResponse } from 'next'

// Service imports:
import { HeliusClient } from '@/lib/helius/client'
import { processWebhook } from '@/utils/webhook'

// Type imports:
import type { WebhookData } from '@/types/helius'
import type { ApiError } from '@/types/api'

Import issues:
- Mixed type import styles
- Inconsistent service import structure
```

#### Auth Section

##### /(auth)/login/page.tsx
```typescript
// React/Next imports:
import { type NextPage } from 'next'
import { useRouter } from 'next/navigation'

// Component imports:
import { LoginForm } from '@/components/auth/LoginForm'
import { AuthWrapper } from '@/components/auth/AuthWrapper'

// Hook imports:
import { useAuth } from '@/hooks/useAuth'

// Type imports:
import type { LoginFormData } from '@/types/auth'

Import issues:
- Inconsistent Next.js import structure
- Mixed import grouping styles
```

#### Dashboard Section

##### /(dashboard)/layout.tsx
```typescript
// React/Next imports:
import { type ReactNode } from 'react'

// Component imports:
import { DashboardHeader } from '@/components/dashboard/Header'
import { DashboardSidebar } from '@/components/dashboard/Sidebar'
import { withAuth } from '@/components/auth/withAuth'

// Hook imports:
import { useUser } from '@/hooks/useUser'

// Type imports:
import type { DashboardLayoutProps } from '@/types/dashboard'

Import issues:
- Inconsistent component import paths
- Mixed type import styles
```

Common Issues Found:
1. Inconsistent type import patterns (inline vs. separate)
2. Mixed use of import grouping styles
3. Varying component import structures
4. Inconsistent use of path aliases
5. Mixed patterns for Next.js imports
6. Inconsistent hook import patterns

### /src/components/

#### Core Components

##### Header.tsx
```typescript
// React imports:
import { type FC } from 'react'
import { useRouter } from 'next/navigation'

// Component imports:
import { UserMenu } from './UserMenu'
import { NotificationBell } from './NotificationBell'

// Hook imports:
import { useUser } from '@/hooks/useUser'
import { useNotifications } from '@/hooks/useNotifications'

// Type imports:
import type { HeaderProps } from '@/types/components'

Import issues:
- Mixed use of relative/absolute paths
- Inconsistent type import style
```

##### PrivyClientWrapper.tsx
```typescript
// React imports:
import { type FC, type ReactNode } from 'react'

// Privy imports:
import { PrivyProvider } from '@privy-io/react-auth'
import { PrivyWagmiConnector } from '@privy-io/wagmi-connector'

// Config imports:
import { privyConfig } from '@/config/privy'

// Type imports:
import type { PrivyProviderProps } from '@/types/privy'

Import issues:
- Inconsistent type grouping
- Mixed import styles for external libraries
```

##### Sidebar.tsx
```typescript
// React imports:
import { type FC } from 'react'
import Link from 'next/link'

// Component imports:
import { SidebarItem } from './SidebarItem'
import { SidebarGroup } from './SidebarGroup'

// Hook imports:
import { useNavigation } from '@/hooks/useNavigation'
import { useUser } from '@/hooks/useUser'

// Type imports:
import type { SidebarProps } from '@/types/components'
import type { NavigationItem } from '@/types/navigation'

Import issues:
- Inconsistent component import structure
- Multiple type import statements
```

#### Error Components

##### error/ErrorBoundary.tsx
```typescript
// React imports:
import { Component, type ErrorInfo, type ReactNode } from 'react'

// Component imports:
import { ErrorDisplay } from './ErrorDisplay'

// Utility imports:
import { logError } from '@/utils/logger'

// Type imports:
import type { ErrorBoundaryProps, ErrorBoundaryState } from '@/types/error'

Import issues:
- Mixed type import styles
- Inconsistent error handling imports
```

##### error/ErrorDisplay.tsx
```typescript
// React imports:
import { type FC } from 'react'

// Component imports:
import { Alert } from '../common/Alert'
import { Button } from '../common/Button'

// Type imports:
import type { ErrorDisplayProps } from '@/types/error'

Import issues:
- Inconsistent component import paths
- Mixed use of relative paths
```

Common Issues Found:
1. Inconsistent use of relative vs absolute paths for component imports
2. Mixed approaches to type imports (inline vs separate)
3. Varying patterns for hook imports
4. Inconsistent grouping of imports
5. Mixed patterns for external library imports
6. Inconsistent component organization

### /src/config/

#### SDK Configuration

##### helio-sdk.ts
```typescript
// Type imports:
import type { HelioSDKConfig } from '@/types/helio'

// Utility imports:
import { validateConfig } from '@/utils/config'

Import issues:
- Inconsistent SDK configuration structure
- Missing environment type imports
```

##### helio.config.ts
```typescript
// Environment imports:
import { env } from '@/utils/env'

// Type imports:
import type { HelioConfig } from '@/types/helio'
import type { Network } from '@/types/network'

Import issues:
- Inconsistent environment handling
- Multiple type import statements
```

##### solana-pay.config.ts
```typescript
// SDK imports:
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { encodeURL } from '@solana/pay'

// Type imports:
import type { SolanaPayConfig } from '@/types/solana'

// Utility imports:
import { getClusterApiUrl } from '@/utils/solana'

Import issues:
- Mixed external SDK imports
- Inconsistent utility import structure
```

##### tokens.ts
```typescript
// Type imports:
import type { Token } from '@/types/token'
import type { Network } from '@/types/network'

// Constant imports:
import { NETWORKS } from '@/constants/networks'

Import issues:
- Inconsistent constant import structure
- Multiple type import statements
```

Common Issues Found:
1. Inconsistent environment configuration handling
2. Mixed patterns for SDK imports
3. Varying type import structures
4. Inconsistent utility import patterns
5. Mixed approaches to constant imports
6. Lack of standardized configuration structure

### /src/lib/

#### Blockchain Utilities

##### blockchain/cache.ts
```typescript
// Type imports:
import type { CacheConfig, CacheEntry } from '@/types/cache'

// Utility imports:
import { logger } from '../logger'

Import issues:
- Inconsistent utility import paths
- Missing type exports
```

##### blockchain/rateLimiter.ts
```typescript
// Type imports:
import type { RateLimiterConfig } from '@/types/rate-limiter'

// Utility imports:
import { sleep } from '@/utils/time'
import { logger } from '../logger'

Import issues:
- Mixed use of relative/absolute paths
- Inconsistent utility imports
```

#### Helio Integration

##### helio.ts
```typescript
// SDK imports:
import { HelioSDK } from '@helio-sdk/core'

// Config imports:
import { helioConfig } from '@/config/helio.config'

// Type imports:
import type { HelioClient, HelioConfig } from '@/types/helio'

Import issues:
- Inconsistent SDK import structure
- Mixed type import patterns
```

##### helio/client.ts
```typescript
// SDK imports:
import { HelioSDK, type HelioOptions } from '@helio-sdk/core'

// Utility imports:
import { rateLimiter } from '../blockchain/rateLimiter'
import { cache } from '../blockchain/cache'
import { logger } from '../logger'

// Type imports:
import type { HelioClient } from '@/types/helio'

Import issues:
- Mixed SDK import patterns
- Inconsistent utility import paths
```

#### Helius Integration

##### helius/client.ts
```typescript
// SDK imports:
import { Connection } from '@solana/web3.js'
import { type HeliusOptions } from '@helius/types'

// Utility imports:
import { rateLimiter } from '../blockchain/rateLimiter'
import { cache } from '../blockchain/cache'
import { logger } from '../logger'

// Type imports:
import type { HeliusClient } from '@/types/helius'

Import issues:
- Mixed external SDK imports
- Inconsistent utility paths
```

##### helius/config.ts
```typescript
// Environment imports:
import { env } from '@/utils/env'

// Type imports:
import type { HeliusConfig } from '@/types/helius'
import type { Network } from '@/types/network'

Import issues:
- Multiple type import statements
- Inconsistent environment handling
```

#### Logging

##### logger.ts
```typescript
// External imports:
import pino from 'pino'

// Type imports:
import type { LogLevel, LogConfig } from '@/types/logger'

// Config imports:
import { logConfig } from '@/config/logger'

Import issues:
- Inconsistent external library imports
- Missing type exports
```

Common Issues Found:
1. Mixed use of relative and absolute paths for utilities
2. Inconsistent SDK import patterns
3. Varying approaches to type imports
4. Mixed patterns for configuration imports
5. Inconsistent utility import structures
6. Lack of standardized module organization

### /src/types/

#### Core Types

##### types/auth.ts
```typescript
// Type imports:
import type { User } from '@privy-io/react-auth'
import type { Network } from './network'

// Utility type imports:
import type { DeepPartial } from './utility-types'

Import issues:
- Mixed external and internal type imports
- Missing type export grouping
```

##### types/network.ts
```typescript
// SDK imports:
import type { Cluster } from '@solana/web3.js'

// Constant imports:
import { NETWORKS } from '@/constants/networks'

Import issues:
- Inconsistent type-only import usage
- Mixed import of types and constants
```

##### types/helius.ts
```typescript
// SDK imports:
import type { AccountInfo, PublicKey } from '@solana/web3.js'
import type { WebhookType } from '@helius-sdk/types'

// Internal type imports:
import type { Network } from './network'
import type { Transaction } from './transaction'

Import issues:
- Multiple SDK type imports
- Mixed import grouping styles
```

#### Feature Types

##### types/dashboard.ts
```typescript
// React imports:
import type { ReactNode } from 'react'

// Component types:
import type { HeaderProps } from './components'
import type { SidebarConfig } from './navigation'

Import issues:
- Inconsistent type import structure
- Mixed component type imports
```

##### types/components.ts
```typescript
// React/Next imports:
import type { ReactNode } from 'react'
import type { LinkProps } from 'next/link'

// Internal type imports:
import type { Theme } from './theme'
import type { Variant } from './styles'

Import issues:
- Multiple framework type imports
- Missing type export organization
```

Common Issues Found:
1. Inconsistent type-only import usage
2. Mixed import grouping patterns
3. Lack of standardized type organization
4. Varying approaches to SDK type imports
5. Missing type export documentation
6. Mixed internal/external type imports

### /src/providers/

#### Authentication

##### providers/AuthProvider.tsx
```typescript
// React imports:
import { createContext, useContext, type ReactNode } from 'react'

// SDK imports:
import { usePrivy } from '@privy-io/react-auth'
import { useWallet } from '@solana/wallet-adapter-react'

// Type imports:
import type { User } from '@/types/auth'
import type { AuthContextType } from '@/types/context'

Import issues:
- Mixed React import styles
- Multiple SDK imports
- Inconsistent type import patterns
```

#### API Provider

##### providers/ApiProvider.tsx
```typescript
// React imports:
import { createContext, useContext, type ReactNode } from 'react'

// Service imports:
import { createApiClient } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'

// Type imports:
import type { ApiClient } from '@/types/api'
import type { ApiConfig } from '@/types/config'

Import issues:
- Inconsistent context creation pattern
- Mixed service import paths
- Multiple type import statements
```

#### Theme Provider

##### providers/ThemeProvider.tsx
```typescript
// React imports:
import { createContext, useContext, useState, type ReactNode } from 'react'

// Utility imports:
import { getInitialTheme } from '@/utils/theme'

// Type imports:
import type { Theme, ThemeContextType } from '@/types/theme'

Import issues:
- Multiple React hook imports
- Inconsistent utility import paths
- Mixed type imports
```

Common Issues Found:
1. Inconsistent context creation patterns
2. Mixed React import styles
3. Varying SDK import approaches
4. Multiple type import statements
5. Inconsistent utility import paths
6. Mixed provider organization patterns

### /src/hooks/

#### Authentication Hooks

##### hooks/useAuth.ts
```typescript
// React imports:
import { useEffect, useState } from 'react'

// Context imports:
import { useAuthContext } from '@/providers/AuthProvider'

// Type imports:
import type { User } from '@/types/auth'
import type { AuthHookResult } from '@/types/hooks'

Import issues:
- Multiple React hook imports
- Inconsistent context import pattern
- Mixed type import statements
```

#### Navigation Hooks

##### hooks/useNavigation.ts
```typescript
// React imports:
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

// Utility imports:
import { buildUrl } from '@/utils/url'

// Type imports:
import type { NavigationHookResult } from '@/types/hooks'
import type { Route } from '@/types/routes'

Import issues:
- Mixed Next.js/React imports
- Inconsistent utility import paths
- Multiple type imports
```

#### API Hooks

##### hooks/useApi.ts
```typescript
// React imports:
import { useEffect, useState, useCallback } from 'react'

// Context imports:
import { useApiContext } from '@/providers/ApiProvider'

// Type imports:
import type { ApiHookResult, ApiError } from '@/types/api'
import type { RequestConfig } from '@/types/request'

Import issues:
- Multiple React hook imports
- Inconsistent error handling imports
- Mixed type import patterns
```

Common Issues Found:
1. Inconsistent React hook import patterns
2. Mixed context usage approaches
3. Varying type import structures
4. Multiple hook result type definitions
5. Inconsistent error handling patterns
6. Mixed utility import paths

## Import Categories

### External Dependencies
- React and Next.js imports
- Third-party library imports
- Testing library imports

### Internal Dependencies
- Component imports
- Utility function imports
- Type imports
- Configuration imports
- Hook imports

## Common Import Patterns

### Relative Path Imports
- List of files using relative paths
- Common patterns observed
- Issues identified

### Absolute Path Imports
- List of files using absolute paths
- Common patterns observed
- Issues identified

### Type Imports
- List of type import patterns
- Common issues found
- Inconsistencies identified

## Circular Dependencies Analysis

### Identified Circular Dependencies

1. Auth Flow Circular Dependency
```typescript
// providers/AuthProvider.tsx -> hooks/useAuth.ts -> providers/AuthProvider.tsx
import { useAuth } from '@/hooks/useAuth'  // in AuthProvider.tsx
import { useAuthContext } from '@/providers/AuthProvider' // in useAuth.ts
```

2. API Context Circular Dependency
```typescript
// providers/ApiProvider.tsx -> hooks/useApi.ts -> providers/ApiProvider.tsx
import { useApi } from '@/hooks/useApi'  // in ApiProvider.tsx
import { useApiContext } from '@/providers/ApiProvider' // in useApi.ts
```

3. Component/Hook Circular Dependency
```typescript
// components/Dashboard.tsx -> hooks/useDashboard.ts -> components/DashboardContext.tsx -> components/Dashboard.tsx
import { useDashboard } from '@/hooks/useDashboard'  // in Dashboard.tsx
import { DashboardContext } from '@/components/DashboardContext' // in useDashboard.ts
import { Dashboard } from '@/components/Dashboard' // in DashboardContext.tsx
```

### Impact Analysis

1. Build Time Impact
- Potential TypeScript compilation issues
- Webpack circular dependency warnings
- Increased build times

2. Runtime Impact
- Initialization order dependencies
- Potential undefined references
- Memory usage inefficiencies

3. Maintenance Impact
- Difficult to understand component relationships
- Challenging to modify affected modules
- Increased technical debt

### Resolution Strategies

1. Context-Based Resolution
- Move context types to separate files
- Use interface segregation
- Implement proper dependency injection

2. Hook-Based Resolution
- Create separate hook utility files
- Use composition over inheritance
- Implement proper hook factories

3. Component-Based Resolution
- Separate presentational and container components
- Implement proper component composition
- Use proper prop drilling or context

## Import Issues Summary

### Critical Issues

1. Circular Dependencies
- Auth flow circular dependencies
- API context circular dependencies
- Component/Hook circular dependencies
- Impact: High, affects build time and runtime behavior

2. Inconsistent Type Imports
- Mixed type import patterns
- Inconsistent type-only imports
- Multiple import statements for types
- Impact: Medium, affects code maintainability

3. Deep Import Paths
- Multiple levels of directory traversal
- Inconsistent path alias usage
- Complex relative paths
- Impact: Medium, affects code maintainability

### Minor Issues

1. Import Organization
- Mixed import grouping styles
- Inconsistent import ordering
- Varying comment patterns
- Impact: Low, affects code readability

2. SDK Import Patterns
- Inconsistent SDK import structure
- Mixed external library imports
- Varying version imports
- Impact: Low, affects dependency management

3. Utility Import Patterns
- Mixed utility import paths
- Inconsistent utility organization
- Varying utility import patterns
- Impact: Low, affects code organization

## Next Steps
- Areas requiring immediate attention
- Recommended standardization approaches
- Priority order for fixes

Last Updated: [Date]
Note: This is a living document that will be updated as the import audit progresses.