import React, { useEffect, useRef, useState } from 'react';
import { generateOnRampURL, initOnRamp } from '@coinbase/cbpay-js';
import { useWallet } from '@/app/contexts/WalletContext';

interface CoinbaseOnrampWidgetProps {
  mode: 'deposit' | 'withdraw';
}

export default function CoinbaseOnrampWidget({
  mode,
}: CoinbaseOnrampWidgetProps) {
  const { address } = useWallet();
  const [onrampInstance, setOnrampInstance] = useState<any>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Coinbase Onramp is primarily for depositing (buying crypto with fiat)
    // Withdrawals (Offramp) are supported via different parameters but we focus on Onramp here first
    if (!buttonRef.current) return;

    // We initialize the experience
    const instance = initOnRamp(
      {
        appId: 'stakefolio_test', // Replace with real Coinbase App ID
        widgetParameters: {
          destinationWallets: [
            {
              address: address || '0x0000000000000000000000000000000000000000',
              blockchains: ['ethereum', 'polygon', 'base'], // Supported traditional finance rails
              assets: ['USDC', 'ETH'],
            },
          ],
        },
        onSuccess: () => {
          console.log('Coinbase Onramp Success');
        },
        onExit: () => {
          console.log('Coinbase Onramp Exited');
        },
        onEvent: (event) => {
          console.log('Coinbase Onramp Event:', event);
        },
        experienceLoggedIn: 'popup',
        experienceLoggedOut: 'popup',
      },
      (error, instance) => {
        if (error) {
          console.error('Coinbase Onramp Error:', error);
        } else {
          setOnrampInstance(instance);
        }
      }
    );

    return () => {
      if (onrampInstance && typeof onrampInstance.destroy === 'function') {
        onrampInstance.destroy();
      }
    };
  }, [address]);

  const handleLaunch = () => {
    if (onrampInstance) {
      onrampInstance.open();
    } else {
      // Fallback to URL generation if init fails
      const url = generateOnRampURL({
        destinationWallets: [
          {
            address: address || '0x0000000000000000000000000000000000000000',
            blockchains: ['base', 'ethereum'],
            assets: ['USDC'],
          },
        ],
      });
      window.open(url, '_blank');
    }
  };

  return (
    <div className='mx-auto max-w-md rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-8 text-center shadow-sm'>
      <div className='mb-6 flex justify-center'>
        <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 shadow-lg'>
          <svg
            className='h-8 w-8 text-white'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
        </div>
      </div>

      <h3 className='mb-2 text-xl font-bold text-gray-900'>
        {mode === 'deposit' ? 'Buy USDC Instantly' : 'Cash Out to Bank'}
      </h3>
      <p className='mb-8 text-sm text-gray-500'>
        {mode === 'deposit'
          ? 'Use your bank account or debit card to buy USDC via Coinbase Onramp.'
          : 'Convert your crypto to fiat and send it directly to your bank account.'}
      </p>

      <button
        ref={buttonRef}
        onClick={handleLaunch}
        className='w-full rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-md'
      >
        Launch Coinbase {mode === 'deposit' ? 'Onramp' : 'Offramp'}
      </button>

      <div className='mt-6 flex items-center justify-center gap-2 text-xs text-gray-400'>
        <svg
          className='h-4 w-4'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
          />
        </svg>
        <span>Secure integration by Coinbase</span>
      </div>
    </div>
  );
}
