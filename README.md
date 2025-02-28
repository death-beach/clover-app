# Clover USDC Payment Gateway

A streamlined payment gateway enabling Clover merchants to accept USDC payments on Solana, with seamless integration into existing Clover POS systems.

## Core Features

- USDC payments via Solana Pay
- Direct Clover POS integration
- Automatic fiat off-ramp via Helio
- Role-based merchant dashboard
- Real-time transaction monitoring
- Automated settlement process

## Tech Stack

- Frontend: Next.js 13+ (App Router) + TypeScript
- Backend: Next.js API Routes
- Database: PostgreSQL (via Helio)
- Blockchain: Solana + Helius
- Auth: Privy (Initial Setup) + Clover OAuth
- Off-ramp: Helio + Bridge.xyz

## Project Structure

```
src/
  ├── app/
  │   ├── dashboard/        # Protected merchant dashboard
  │   │   ├── layout.tsx    # Dashboard layout with nav
  │   │   ├── page.tsx      # Overview/summary
  │   │   ├── transactions/ # Transaction management
  │   │   ├── off-ramp/     # Off-ramp management
  │   │   └── settings/     # Merchant settings
  │   ├── api/              # API routes
  │   │   ├── auth/         # Auth endpoints
  │   │   ├── webhooks/     # Service webhooks
  │   │   ├── payments/     # Payment processing
  │   │   └── merchants/    # Merchant management
  │   └── pay/              # Payment flow pages
  ├── components/           # Reusable UI components
  ├── lib/                  # Core business logic
  │   ├── clover/          # Clover integration
  │   ├── helio/           # Helio integration
  │   ├── helius/          # Helius integration
  │   └── db/              # Database operations
  ├── config/              # Configuration files
  ├── types/               # TypeScript definitions
  └── hooks/               # Custom React hooks
```

## Authentication Flow

The system uses a two-phase authentication approach:

1. **Initial Setup (Privy Auth)**
   - Merchant owner connects wallet via Privy
   - Full access granted for initial setup
   - Configure wallets and Clover integration

2. **Operational Phase (Clover Auth)**
   - All staff login through Clover
   - Roles and permissions inherited from Clover
   - Seamless integration with existing POS permissions

## Role System

Roles are directly mapped from Clover's employee hierarchy:

- **Owner**
  - Full system access
  - Manage all settings
  - Access all features
  
- **Admin**
  - Full access + off-ramp
  - Manage settings
  - View all data
  
- **Manager**
  - Manage staff
  - View transactions
  - Process payments
  
- **Employee**
  - Process payments
  - View transactions

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```
   # Auth
   PRIVY_APP_ID=
   CLOVER_CLIENT_ID=
   CLOVER_CLIENT_SECRET=

   # Solana
   HELIUS_API_KEY=
   
   # Helio
   HELIO_API_KEY=
   HELIO_WEBHOOK_SECRET=
   
   # Database
   DATABASE_URL=
   ```

3. Run development server:
   ```bash
   npm run dev
   ```

## Core Workflows

### Payment Flow
1. Create Clover order
2. Generate Solana Pay QR
3. Customer pays USDC
4. Helius confirms transaction
5. Update Clover order
6. Auto off-ramp via Helio

### Merchant Onboarding
1. Connect wallet (Privy)
2. Configure merchant settings
3. Connect Clover POS
4. Complete KYC verification
5. Set up bank account
6. Configure auto-settlement

## Security

- End-to-end encryption
- Secure webhook endpoints
- Role-based access control
- Real-time transaction validation
- Comprehensive error logging
- Automated database backups
- Data encryption at rest
- Regular security audits

extra 