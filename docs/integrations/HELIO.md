# Helio Integration Guide

## Overview

Helio integration provides:
- USDC to fiat off-ramp
- KYC verification
- Bank account connections
- Automated settlements

## Prerequisites

1. Helio Account
2. API Key
3. Webhook Secret
4. KYC approval
5. Bank account verification

## Setup Process

### 1. Helio Configuration

1. Create Account
   ```
   Business Type: Payment Processor
   Settlement Currency: USD
   Settlement Frequency: Daily
   ```

2. Get API Credentials
   ```
   HELIO_API_KEY={YOUR_API_KEY}
   HELIO_WEBHOOK_SECRET={YOUR_WEBHOOK_SECRET}
   ```

3. Configure Webhook
   ```
   Webhook URL: https://your-domain.com/api/webhooks/helio
   Events: ['transfer', 'settlement', 'kyc']
   ```

## Core Implementation

### 1. Client Setup

```typescript
import { HelioClient } from './lib/helio/client';

const helio = new HelioClient({
  apiKey: process.env.HELIO_API_KEY,
  environment: process.env.NODE_ENV
});
```

### 2. KYC Process

```typescript
// Start KYC
async function initiateKYC(merchantId: string) {
  const kyc = await helio.kyc.create({
    merchantId,
    businessType: 'llc',
    callbackUrl: `${process.env.BASE_URL}/kyc/callback`
  });
  
  return kyc.verificationUrl;
}

// Check KYC Status
async function checkKYCStatus(merchantId: string) {
  const status = await helio.kyc.getStatus(merchantId);
  return status;
}
```

### 3. Bank Account Setup

```typescript
// Link Bank Account
async function linkBankAccount(merchantId: string) {
  const link = await helio.bankAccounts.create({
    merchantId,
    accountType: 'checking',
    currency: 'USD'
  });
  
  return link.linkToken;
}

// Verify Bank Account
async function verifyBankAccount(linkToken: string) {
  const account = await helio.bankAccounts.verify(linkToken);
  return account.status;
}
```

### 4. Off-ramp Implementation

```typescript
// Initiate Transfer
async function initiateTransfer(
  amount: number,
  merchantId: string
) {
  const transfer = await helio.transfers.create({
    amount,
    merchantId,
    currency: 'USD',
    source: 'USDC',
    destination: 'bank_account'
  });
  
  return transfer.id;
}

// Check Transfer Status
async function checkTransferStatus(transferId: string) {
  const status = await helio.transfers.getStatus(transferId);
  return status;
}
```

## Webhook Implementation

### 1. Webhook Handler

```typescript
async function handleHelioWebhook(
  payload: HelioWebhookPayload,
  signature: string
) {
  // Verify signature
  if (!verifyWebhookSignature(payload, signature)) {
    throw new Error('Invalid webhook signature');
  }

  // Process event
  switch (payload.type) {
    case 'transfer.completed':
      await handleTransferComplete(payload.data);
      break;
    case 'kyc.updated':
      await handleKYCUpdate(payload.data);
      break;
    case 'settlement.completed':
      await handleSettlementComplete(payload.data);
      break;
  }
}
```

### 2. Event Handlers

```typescript
async function handleTransferComplete(data: TransferData) {
  // Update transfer status
  await updateTransferStatus(data.transferId, 'completed');
  
  // Notify merchant
  await notifyMerchant(data.merchantId, {
    type: 'transfer_complete',
    amount: data.amount
  });
}

async function handleKYCUpdate(data: KYCData) {
  // Update merchant KYC status
  await updateMerchantKYC(data.merchantId, data.status);
  
  if (data.status === 'approved') {
    // Enable off-ramp features
    await enableOffRamp(data.merchantId);
  }
}
```

## Settlement Configuration

### 1. Auto-settlement Setup

```typescript
async function configureAutoSettlement(merchantId: string) {
  await helio.settlements.configure({
    merchantId,
    frequency: 'daily',
    time: '23:00:00',
    timezone: 'UTC',
    minimumAmount: 100,
    currency: 'USD'
  });
}
```

### 2. Settlement Rules

```typescript
const SETTLEMENT_RULES = {
  minimumAmount: 100,
  maxAmount: 50000,
  cutoffTime: '23:00',
  processingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  holidayExclusions: true
};
```

## Error Handling

### 1. Transfer Errors

```typescript
async function handleTransferError(error: any) {
  if (error.code === 'INSUFFICIENT_FUNDS') {
    await notifyLowBalance();
  } else if (error.code === 'BANK_ACCOUNT_ERROR') {
    await notifyBankIssue();
  }
  
  logger.error('Transfer failed', {
    error: error.message,
    code: error.code
  });
}
```

### 2. KYC Errors

```typescript
async function handleKYCError(error: any) {
  if (error.code === 'VERIFICATION_FAILED') {
    await notifyKYCFailed();
  } else if (error.code === 'DOCUMENTS_REQUIRED') {
    await requestAdditionalDocuments();
  }
}
```

## Testing

### 1. Test Environment

```typescript
const testHelio = new HelioClient({
  apiKey: process.env.HELIO_TEST_API_KEY,
  environment: 'sandbox'
});
```

### 2. Test Cases

```typescript
describe('Helio Integration', () => {
  it('should process transfer', async () => {
    const transfer = await testHelio.transfers.create({
      amount: 1000,
      merchantId: 'test_merchant'
    });
    
    expect(transfer.status).toBe('pending');
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
async function checkHelioHealth() {
  try {
    await helio.health.check();
    return { status: 'healthy' };
  } catch (error) {
    return { status: 'unhealthy', error };
  }
}
```

### 2. Metrics

```typescript
const metrics = {
  transfers: new Counter('helio_transfers_total'),
  settlements: new Counter('helio_settlements_total'),
  errors: new Counter('helio_errors_total')
};
```

## Security

### 1. Data Encryption

```typescript
function encryptBankData(data: BankData): string {
  return encrypt(data, process.env.ENCRYPTION_KEY);
}

function decryptBankData(encrypted: string): BankData {
  return decrypt(encrypted, process.env.ENCRYPTION_KEY);
}
```

### 2. Webhook Security

```typescript
function verifyWebhookSignature(
  payload: any,
  signature: string
): boolean {
  const computed = crypto
    .createHmac('sha256', process.env.HELIO_WEBHOOK_SECRET)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(computed),
    Buffer.from(signature)
  );
}
```

## Best Practices

1. **KYC Management**
   - Store verification status
   - Monitor expiration
   - Keep documents updated

2. **Settlement Configuration**
   - Set realistic minimums
   - Configure notifications
   - Monitor settlement status

3. **Security**
   - Encrypt sensitive data
   - Verify all webhooks
   - Monitor for fraud

## Troubleshooting

### Common Issues

1. **Transfer Failures**
   - Check bank account status
   - Verify KYC status
   - Check balance availability

2. **Settlement Issues**
   - Verify minimum amounts
   - Check processing schedule
   - Monitor bank connectivity

3. **KYC Problems**
   - Check document validity
   - Verify business information
   - Monitor verification status

### Support Resources

1. Helio Documentation
2. Developer Dashboard
3. Support Contact
4. Status Page