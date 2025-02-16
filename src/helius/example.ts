import { HeliusClient } from './client';
import { getHeliusConfig } from './config';
import { logger } from '../lib/logger';

async function example() {
  // Initialize Helius client
  const config = getHeliusConfig();
  const helius = new HeliusClient(config);

  try {
    // Example: Get enriched transaction
    const signature = 'your-transaction-signature';
    const enrichedTx = await helius.getEnrichedTransaction(signature);
    logger.info('Enriched transaction', { signature, type: enrichedTx.type });

    // Example: Get assets by owner
    const owner = 'owner-address';
    const assets = await helius.getAssetsByOwner(owner);
    logger.info('Assets fetched', { owner, count: assets.length });

    // Example: Get token transfers from transaction
    const transfers = await helius.getTokenTransfers(signature);
    logger.info('Token transfers', { signature, count: transfers.length });

    // Example: Create webhook
    const webhook = await helius.createWebhook(
      'https://your-webhook-url.com',
      ['address1', 'address2']
    );
    logger.info('Webhook created', { webhookId: webhook.id });

  } catch (error) {
    logger.error('Example failed', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Run example
example();