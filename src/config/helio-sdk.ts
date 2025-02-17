import axios from 'axios';

const HELIO_API_BASE_URL = 'https://api.hel.io/v1';

if (!process.env.HELIO_API_KEY) {
  throw new Error('HELIO_API_KEY is not defined');
}

// Create Helio API client
export const helioApi = axios.create({
  baseURL: HELIO_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.HELIO_API_KEY}`
  }
});

// Network configuration
export const SOLANA_NETWORK = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'mainnet';