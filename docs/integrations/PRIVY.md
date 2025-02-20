# Privy Integration Guide

## Overview

Privy integration provides:
- Initial merchant wallet authentication
- Secure wallet connection
- User verification
- Setup phase authentication

## Prerequisites

1. Privy Account
2. App ID
3. API Key
4. Configured redirect URLs

## Setup Process

### 1. Privy Configuration

1. Create App in Privy Dashboard
   ```
   App Name: USDC Payments
   Type: Web Application
   ```

2. Configure Settings
   ```
   Allowed Domains: your-domain.com
   Redirect URLs: https://your-domain.com/auth/callback
   ```

3. Get Credentials
   ```
   PRIVY_APP_ID={YOUR_APP_ID}
   PRIVY_API_KEY={YOUR_API_KEY}
   ```

## Implementation

### 1. Provider Setup

```typescript
import { PrivyProvider } from '@privy-io/react-auth';

function App() {
  return (
    <PrivyProvider
      appId={process.env.PRIVY_APP_ID}
      config={{
        loginMethods: ['wallet'],
        appearance: {
          theme: 'light',
          accentColor: '#676FFF'
        }
      }}
    >
      <YourApp />
    </PrivyProvider>
  );
}
```

### 2. Wallet Connection

```typescript
import { usePrivy } from '@privy-io/react-auth';

function WalletConnect() {
  const { login, user, isAuthenticated } = usePrivy();

  const handleConnect = async () => {
    try {
      await login();
      // Handle successful connection
    } catch (error) {
      // Handle connection error
    }
  };

  return (
    <button onClick={handleConnect}>
      {isAuthenticated ? 'Wallet Connected' : 'Connect Wallet'}
    </button>
  );
}
```

### 3. User Management

```typescript
// User Verification
async function verifyUser(user: PrivyUser) {
  const verified = await validateWalletOwnership(user.wallet.address);
  if (verified) {
    await createMerchantAccount(user);
  }
  return verified;
}

// Handle Authentication
function useAuthHandler() {
  const { user, isAuthenticated, logout } = usePrivy();

  useEffect(() => {
    if (isAuthenticated && user) {
      verifyUser(user)
        .catch(() => logout());
    }
  }, [isAuthenticated, user]);
}
```

## Security Features

### 1. Wallet Verification

```typescript
async function validateWalletOwnership(address: string) {
  const message = generateVerificationMessage();
  const signature = await requestSignature(message);
  return verifySignature(message, signature, address);
}
```

### 2. Session Management

```typescript
function usePrivySession() {
  const { user, logout } = usePrivy();

  useEffect(() => {
    const sessionTimeout = setTimeout(() => {
      logout();
    }, SETUP_SESSION_DURATION);

    return () => clearTimeout(sessionTimeout);
  }, [user]);
}
```

## Error Handling

### 1. Connection Errors

```typescript
async function handleWalletConnection() {
  try {
    await login();
  } catch (error) {
    if (error.code === 'USER_REJECTED') {
      showError('Please approve wallet connection');
    } else if (error.code === 'UNSUPPORTED_CHAIN') {
      showError('Please switch to Solana network');
    }
  }
}
```

### 2. Verification Errors

```typescript
async function handleVerification(user: PrivyUser) {
  try {
    await verifyUser(user);
  } catch (error) {
    if (error.code === 'INVALID_SIGNATURE') {
      await logout();
      showError('Wallet verification failed');
    }
  }
}
```

## Testing

### 1. Test Environment

```typescript
const testConfig = {
  appId: process.env.PRIVY_TEST_APP_ID,
  environment: 'development'
};
```

### 2. Test Cases

```typescript
describe('Privy Integration', () => {
  it('should connect wallet', async () => {
    const { result } = renderHook(() => usePrivy());
    await act(() => result.current.login());
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should verify wallet ownership', async () => {
    const user = mockPrivyUser();
    const verified = await verifyUser(user);
    expect(verified).toBe(true);
  });
});
```

## Monitoring

### 1. Connection Monitoring

```typescript
function useConnectionMonitor() {
  const { user, isAuthenticated } = usePrivy();

  useEffect(() => {
    if (isAuthenticated) {
      logConnection({
        userId: user.id,
        walletAddress: user.wallet.address,
        timestamp: new Date()
      });
    }
  }, [isAuthenticated]);
}
```

### 2. Error Tracking

```typescript
function trackPrivyError(error: any) {
  logger.error('Privy Error', {
    code: error.code,
    message: error.message,
    user: error.user?.id,
    timestamp: new Date()
  });
}
```

## Best Practices

1. **Wallet Security**
   - Verify signatures
   - Validate chain
   - Check wallet balance

2. **Session Management**
   - Limited setup session
   - Auto logout
   - Clear state on disconnect

3. **Error Handling**
   - User-friendly errors
   - Graceful fallbacks
   - Clear error messages

## Troubleshooting

### Common Issues

1. **Connection Failed**
   - Check wallet extension
   - Verify network
   - Check browser compatibility

2. **Verification Failed**
   - Check signature request
   - Verify message format
   - Validate wallet address

3. **Session Issues**
   - Check session duration
   - Verify token validity
   - Check local storage

### Support Resources

1. Privy Documentation
2. Developer Dashboard
3. Support Channels
4. Status Page