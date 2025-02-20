# Webhooks

## Overview

The Clover USDC Payment Gateway uses webhooks to notify your system about real-time events. There are three main webhook sources:

1. Helius - Transaction monitoring
2. Helio - Off-ramp status updates
3. Internal - System events

## Security

### Authentication
All webhooks include an HMAC signature in the `X-Signature` header:

```typescript
const signature = HMAC_SHA256(webhookSecret, JSON.stringify(body));
```

### Verification Example
```typescript
const crypto = require('crypto');

function verifyWebhook(body: string, signature: string, secret: string): boolean {
  const computed = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(computed),
    Buffer.from(signature)
  );
}
```

## Helius Transaction Webhooks

### Configuration
Endpoint: `/api/webhooks/helius`

### Events

#### Transaction Detected
```typescript
{
  type: "TRANSACTION_DETECTED",
  signature: string;
  timestamp: number;
  accountKeys: string[];
  data: {
    amount: number;
    sender: string;
    recipient: string;
    mint: string;
  };
}
```

#### Transaction Confirmed
```typescript
{
  type: "TRANSACTION_CONFIRMED",
  signature: string;
  timestamp: number;
  slot: number;
  confirmations: number;
  data: {
    amount: number;
    sender: string;
    recipient: string;
    mint: string;
  };
}
```

## Helio Off-ramp Webhooks

### Configuration
Endpoint: `/api/webhooks/helio`

### Events

#### Transfer Initiated
```typescript
{
  type: "TRANSFER_INITIATED",
  transferId: string;
  timestamp: number;
  data: {
    merchantId: string;
    amount: number;
    fromWallet: string;
    toWallet: string;
    estimatedCompletionTime: string;
  };
}
```

#### Transfer Completed
```typescript
{
  type: "TRANSFER_COMPLETED",
  transferId: string;
  timestamp: number;
  data: {
    merchantId: string;
    amount: number;
    fromWallet: string;
    toWallet: string;
    completionTime: string;
    transactionId: string;
  };
}
```

#### Transfer Failed
```typescript
{
  type: "TRANSFER_FAILED",
  transferId: string;
  timestamp: number;
  data: {
    merchantId: string;
    amount: number;
    fromWallet: string;
    toWallet: string;
    error: {
      code: string;
      message: string;
    };
  };
}
```

## Internal System Webhooks

### Configuration
Endpoint: Configured per merchant

### Events

#### Payment Status Update
```typescript
{
  type: "PAYMENT_STATUS_UPDATE",
  paymentId: string;
  timestamp: number;
  data: {
    status: "PENDING" | "COMPLETED" | "FAILED";
    orderId: string;
    amount: number;
    signature?: string;
  };
}
```

#### Settlement Status
```typescript
{
  type: "SETTLEMENT_STATUS",
  settlementId: string;
  timestamp: number;
  data: {
    status: "SCHEDULED" | "PROCESSING" | "COMPLETED" | "FAILED";
    amount: number;
    merchantId: string;
    error?: {
      code: string;
      message: string;
    };
  };
}
```

## Best Practices

1. **Webhook Processing**
   - Implement idempotency checks
   - Process webhooks asynchronously
   - Store raw webhook data
   - Implement retry logic

2. **Security**
   - Always verify signatures
   - Use HTTPS endpoints
   - Implement request timeouts
   - Monitor webhook latency

3. **Error Handling**
   - Return 2xx for received webhooks
   - Log processing errors
   - Implement dead letter queues
   - Monitor failed webhooks

## Retry Logic

Webhooks are retried on failure with exponential backoff:

- 1st retry: 30 seconds
- 2nd retry: 2 minutes
- 3rd retry: 5 minutes
- 4th retry: 15 minutes
- 5th retry: 30 minutes
- Final retry: 1 hour

After all retries are exhausted, the webhook is moved to a dead letter queue.

## Monitoring

### Metrics Tracked
- Webhook delivery rate
- Processing success rate
- Average processing time
- Retry counts
- Error rates

### Alerts
- High error rate
- Processing delays
- Multiple retries
- Signature verification failures

## Testing

Test webhooks are available in development:

1. Enable test mode in dashboard
2. Use test endpoints
3. Generate test events
4. Verify processing

### Test Event Generation
```http
POST /api/test/webhooks/generate
Content-Type: application/json

{
  "type": "TRANSACTION_CONFIRMED",
  "data": {
    // Test event data
  }
}
```