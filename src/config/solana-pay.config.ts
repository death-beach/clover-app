export const SOLANA_PAY_CONFIG = {
    // Network Configuration
    NETWORK: process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet',
    RPC_URL: process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',

    // Token Addresses
    USDC_ADDRESS: {
        mainnet: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU', // USDC on Solana mainnet
        devnet: 'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr',  // USDC on Devnet
    },

    // Payment Settings
    PAYMENT_TIMEOUT: 60000, // 1 minute in milliseconds
    MIN_AMOUNT: 0.01,      // Minimum payment amount in USDC
    MAX_AMOUNT: 100000,    // Maximum payment amount in USDC

    // QR Code Settings
    QR_CODE: {
        width: 400,
        height: 400,
        margin: 2,
        color: {
            dark: '#000000',
            light: '#ffffff',
        },
    },

    // Supported Wallets
    SUPPORTED_WALLETS: [
        {
            name: 'Phantom',
            deepLink: 'https://phantom.app/ul/browse/',
            icon: '/wallet-icons/phantom.png',
        },
        {
            name: 'Solflare',
            deepLink: 'https://solflare.com/ul/',
            icon: '/wallet-icons/solflare.png',
        },
    ],

    // Transaction Settings
    TRANSACTION: {
        CONFIRMATION_THRESHOLD: 32,  // Number of confirmations needed
        RETRY_ATTEMPTS: 3,          // Number of retry attempts for failed transactions
        RETRY_DELAY: 1000,          // Delay between retries in milliseconds
    },

    // Labels and Messages
    LABELS: {
        DEFAULT_PAYMENT_LABEL: 'Payment Request',
        DEFAULT_PAYMENT_MESSAGE: 'Thank you for your payment',
        EXPIRED_MESSAGE: 'This payment request has expired',
        PROCESSING_MESSAGE: 'Processing payment...',
        SUCCESS_MESSAGE: 'Payment successful!',
        ERROR_MESSAGE: 'Payment failed. Please try again.',
    },
} as const;

// Error Messages
export const SOLANA_PAY_ERRORS = {
    INVALID_AMOUNT: 'Invalid payment amount',
    INVALID_ADDRESS: 'Invalid recipient address',
    INVALID_TOKEN: 'Invalid token address',
    INVALID_REFERENCE: 'Invalid reference',
    QR_GENERATION_FAILED: 'Failed to generate QR code',
    PAYMENT_TIMEOUT: 'Payment request timed out',
    NETWORK_ERROR: 'Network error occurred',
    TRANSACTION_FAILED: 'Transaction failed',
} as const;

// Validation Rules
export const VALIDATION_RULES = {
    AMOUNT: {
        MIN: 0.01,
        MAX: 100000,
        DECIMALS: 6,
    },
    REFERENCE: {
        LENGTH: 32,
    },
} as const;