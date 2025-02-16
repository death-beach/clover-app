export enum Network {
  MAINNET = 'mainnet-beta',
  DEVNET = 'devnet',
  TESTNET = 'testnet'
}

export interface NetworkConfig {
  rpcUrl: string;
  network: Network;
  confirmationTimeout: number;
}