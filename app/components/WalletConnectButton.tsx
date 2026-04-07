import React, { useState } from 'react';
import { ChevronDown, Shield, LogOut } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import { useToast } from '../contexts/ToastContext';

const WalletConnectButton = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { addToast } = useToast();
  const { address, connectPrivy, disconnect } = useWallet();

  const handleConnectPrivy = () => {
    connectPrivy();
    setIsExpanded(false);
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      addToast('Wallet disconnected successfully!', 'info');
      setIsExpanded(false);
    } catch (error) {
      addToast('Failed to disconnect wallet', 'error');
    }
  };

  return (
    <div className='relative'>
      <div className='flex h-12 gap-4 rounded-lg border-0 p-1'>
        {!address ? (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className='flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-black transition-all hover:border-black hover:shadow-sm'
          >
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
            Connect Wallet
            <ChevronDown
              className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            />
          </button>
        ) : (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className='flex items-center gap-3 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-black transition-all hover:border-black hover:shadow-sm'
          >
            <div className='flex h-6 w-6 items-center justify-center rounded-full bg-black'>
              <Shield className='h-3 w-3 text-white' />
            </div>
            <div className='flex items-center gap-2'>
              <p className='font-mono text-sm tracking-tight'>
                {address?.slice(0, 8)}...{address?.slice(-6)}
              </p>
              <ChevronDown
                className={`h-4 w-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              />
            </div>
          </button>
        )}
      </div>

      {isExpanded && (
        <div className='absolute right-0 top-14 z-50 w-[400px] rounded-2xl border border-gray-100 bg-white p-6 shadow-xl'>
          <div className='mb-6 flex items-center justify-between border-b border-gray-100 pb-4'>
            <h3 className='font-["Playfair_Display",_serif] text-xl font-light text-black'>
              {address ? 'Wallet Options' : 'Connect Wallet'}
            </h3>
            <button
              onClick={() => setIsExpanded(false)}
              className='text-gray-400 transition-colors hover:text-black'
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
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          </div>

          {address ? (
            <div className='space-y-4'>
              <div className='rounded-xl border border-gray-100 bg-gray-50 p-4'>
                <div className='flex items-center gap-4'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-black'>
                    <Shield className='h-5 w-5 text-white' />
                  </div>
                  <div>
                    <p className='font-medium text-black'>Privy Wallet</p>
                    <p className='text-sm text-gray-500'>
                      {address?.slice(0, 8)}...{address?.slice(-6)}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleDisconnect}
                className='mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-50 py-3 font-medium text-red-600 transition-colors hover:bg-red-50'
              >
                <LogOut className='h-4 w-4' />
                Disconnect Wallet
              </button>
            </div>
          ) : (
            <div className='space-y-6'>
              <div>
                <button
                  onClick={handleConnectPrivy}
                  className='group flex w-full items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 text-left transition-all hover:border-black hover:shadow-md'
                >
                  <div className='flex h-12 w-12 items-center justify-center rounded-full bg-black transition-transform group-hover:scale-105'>
                    <Shield className='h-6 w-6 text-white' />
                  </div>
                  <div>
                    <p className='font-medium text-black'>Connect with Privy</p>
                    <p className='text-sm text-gray-500'>
                      Email, social, or external wallet
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WalletConnectButton;
