import Link from 'next/link';
import { useChain } from '@interchain-kit/react';

const WalletConnectButton = () => {
  const { connect, disconnect, wallet, address } = useChain('cosmoshub');

  return (
    <div className='flex flex-col gap-4 rounded-lg border p-4'>
      <h2 className='text-xl font-bold'>CosmosKit Wallet Connection</h2>
      {!address ? (
        <button
          onClick={() => connect()}
          className='rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'
        >
          Connect Wallet
        </button>
      ) : (
        <div className='flex flex-col gap-2'>
          <p className='text-sm text-gray-600'>
            Connected to: {wallet?.walletName}
          </p>
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

const index = () => {
  return (
    <div className='flex flex-col gap-8 p-8 px-12'>
      <WalletConnectButton />
      <div className='flex flex-col gap-2'>
        <Link target='_blank' href='/stakefolio_staking_walkthrough.pdf'>
          Staking Walkthrough
        </Link>
        <Link target='_blank' href='https://www.keplr.app/'>
          Keplr
        </Link>
        <Link target='_blank' href='https://www.leapwallet.io/'>
          Leap
        </Link>
        <Link
          target='_blank'
          href='https://app.kado.money/?onPayCurrency=CAD&onRevCurrency=ATOM&network=Cosmos%20Hub'
        >
          Kado
        </Link>
      </div>
    </div>
  );
};

export default index;
