# Blockchain Utilities Documentation

## Overview
This document describes the blockchain utilities implemented for enhanced Helius integration, including retry mechanisms, caching, rate limiting, and logging functionalities.

## Features
- Automatic retry with exponential backoff
- In-memory caching with TTL
- Rate limiting protection
- Comprehensive logging
- Common blockchain operations utilities

## Installation
All utilities are located in the `src/lib/blockchain` directory. No additional installation is required as they are part of the project's codebase.

## Usage Examples

### Basic Setup
```typescript
import { Connection } from '@solana/web3.js';
import { BlockchainUtils } from './lib/blockchain/utils';
import { logger } from './lib/logger';

// Initialize
const connection = new Connection(process.env.HELIUS_RPC_URL);
const blockchain = new BlockchainUtils(connection);
```

### Fetching Transaction Data
```typescript
try {
  const transaction = await blockchain.getTransaction('your-tx-signature');
  logger.info('Transaction fetched', { signature: 'your-tx-signature' });
} catch (error) {
  logger.error('Failed to fetch transaction', { error });
}
```

### Getting Account Balance
```typescript
try {
  const balance = await blockchain.getBalance('wallet-address');
  logger.info('Balance fetched', { address: 'wallet-address', balance });
} catch (error) {
  logger.error('Failed to fetch balance', { error });
}
```

### Fetching Token Accounts
```typescript
try {
  const tokens = await blockchain.getTokenAccounts('owner-address');
  logger.info('Token accounts fetched', { 
    owner: 'owner-address', 
    count: tokens.length 
  });
} catch (error) {
  logger.error('Failed to fetch token accounts', { error });
}
```

## Utility Components

### Retry Mechanism
The retry utility provides automatic retrying of failed operations with exponential backoff.

```typescript
import { withRetry } from './lib/blockchain/retry';

// Custom retry options
const options = {
  maxAttempts: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffFactor: 2
};

// Usage
const result = await withRetry(async () => {
  // Your async operation here
}, options);
```

### Caching
The caching system provides temporary storage of frequently accessed data.

```typescript
import { BlockchainCache } from './lib/blockchain/cache';

const cache = new BlockchainCache();

// Store data
cache.set('key', data, { ttl: 5 * 60 * 1000 }); // 5 minutes TTL

// Retrieve data
const data = cache.get('key');
```

### Rate Limiting
Protects against API rate limits by controlling request frequency.

```typescript
import { RateLimiter } from './lib/blockchain/rateLimiter';

// 50 requests per second
const rateLimiter = new RateLimiter(1000, 50);

// Usage
await rateLimiter.acquire();
// Make your API call here
```

### Logging
Structured logging system with different severity levels.

```typescript
import { logger } from './lib/logger';

// Different log levels
logger.debug('Debug message', { context: 'additional info' });
logger.info('Info message', { data: 'some data' });
logger.warn('Warning message', { warning: 'something suspicious' });
logger.error('Error message', { error: 'error details' });
```

## Error Handling
All utilities include comprehensive error handling:

```typescript
try {
  // Your blockchain operation
  const result = await blockchain.someOperation();
} catch (error) {
  if (error instanceof RetryError) {
    logger.error('Operation failed after multiple retries', {
      attempts: error.attempts,
      lastError: error.lastError
    });
  } else {
    logger.error('Unexpected error', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
```

## Best Practices

1. **Always use logging**
   ```typescript
   logger.info('Operation starting', { context: 'your-context' });
   // Your operation
   logger.info('Operation completed', { result: 'success' });
   ```

2. **Handle errors appropriately**
   ```typescript
   try {
     // Your code
   } catch (error) {
     logger.error('Operation failed', {
       error: error instanceof Error ? error.message : 'Unknown error',
       context: 'your-context'
     });
     // Additional error handling
   }
   ```

3. **Use rate limiting for API calls**
   ```typescript
   await rateLimiter.acquire();
   // Make your API call
   ```

4. **Leverage caching for frequent requests**
   ```typescript
   let data = cache.get('key');
   if (!data) {
     data = await fetchData();
     cache.set('key', data, { ttl: 60000 }); // 1 minute cache
   }
   ```

## Configuration
The utilities can be configured through environment variables:

```env
LOG_LEVEL=info                    # debug, info, warn, or error
CACHE_TTL=300000                 # Default cache TTL in milliseconds
RATE_LIMIT_WINDOW=1000           # Rate limit window in milliseconds
RATE_LIMIT_MAX_REQUESTS=50       # Maximum requests per window
```

## Maintenance
- Cache entries are automatically cleaned up based on their TTL
- Rate limiter automatically manages request queuing
- Logging can be adjusted based on environment needs

---

For additional support or questions, please refer to the main project documentation or create an issue in the repository.