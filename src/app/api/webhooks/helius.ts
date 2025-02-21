import { NextApiRequest, NextApiResponse } from 'next';
import { WebhookType } from '../../../lib/helius/config';
import { HeliusWebhookData, TokenTransfer, WebhookData } from '../../../lib/helius/types';
import { USDC_MINT } from '../../../config/tokens';
import { createClient } from '@supabase/supabase-js';

// Database types
interface Transaction {
  id: string;
  merchant_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  solana_signature: string;
  clover_order_id?: string;
  created_at: string;
  updated_at: string;
}

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify webhook authentication
  const authHeader = req.headers['authorization'];
  if (authHeader !== `Bearer ${process.env.WEBHOOK_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Validate request body
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ error: 'Invalid request body format' });
    }

    const webhookData = req.body as HeliusWebhookData;

    // Validate webhook data structure
    if (!webhookData.type || !webhookData.data) {
      return res.status(400).json({ error: 'Invalid webhook data structure' });
    }

    // Process different webhook types
    switch (webhookData.type) {
      case WebhookType.ENHANCED_TRANSACTION:
        if (!webhookData.data.tokenTransfers) {
          console.warn('No token transfers in enhanced transaction');
          break;
        }
        await handleEnhancedTransaction(webhookData.data);
        break;
      case WebhookType.TOKEN_TRANSFER:
        if (webhookData.data.tokenTransfers?.length > 0) {
          await handleTokenTransfer(webhookData.data.tokenTransfers[0]);
        } else {
          console.warn('No token transfers in TOKEN_TRANSFER webhook');
        }
        break;
      default:
        console.warn('Unhandled webhook type:', webhookData.type);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleEnhancedTransaction(transaction: WebhookData) {
  try {
    if (!transaction.tokenTransfers) {
      console.warn('No token transfers in transaction');
      return;
    }

    // Check if this is a USDC transfer
    const usdcTransfers = transaction.tokenTransfers.filter(
      transfer => transfer.mint?.toLowerCase() === USDC_MINT.toLowerCase()
    );

    if (usdcTransfers.length > 0) {
      // Process each USDC transfer
      for (const transfer of usdcTransfers) {
        await processUSDCTransfer(transfer, transaction.signature);
      }
    }

    // Store transaction data for record-keeping
    await storeTransactionData(transaction);
  } catch (error) {
    console.error('Error handling enhanced transaction:', error);
    throw new Error(`Enhanced transaction processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function handleTokenTransfer(transfer: TokenTransfer) {
  try {
    // Check if this is a USDC transfer
    if (!transfer.mint) {
      console.warn('Token transfer missing mint address');
      return;
    }

    if (transfer.mint.toLowerCase() === USDC_MINT.toLowerCase()) {
      await processUSDCTransfer(transfer);
    }
  } catch (error) {
    console.error('Error handling token transfer:', error);
    throw new Error(`Token transfer processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function processUSDCTransfer(transfer: TokenTransfer, signature?: string) {
  try {
    if (!transfer.amount || !transfer.fromUserAccount || !transfer.toUserAccount) {
      console.warn('Invalid USDC transfer data', { transfer });
      return;
    }

    // Find pending transaction for this merchant
    const { data: pendingTx, error: pendingError } = await supabase
      .from('transactions')
      .select('id, merchant_id, amount, clover_order_id')
      .eq('status', 'pending')
      .eq('amount', transfer.amount)
      .single();

    if (pendingError) {
      console.warn('No pending transaction found for transfer:', transfer);
      return;
    }

    // Verify merchant wallet matches
    const { data: merchant, error: merchantError } = await supabase
      .from('merchants')
      .select('wallet_address')
      .eq('id', pendingTx.merchant_id)
      .single();

    if (merchantError || merchant.wallet_address.toLowerCase() !== transfer.toUserAccount.toLowerCase()) {
      console.warn('Merchant wallet mismatch for transfer:', transfer);
      return;
    }

    // Update transaction status
    const { error: updateError } = await supabase
      .from('transactions')
      .update({
        status: 'completed',
        solana_signature: signature,
        updated_at: new Date().toISOString()
      })
      .eq('id', pendingTx.id);

    if (updateError) {
      throw new Error(`Failed to update transaction status: ${updateError.message}`);
    }

    // TODO: Add webhook call to Clover API to update order status
    // This will be implemented in a separate phase

  } catch (error) {
    console.error('Error processing USDC transfer:', error);
    throw new Error(`USDC transfer processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function storeTransactionData(transaction: WebhookData) {
  try {
    if (!transaction.signature) {
      console.warn('Transaction missing signature');
      return;
    }

    // Calculate total USDC amount from token transfers
    const usdcAmount = transaction.tokenTransfers
      ?.filter(transfer => transfer.mint?.toLowerCase() === USDC_MINT.toLowerCase())
      .reduce((total, transfer) => total + (transfer.amount || 0), 0) || 0;

    // Find merchant by recipient wallet address
    const recipientAddress = transaction.tokenTransfers?.[0]?.toUserAccount;
    if (!recipientAddress) {
      console.warn('No recipient address found in transaction');
      return;
    }

    // Get merchant ID from wallet address
    const { data: merchant, error: merchantError } = await supabase
      .from('merchants')
      .select('id')
      .eq('wallet_address', recipientAddress)
      .single();

    if (merchantError) {
      console.error('Error finding merchant:', merchantError);
      return;
    }

    // Store transaction data
    const { error: insertError } = await supabase
      .from('transactions')
      .insert({
        merchant_id: merchant.id,
        amount: usdcAmount,
        status: 'completed',
        solana_signature: transaction.signature,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (insertError) {
      throw new Error(`Failed to insert transaction: ${insertError.message}`);
    }

  } catch (error) {
    console.error('Error storing transaction data:', error);
    throw new Error(`Transaction storage failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}