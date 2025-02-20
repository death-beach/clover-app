declare namespace NodeJS {
  interface ProcessEnv {
    // Auth
    PRIVY_APP_ID: string;
    CLOVER_CLIENT_ID: string;
    CLOVER_CLIENT_SECRET: string;
    
    // Solana
    HELIUS_API_KEY: string;
    
    // Helio
    HELIO_API_KEY: string;
    HELIO_WEBHOOK_SECRET: string;
    
    // Database
    DATABASE_URL: string;
    
    // Environment
    NODE_ENV: 'development' | 'production' | 'test';
    NEXT_PUBLIC_APP_URL: string;
  }
}