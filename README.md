# Clover USDC Payment Gateway

A streamlined payment gateway enabling Clover merchants to accept USDC payments on Solana.

## Core Features

- USDC payments via Solana Pay
- Clover POS integration
- Automatic fiat off-ramp via Helio
- Merchant dashboard
- Transaction management

## Tech Stack

- Frontend: Next.js + TypeScript
- Backend: Next.js API Routes
- Database: PostgreSQL (via Helio)
- Blockchain: Solana + Helius
- Auth: Privy + Clover OAuth
- Off-ramp: Helio + Bridge.xyz

## Project Structure

```
src/
  ├── app/
  │   ├── (auth)/           # Authentication routes
  │   │   ├── login/        # Merchant login
  │   │   └── callback/     # OAuth callback
  │   ├── (dashboard)/      # Protected merchant dashboard
  │   │   ├── layout.tsx    # Dashboard layout with nav
  │   │   ├── page.tsx      # Overview/summary
  │   │   ├── transactions/ # Transaction history
  │   │   ├── settings/     # Merchant settings
  │   │   └── users/        # User management
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
  │   ├── solana/          # Solana/Helius integration
  │   └── db/              # Database operations
  ├── types/               # TypeScript definitions
  └── utils/               # Helper functions
```

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
1. Clover OAuth login
2. KYC verification
3. Bank account setup
4. Wallet configuration
5. Staff user setup

## Security

- Encrypted API keys
- Secure webhook endpoints
- Role-based access control
- Transaction validation
- Error logging
- Database backups
- Data encryption at rest