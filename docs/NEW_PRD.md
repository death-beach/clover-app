# Charon Gateway - Product Requirements Document (MVP)

## Product Overview
Charon Gateway is a Solana-based USDC payment gateway designed for Clover merchants. It enables businesses to accept USDC payments and automatically convert them to fiat currency through Circle's off-ramping services.

## Core Value Proposition
- Enable Clover merchants to accept USDC payments
- Provide seamless fiat off-ramping through Circle
- Maintain transaction records securely
- Offer simple integration with existing Clover POS systems

## Technical Architecture

### Stack Components
1. **Frontend & API Routes**
   - Next.js application
   - Deployed on Vercel
   - Solana Pay for payment links

2. **Database (Supabase)**
   - PostgreSQL database
   - Transaction records
   - Merchant information
   - Off-ramp request tracking

3. **Blockchain Integration**
   - Solana network integration
   - USDC token handling
   - Helius for transaction monitoring

4. **Off-ramping (Circle)**
   - USDC to fiat conversion
   - Bank account payouts
   - Transaction status tracking

5. **POS Integration**
   - Clover POS system integration
   - Order synchronization
   - Payment status updates

## Core Features (MVP)

### 1. Payment Processing
- Generate Solana Pay payment links
- QR code generation for POS display
- Real-time payment verification
- Transaction status updates to Clover POS

### 2. Merchant Management
- Merchant onboarding
- Wallet address management
- Bank account linking for payouts
- Basic merchant dashboard

### 3. Transaction Management
- Transaction recording
- Payment status tracking
- Transaction history
- Basic reporting

### 4. Off-ramping (MVP)
- Merchants receive USDC directly to their wallet
- No automatic fiat conversion
- Merchants handle USDC conversion manually
- Wallet address management

### 5. FUTURE Off-ramp Process Details
- Merchants complete individual KYC through USDC Access widget or Sphere
- Manual off-ramp process with following steps:
  1. Initiate off-ramp session
  2. Merchant completes KYC
  3. Select bank account for conversion
  4. Manually transfer USDC
- Webhook notifications for session state changes
- Merchant-controlled conversion process

### 5.1 FUTURE Technical Off-ramp Integration
- Use USDC Access widget embedded in application or Sphere API
- API endpoints for session management:
  - POST /w3s/ramp/sessions (create session)
  - GET /w3s/ramp/sessions (retrieve session details)
- Webhook support for tracking conversion status

## Database Schema

### Merchants Table
```sql
CREATE TABLE merchants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clover_merchant_id TEXT NOT NULL UNIQUE,
    business_name TEXT NOT NULL,
    wallet_address TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Transactions Table
```sql
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID REFERENCES merchants(id),
    amount DECIMAL(18,6) NOT NULL,
    status TEXT NOT NULL,
    solana_signature TEXT,
    clover_order_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Off-ramp Requests Table
```sql
CREATE TABLE offramp_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID REFERENCES merchants(id),
    transaction_id UUID REFERENCES transactions(id),
    amount DECIMAL(18,6) NOT NULL,
    status TEXT NOT NULL,
    circle_payout_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## User Flows

### Payment Flow
1. Merchant initiates payment through Clover POS
2. System generates Solana Pay link
3. Customer scans QR code or uses payment link
4. Customer approves payment in wallet
5. System verifies transaction
6. Payment status updated in Clover POS
7. Transaction recorded in database

### Off-ramp Flow
1. Merchant accumulates USDC payments
2. System initiates Circle payout
3. Circle processes USDC to fiat conversion
4. Funds transferred to merchant's bank account
5. Payout status tracked and updated

## Security Requirements

### Data Security
- SSL/TLS encryption for all communications
- Secure storage of sensitive data
- Regular database backups
- Access control and authentication

### Transaction Security
- Payment verification
- Double-spend prevention
- Transaction signing validation
- Error handling and logging

## Integration Requirements

### Clover Integration
- Merchant authentication
- Order synchronization
- Payment status updates
- Refund handling

### Circle Integration
- API authentication
- Payout processing
- Status tracking
- Error handling

### Solana Integration
- Network connection
- Transaction monitoring
- Wallet management
- Token handling

## Monitoring and Maintenance

### Transaction Monitoring
- Payment status tracking
- Off-ramp status monitoring
- Error detection and alerting
- Performance metrics

### System Health
- API endpoint monitoring
- Database performance
- Network connectivity
- Error rate tracking

## Future Considerations (Post-MVP)
- Enhanced reporting and analytics
- Multiple currency support
- Advanced merchant features
- Automated compliance tools
- Enhanced security features
- Mobile application

## Success Metrics
- Transaction success rate
- Off-ramp completion rate
- System uptime
- Average transaction time
- Merchant satisfaction
- Support ticket volume

## Compliance and Regulatory
- KYC/AML compliance
- Transaction monitoring
- Record keeping
- Privacy compliance
- Financial regulations