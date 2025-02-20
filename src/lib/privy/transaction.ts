import { ethers } from 'ethers';
import { useEthereumProvider } from './ethereum-provider';

export interface TransactionConfig {
  to: string;
  value: bigint | string;
  data?: string;
  gasLimit?: bigint;
  maxFeePerGas?: bigint;
  maxPriorityFeePerGas?: bigint;
}

export const useTransaction = () => {
  const { sendTransaction, getProvider } = useEthereumProvider();

  const executeTransaction = async (config: TransactionConfig) => {
    try {
      // Convert value to BigInt if it's a string
      const value = typeof config.value === 'string' 
        ? ethers.parseEther(config.value)
        : config.value;

      // Prepare transaction request
      const transaction: ethers.TransactionRequest = {
        to: config.to,
        value,
        data: config.data,
        gasLimit: config.gasLimit,
        maxFeePerGas: config.maxFeePerGas,
        maxPriorityFeePerGas: config.maxPriorityFeePerGas,
      };

      // Send transaction and get result
      const { hash, receipt } = await sendTransaction(transaction);

      return {
        hash,
        receipt,
        status: receipt.status === 1 ? 'success' : 'failed',
      };
    } catch (error) {
      throw new Error(
        error instanceof Error 
          ? error.message 
          : 'Transaction failed'
      );
    }
  };

  const estimateGas = async (config: Omit<TransactionConfig, 'gasLimit'>) => {
    const provider = await getProvider();
    const value = typeof config.value === 'string' 
      ? ethers.parseEther(config.value)
      : config.value;

    const estimate = await provider.estimateGas({
      to: config.to,
      value,
      data: config.data,
    });

    return estimate;
  };

  return {
    executeTransaction,
    estimateGas,
  };
};

// Export types for better DX
export type UseTransactionReturn = ReturnType<typeof useTransaction>;