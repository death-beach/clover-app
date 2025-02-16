export interface HeliusTransaction {
  signature: string;
  timestamp: number;
  type: 'transfer' | 'swap' | 'mint' | 'burn';
  amount: number;
  token: string;
}

export interface HeliusWebhookPayload {
  transactions: HeliusTransaction[];
  wallet: string;
}