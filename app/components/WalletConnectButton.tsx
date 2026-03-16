import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, Shield, LogOut, Settings } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import { useToast } from '../contexts/ToastContext';

const walletImages: Record<string, string> = {
  'keplr-extension': '/wallet/keplr.png',
  'leap-extension': '/wallet/leap.png',
  'cosmostation-extension': '/wallet/cosmostation.png',
  'okx-extension': '/wallet/okx.png',
  'metamask-extension': '/wallet/metamask.png',
};

const WalletConnectButton = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { addToast } = useToast();
  const {
    address,
    connectedWallet,
    isProMode,
    toggleProMode,
    connectPrivy,
    connectKeplr,
    connectCosmostation,
    connectLeap,
    connectOkx,
    disconnect,
  } = useWallet();

  const handleConnectExtension = async (
    walletType: 'keplr' | 'cosmostation' | 'leap' | 'okx'
  ) => {
    try {
      switch (walletType) {
        case 'keplr':
          await connectKeplr();
          break;
        case 'cosmostation':
          await connectCosmostation();
          break;
        case 'leap':
          await connectLeap();
          break;
        case 'okx':
          await connectOkx();
          break;
      }
      addToast(`${walletType} wallet connected successfully!`, 'success');
      setIsExpanded(false);
    } catch (error) {
      addToast(`Failed to connect ${walletType} wallet`, 'error');
    }
  };

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

  const getWalletIcon = () => {
    if (connectedWallet === 'privy') {
      return (
        <div className='flex h-6 w-6 items-center justify-center rounded-full bg-black'>
          <Shield className='h-3 w-3 text-white' />
        </div>
      );
    }

    if (connectedWallet && walletImages[`${connectedWallet}-extension`]) {
      return (
        <Image
          src={walletImages[`${connectedWallet}-extension`]}
          alt={connectedWallet}
          width={24}
          height={24}
          className='h-6 w-6'
        />
      );
    }

    return null;
  };

  const getWalletName = () => {
    if (connectedWallet === 'privy') return 'Privy Wallet';
    if (connectedWallet === 'keplr') return 'Keplr';
    if (connectedWallet === 'cosmostation') return 'Cosmostation';
    if (connectedWallet === 'leap') return 'Leap';
    if (connectedWallet === 'okx') return 'OKX Wallet';
    if (connectedWallet === 'metamask') return 'MetaMask';
    if (connectedWallet === 'station') return 'Station';
    if (connectedWallet === 'xdefi') return 'XDEFI';
    return 'Wallet';
  };

  return (
    <div className='relative'>
      {/* Main button */}
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
            {getWalletIcon()}
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

      {/* Expanded dropdown */}
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
            /* Connected wallet options */
            <div className='space-y-4'>
              <div className='rounded-xl border border-gray-100 bg-gray-50 p-4'>
                <div className='flex items-center gap-4'>
                  {getWalletIcon()}
                  <div>
                    <p className='font-medium text-black'>{getWalletName()}</p>
                    <p className='text-sm text-gray-500'>
                      {address?.slice(0, 8)}...{address?.slice(-6)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Pro Mode Toggle */}
              <div className='flex items-center justify-between rounded-xl border border-gray-100 p-4'>
                <div className='flex items-center gap-2'>
                  <Settings className='h-4 w-4 text-gray-500' />
                  <span className='text-sm font-medium text-gray-700'>
                    Pro Mode
                  </span>
                </div>
                <button
                  onClick={toggleProMode}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isProMode ? 'bg-black' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isProMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
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
            /* Wallet connection options */
            <div className='space-y-6'>
              {/* Primary: Privy Login */}
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
                      Email, social, or wallet
                    </p>
                  </div>
                </button>
              </div>

              {/* Pro Mode Toggle */}
              <div className='flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-4'>
                <div className='flex items-center gap-2'>
                  <Settings className='h-4 w-4 text-gray-500' />
                  <span className='text-sm text-gray-600'>
                    Show extension wallets
                  </span>
                </div>
                <button
                  onClick={toggleProMode}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isProMode ? 'bg-black' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isProMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Extension Wallets (Pro Mode only) */}
              {isProMode && (
                <div className='animate-in fade-in slide-in-from-top-2 duration-300'>
                  <h4 className='mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400'>
                    Extension Wallets
                  </h4>
                  <div className='space-y-3'>
                    {/* Keplr */}
                    <button
                      onClick={() => handleConnectExtension('keplr')}
                      className='flex w-full items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 text-left transition-all hover:border-gray-300 hover:bg-gray-50'
                    >
                      <Image
                        src='/wallet/keplr.png'
                        alt='Keplr'
                        width={32}
                        height={32}
                        className='h-8 w-8'
                      />
                      <div>
                        <p className='text-sm font-medium text-black'>Keplr</p>
                        <p className='text-xs text-gray-500'>
                          Most popular Cosmos wallet
                        </p>
                      </div>
                    </button>

                    {/* Cosmostation */}
                    <button
                      onClick={() => handleConnectExtension('cosmostation')}
                      className='flex w-full items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 text-left transition-all hover:border-gray-300 hover:bg-gray-50'
                    >
                      <Image
                        src='/wallet/cosmostation.png'
                        alt='Cosmostation'
                        width={32}
                        height={32}
                        className='h-8 w-8'
                      />
                      <div>
                        <p className='text-sm font-medium text-black'>
                          Cosmostation
                        </p>
                        <p className='text-xs text-gray-500'>
                          Mobile-first experience
                        </p>
                      </div>
                    </button>

                    {/* Leap */}
                    <button
                      onClick={() => handleConnectExtension('leap')}
                      className='flex w-full items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 text-left transition-all hover:border-gray-300 hover:bg-gray-50'
                    >
                      <Image
                        src='/wallet/leap.png'
                        alt='Leap'
                        width={32}
                        height={32}
                        className='h-8 w-8'
                      />
                      <div>
                        <p className='text-sm font-medium text-black'>Leap</p>
                        <p className='text-xs text-gray-500'>
                          Modern Cosmos wallet
                        </p>
                      </div>
                    </button>

                    {/* OKX Wallet */}
                    <button
                      onClick={() => handleConnectExtension('okx')}
                      className='flex w-full items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 text-left transition-all hover:border-gray-300 hover:bg-gray-50'
                    >
                      <Image
                        src='/wallet/okx.png'
                        alt='OKX Wallet'
                        width={32}
                        height={32}
                        className='h-8 w-8'
                      />
                      <div>
                        <p className='text-sm font-medium text-black'>
                          OKX Wallet
                        </p>
                        <p className='text-xs text-gray-500'>
                          Multi-chain DeFi wallet
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WalletConnectButton;
