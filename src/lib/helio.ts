import { Connection } from '@solana/web3.js';

class HelioSDK {
    private apiKey: string;
    private secretKey: string;
    private connection: Connection;
    private baseUrl: string = 'https://api.hel.io/v1';

    constructor() {
        if (!process.env.NEXT_PUBLIC_HELIO_API_KEY || !process.env.NEXT_PUBLIC_HELIO_SECRET_KEY) {
            throw new Error('Helio API key or secret key not found in environment variables');
        }

        this.apiKey = process.env.NEXT_PUBLIC_HELIO_API_KEY;
        this.secretKey = process.env.NEXT_PUBLIC_HELIO_SECRET_KEY;
        this.connection = new Connection(process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com');
    }

    /**
     * Initialize the off-ramp process for a merchant
     * @param merchantId - The unique identifier for the merchant
     * @param amount - The amount to off-ramp in USDC
     * @param bankDetails - The merchant's bank account details
     */
    async initializeOffRamp(merchantId: string, amount: number, bankDetails: BankDetails): Promise<OffRampResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/off-ramp/initialize`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': this.apiKey,
                    'X-Secret-Key': this.secretKey,
                },
                body: JSON.stringify({
                    merchantId,
                    amount,
                    bankDetails,
                }),
            });

            if (!response.ok) {
                throw new Error(`Off-ramp initialization failed: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error initializing off-ramp:', error);
            throw error;
        }
    }

    /**
     * Get the status of an off-ramp transaction
     * @param transactionId - The ID of the off-ramp transaction
     */
    async getOffRampStatus(transactionId: string): Promise<OffRampStatus> {
        try {
            const response = await fetch(`${this.baseUrl}/off-ramp/status/${transactionId}`, {
                headers: {
                    'X-API-Key': this.apiKey,
                    'X-Secret-Key': this.secretKey,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to get off-ramp status: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error getting off-ramp status:', error);
            throw error;
        }
    }

    /**
     * Schedule automatic off-ramp for a merchant
     * @param merchantId - The unique identifier for the merchant
     * @param schedule - The schedule configuration for automatic off-ramp
     */
    async scheduleAutoOffRamp(merchantId: string, schedule: OffRampSchedule): Promise<ScheduleResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/off-ramp/schedule`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': this.apiKey,
                    'X-Secret-Key': this.secretKey,
                },
                body: JSON.stringify({
                    merchantId,
                    schedule,
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to schedule auto off-ramp: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error scheduling auto off-ramp:', error);
            throw error;
        }
    }

    /**
     * Get merchant's off-ramp history
     * @param merchantId - The unique identifier for the merchant
     * @param startDate - Start date for the history query
     * @param endDate - End date for the history query
     */
    async getOffRampHistory(
        merchantId: string,
        startDate?: Date,
        endDate?: Date
    ): Promise<OffRampHistoryResponse> {
        try {
            const queryParams = new URLSearchParams({
                merchantId,
                ...(startDate && { startDate: startDate.toISOString() }),
                ...(endDate && { endDate: endDate.toISOString() }),
            });

            const response = await fetch(`${this.baseUrl}/off-ramp/history?${queryParams}`, {
                headers: {
                    'X-API-Key': this.apiKey,
                    'X-Secret-Key': this.secretKey,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to get off-ramp history: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error getting off-ramp history:', error);
            throw error;
        }
    }

    /**
     * Update merchant's bank account details
     * @param merchantId - The unique identifier for the merchant
     * @param bankDetails - The new bank account details
     */
    async updateBankDetails(merchantId: string, bankDetails: BankDetails): Promise<UpdateResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/merchant/bank-details`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': this.apiKey,
                    'X-Secret-Key': this.secretKey,
                },
                body: JSON.stringify({
                    merchantId,
                    bankDetails,
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to update bank details: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating bank details:', error);
            throw error;
        }
    }
}

// Types
interface BankDetails {
    accountNumber: string;
    routingNumber: string;
    accountType: 'checking' | 'savings';
    accountHolderName: string;
    bankName: string;
}

interface OffRampResponse {
    transactionId: string;
    status: string;
    estimatedCompletionTime: Date;
}

interface OffRampStatus {
    status: 'pending' | 'processing' | 'completed' | 'failed';
    transactionId: string;
    amount: number;
    completionTime?: Date;
    error?: string;
}

interface OffRampSchedule {
    frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
    minimumAmount?: number;
    startDate: Date;
    endDate?: Date;
    preferredTime?: string; // HH:mm format
}

interface ScheduleResponse {
    scheduleId: string;
    status: 'active' | 'pending' | 'failed';
    nextExecutionTime: Date;
}

interface OffRampHistoryResponse {
    transactions: Array<{
        transactionId: string;
        amount: number;
        status: string;
        timestamp: Date;
        completionTime?: Date;
    }>;
    pagination: {
        totalItems: number;
        currentPage: number;
        totalPages: number;
    };
}

interface UpdateResponse {
    success: boolean;
    message: string;
    updatedAt: Date;
}

// Export a singleton instance
export const helioSDK = new HelioSDK();