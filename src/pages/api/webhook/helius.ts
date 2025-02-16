import { NextApiRequest, NextApiResponse } from 'next';
import { WebhookType } from '../../../helius/config';
import { HeliusWebhookData, TokenTransfer, WebhookData } from '../../../types/helius';
import { USDC_MINT } from '../../../config/tokens';

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

    // TODO: Implement these functions based on your business logic
    // 1. Verify if this transfer is related to a pending payment
    // 2. Update payment status if verified
    // 3. Trigger any necessary notifications or follow-up actions
    
    // Example implementation structure:
    // const payment = await findPendingPayment(transfer);
    // if (payment) {
    //   await updatePaymentStatus(payment.id, 'completed', {
    //     signature,
    //     amount: transfer.amount,
    //     from: transfer.fromUserAccount,
    //     to: transfer.toUserAccount,
    //   });
    //   await sendPaymentConfirmation(payment);
    // }
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

    // TODO: Implement transaction storage logic
    // This could be storing in your database for:
    // - Transaction history
    // - Audit trails
    // - Analytics
    
    // Example implementation structure:
    // await prisma.transaction.create({
    //   data: {
    //     signature: transaction.signature,
    //     timestamp: transaction.timestamp,
    //     type: transaction.type,
    //     description: transaction.description,
    //     // ... other relevant fields
    //   }
    // });
  } catch (error) {
    console.error('Error storing transaction data:', error);
    throw new Error(`Transaction storage failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}