import { createQR, encodeURL, TransferRequestURL } from '@solana/pay';
import { Cluster, Connection, PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { SOLANA_PAY_CONFIG } from '../../config/solana-pay.config';

interface CreatePaymentLinkParams {
    amount: number;
    recipient: string;
    label?: string;
    message?: string;
    memo?: string;
    reference?: string;
    splToken?: string; // USDC address
}

interface PaymentLinkResponse {
    url: string;
    qrCode: string;
    reference: string;
}

/**
 * Creates a Solana Pay payment link and QR code
 */
export async function createPaymentLink({
    amount,
    recipient,
    label = 'Payment Request',
    message = 'Thank you for your payment',
    memo,
    reference,
    splToken = SOLANA_PAY_CONFIG.USDC_ADDRESS,
}: CreatePaymentLinkParams): Promise<PaymentLinkResponse> {
    try {
        // Validate recipient address
        const recipientPublicKey = new PublicKey(recipient);
        
        // Convert amount to proper decimals for USDC (6 decimals)
        const amountBN = new BigNumber(amount).multipliedBy(1e6);

        // Create unique reference if not provided
        const paymentReference = reference || generateReference();

        // Create the payment URL
        const url = encodeURL({
            recipient: recipientPublicKey,
            amount: amountBN,
            splToken: new PublicKey(splToken),
            reference: new PublicKey(paymentReference),
            label,
            message,
            memo,
        });

        // Generate QR code
        const qr = createQR(url);
        const qrCode = await qr.getRawData('svg');

        if (!qrCode) {
            throw new Error('Failed to generate QR code');
        }

        return {
            url: url.toString(),
            qrCode,
            reference: paymentReference,
        };
    } catch (error) {
        console.error('Error creating payment link:', error);
        throw new Error('Failed to create payment link');
    }
}

/**
 * Generates a unique reference for the payment
 */
function generateReference(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Validates a Solana Pay URL
 */
export function validatePaymentURL(url: string): boolean {
    try {
        const parsedUrl = new URL(url);
        const protocol = parsedUrl.protocol;

        if (protocol !== 'solana:') {
            throw new Error('Invalid Solana Pay URL protocol');
        }

        // Additional validation can be added here
        return true;
    } catch (error) {
        console.error('Error validating payment URL:', error);
        return false;
    }
}

/**
 * Monitors a payment reference for completion
 */
export async function monitorPaymentReference(
    reference: string,
    connection: Connection,
    timeout = 60000 // 1 minute timeout
): Promise<boolean> {
    const startTime = Date.now();
    const referencePublicKey = new PublicKey(reference);

    while (Date.now() - startTime < timeout) {
        try {
            const signatureInfo = await connection.getSignaturesForAddress(
                referencePublicKey,
                { limit: 1 }
            );

            if (signatureInfo.length > 0) {
                // Payment found
                return true;
            }

            // Wait before checking again
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            console.error('Error monitoring payment:', error);
            throw new Error('Failed to monitor payment');
        }
    }

    // Timeout reached without finding the payment
    return false;
}

/**
 * Creates a deep link for mobile wallets
 */
export function createMobileDeepLink(paymentUrl: string): string {
    // List of supported wallet URLs
    const walletUrls = {
        phantom: 'https://phantom.app/ul/browse/',
        solflare: 'https://solflare.com/ul/',
    };

    // Default to Phantom
    return `${walletUrls.phantom}${encodeURIComponent(paymentUrl)}`;
}