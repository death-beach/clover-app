# Helius Integration Guide

## Overview

Helius integration provides:
- Real-time transaction monitoring
- Payment confirmation
- Webhook notifications
- Transaction parsing

## Prerequisites

1. Helius Account
2. API Key
3. Webhook endpoint
4. RPC endpoints configured

## Setup Process

### 1. Helius Configuration

1. Create Account
   ```
   Account Type: Business
   Network: Solana
   ```

2. Get API Credentials
   ```
   HELIUS_API_KEY={YOUR_API_KEY}
   HELIUS_RPC_URL=https://mainnet.helius-rpc.com/{YOUR_API_KEY}
   ```

3. Configure Webhook
   ```
   Webhook URL: https://your-domain.com/api/webhooks/helius
   Event Types: ['transaction']
   ```

## Core Implementation

### 1. Client Setup

```typescript
import { HeliusClient } from './lib/helius/client';

const helius = new HeliusClient({
  apiKey: process.env.HELIUS_API_KEY,
  environment: process.env.NODE_ENV
});
```

### 2. Transaction Monitoring

```typescript
// Monitor Address
async function monitorWallet(address: string) {
  await helius.subscribeAddress({
    address,
    webhook: process.env.HELIUS_WEBHOOK_URL,
    transactionTypes: ['token-transfer']
  });
}

// Parse Transaction
async function parseTransaction(signature: string) {
  const parsed = await helius.parseTransaction(signature);
  return {
    amount: parsed.amount,
    sender: parsed.sender,
    recipient: parsed.recipient,
    mint: parsed.mint
  };
}
```

### 3. Payment Confirmation

```typescript
async function confirmPayment(signature: string) {
  // Get transaction details
  const tx = await helius.getTransaction(signature);
  
  // Verify transaction
  if (await verifyTransaction(tx)) {
    // Update payment status
    await updatePaymentStatus(tx.reference, 'confirmed');
  }
}

async function verifyTransaction(tx: HeliusTransaction) {
  return (
    tx.confirmations >= REQUIRED_CONFIRMATIONS &&
    tx.successful &&
    validateAmount(tx.amount)
  );
}
```

## Webhook Implementation

### 1. Webhook Handler

```typescript
async function handleHeliusWebhook(
  payload: HeliusWebhookPayload,
  signature: string
) {
  // Verify webhook signature
  if (!verifyWebhookSignature(payload, signature)) {
    throw new Error('Invalid webhook signature');
  }

  // Process transaction
  const tx = payload.transaction;
  switch (tx.type) {
    case 'token-transfer':
      await handleTokenTransfer(tx);
      break;
    // Handle other types...
  }
}
```

### 2. Transaction Processing

```typescript
async function handleTokenTransfer(tx: TokenTransfer) {
  // Verify USDC transfer
  if (tx.mint === USDC_MINT) {
    // Find matching payment
    const payment = await findPaymentByReference(tx.reference);
    if (payment) {
      // Confirm payment
      await confirmPayment(tx.signature);
    }
  }
}
```

## Error Handling

### 1. Transaction Errors

```typescript
async function handleTransactionError(error: any) {
  if (error.code === 'NOT_FOUND') {
    // Handle missing transaction
    await retryTransaction();
  } else if (error.code === 'INVALID_SIGNATURE') {
    // Handle invalid signature
    await logInvalidTransaction();
  }
}
```

### 2. Webhook Errors

```typescript
function handleWebhookError(error: any) {
  logger.error('Helius webhook error', {
    error: error.message,
    code: error.code,
    timestamp: new Date()
  });

  if (isRetryable(error)) {
    await enqueueForRetry(error.payload);
  }
}
```

## Testing

### 1. Test Environment

```typescript
const testHelius = new HeliusClient({
  apiKey: process.env.HELIUS_TEST_API_KEY,
  environment: 'devnet'
});
```

### 2. Test Cases

```typescript
describe('Helius Integration', () => {
  it('should parse transaction', async () => {
    const tx = await testHelius.parseTransaction(TEST_SIGNATURE);
    expect(tx.mint).toBe(USDC_MINT);
    expect(tx.amount).toBe(TEST_AMOUNT);
  });

  it('should verify webhook', () => {
    const valid = verifyWebhookSignature(TEST_PAYLOAD, TEST_SIGNATURE);
    expect(valid).toBe(true);
  });
});
```

## Monitoring

### 1. Health Checks

```typescript
async function checkHeliusHealth() {
  try {
    await helius.getHealth();
    return { status: 'healthy' };
  } catch (error) {
    return { status: 'unhealthy', error };
  }
}
```

### 2. Metrics

```typescript
const metrics = {
  transactions: new Counter('helius_transactions_processed'),
  webhooks: new Counter('helius_webhooks_received'),
  errors: new Counter('helius_errors')
};
```

## Security

### 1. Webhook Security

```typescript
function verifyWebhookSignature(
  payload: any,
  signature: string
): boolean {
  const computed = crypto
    .createHmac('sha256', process.env.HELIUS_WEBHOOK_SECRET)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(computed),
    Buffer.from(signature)
  );
}
```

### 2. Transaction Validation

```typescript
function validateTransaction(tx: HeliusTransaction): boolean {
  return (
    validateSignature(tx.signature) &&
    validateAmount(tx.amount) &&
    validateMint(tx.mint) &&
    validateAddresses(tx)
  );
}
```

## Best Practices

1. **Transaction Monitoring**
   - Monitor specific addresses
   - Filter relevant transactions
   - Implement retry logic

2. **Webhook Handling**
   - Verify signatures
   - Process asynchronously
   - Implement idempotency

3. **Error Management**
   - Log all errors
   - Implement retries
   - Monitor error rates

## Troubleshooting

### Common Issues

1. **Missing Transactions**
   - Check transaction signature
   - Verify network status
   - Check confirmation status

2. **Webhook Failures**
   - Verify webhook URL
   - Check signature verification
   - Monitor webhook logs

3. **API Issues**
   - Check API key
   - Verify rate limits
   - Monitor API status

### Support Resources

1. Helius Documentation
2. Developer Dashboard
3. Support Channels
4. Status Page