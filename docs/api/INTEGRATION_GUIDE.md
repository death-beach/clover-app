# Integration Guide

## Overview

This guide walks through the process of integrating the Clover USDC Payment Gateway into your application. The integration consists of three main components:

1. Payment Processing
2. Transaction Management
3. Settlement Handling

## Prerequisites

Before starting the integration:

1. Complete merchant onboarding
2. Obtain API credentials
3. Set up webhook endpoints
4. Configure test environment

## Quick Start

### 1. Installation

```bash
# NPM
npm install @clover-usdc/sdk

# Yarn
yarn add @clover-usdc/sdk
```

### 2. Configuration

```typescript
import { CloverUSDCClient } from '@clover-usdc/sdk';

const client = new CloverUSDCClient({
  apiKey: 'your_api_key',
  environment: 'development', // or 'production'
  merchantId: 'your_merchant_id',
  webhookSecret: 'your_webhook_secret'
});
```

## Payment Flow Implementation

### 1. Create Payment Request

```typescript
// Generate QR code for payment
const payment = await client.payments.create({
  amount: 99.99,
  currency: 'USDC',
  orderId: 'ORDER_123',
  metadata: {
    customerRef: 'CUST_456'
  }
});

// Get QR code URL
const qrCodeUrl = payment.qrCode;
```

### 2. Monitor Payment Status

```typescript
// Option 1: Webhook listener
app.post('/webhooks/payment', (req, res) => {
  const event = client.webhooks.constructEvent(
    req.body,
    req.headers['x-signature']
  );

  switch (event.type) {
    case 'PAYMENT_STATUS_UPDATE':
      handlePaymentUpdate(event.data);
      break;
    // Handle other events...
  }

  res.sendStatus(200);
});

// Option 2: Polling
const status = await client.payments.getStatus(paymentId);
```

### 3. Handle Transaction Completion

```typescript
async function handlePaymentUpdate(data) {
  if (data.status === 'COMPLETED') {
    // Update order status
    await updateOrder(data.orderId);
    
    // Record transaction
    await recordTransaction({
      paymentId: data.paymentId,
      signature: data.signature,
      amount: data.amount
    });
  }
}
```

## Transaction Management

### 1. List Transactions

```typescript
// Get recent transactions
const transactions = await client.transactions.list({
  startDate: '2024-01-01',
  endDate: '2024-01-31',
  limit: 20,
  offset: 0
});

// Get transaction details
const details = await client.transactions.get(transactionId);
```

### 2. Transaction Reconciliation

```typescript
async function reconcileTransactions() {
  const transactions = await client.transactions.list({
    status: 'COMPLETED',
    startDate: getStartOfDay(),
    endDate: getEndOfDay()
  });

  for (const tx of transactions) {
    await validateTransaction(tx);
    await updateAccountingSystem(tx);
  }
}
```

## Settlement Integration

### 1. Configure Auto-settlement

```typescript
await client.merchant.updateSettings({
  autoSettlement: true,
  settlementSchedule: {
    frequency: 'DAILY',
    time: '23:00:00',
    minimumAmount: 100
  }
});
```

### 2. Manual Settlement

```typescript
// Initiate manual settlement
const transfer = await client.transfers.initiate({
  amount: 1000,
  fromWallet: mainWalletAddress,
  toWallet: offrampWalletAddress
});

// Check transfer status
const status = await client.transfers.getStatus(transfer.transferId);
```

## Error Handling

### 1. API Errors

```typescript
try {
  await client.payments.create({...});
} catch (error) {
  if (error.code === 'PAY_001') {
    // Handle invalid payment amount
  } else if (error.code === 'AUTH_001') {
    // Handle authentication error
  }
  // Handle other errors...
}
```

### 2. Webhook Errors

```typescript
function handleWebhookError(error) {
  logger.error('Webhook processing failed', {
    error: error.message,
    code: error.code,
    eventType: error.eventType
  });

  // Implement retry logic
  if (isRetryable(error)) {
    await enqueueForRetry(error.event);
  }
}
```

## Testing

### 1. Test Environment

```typescript
const testClient = new CloverUSDCClient({
  apiKey: 'test_api_key',
  environment: 'development',
  merchantId: 'test_merchant'
});
```

### 2. Test Transactions

```typescript
// Create test payment
const testPayment = await testClient.payments.create({
  amount: 10,
  currency: 'USDC',
  orderId: 'TEST_ORDER_123'
});

// Simulate payment completion
await testClient.test.simulatePayment({
  paymentId: testPayment.paymentId,
  status: 'COMPLETED'
});
```

### 3. Test Webhooks

```typescript
// Generate test webhook
await testClient.test.generateWebhook({
  type: 'PAYMENT_STATUS_UPDATE',
  data: {
    paymentId: 'test_payment_id',
    status: 'COMPLETED'
  }
});
```

## Security Best Practices

1. **API Key Management**
   - Rotate keys regularly
   - Use environment variables
   - Never commit keys to code

2. **Webhook Security**
   - Verify signatures
   - Use HTTPS endpoints
   - Implement timeouts

3. **Error Handling**
   - Log security events
   - Monitor for unusual activity
   - Implement rate limiting

## Monitoring

### 1. Health Checks

```typescript
// Check API status
const health = await client.system.health();

// Check webhook configuration
const webhookStatus = await client.webhooks.verify();
```

### 2. Metrics

```typescript
// Get integration metrics
const metrics = await client.metrics.get({
  startDate: '2024-01-01',
  endDate: '2024-01-31'
});
```

## Support

For integration support:

1. Check documentation
2. Review error codes
3. Contact support team
4. Monitor status page