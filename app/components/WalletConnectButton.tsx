import React, { useState } from 'react';
import Image from 'next/image';
import { Zap, ChevronDown } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import { useBrowserWallet } from '../hooks/useBrowserWallet';
import { useToast } from '../contexts/ToastContext';
import { QuickWalletSetup } from './onboarding/QuickWalletSetup';

const walletImages: Record<string, string> = {
  'keplr-extension': '/wallet/keplr.png',
  'leap-extension': '/wallet/leap.png',
  'cosmostation-extension': '/wallet/cosmostation.png',
};

const WalletConnectButton = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showQuickWallet, setShowQuickWallet] = useState(false);
  const { addToast } = useToast();
  const {
    address,
    connectedWallet,
    connectBrowserWallet,
    connectKeplr,
    connectCosmostation,
    connectLeap,
    disconnect,
  } = useWallet();
  const { wallets: browserWallets, activeWallet } = useBrowserWallet();

  const handleConnectBrowserWallet = async (walletAddress: string) => {
    try {
      await connectBrowserWallet(walletAddress);
      addToast('Browser wallet connected successfully!', 'success');
      setIsExpanded(false);
    } catch (error) {
      addToast('Failed to connect browser wallet', 'error');
    }
  };

  const handleConnectExtension = async (
    walletType: 'keplr' | 'cosmostation' | 'leap'
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
      }
      addToast(`${walletType} wallet connected successfully!`, 'success');
      setIsExpanded(false);
    } catch (error) {
      addToast(`Failed to connect ${walletType} wallet`, 'error');
    }
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

  const handleQuickWalletComplete = () => {
    setShowQuickWallet(false);
    setIsExpanded(false);
    addToast('Quick wallet connected successfully!', 'success');
  };

  const getWalletIcon = () => {
    if (connectedWallet === 'browser') {
      return (
        <div className='flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500'>
          <Zap className='h-3 w-3 text-white' />
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
    if (connectedWallet === 'browser') return 'Quick Wallet';
    if (connectedWallet === 'keplr') return 'Keplr';
    if (connectedWallet === 'cosmostation') return 'Cosmostation';
    if (connectedWallet === 'leap') return 'Leap';
    return 'Wallet';
  };

  return (
    <div className='relative'>
      {/* Quick Wallet Setup Modal */}
      {showQuickWallet && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl'>
            <QuickWalletSetup
              onComplete={handleQuickWalletComplete}
              onBack={() => setShowQuickWallet(false)}
            />
          </div>
        </div>
      )}

      {/* Main button */}
      <div className='flex h-12 gap-4 rounded-lg border-0 p-1'>
        {!address ? (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className='glass-button flex items-center gap-2 rounded-lg border-0 px-4 py-2 text-sm font-medium transition-all duration-200 hover:bg-gray-100'
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
            className='glass-button flex items-center gap-3 rounded-lg border-0 px-4 py-2 text-sm font-medium transition-all duration-200 hover:bg-gray-100'
          >
            {getWalletIcon()}
            <div className='flex items-center gap-2'>
              <p className='glass-ultra-light rounded-lg p-2 font-mono text-sm'>
                {address?.slice(0, 8)}...{address?.slice(-6)}
              </p>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              />
            </div>
          </button>
        )}
      </div>

      {/* Expanded dropdown */}
      {isExpanded && (
        <div className='bright-card ultra-soft-shadow absolute right-0 top-14 z-50 w-[400px] rounded-xl border-0 p-4 shadow-2xl'>
          <div className='mb-4 flex justify-between'>
            <h3 className='font-semibold text-gray-800'>
              {address ? 'Wallet Options' : 'Choose Wallet'}
            </h3>
            <button
              onClick={() => setIsExpanded(false)}
              className='text-gray-500 hover:text-gray-700'
            >
              ✕
            </button>
          </div>

          {address ? (
            /* Connected wallet options */
            <div className='space-y-4'>
              <div className='rounded-lg bg-emerald-50 p-4'>
                <div className='flex items-center gap-3'>
                  {getWalletIcon()}
                  <div>
                    <p className='font-medium text-emerald-800'>
                      {getWalletName()}
                    </p>
                    <p className='text-sm text-emerald-600'>
                      {address?.slice(0, 8)}...{address?.slice(-6)}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleDisconnect}
                className='w-full rounded-lg bg-red-500 px-4 py-3 font-medium text-white transition-colors hover:bg-red-600'
              >
                Disconnect Wallet
              </button>
            </div>
          ) : (
            /* Wallet connection options */
            <div className='space-y-4'>
              {/* Browser Wallet Section */}
              <div>
                <h4 className='mb-3 text-sm font-semibold text-gray-700'>
                  Quick Wallet
                </h4>

                {/* Existing Browser Wallets */}
                {browserWallets.length > 0 && (
                  <div className='mb-3 space-y-2'>
                    {browserWallets.map((wallet) => (
                      <div
                        key={wallet.address}
                        className='flex items-center justify-between rounded-lg border border-gray-200 p-3'
                      >
                        <div className='flex items-center gap-3'>
                          <div className='flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500'>
                            <Zap className='h-4 w-4 text-white' />
                          </div>
                          <div>
                            <p className='text-sm font-medium text-gray-800'>
                              {wallet.name}
                            </p>
                            <p className='font-mono text-xs text-gray-500'>
                              {wallet.address.slice(0, 8)}...
                              {wallet.address.slice(-6)}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            handleConnectBrowserWallet(wallet.address)
                          }
                          className='rounded bg-gradient-to-r from-purple-500 to-blue-500 px-3 py-1 text-xs font-medium text-white transition-all hover:scale-105'
                        >
                          Connect
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Create New Quick Wallet */}
                <button
                  onClick={() => setShowQuickWallet(true)}
                  className='flex w-full items-center gap-3 rounded-lg border border-gray-200 p-3 text-left transition-all hover:border-purple-300 hover:bg-purple-50'
                >
                  <div className='flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500'>
                    <Zap className='h-4 w-4 text-white' />
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-800'>
                      Create Quick Wallet
                    </p>
                    <p className='text-xs text-gray-500'>
                      Generate wallet instantly
                    </p>
                  </div>
                </button>
              </div>

              {/* Extension Wallets Section */}
              <div>
                <h4 className='mb-3 text-sm font-semibold text-gray-700'>
                  Extension Wallets
                </h4>
                <div className='space-y-2'>
                  {/* Keplr */}
                  <button
                    onClick={() => handleConnectExtension('keplr')}
                    className='flex w-full items-center gap-3 rounded-lg border border-gray-200 p-3 text-left transition-all hover:border-purple-300 hover:bg-purple-50'
                  >
                    <Image
                      src='/wallet/keplr.png'
                      alt='Keplr'
                      width={32}
                      height={32}
                      className='h-8 w-8'
                    />
                    <div>
                      <p className='text-sm font-medium text-gray-800'>Keplr</p>
                      <p className='text-xs text-gray-500'>
                        Most popular Cosmos wallet
                      </p>
                    </div>
                  </button>

                  {/* Cosmostation */}
                  <button
                    onClick={() => handleConnectExtension('cosmostation')}
                    className='flex w-full items-center gap-3 rounded-lg border border-gray-200 p-3 text-left transition-all hover:border-purple-300 hover:bg-purple-50'
                  >
                    <Image
                      src='/wallet/cosmostation.png'
                      alt='Cosmostation'
                      width={32}
                      height={32}
                      className='h-8 w-8'
                    />
                    <div>
                      <p className='text-sm font-medium text-gray-800'>
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
                    className='flex w-full items-center gap-3 rounded-lg border border-gray-200 p-3 text-left transition-all hover:border-purple-300 hover:bg-purple-50'
                  >
                    <Image
                      src='/wallet/leap.png'
                      alt='Leap'
                      width={32}
                      height={32}
                      className='h-8 w-8'
                    />
                    <div>
                      <p className='text-sm font-medium text-gray-800'>Leap</p>
                      <p className='text-xs text-gray-500'>
                        Modern Cosmos wallet
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WalletConnectButton;
