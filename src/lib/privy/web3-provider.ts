import { useWallet } from '@privy-io/react-auth';
import Web3 from 'web3';

export const useWeb3Provider = () => {
  const { wallet } = useWallet();

  const getWeb3 = async () => {
    if (!wallet) {
      throw new Error('Wallet not initialized');
    }

    const provider = await wallet.getEthereumProvider();
    return new Web3(provider);
  };

  const getAccounts = async () => {
    const web3 = await getWeb3();
    return web3.eth.getAccounts();
  };

  const getChainId = async () => {
    const web3 = await getWeb3();
    return web3.eth.getChainId();
  };

  return {
    getWeb3,
    getAccounts,
    getChainId,
  };
};

// Export types for better DX
export type UseWeb3ProviderReturn = ReturnType<typeof useWeb3Provider>;