import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import { useWallet } from '@/app/contexts/WalletContext';

interface CryptoTransferProps {
  mode: 'deposit' | 'withdraw';
}

export default function CryptoTransfer({ mode }: CryptoTransferProps) {
  const { address } = useWallet();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  if (!address) {
    return (
      <div className='flex flex-col items-center justify-center py-12'>
        <div className='mb-4 rounded-full bg-orange-100 p-4'>
          <svg
            className='h-8 w-8 text-orange-500'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
            />
          </svg>
        </div>
        <h3 className='mb-2 text-lg font-semibold'>Wallet Not Connected</h3>
        <p className='text-center text-gray-500'>
          Please connect your wallet to access direct crypto {mode}s.
        </p>
      </div>
    );
  }

  if (mode === 'deposit') {
    return (
      <div className='flex flex-col items-center justify-center py-8'>
        <div className='mb-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm'>
          <QRCode
            value={address}
            size={200}
            bgColor='#ffffff'
            fgColor='#000000'
            level='Q'
          />
        </div>

        <div className='w-full max-w-sm rounded-xl bg-gray-50 p-4 text-center'>
          <p className='mb-2 text-sm text-gray-500'>Your Deposit Address</p>
          <div className='flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3'>
            <span className='break-all font-mono text-sm text-gray-800'>
              {address}
            </span>
            <button
              onClick={() => navigator.clipboard.writeText(address)}
              className='ml-2 text-purple-600 hover:text-purple-700'
              title='Copy to clipboard'
            >
              <svg
                className='h-5 w-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'
                />
              </svg>
            </button>
          </div>
        </div>
        <p className='mt-6 max-w-md text-center text-sm text-gray-500'>
          Send only supported assets to this address. Sending unsupported assets
          may result in permanent loss.
        </p>
      </div>
    );
  }

  return (
    <div className='mx-auto max-w-md py-4'>
      <div className='mb-6 space-y-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm'>
        <div>
          <label className='mb-2 block text-sm font-medium text-gray-700'>
            Recipient Address
          </label>
          <input
            type='text'
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder='cosmos1...'
            className='w-full rounded-lg border border-gray-300 p-3 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500'
          />
        </div>
        <div>
          <label className='mb-2 block text-sm font-medium text-gray-700'>
            Amount
          </label>
          <div className='relative'>
            <input
              type='number'
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder='0.00'
              className='w-full rounded-lg border border-gray-300 p-3 pr-16 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500'
            />
            <div className='absolute inset-y-0 right-0 flex items-center pr-3'>
              <span className='text-gray-500'>ATOM</span>
            </div>
          </div>
        </div>

        <button
          className='mt-6 w-full rounded-lg bg-purple-600 py-3 font-semibold text-white transition-colors hover:bg-purple-700 disabled:opacity-50'
          disabled={!recipient || !amount}
        >
          Preview Withdrawal
        </button>
      </div>
    </div>
  );
}
