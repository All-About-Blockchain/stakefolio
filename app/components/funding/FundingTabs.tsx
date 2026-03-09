import React from 'react';

type FundingMode = 'deposit' | 'withdraw';
type FundingMethod = 'crypto' | 'moonpay' | 'coinbase';

interface FundingTabsProps {
  mode: FundingMode;
  setMode: (mode: FundingMode) => void;
  method: FundingMethod;
  setMethod: (method: FundingMethod) => void;
}

export default function FundingTabs({
  mode,
  setMode,
  method,
  setMethod,
}: FundingTabsProps) {
  return (
    <div className='mx-auto mb-8 w-full max-w-2xl'>
      {/* Deposit / Withdraw Toggle */}
      <div className='mb-6 flex rounded-xl bg-gray-100 p-1'>
        <button
          onClick={() => setMode('deposit')}
          className={`flex-1 rounded-lg py-3 text-sm font-semibold transition-all ${
            mode === 'deposit'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Deposit
        </button>
        <button
          onClick={() => setMode('withdraw')}
          className={`flex-1 rounded-lg py-3 text-sm font-semibold transition-all ${
            mode === 'withdraw'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Withdraw
        </button>
      </div>

      {/* Funding Method Selection */}
      <div className='grid grid-cols-3 gap-3'>
        <button
          onClick={() => setMethod('crypto')}
          className={`flex flex-col items-center justify-center rounded-xl border p-4 transition-all ${
            method === 'crypto'
              ? 'border-purple-500 bg-purple-50 text-purple-700'
              : 'border-gray-200 bg-white text-gray-600 hover:border-purple-200 hover:bg-gray-50'
          }`}
        >
          <svg
            className='mb-2 h-6 w-6'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1'
            />
          </svg>
          <span className='text-sm font-medium'>Native Crypto</span>
        </button>
        <button
          onClick={() => setMethod('coinbase')}
          className={`flex flex-col items-center justify-center rounded-xl border p-4 transition-all ${
            method === 'coinbase'
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 bg-white text-gray-600 hover:border-blue-200 hover:bg-gray-50'
          }`}
        >
          <svg
            className='mb-2 h-6 w-6'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
            />
          </svg>
          <span className='text-sm font-medium'>Card / Bank</span>
        </button>
        <button
          onClick={() => setMethod('moonpay')}
          className={`flex flex-col items-center justify-center rounded-xl border p-4 transition-all ${
            method === 'moonpay'
              ? 'border-purple-500 bg-purple-50 text-purple-700'
              : 'border-gray-200 bg-white text-gray-600 hover:border-purple-200 hover:bg-gray-50'
          }`}
        >
          <svg
            className='mb-2 h-6 w-6'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9'
            />
          </svg>
          <span className='text-sm font-medium'>Global Onramp</span>
        </button>
      </div>
    </div>
  );
}
