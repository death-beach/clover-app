// USDC token mint addresses for different networks
export const USDC_MINT = process.env.SOLANA_NETWORK === 'devnet'
  ? 'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr' // Devnet USDC
  : 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'; // Mainnet USDC