export const HELIO_CONFIG = {
    // API Configuration
    API_VERSION: 'v1',
    BASE_URL: 'https://api.hel.io',
    
    // Off-ramp Settings
    SUPPORTED_CURRENCIES: {
        SOLANA: ['USDC', 'PYUSD'],
        ETHEREUM: ['USDC', 'USDT', 'PYUSD'],
        BASE: ['USDC'],
        POLYGON: ['USDC']
    },
    
    // Fee Configuration
    FEES: {
        OFF_RAMP: 0.005, // 0.50%
    },
    
    // Transfer Methods
    TRANSFER_METHODS: ['SEPA', 'WIRE', 'ACH'],
    
    // Schedule Options
    SCHEDULE_OPTIONS: {
        FREQUENCIES: ['daily', 'weekly', 'biweekly', 'monthly'],
        MIN_AMOUNT: 1, // Minimum amount in USDC
        MAX_AMOUNT: 1000000, // Maximum amount in USDC
    },
    
    // Timeout Settings
    TIMEOUTS: {
        API_CALL: 30000, // 30 seconds
        TRANSACTION: 60000, // 1 minute
    },
    
    // Retry Configuration
    RETRY: {
        MAX_ATTEMPTS: 3,
        DELAY: 1000, // 1 second
        BACKOFF_FACTOR: 2,
    },
} as const;

// Error Messages
export const HELIO_ERRORS = {
    INITIALIZATION: 'Failed to initialize Helio SDK',
    API_KEY_MISSING: 'Helio API key is missing',
    SECRET_KEY_MISSING: 'Helio secret key is missing',
    INVALID_AMOUNT: 'Invalid off-ramp amount',
    INVALID_MERCHANT: 'Invalid merchant ID',
    INVALID_BANK_DETAILS: 'Invalid bank account details',
    TRANSACTION_FAILED: 'Transaction failed',
    SCHEDULE_FAILED: 'Failed to schedule off-ramp',
    NETWORK_ERROR: 'Network error occurred',
    UNAUTHORIZED: 'Unauthorized request',
    RATE_LIMIT: 'Rate limit exceeded',
} as const;

// Validation Rules
export const VALIDATION_RULES = {
    MERCHANT_ID: {
        MIN_LENGTH: 8,
        MAX_LENGTH: 64,
        PATTERN: /^[a-zA-Z0-9-_]+$/,
    },
    BANK_ACCOUNT: {
        MIN_LENGTH: 8,
        MAX_LENGTH: 17,
        ROUTING_LENGTH: 9,
    },
    AMOUNT: {
        MIN: 1,
        MAX: 1000000,
        DECIMALS: 2,
    },
} as const;