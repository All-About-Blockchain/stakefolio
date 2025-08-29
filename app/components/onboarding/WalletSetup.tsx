import { useMemo } from 'react';
import { useCosmosWalletDetection } from '@/app/hooks/useCosmosWalletDetection';
import { useToast } from '@/app/contexts/ToastContext';
import { Download } from 'lucide-react';
import { useWalletConnection } from '@/app/hooks/useWalletConnection';

interface WalletSetupProps {
  onPrevious: () => void;
  onNext: () => void;
}

export function WalletSetup({ onPrevious, onNext }: WalletSetupProps) {
  const { addToast } = useToast();
  const { isChecked, detectedWallets } = useCosmosWalletDetection();
  const {
    connectionStatuses,
    isConnecting,
    summary,
    connectAll,
    disconnectAll,
    connectSingleChain,
  } = useWalletConnection();

  // Get the first connected wallet info
  const connectedWallet = connectionStatuses.find(
    (s) => s.status === 'connected'
  );
  const connectedAddress = connectedWallet?.address;
  const connectedWalletName = connectedWallet?.walletName;

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

  const handleConnectWallet = async (walletType: string) => {
    try {
      // Connect to the first available chain (cosmoshub)
      await connectSingleChain('cosmoshub');
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
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
              keplrInstalled
                ? () => handleConnectWallet('keplr')
                : () => open('https://keplr.app')
            }
            className={`rounded-xl border p-6 text-left transition-all hover:scale-[1.01] focus:outline-none focus:ring-2 ${connectedAddress && connectedWalletName === 'keplr' ? 'border-emerald-300 ring-emerald-300/50' : 'border-gray-100 focus:ring-purple-500'}`}
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
                    handleConnectWallet('keplr');
                  }}
                  disabled={
                    isConnecting ||
                    (connectedWalletName === 'keplr' && !!connectedAddress)
                  }
                  className={`w-full rounded px-4 py-2 text-center text-sm ${
                    connectedWalletName === 'keplr' && connectedAddress
                      ? 'cursor-not-allowed bg-gray-300 text-gray-500'
                      : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                  }`}
                >
                  {connectedWalletName === 'keplr' && connectedAddress
                    ? 'Connected'
                    : 'Connect'}
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    open('https://keplr.app');
                  }}
                  className='flex w-full items-center justify-center gap-2 rounded bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200'
                >
                  <Download className='h-4 w-4' />
                  Install
                </button>
              )}
            </div>
          </button>

          {/* Cosmostation */}
          <button
            type='button'
            onClick={
              cosmostationInstalled
                ? () => handleConnectWallet('cosmostation')
                : () => open('https://cosmostation.io/wallet')
            }
            className={`rounded-xl border p-6 text-left transition-all hover:scale-[1.01] focus:outline-none focus:ring-2 ${connectedAddress && connectedWalletName === 'cosmostation' ? 'border-emerald-300 ring-emerald-300/50' : 'border-gray-100 focus:ring-purple-500'}`}
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
              <li>Mobile-first experience</li>
              <li>Built-in DEX integration</li>
              <li>Multi-chain support</li>
            </ul>
            <div className='flex w-full gap-3'>
              {cosmostationInstalled ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleConnectWallet('cosmostation');
                  }}
                  disabled={
                    isConnecting ||
                    (connectedWalletName === 'cosmostation' &&
                      !!connectedAddress)
                  }
                  className={`w-full rounded px-4 py-2 text-center text-sm ${
                    connectedWalletName === 'cosmostation' && connectedAddress
                      ? 'cursor-not-allowed bg-gray-300 text-gray-500'
                      : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                  }`}
                >
                  {connectedWalletName === 'cosmostation' && connectedAddress
                    ? 'Connected'
                    : 'Connect'}
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    open('https://cosmostation.io/wallet');
                  }}
                  className='flex w-full items-center justify-center gap-2 rounded bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200'
                >
                  <Download className='h-4 w-4' />
                  Install
                </button>
              )}
            </div>
          </button>

          {/* Leap */}
          <button
            type='button'
            onClick={
              leapInstalled
                ? () => handleConnectWallet('leap')
                : () => open('https://www.leapwallet.io/cosmos')
            }
            className={`rounded-xl border p-6 text-left transition-all hover:scale-[1.01] focus:outline-none focus:ring-2 ${connectedAddress && connectedWalletName === 'leap' ? 'border-emerald-300 ring-emerald-300/50' : 'border-gray-100 focus:ring-purple-500'}`}
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
              <li>Modern interface</li>
              <li>Advanced DeFi features</li>
              <li>Cross-chain functionality</li>
            </ul>
            <div className='flex w-full gap-3'>
              {leapInstalled ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleConnectWallet('leap');
                  }}
                  disabled={
                    isConnecting ||
                    (connectedWalletName === 'leap' && !!connectedAddress)
                  }
                  className={`w-full rounded px-4 py-2 text-center text-sm ${
                    connectedWalletName === 'leap' && connectedAddress
                      ? 'cursor-not-allowed bg-gray-300 text-gray-500'
                      : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                  }`}
                >
                  {connectedWalletName === 'leap' && connectedAddress
                    ? 'Connected'
                    : 'Connect'}
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    open('https://www.leapwallet.io/cosmos');
                  }}
                  className='flex w-full items-center justify-center gap-2 rounded bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200'
                >
                  <Download className='h-4 w-4' />
                  Install
                </button>
              )}
            </div>
          </button>
        </div>
        {connectedAddress && (
          <div className='mt-4 flex items-center justify-center gap-3 text-xs text-gray-600'>
            <span>
              Connected: <span className='font-mono'>{connectedAddress}</span>
            </span>
            <button
              onClick={disconnectAll}
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
