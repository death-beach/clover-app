import axios from 'axios';
import { PublicKey } from '@solana/web3.js';

const HELIO_API_BASE = 'https://api.hel.io/v1';

// Interface definitions for Helio API responses
interface PaymentIntent {
  id: string;
  amount: string;
  currency: string;
  status: string;
  createdAt: string;
  expiresAt: string;
  paymentUrl: string;
  company: string;
  creator: string;
  description?: string;
  metadata?: Record<string, any>;
}

interface PaymentStatus {
  status: string;
  transactionId?: string;
  amount: string;
  currency: string;
}

interface OffRampRequest {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  amount: number;
  destination_bank_account: string;
}

export class HelioSDK {
  private apiKey: string;
  private secretKey: string;

  constructor() {
    // In Next.js client components, we need to use NEXT_PUBLIC_ prefix
    const apiKey = process.env.NEXT_PUBLIC_HELIO_API_KEY;
    const secretKey = process.env.NEXT_PUBLIC_HELIO_SECRET_KEY;

    if (!apiKey || !secretKey) {
      console.error('Environment variables check:', {
        HELIO_API_KEY: apiKey ? 'Set' : 'Not set',
        HELIO_SECRET_KEY: secretKey ? 'Set' : 'Not set'
      });
      throw new Error('Missing Helio API credentials. Please check your environment variables.');
    }

    this.apiKey = apiKey;
    this.secretKey = secretKey;
  }

  private async request<T>(
    method: 'GET' | 'POST',
    endpoint: string,
    data?: any
  ): Promise<T> {
    const url = `${HELIO_API_BASE}${endpoint}`;
    console.log('SDK Request:', {
      method,
      url,
      data,
    });

    try {
      const response = await axios({
        method,
        url,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.secretKey}`,
          'cache-control': 'no-cache'
        },
        params: {
          apiKey: this.apiKey
        },
        data,
      });
      console.log('SDK Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('SDK Error:', error);
      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;
        console.error('Full error response:', responseData);
        throw new Error(`Helio API Error: ${responseData?.message || error.message}`);
      }
      throw error;
    }
  }

  /**
   * Creates a new payment intent
   * @param amount Amount in USD cents
   * @param metadata Optional metadata for the payment
   */
  async createPaymentIntent(amount: number, metadata?: Record<string, any>): Promise<PaymentIntent> {
    return this.request<PaymentIntent>('POST', '/paylink/create/api-key', {
      template: "OTHER",
      name: metadata?.name || "Payment Link",
      price: amount.toString(),
      pricingCurrency: "6340313846e4f91b8abc519b", // USDC currency ID
      features: {},
      recipients: [
        {
          walletId: "67a8f8404779882449c3f97b",
          currencyId: "6340313846e4f91b8abc519b"
        }
      ],
      ...(metadata?.description && { description: metadata.description })
    });
  }

  /**
   * Gets the status of a payment
   * @param paymentId The payment intent ID
   */
  async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    return this.request<PaymentStatus>('GET', `/payment-intents/${paymentId}`);
  }

  /**
   * Initiates an off-ramp request
   * @param amount Amount in USD cents to off-ramp
   * @param destinationAccount Bank account information for the off-ramp
   * @param sourceWallet Solana wallet address containing the funds
   */
  async initiateOffRamp(
    amount: number,
    destinationAccount: string,
    sourceWallet: PublicKey
  ): Promise<OffRampRequest> {
    return this.request<OffRampRequest>('POST', '/off-ramp', {
      amount,
      destination_bank_account: destinationAccount,
      source_wallet: sourceWallet.toString(),
    });
  }
}

// Export a singleton instance
export const helioSDK = new HelioSDK();