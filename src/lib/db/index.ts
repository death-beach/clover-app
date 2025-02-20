import { sql } from '@vercel/postgres';
import { config } from '@/config';

if (!config.databaseUrl) {
  throw new Error('DATABASE_URL is not set');
}

export { sql };

export async function queryWithErrorHandling<T>(
  query: string,
  values: any[] = []
): Promise<T> {
  try {
    const result = await sql.query(query, values);
    return result.rows as T;
  } catch (error) {
    console.error('Database query error:', error);
    throw new Error('Database operation failed');
  }
}

// Export type-safe query functions for each table
export async function getMerchant(merchantId: string) {
  return queryWithErrorHandling(
    'SELECT * FROM merchants WHERE merchant_id = $1',
    [merchantId]
  );
}

export async function getUser(userId: string) {
  return queryWithErrorHandling(
    'SELECT * FROM users WHERE user_id = $1',
    [userId]
  );
}

export async function getTransaction(transactionId: string) {
  return queryWithErrorHandling(
    'SELECT * FROM transactions WHERE transaction_id = $1',
    [transactionId]
  );
}

export async function getTransfer(transferId: string) {
  return queryWithErrorHandling(
    'SELECT * FROM transfers WHERE transfer_id = $1',
    [transferId]
  );
}