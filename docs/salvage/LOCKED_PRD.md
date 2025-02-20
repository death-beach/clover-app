# LOCKED PRD - DO NOT MODIFY

This PRD represents the core functionality. It should not be modified or expanded.

# Clover USDC Payment Gateway - MVP PRD

## Overview
A Solana-based payment gateway allowing Clover merchants to accept USDC payments and off-ramp to fiat via Helio.

## Core Features

### 1. Payment Processing
- Accept USDC via Solana Pay
- Generate QR code from Clover order
- Confirm transaction via Helius
- Update Clover order status
- Store transaction details

### 2. Transaction Storage
**Database Tables:**
1. `transactions`
   - transaction_id (primary)
   - clover_order_id
   - solana_signature
   - amount_usdc
   - amount_usd
   - status
   - timestamp
   - merchant_id

2. `merchants`
   - merchant_id (primary)
   - clover_merchant_id
   - business_name
   - main_wallet_address
   - offramp_wallet_address
   - kyc_status

3. `users`
   - user_id (primary)
   - merchant_id
   - role
   - clover_employee_id
   - email

4. `transfers`
   - transfer_id (primary)
   - merchant_id
   - from_wallet
   - to_wallet
   - amount
   - status
   - timestamp

### 3. Off-Ramp (via Helio)
- Auto off-ramp to bank account
- Manual or scheduled transfers
- 0.50% off-ramp fee
- KYC via Bridge.xyz
- Store off-ramp history

### 4. Merchant Dashboard
- View all transactions
- Transaction search/filter
- Export transaction history
- Manage wallets
- Configure off-ramp schedule
- User management

### 5. Roles & Permissions
- Pulling roles from Clover
- Owner: Full access
- Admin: Full access + off-ramp
- Manager: Manage staff + transfers + transaction view
- Employee: Process payments

### 6. Wallet System
- Main Sales Wallet: Receives payments
- Off-Ramp Wallet: Staging for fiat conversion

## Technical Integration

### Clover Integration
- OAuth 2.0 authentication
- Create/update orders
- Custom tender for USDC payments
- Required permissions:
  - READ_MERCHANT
  - WRITE_ORDERS
  - READ_ORDERS

### Solana Pay Flow
1. Create Clover order
2. Generate Solana Pay QR
3. Customer pays USDC
4. Helius confirms transaction
5. Store transaction details
6. Update Clover order

### Helio Integration
- KYC/Bank account setup
- Auto off-ramp configuration
- Webhook monitoring
- Transaction reconciliation
- Store off-ramp records

## Tech Stack
- Frontend: Next.js + TypeScript
- Backend: Next.js API Routes
- Database: PostgreSQL (via Helio)
- Blockchain: Solana + Helius
- Auth: Privy + Clover OAuth
- Off-ramp: Helio + Bridge.xyz

## Security Requirements
- Encrypted API keys
- Secure webhook endpoints
- Role-based access control
- Transaction validation
- Error logging
- Database backups
- Data encryption at rest

## MVP Deployment
1. Internal testing (Devnet)
2. Beta test with 5 merchants
3. Launch on Mainnet

## Cost Structure
- Helio Fee: 1% per transaction
- Off-ramp Fee: 0.50%
- Merchant Fee: 2.2% + $0.10 per transaction

## Future Features (Post-MVP)
- NFT discount program
- Brand token rewards
- Additional SPL token support
- Jupiter DEX integration

---

DO NOT MODIFY THIS PRD. Any additional features or changes should be tracked separately for post-MVP consideration.