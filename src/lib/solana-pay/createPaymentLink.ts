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

export async function createPaymentLink({
    amount,
    recipient,
    label = 'Payment Request',
    message = 'Thank you for your payment',
    memo,
    reference,
    splToken = process.env.NEXT_PUBLIC_SOLANA_NETWORK === 'devnet'
        ? SOLANA_PAY_CONFIG.USDC_ADDRESS.devnet
        : SOLANA_PAY_CONFIG.USDC_ADDRESS.mainnet, // Dynamic network selection
}: CreatePaymentLinkParams): Promise<PaymentLinkResponse> {
    try {
        const recipientPublicKey = new PublicKey(recipient);
        const amountBN = new BigNumber(amount).multipliedBy(1e6); // USDC has 6 decimals
        const paymentReference = reference || generateReference();

        const url = encodeURL({
            recipient: recipientPublicKey,
            amount: amountBN,
            splToken: new PublicKey(splToken),
            reference: new PublicKey(paymentReference),
            label,
            message,
            memo,
        });

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

function generateReference(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

export function validatePaymentURL(url: string): boolean {
    try {
        const parsedUrl = new URL(url);
        if (parsedUrl.protocol !== 'solana:') {
            throw new Error('Invalid Solana Pay URL protocol');
        }
        return true;
    } catch (error) {
        console.error('Error validating payment URL:', error);
        return false;
    }
}

export async function monitorPaymentReference(
    reference: string,
    connection: Connection,
    timeout = 60000
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
                return true;
            }

            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            console.error('Error monitoring payment:', error);
            throw new Error('Failed to monitor payment');
        }
    }

    return false;
}

export function createMobileDeepLink(paymentUrl: string): string {
    const walletUrls = {
        phantom: 'https://phantom.app/ul/browse/',
        solflare: 'https://solflare.com/ul/',
    };
    return `${walletUrls.phantom}${encodeURIComponent(paymentUrl)}`;
}