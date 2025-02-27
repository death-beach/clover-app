"use client";

// builtin
import { useEffect } from 'react';

// external
import { useWallet } from '@solana/wallet-adapter-react';

export function PhantomConnect() {
  const { connect, disconnect, connected, wallet, publicKey } = useWallet();

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Failed to connect Phantom:', error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error('Failed to disconnect Phantom:', error);
    }
  };

  useEffect(() => {
    if (connected && publicKey) {
      console.log('Phantom connected:', publicKey.toBase58());
    }
  }, [connected, publicKey]);

  return (
    <div>
      {connected ? (
        <button onClick={handleDisconnect}>
          Disconnect Phantom ({publicKey?.toBase58()})
        </button>
      ) : (
        <button onClick={handleConnect} disabled={!wallet}>
          Connect Phantom
        </button>
      )}
    </div>
  );
}