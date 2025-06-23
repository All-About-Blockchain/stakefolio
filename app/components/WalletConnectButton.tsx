import { useChain } from '@interchain-kit/react';
import React from 'react';
import Image from 'next/image';

const walletImages: Record<string, string> = {
  'keplr-extension': '/wallet/keplr.png',
  'leap-extension': '/wallet/leap.png',
  'cosmostation-extension': '/wallet/cosmostation.png',
};

const WalletConnectButton = () => {
  const { connect, disconnect, wallet, address } = useChain('cosmoshub');

  return (
    <div className='flex h-12 gap-4 rounded-lg border p-1'>
      {!address ? (
        <button
          onClick={() => connect()}
          className='rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'
        >
          Connect Wallet
        </button>
      ) : (
        <div className='flex items-center gap-3 pl-2'>
          {wallet?.walletName && walletImages[wallet.walletName] && (
            <Image
              src={walletImages[wallet.walletName]}
              alt={wallet.walletName}
              width={24}
              height={24}
              className='h-6 w-6'
            />
          )}
          <p className='rounded bg-gray-100 p-2 font-mono text-sm'>
            {address?.slice(0, 20)}...{address?.slice(-10)}
          </p>
          <button
            onClick={() => disconnect()}
            className='rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600'
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
};

export default WalletConnectButton;
