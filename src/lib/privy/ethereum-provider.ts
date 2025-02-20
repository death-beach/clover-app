import { ethers } from 'ethers';
import { useWallet } from '@privy-io/react-auth';

export const useEthereumProvider = () => {
  const { wallet } = useWallet();

  const getProvider = async () => {
    if (!wallet) {
      throw new Error('Wallet not initialized');
    }

    const provider = await wallet.getEthereumProvider();
    return new ethers.BrowserProvider(provider);
  };

  const sendTransaction = async (transaction: ethers.TransactionRequest) => {
    const provider = await getProvider();
    const signer = await provider.getSigner();
    
    // Send transaction and get hash
    const { hash } = await signer.sendTransaction(transaction);
    
    // Wait for transaction receipt
    const receipt = await provider.waitForTransactionReceipt({ hash });
    
    return { hash, receipt };
  };

  return {
    getProvider,
    sendTransaction,
  };
};

// Export types for better DX
export type UseEthereumProviderReturn = ReturnType<typeof useEthereumProvider>;