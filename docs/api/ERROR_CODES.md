# Error Codes and Handling

## Error Response Format

All API errors follow a standard format:

```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  }
}
```

## Error Code Reference

### Authentication Errors (AUTH_XXX)

| Code | Message | Description | Resolution |
|------|---------|-------------|------------|
| AUTH_001 | Invalid authentication | Missing or invalid token | Check token is valid and included in Authorization header |
| AUTH_002 | Token expired | Access token has expired | Refresh token using refresh endpoint |
| AUTH_003 | Invalid scope | Token lacks required permissions | Request appropriate permissions or use correct token |
| AUTH_004 | Invalid refresh token | Refresh token is invalid or expired | Re-authenticate to obtain new tokens |

### Payment Errors (PAY_XXX)

| Code | Message | Description | Resolution |
|------|---------|-------------|------------|
| PAY_001 | Invalid payment amount | Amount is zero or negative | Verify payment amount is positive |
| PAY_002 | Insufficient funds | Wallet lacks required USDC | Ensure wallet has sufficient balance |
| PAY_003 | Payment expired | Payment request timeout | Create new payment request |
| PAY_004 | Invalid currency | Unsupported currency specified | Use supported currency (USDC) |

### Transaction Errors (TXN_XXX)

| Code | Message | Description | Resolution |
|------|---------|-------------|------------|
| TXN_001 | Transaction not found | Invalid transaction ID | Verify transaction ID |
| TXN_002 | Invalid signature | Transaction signature invalid | Check transaction details |
| TXN_003 | Pending confirmation | Transaction not confirmed | Wait for confirmation |
| TXN_004 | Failed transaction | Transaction failed on chain | Check blockchain status |

### Merchant Errors (MER_XXX)

| Code | Message | Description | Resolution |
|------|---------|-------------|------------|
| MER_001 | Merchant not found | Invalid merchant ID | Verify merchant ID |
| MER_002 | Invalid KYC status | KYC not completed | Complete KYC process |
| MER_003 | Account suspended | Merchant account suspended | Contact support |
| MER_004 | Invalid wallet | Invalid wallet address | Verify wallet address |

### Transfer Errors (TRF_XXX)

| Code | Message | Description | Resolution |
|------|---------|-------------|------------|
| TRF_001 | Transfer failed | Off-ramp transfer failed | Check transfer details |
| TRF_002 | Invalid amount | Transfer amount invalid | Verify transfer amount |
| TRF_003 | Limit exceeded | Transfer limit exceeded | Check transfer limits |
| TRF_004 | Invalid destination | Invalid destination account | Verify bank details |

## Error Handling Best Practices

### 1. Implement Retry Logic

```typescript
async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (!isRetryable(error)) {
        throw error;
      }
      await delay(Math.pow(2, i) * 1000);
    }
  }
  
  throw lastError;
}

function isRetryable(error: any): boolean {
  const retryableCodes = ['TXN_003', 'PAY_003'];
  return retryableCodes.includes(error.code);
}
```

### 2. Error Logging

```typescript
function logError(error: any, context: any) {
  logger.error({
    code: error.code,
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString()
  });
}
```

### 3. User-Friendly Error Messages

```typescript
function getUserMessage(error: any): string {
  const messages = {
    PAY_001: "Please enter a valid payment amount",
    PAY_002: "Insufficient funds available",
    AUTH_002: "Please log in again",
    // ... more mappings
  };
  
  return messages[error.code] || "An unexpected error occurred";
}
```

## Troubleshooting Guide

### Authentication Issues

1. **Invalid Token**
   - Check token expiration
   - Verify token format
   - Confirm correct environment
   - Check required scopes

2. **Refresh Token Failures**
   - Verify refresh token validity
   - Check token expiration
   - Confirm correct refresh endpoint
   - Validate client credentials

### Payment Problems

1. **Failed Payments**
   - Check wallet balance
   - Verify transaction signature
   - Confirm network status
   - Check payment expiration

2. **Transaction Issues**
   - Verify transaction ID
   - Check confirmation status
   - Confirm blockchain status
   - Validate signature

### Transfer Failures

1. **Off-ramp Issues**
   - Verify bank details
   - Check transfer limits
   - Confirm KYC status
   - Validate wallet balance

2. **Settlement Problems**
   - Check settlement schedule
   - Verify minimum amounts
   - Confirm bank connection
   - Check transfer history

## Monitoring and Alerts

### Key Metrics to Monitor

1. **Error Rates**
   - Authentication failures
   - Payment failures
   - Transfer failures
   - API timeouts

2. **Response Times**
   - API latency
   - Blockchain confirmation times
   - Settlement processing times

### Alert Thresholds

1. **Critical Alerts**
   - Error rate > 5%
   - Response time > 5s
   - Failed settlements
   - Security violations

2. **Warning Alerts**
   - Error rate > 2%
   - Response time > 2s
   - Multiple retries
   - Rate limit warnings