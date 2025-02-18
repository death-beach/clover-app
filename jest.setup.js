// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock environment variables
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
process.env.NEXT_PUBLIC_HELIUS_API_KEY = 'test-helius-key';
process.env.SOLANA_NETWORK = 'devnet';
process.env.WEBHOOK_SECRET = 'test-webhook-secret';
process.env.HELIO_API_KEY = 'test-helio-key';
process.env.HELIO_API_URL = 'https://api.test.helio.com';