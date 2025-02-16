import { Connection, PublicKey } from '@solana/web3.js';
import { SOLANA_PAY_CONFIG, SOLANA_PAY_ERRORS, VALIDATION_RULES } from '../../config/solana-pay.config';
import BigNumber from 'bignumber.js';

/**
 * Validates payment amount
 */
export function validateAmount(amount: number): boolean {
    const { MIN, MAX } = VALIDATION_RULES.AMOUNT;
    
    if (isNaN(amount) || amount < MIN || amount > MAX) {
        throw new Error(SOLANA_PAY_ERRORS.INVALID_AMOUNT);
    }
    
    return true;
}

/**
 * Validates Solana address
 */
export function validateSolanaAddress(address: string): boolean {
    try {
        new PublicKey(address);
        return true;
    } catch {
        throw new Error(SOLANA_PAY_ERRORS.INVALID_ADDRESS);
    }
}

/**
 * Formats amount to USDC decimal places
 */
export function formatUSDCAmount(amount: number): string {
    return new BigNumber(amount).toFixed(VALIDATION_RULES.AMOUNT.DECIMALS);
}

/**
 * Gets USDC token address based on network
 */
export function getUSDCAddress(): string {
    const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK as 'mainnet' | 'devnet';
    return SOLANA_PAY_CONFIG.USDC_ADDRESS[network];
}

/**
 * Creates a connection to Solana network
 */
export function createSolanaConnection(): Connection {
    return new Connection(
        SOLANA_PAY_CONFIG.RPC_URL,
        'confirmed'
    );
}

/**
 * Checks if a transaction is confirmed
 */
export async function isTransactionConfirmed(
    signature: string,
    connection: Connection
): Promise<boolean> {
    try {
        const status = await connection.getSignatureStatus(signature);
        return status.value?.confirmationStatus === 'confirmed';
    } catch {
        return false;
    }
}

/**
 * Gets transaction details
 */
export async function getTransactionDetails(
    signature: string,
    connection: Connection
) {
    try {
        const transaction = await connection.getTransaction(signature);
        return transaction;
    } catch (error) {
        console.error('Error getting transaction details:', error);
        throw new Error('Failed to get transaction details');
    }
}

/**
 * Determines if user is on mobile device
 */
export function isMobileDevice(): boolean {
    if (typeof window === 'undefined') return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        window.navigator.userAgent
    );
}

/**
 * Gets appropriate wallet deep link based on device
 */
export function getWalletDeepLink(paymentUrl: string): string {
    if (isMobileDevice()) {
        // Default to Phantom, can be made configurable
        return `${SOLANA_PAY_CONFIG.SUPPORTED_WALLETS[0].deepLink}${encodeURIComponent(paymentUrl)}`;
    }
    return paymentUrl;
}

/**
 * Formats error message for user display
 */
export function formatErrorMessage(error: any): string {
    if (error instanceof Error) {
        return error.message;
    }
    return SOLANA_PAY_ERRORS.NETWORK_ERROR;
}