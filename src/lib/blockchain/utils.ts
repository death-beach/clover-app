// external
import { Connection, ParsedTransactionWithMeta, PublicKey } from '@solana/web3.js';

// internal
import { BlockchainCache } from '@/lib/blockchain/cache';
import { RateLimiter } from '@/lib/blockchain/rateLimiter';
import { withRetry } from '@/lib/blockchain/retry';
import { logger } from '@/lib/logger';

interface TokenAccount {
  mint: string;
  amount: string;
  decimals: number;
}

// Initialize cache and rate limiter
const cache = new BlockchainCache();
const rateLimiter = new RateLimiter(1000, 50); // 50 requests per second

export class BlockchainUtils {
  private connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
  }

  async getTransaction(signature: string): Promise<ParsedTransactionWithMeta | null> {
    const cacheKey = `tx:${signature}`;
    const cachedTx = cache.get<ParsedTransactionWithMeta>(cacheKey);
    
    if (cachedTx) {
      logger.debug('Cache hit for transaction', { signature });
      return cachedTx;
    }

    await rateLimiter.acquire();

    try {
      const tx = await withRetry(async () => {
        return await this.connection.getParsedTransaction(signature, {
          maxSupportedTransactionVersion: 0,
        });
      });

      if (tx) {
        cache.set(cacheKey, tx, { ttl: 5 * 60 * 1000 }); // Cache for 5 minutes
      }

      return tx;
    } catch (error) {
      logger.error('Failed to fetch transaction', {
        signature,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  async getBalance(address: string): Promise<number> {
    const cacheKey = `balance:${address}`;
    const cachedBalance = cache.get<number>(cacheKey);
    
    if (cachedBalance !== null) {
      logger.debug('Cache hit for balance', { address });
      return cachedBalance;
    }

    await rateLimiter.acquire();

    try {
      const balance = await withRetry(async () => {
        return await this.connection.getBalance(new PublicKey(address));
      });

      cache.set(cacheKey, balance, { ttl: 30 * 1000 }); // Cache for 30 seconds
      return balance;
    } catch (error) {
      logger.error('Failed to fetch balance', {
        address,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  async getTokenAccounts(owner: string): Promise<TokenAccount[]> {
    const cacheKey = `tokens:${owner}`;
    const cachedAccounts = cache.get<TokenAccount[]>(cacheKey);
    
    if (cachedAccounts) {
      return cachedAccounts;
    }

    await rateLimiter.acquire();

    try {
      const accounts = await withRetry(async () => 
        this.connection.getParsedTokenAccountsByOwner(
          new PublicKey(owner),
          { programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') }
        )
      );

      const parsedAccounts: TokenAccount[] = accounts.value.map(account => ({
        mint: account.account.data.parsed.info.mint,
        amount: account.account.data.parsed.info.tokenAmount.amount,
        decimals: account.account.data.parsed.info.tokenAmount.decimals,
      }));

      cache.set(cacheKey, parsedAccounts, { ttl: 60 * 1000 });
      return parsedAccounts;
    } catch (error) {
      logger.error('Failed to fetch token accounts', {
        owner,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  // Add more utility methods as needed...
}