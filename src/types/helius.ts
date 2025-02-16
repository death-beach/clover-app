import { PublicKey } from '@solana/web3.js';

export interface TokenTransfer {
  fromUserAccount: string;
  toUserAccount: string;
  amount: number;
  mint: string;
  tokenStandard: string;
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
  nativeTransfers: any[];
  tokenTransfers: TokenTransfer[];
}

import { WebhookType } from '@/helius/config';

export interface HeliusWebhookData {
  webhookID: string;
  accountKeys: string[];
  type: WebhookType;
  data: WebhookData;
}