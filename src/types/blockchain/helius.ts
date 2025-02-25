import { type WebhookType } from '@/lib/helius/config';

export interface TokenTransfer {
  fromUserAccount: string;
  toUserAccount: string;
  amount: number;
  mint: string;
  tokenStandard: string;
}

export interface NativeTransfer {
  fromUserAccount: string;
  toUserAccount: string;
  amount: number;
}

export interface AccountData {
  account: string;
  nativeBalanceChange: number;
  tokenBalanceChanges: TokenTransfer[];
}

export interface EnrichedTransaction {
  accountData: AccountData[];
  description: string;
  type: string;
  fee: number;
  signature: string;
  slot: number;
  timestamp: number;
  tokenTransfers: TokenTransfer[];
  source: string;
}

export interface NFTEvent {
  amount: number;
  buyer: string;
  seller: string;
  signature: string;
  mint: string;
  timestamp: number;
}

export interface TokenMintEvent {
  amount: number;
  mint: string;
  mintAuthority: string;
  timestamp: number;
  signature: string;
}

export type WebhookData = {
  accountData: AccountData[];
  type: string;
  signature: string;
  description: string;
  source: string;
  fee: number;
  timestamp: number;
  slot: number;
  nativeTransfers: NativeTransfer[];
  tokenTransfers: TokenTransfer[];
}

export interface HeliusWebhookData {
  webhookID: string;
  accountKeys: string[];
  type: WebhookType;
  data: WebhookData;
}