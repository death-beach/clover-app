export interface EnrichedTransaction {
  timestamp: number;
  fee: number;
  status: string;
  type: string;
  tokenTransfers: TokenTransfer[];
  nativeTransfers: NativeTransfer[];
  accountData: AccountData[];
  events: any[];
}

export interface TokenTransfer {
  fromUserAccount: string;
  toUserAccount: string;
  mint: string;
  amount: number;
}

export interface NativeTransfer {
  fromUserAccount: string;
  toUserAccount: string;
  amount: number;
}

export interface AccountData {
  account: string;
  nativeBalanceChange: number;
  tokenBalanceChanges: TokenBalanceChange[];
}

export interface TokenBalanceChange {
  userAccount: string;
  mint: string;
  rawTokenAmount: {
    tokenAmount: string;
    decimals: number;
  };
}

export interface WebhookPayload {
  webhookId: string;
  accountAddresses: string[];
  type: string;
  timestamp: number;
  signature: string;
  enriched: EnrichedTransaction;
}