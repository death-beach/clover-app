import { z } from 'zod';

const configSchema = z.object({
  // Auth
  privyAppId: z.string(),
  cloverClientId: z.string(),
  cloverClientSecret: z.string(),
  
  // Solana
  heliusApiKey: z.string(),
  
  // Database
  databaseUrl: z.string(),
  
  // Environment
  isDev: z.boolean(),
  isProd: z.boolean(),
  appUrl: z.string(),
  
  // Fees
  offRampFee: z.number().default(0.005), // 0.50%
  merchantFee: z.number().default(0.022), // 2.2%
  merchantFeeFixed: z.number().default(0.10), // $0.10
});

export const config = configSchema.parse({
  // Auth
  privyAppId: process.env.PRIVY_APP_ID,
  cloverClientId: process.env.CLOVER_API_KEY,
  cloverClientSecret: process.env.CLOVER_CLIENT_SECRET,
  
  // Solana
  heliusApiKey: process.env.HELIUS_API_KEY,
  
  // Database
  databaseUrl: process.env.DATABASE_URL,
  
  // Environment
  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',
  appUrl: process.env.NEXT_PUBLIC_APP_URL,
});

export type Config = z.infer<typeof configSchema>;