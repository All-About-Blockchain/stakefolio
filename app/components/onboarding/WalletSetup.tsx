import { useMemo } from 'react';
import { useCosmosWalletDetection } from '@/app/hooks/useCosmosWalletDetection';
import { useToast } from '@/app/contexts/ToastContext';
import { Download } from 'lucide-react';

interface WalletSetupProps {
  onPrevious: () => void;
  onNext: () => void;
}

import { useWallet } from '@/app/contexts/WalletContext';

export function WalletSetup({ onPrevious, onNext }: WalletSetupProps) {
  const { addToast } = useToast();
  const { isChecked, detectedWallets } = useCosmosWalletDetection();
  const {
    address: connectedAddress,
    connectedWallet,
    isConnecting,
    connectKeplr,
    connectCosmostation,
    connectLeap,
    disconnect,
  } = useWallet();

  const keplrInstalled = useMemo(
    () => detectedWallets.includes('keplr'),
    [detectedWallets]
  );
  const cosmostationInstalled = useMemo(
    () => detectedWallets.includes('cosmostation'),
    [detectedWallets]
  );
  const leapInstalled = useMemo(
    () => detectedWallets.includes('leap'),
    [detectedWallets]
  );

  const open = (url: string) => {
    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch {}
  };

  const continueWithWallet = () => {
    if (connectedAddress) onNext();
    else
      addToast(
        'Please connect a wallet for the selected chain to continue.',
        'warning'
      );
  };

  return (
    <div className='space-y-8 text-left'>
      <div>
        <h2 className='text-3xl font-bold text-gray-800'>Set Up Your Wallet</h2>
        <p className='mt-2 text-lg text-gray-600'>
          Choose a wallet extension and connect to continue.
        </p>
      </div>

      <div className='glass-card luxury-shadow-light rounded-xl border-0 p-6'>
        <div className='mb-6 text-center text-lg font-semibold text-gray-800'>
          Choose Your Wallet
        </div>
        <div className='grid gap-6 md:grid-cols-3'>
          {/* Keplr */}
          <button
            type='button'
            onClick={
              keplrInstalled ? connectKeplr : () => open('https://keplr.app')
            }
            className={`rounded-xl border p-6 text-left transition-all hover:scale-[1.01] focus:outline-none focus:ring-2 ${connectedAddress && connectedWallet === 'keplr' ? 'border-emerald-300 ring-emerald-300/50' : 'border-gray-100 focus:ring-purple-500'}`}
          >
            <div className='text-center'>
              <img
                src='/wallet/keplr.png'
                alt='Keplr'
                className='mx-auto mb-3 h-12 w-12'
              />
              <div className='mb-1 text-base font-semibold text-gray-800'>
                Keplr
              </div>
            </div>
            <ul className='mb-4 list-disc space-y-1 pl-5 text-xs text-gray-600'>
              <li>Largest Cosmos ecosystem support</li>
              <li>Staking and governance ready</li>
              <li>Hardware wallet support</li>
            </ul>
            <div className='flex w-full gap-3'>
              {keplrInstalled ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    connectKeplr();
                  }}
                  disabled={
                    isConnecting ||
                    (connectedWallet === 'keplr' && !!connectedAddress)
                  }
                  className={`w-full rounded px-4 py-2 text-center text-sm ${
                    connectedWallet === 'keplr' && connectedAddress
                      ? 'cursor-not-allowed bg-gray-300 text-gray-500'
                      : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                  }`}
                >
                  {connectedWallet === 'keplr' && connectedAddress
                    ? 'Connected'
                    : 'Connect'}
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    open('https://keplr.app');
                  }}
                  className='glass-button w-full rounded px-4 py-2 text-center text-sm'
                >
                  <Download className='mr-1 inline h-3 w-3' /> Install
                </button>
              )}
              {/* Disconnect moved to address section below */}
            </div>
          </button>

          {/* Cosmostation */}
          <button
            type='button'
            onClick={
              cosmostationInstalled
                ? connectCosmostation
                : () => open('https://cosmostation.io/wallet')
            }
            className={`rounded-xl border p-6 text-left transition-all hover:scale-[1.01] focus:outline-none focus:ring-2 ${connectedAddress && connectedWallet === 'cosmostation' ? 'border-emerald-300 ring-emerald-300/50' : 'border-gray-100 focus:ring-purple-500'}`}
          >
            <div className='text-center'>
              <img
                src='/wallet/cosmostation.png'
                alt='Cosmostation'
                className='mx-auto mb-3 h-12 w-12'
              />
              <div className='mb-1 text-base font-semibold text-gray-800'>
                Cosmostation
              </div>
            </div>
            <ul className='mb-4 list-disc space-y-1 pl-5 text-xs text-gray-600'>
              <li>Professional-grade UI</li>
              <li>Advanced features, multi-chain</li>
              <li>Mobile companion app</li>
            </ul>
            <div className='flex w-full gap-3'>
              {cosmostationInstalled ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    connectCosmostation();
                  }}
                  disabled={
                    isConnecting ||
                    (connectedWallet === 'cosmostation' && !!connectedAddress)
                  }
                  className={`w-full rounded px-4 py-2 text-center text-sm ${
                    connectedWallet === 'cosmostation' && connectedAddress
                      ? 'cursor-not-allowed bg-gray-300 text-gray-500'
                      : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                  }`}
                >
                  {connectedWallet === 'cosmostation' && connectedAddress
                    ? 'Connected'
                    : 'Connect'}
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    open('https://cosmostation.io/wallet');
                  }}
                  className='glass-button w-full rounded px-4 py-2 text-center text-sm'
                >
                  <Download className='mr-1 inline h-3 w-3' /> Install
                </button>
              )}
              {/* Disconnect moved to address section below */}
            </div>
          </button>

          {/* Leap */}
          <button
            type='button'
            onClick={
              leapInstalled
                ? connectLeap
                : () => open('https://www.leapwallet.io/cosmos')
            }
            className={`rounded-xl border p-6 text-left transition-all hover:scale-[1.01] focus:outline-none focus:ring-2 ${connectedAddress && connectedWallet === 'leap' ? 'border-emerald-300 ring-emerald-300/50' : 'border-gray-100 focus:ring-purple-500'}`}
          >
            <div className='text-center'>
              <img
                src='/wallet/leap.png'
                alt='Leap'
                className='mx-auto mb-3 h-12 w-12'
              />
              <div className='mb-1 text-base font-semibold text-gray-800'>
                Leap
              </div>
            </div>
            <ul className='mb-4 list-disc space-y-1 pl-5 text-xs text-gray-600'>
              <li>Modern, user-friendly interface</li>
              <li>Strong DeFi integrations</li>
              <li>Mobile support</li>
            </ul>
            <div className='flex w-full gap-3'>
              {leapInstalled ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    connectLeap();
                  }}
                  disabled={
                    isConnecting ||
                    (connectedWallet === 'leap' && !!connectedAddress)
                  }
                  className={`w-full rounded px-4 py-2 text-center text-sm ${
                    connectedWallet === 'leap' && connectedAddress
                      ? 'cursor-not-allowed bg-gray-300 text-gray-500'
                      : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                  }`}
                >
                  {connectedWallet === 'leap' && connectedAddress
                    ? 'Connected'
                    : 'Connect'}
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    open('https://www.leapwallet.io/cosmos');
                  }}
                  className='glass-button w-full rounded px-4 py-2 text-center text-sm'
                >
                  <Download className='mr-1 inline h-3 w-3' /> Install
                </button>
              )}
              {/* Disconnect moved to address section below */}
            </div>
          </button>
        </div>
        {connectedAddress && (
          <div className='mt-4 flex items-center justify-center gap-3 text-xs text-gray-600'>
            <span>
              Connected: <span className='font-mono'>{connectedAddress}</span>
            </span>
            <button
              onClick={disconnect}
              className='glass-button rounded px-3 py-1'
            >
              Disconnect
            </button>
          </div>
        )}
      </div>

      {isChecked &&
        !keplrInstalled &&
        !cosmostationInstalled &&
        !leapInstalled && (
          <div className='rounded-lg bg-amber-50 p-4 text-amber-800'>
            No wallets detected. Please install a Cosmos wallet extension to
            continue. We recommend starting with Keplr for the best experience.
          </div>
        )}

      <div className='flex items-center justify-between'>
        <button
          onClick={onPrevious}
          className='glass-button rounded-lg px-6 py-3'
        >
          Previous
        </button>
        <div className='flex items-center gap-3'>
          <button
            onClick={() => window.location.assign('/')}
            className='glass-button rounded-lg px-6 py-3'
          >
            Skip to Dashboard
          </button>
          <button
            onClick={continueWithWallet}
            disabled={!connectedAddress}
            className={`rounded-lg px-6 py-3 text-white ${connectedAddress ? 'bg-gradient-to-r from-purple-500 to-blue-500' : 'cursor-not-allowed bg-gray-300'}`}
          >
            Continue with Wallet
          </button>
        </div>
      </div>
    </div>
  );
}
