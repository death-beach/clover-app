import { Connection } from '@solana/web3.js';
import { withRetry } from '../lib/blockchain/retry';
import { BlockchainCache } from '../lib/blockchain/cache';
import { RateLimiter } from '../lib/blockchain/rateLimiter';
import { logger } from '../lib/logger';
import { HeliusConfig } from './config';

export class HeliusClient {
  private connection: Connection;
  private cache: BlockchainCache;
  private rateLimiter: RateLimiter;
  private config: HeliusConfig;

  constructor(config: HeliusConfig) {
    this.config = config;
    this.connection = new Connection(config.rpcEndpoint);
    this.cache = new BlockchainCache();
    this.rateLimiter = new RateLimiter(1000, 50); // 50 requests per second
  }

  async getEnrichedTransaction(signature: string) {
    const cacheKey = `enriched-tx:${signature}`;
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    await this.rateLimiter.acquire();

    try {
      const response = await withRetry(async () => {
        const result = await fetch(`https://api.helius.xyz/v0/transactions/?api-key=${this.config.apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transactions: [signature] })
        });

        if (!result.ok) {
          throw new Error(`Helius API error: ${result.statusText}`);
        }

        return await result.json();
      });

      this.cache.set(cacheKey, response[0], { ttl: 5 * 60 * 1000 }); // Cache for 5 minutes
      return response[0];
    } catch (error) {
      logger.error('Failed to fetch enriched transaction', {
        signature,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  async getAssetsByOwner(owner: string) {
    const cacheKey = `assets:${owner}`;
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    await this.rateLimiter.acquire();

    try {
      const response = await withRetry(async () => {
        const result = await fetch(
          `https://api.helius.xyz/v0/addresses/${owner}/balances?api-key=${this.config.apiKey}`
        );

        if (!result.ok) {
          throw new Error(`Helius API error: ${result.statusText}`);
        }

        return await result.json();
      });

      this.cache.set(cacheKey, response, { ttl: 30 * 1000 }); // Cache for 30 seconds
      return response;
    } catch (error) {
      logger.error('Failed to fetch assets', {
        owner,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  async getTokenTransfers(signature: string) {
    const cacheKey = `token-transfers:${signature}`;
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    await this.rateLimiter.acquire();

    try {
      const enrichedTx = await this.getEnrichedTransaction(signature);
      const transfers = enrichedTx.tokenTransfers || [];

      this.cache.set(cacheKey, transfers, { ttl: 5 * 60 * 1000 }); // Cache for 5 minutes
      return transfers;
    } catch (error) {
      logger.error('Failed to fetch token transfers', {
        signature,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  async parseTransaction(signature: string) {
    const cacheKey = `parsed-tx:${signature}`;
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    await this.rateLimiter.acquire();

    try {
      const enrichedTx = await this.getEnrichedTransaction(signature);
      
      // Extract relevant information
      const parsed = {
        timestamp: enrichedTx.timestamp,
        fee: enrichedTx.fee,
        status: enrichedTx.status,
        type: enrichedTx.type,
        tokenTransfers: enrichedTx.tokenTransfers,
        nativeTransfers: enrichedTx.nativeTransfers,
        accountData: enrichedTx.accountData,
        events: enrichedTx.events
      };

      this.cache.set(cacheKey, parsed, { ttl: 5 * 60 * 1000 }); // Cache for 5 minutes
      return parsed;
    } catch (error) {
      logger.error('Failed to parse transaction', {
        signature,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  // Webhook management methods
  async createWebhook(webhookUrl: string, accountAddresses: string[]) {
    try {
      const response = await withRetry(async () => {
        const result = await fetch('https://api.helius.xyz/v0/webhooks', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.apiKey}`
          },
          body: JSON.stringify({
            webhookURL: webhookUrl,
            accountAddresses,
            transactionTypes: ['ANY'],
            webhook: {
              includeMetadata: true,
              includeTokenBalances: true
            }
          })
        });

        if (!result.ok) {
          throw new Error(`Failed to create webhook: ${result.statusText}`);
        }

        return await result.json();
      });

      logger.info('Created Helius webhook', { webhookUrl, accountAddresses });
      return response;
    } catch (error) {
      logger.error('Failed to create webhook', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  async deleteWebhook(webhookId: string) {
    try {
      await withRetry(async () => {
        const result = await fetch(`https://api.helius.xyz/v0/webhooks/${webhookId}`, {
          method: 'DELETE',
          headers: { 
            'Authorization': `Bearer ${this.config.apiKey}`
          }
        });

        if (!result.ok) {
          throw new Error(`Failed to delete webhook: ${result.statusText}`);
        }
      });

      logger.info('Deleted Helius webhook', { webhookId });
    } catch (error) {
      logger.error('Failed to delete webhook', {
        webhookId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }
}