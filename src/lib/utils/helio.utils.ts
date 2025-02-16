import { VALIDATION_RULES, HELIO_ERRORS } from '../../config/helio.config';

/**
 * Validates merchant ID format
 * @param merchantId - The merchant ID to validate
 */
export function validateMerchantId(merchantId: string): boolean {
    const { MIN_LENGTH, MAX_LENGTH, PATTERN } = VALIDATION_RULES.MERCHANT_ID;
    
    if (!merchantId || 
        merchantId.length < MIN_LENGTH || 
        merchantId.length > MAX_LENGTH || 
        !PATTERN.test(merchantId)) {
        throw new Error(HELIO_ERRORS.INVALID_MERCHANT);
    }
    
    return true;
}

/**
 * Validates bank account details
 * @param accountNumber - Bank account number
 * @param routingNumber - Bank routing number
 */
export function validateBankDetails(accountNumber: string, routingNumber: string): boolean {
    const { MIN_LENGTH, MAX_LENGTH, ROUTING_LENGTH } = VALIDATION_RULES.BANK_ACCOUNT;
    
    if (!accountNumber || 
        accountNumber.length < MIN_LENGTH || 
        accountNumber.length > MAX_LENGTH) {
        throw new Error(HELIO_ERRORS.INVALID_BANK_DETAILS);
    }
    
    if (!routingNumber || routingNumber.length !== ROUTING_LENGTH) {
        throw new Error(HELIO_ERRORS.INVALID_BANK_DETAILS);
    }
    
    return true;
}

/**
 * Validates off-ramp amount
 * @param amount - Amount to validate
 */
export function validateAmount(amount: number): boolean {
    const { MIN, MAX, DECIMALS } = VALIDATION_RULES.AMOUNT;
    
    if (isNaN(amount) || 
        amount < MIN || 
        amount > MAX || 
        !Number.isInteger(amount * Math.pow(10, DECIMALS))) {
        throw new Error(HELIO_ERRORS.INVALID_AMOUNT);
    }
    
    return true;
}

/**
 * Formats amount to USDC decimal places
 * @param amount - Amount to format
 */
export function formatUSDCAmount(amount: number): string {
    return amount.toFixed(VALIDATION_RULES.AMOUNT.DECIMALS);
}

/**
 * Calculates off-ramp fee
 * @param amount - Amount to calculate fee for
 */
export function calculateOffRampFee(amount: number): number {
    return amount * 0.005; // 0.50%
}

/**
 * Generates a transaction reference
 * @param merchantId - Merchant ID
 * @param timestamp - Transaction timestamp
 */
export function generateTransactionReference(merchantId: string, timestamp: number): string {
    return `${merchantId}-${timestamp}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Validates and formats schedule configuration
 * @param frequency - Schedule frequency
 * @param startDate - Schedule start date
 * @param endDate - Schedule end date (optional)
 */
export function validateScheduleConfig(
    frequency: string,
    startDate: Date,
    endDate?: Date
): boolean {
    const validFrequencies = ['daily', 'weekly', 'biweekly', 'monthly'];
    
    if (!validFrequencies.includes(frequency)) {
        throw new Error('Invalid schedule frequency');
    }
    
    if (startDate < new Date()) {
        throw new Error('Start date must be in the future');
    }
    
    if (endDate && endDate <= startDate) {
        throw new Error('End date must be after start date');
    }
    
    return true;
}

/**
 * Handles API errors and provides consistent error messages
 * @param error - Error object
 */
export function handleHelioError(error: any): Error {
    if (error.response) {
        switch (error.response.status) {
            case 401:
                return new Error(HELIO_ERRORS.UNAUTHORIZED);
            case 429:
                return new Error(HELIO_ERRORS.RATE_LIMIT);
            default:
                return new Error(error.response.data?.message || HELIO_ERRORS.NETWORK_ERROR);
        }
    }
    
    return error;
}