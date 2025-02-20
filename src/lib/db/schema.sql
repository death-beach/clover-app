-- Core database schema for Clover USDC Payment Gateway

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Merchants table
CREATE TABLE merchants (
    merchant_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clover_merchant_id TEXT NOT NULL UNIQUE,
    business_name TEXT NOT NULL,
    main_wallet_address TEXT NOT NULL,
    offramp_wallet_address TEXT NOT NULL,
    kyc_status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Users table
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL REFERENCES merchants(merchant_id),
    role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'cashier')),
    clover_employee_id TEXT NOT NULL,
    email TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(merchant_id, clover_employee_id)
);

-- Transactions table
CREATE TABLE transactions (
    transaction_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL REFERENCES merchants(merchant_id),
    clover_order_id TEXT NOT NULL,
    solana_signature TEXT NOT NULL UNIQUE,
    amount_usdc NUMERIC(20,6) NOT NULL,
    amount_usd NUMERIC(10,2) NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'failed')),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Transfers table (for off-ramp tracking)
CREATE TABLE transfers (
    transfer_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL REFERENCES merchants(merchant_id),
    from_wallet TEXT NOT NULL,
    to_wallet TEXT NOT NULL,
    amount NUMERIC(20,6) NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_transactions_merchant ON transactions(merchant_id);
CREATE INDEX idx_transactions_order ON transactions(clover_order_id);
CREATE INDEX idx_transfers_merchant ON transfers(merchant_id);
CREATE INDEX idx_users_merchant ON users(merchant_id);

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_merchant_updated_at
    BEFORE UPDATE ON merchants
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();