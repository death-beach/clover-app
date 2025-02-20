# Merchant Setup Guide

This guide details the process of setting up a new merchant in the Clover USDC Payment Gateway system. Follow these steps to ensure proper configuration and integration.

## Prerequisites

Before starting the setup process, ensure you have:

1. Active Clover merchant account
2. Valid business documentation
3. Bank account for settlements
4. Solana wallet (or ability to create one)
5. Completed KYC requirements

## Setup Process

### 1. Initial Registration

#### Connect Wallet
1. Visit the registration page
2. Click "Connect Wallet"
3. Complete Privy wallet connection
4. Verify wallet ownership

#### Basic Information
```typescript
interface MerchantBasicInfo {
  businessName: string;
  businessType: string;
  contactEmail: string;
  phoneNumber: string;
  taxId: string;
}
```

### 2. Clover Integration

#### OAuth Connection
1. Click "Connect Clover"
2. Authorize required permissions:
   - READ_MERCHANT
   - WRITE_ORDERS
   - READ_ORDERS
3. Confirm merchant ID
4. Test connection

#### POS Configuration
1. Configure custom tender
2. Set up payment buttons
3. Test order creation
4. Verify webhooks

### 3. Wallet Setup

#### Main Sales Wallet
- Purpose: Receiving customer payments
- Configuration:
  - Generate new wallet or import existing
  - Set up monitoring
  - Configure alerts

#### Off-ramp Wallet
- Purpose: Staging for fiat conversion
- Configuration:
  - Generate dedicated wallet
  - Set transfer limits
  - Configure auto-settlement

### 4. KYC Verification

#### Required Documents
1. Business license
2. Tax documentation
3. Owner identification
4. Proof of address
5. Bank statements

#### Verification Process
1. Submit documents
2. Complete Bridge.xyz verification
3. Await approval (24-48 hours)
4. Receive confirmation

### 5. Bank Account Setup

#### Account Information
```typescript
interface BankDetails {
  accountName: string;
  accountNumber: string;
  routingNumber: string;
  bankName: string;
  accountType: 'checking' | 'savings';
}
```

#### Verification
1. Submit bank details
2. Complete micro-deposit verification
3. Set up ACH authorization
4. Test settlement process

### 6. System Configuration

#### Payment Settings
1. Configure transaction limits
2. Set processing fees
3. Define operating hours
4. Set up notifications

#### Off-ramp Settings
1. Configure auto-settlement
2. Set minimum transfer amounts
3. Define settlement schedule
4. Set up alerts

#### User Setup
1. Import Clover staff
2. Assign roles
3. Configure permissions
4. Set up training access

## Technical Configuration

### API Integration
```typescript
interface MerchantConfig {
  merchantId: string;
  cloverMerchantId: string;
  mainWalletAddress: string;
  offrampWalletAddress: string;
  webhookUrl: string;
  apiKey: string;
}
```

### Webhook Configuration
1. Register webhook endpoints
2. Configure security keys
3. Set up monitoring
4. Test notifications

## Testing Process

### Payment Flow Testing
1. Create test order
2. Generate QR code
3. Process test payment
4. Verify transaction
5. Check settlement

### Integration Testing
1. Verify Clover sync
2. Test order updates
3. Confirm webhooks
4. Validate reporting

## Go-Live Checklist

### Pre-launch Verification
- [ ] All KYC approved
- [ ] Bank account verified
- [ ] Wallets configured
- [ ] Staff trained
- [ ] Test transactions completed
- [ ] Webhooks verified
- [ ] Monitoring active

### Launch Steps
1. Enable live mode
2. Process test transaction
3. Verify settlement
4. Monitor system
5. Confirm reporting

## Support Resources

### Documentation
- API Documentation
- User Guides
- Training Materials
- Troubleshooting Guide

### Contact Information
- Technical Support
- Account Management
- Emergency Contact
- Compliance Team

## Maintenance

### Regular Tasks
1. Update API keys
2. Review permissions
3. Check integrations
4. Monitor performance
5. Update documentation

### Security Reviews
1. Access audit
2. Permission review
3. API key rotation
4. Security scanning
5. Compliance check

## Troubleshooting

### Common Issues
1. **Connection Problems**
   - Check API credentials
   - Verify webhooks
   - Test network connectivity

2. **Transaction Issues**
   - Verify wallet balance
   - Check transaction limits
   - Confirm network status

3. **Settlement Problems**
   - Verify bank details
   - Check transfer limits
   - Confirm KYC status