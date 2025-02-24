import { NextApiRequest, NextApiResponse } from 'next';
import { WebhookPayload, TokenTransfer } from './types'; // Move WebhookType here
import { USDC_MINT } from '@/config/tokens';
import { createClient } from '@supabase/supabase-js';

// Rest of your code...
export interface HeliusConfig {
  apiKey: string;
  rpcEndpoint: string;
  webhookSecret?: string;
}

export const getHeliusConfig = (): HeliusConfig => {
  const apiKey = process.env.HELIUS_API_KEY;
  const rpcEndpoint = process.env.HELIUS_RPC_URL;
  const webhookSecret = process.env.HELIUS_WEBHOOK_SECRET;

  if (!apiKey) {
    throw new Error('HELIUS_API_KEY environment variable is required');
  }

  if (!rpcEndpoint) {
    throw new Error('HELIUS_RPC_URL environment variable is required');
  }

  return {
    apiKey,
    rpcEndpoint,
    webhookSecret
  };
};