import { useMemo, useState } from 'react';
import { useCosmosWalletDetection } from '@/app/hooks/useCosmosWalletDetection';
import { useToast } from '@/app/contexts/ToastContext';
import { Download, Zap } from 'lucide-react';
import { useWalletConnection } from '@/app/hooks/useWalletConnection';
import { QuickWalletSetup } from './QuickWalletSetup';

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
  const [showQuickWallet, setShowQuickWallet] = useState(false);

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
  const okxInstalled = useMemo(
    () => detectedWallets.includes('okx'),
    [detectedWallets]
  );
  const metamaskInstalled = useMemo(
    () => detectedWallets.includes('metamask'),
    [detectedWallets]
  );
  const stationInstalled = useMemo(
    () => detectedWallets.includes('station'),
    [detectedWallets]
  );
  const xdefiInstalled = useMemo(
    () => detectedWallets.includes('xdefi'),
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

  if (showQuickWallet) {
    return (
      <QuickWalletSetup
        onComplete={onNext}
        onBack={() => setShowQuickWallet(false)}
      />
    );
  }

  return (
    <div className='space-y-8 text-left'>
      <div>
        <h2 className='text-3xl font-bold text-gray-800'>Set Up Your Wallet</h2>
        <p className='mt-2 text-lg text-gray-600'>
          Choose a wallet option to get started quickly.
        </p>
      </div>

      <div className='glass-card luxury-shadow-light rounded-xl border-0 p-6'>
        <div className='mb-6 text-center text-lg font-semibold text-gray-800'>
          Choose Your Wallet
        </div>
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {/* Quick Wallet */}
          <button
            type='button'
            onClick={() => setShowQuickWallet(true)}
            className={`rounded-xl border p-6 text-left transition-all hover:scale-[1.01] focus:outline-none focus:ring-2 ${connectedAddress && connectedWalletName === 'browser' ? 'border-emerald-300 ring-emerald-300/50' : 'border-gray-100 focus:ring-purple-500'}`}
          >
            <div className='text-center'>
              <div className='mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500'>
                <Zap className='h-6 w-6 text-white' />
              </div>
              <div className='mb-1 text-base font-semibold text-gray-800'>
                Quick Wallet
              </div>
            </div>
            <ul className='mb-4 list-disc space-y-1 pl-5 text-xs text-gray-600'>
              <li>Create wallet instantly</li>
              <li>No extension required</li>
              <li>Perfect for beginners</li>
            </ul>
            <div className='flex w-full gap-3'>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowQuickWallet(true);
                }}
                disabled={isConnecting}
                className='w-full rounded bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-2 text-center text-sm text-white transition-all hover:scale-105'
              >
                Get Started
              </button>
            </div>
          </button>

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

          {/* OKX Wallet */}
          <button
            type='button'
            onClick={
              okxInstalled
                ? () => handleConnectWallet('okx')
                : () => open('https://www.okx.com/web3')
            }
            className={`rounded-xl border p-6 text-left transition-all hover:scale-[1.01] focus:outline-none focus:ring-2 ${connectedAddress && connectedWalletName === 'okx' ? 'border-emerald-300 ring-emerald-300/50' : 'border-gray-100 focus:ring-purple-500'}`}
          >
            <div className='text-center'>
              <img
                src='/wallet/okx.png'
                alt='OKX Wallet'
                className='mx-auto mb-3 h-12 w-12'
              />
              <div className='mb-1 text-base font-semibold text-gray-800'>
                OKX Wallet
              </div>
            </div>
            <ul className='mb-4 list-disc space-y-1 pl-5 text-xs text-gray-600'>
              <li>Multi-chain DeFi wallet</li>
              <li>Built-in exchange features</li>
              <li>Advanced trading tools</li>
            </ul>
            <div className='flex w-full gap-3'>
              {okxInstalled ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleConnectWallet('okx');
                  }}
                  disabled={
                    isConnecting ||
                    (connectedWalletName === 'okx' && !!connectedAddress)
                  }
                  className={`w-full rounded px-4 py-2 text-center text-sm ${
                    connectedWalletName === 'okx' && connectedAddress
                      ? 'cursor-not-allowed bg-gray-300 text-gray-500'
                      : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                  }`}
                >
                  {connectedWalletName === 'okx' && connectedAddress
                    ? 'Connected'
                    : 'Connect'}
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    open('https://www.okx.com/web3');
                  }}
                  className='flex w-full items-center justify-center gap-2 rounded bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200'
                >
                  <Download className='h-4 w-4' />
                  Install
                </button>
              )}
            </div>
          </button>

          {/* MetaMask */}
          <button
            type='button'
            onClick={
              metamaskInstalled
                ? () => handleConnectWallet('metamask')
                : () => open('https://metamask.io')
            }
            className={`rounded-xl border p-6 text-left transition-all hover:scale-[1.01] focus:outline-none focus:ring-2 ${connectedAddress && connectedWalletName === 'metamask' ? 'border-emerald-300 ring-emerald-300/50' : 'border-gray-100 focus:ring-purple-500'}`}
          >
            <div className='text-center'>
              <img
                src='/wallet/metamask.png'
                alt='MetaMask'
                className='mx-auto mb-3 h-12 w-12'
              />
              <div className='mb-1 text-base font-semibold text-gray-800'>
                MetaMask
              </div>
            </div>
            <ul className='mb-4 list-disc space-y-1 pl-5 text-xs text-gray-600'>
              <li>Popular Ethereum wallet</li>
              <li>Wide ecosystem support</li>
              <li>Easy to use interface</li>
            </ul>
            <div className='flex w-full gap-3'>
              {metamaskInstalled ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleConnectWallet('metamask');
                  }}
                  disabled={
                    isConnecting ||
                    (connectedWalletName === 'metamask' && !!connectedAddress)
                  }
                  className={`w-full rounded px-4 py-2 text-center text-sm ${
                    connectedWalletName === 'metamask' && connectedAddress
                      ? 'cursor-not-allowed bg-gray-300 text-gray-500'
                      : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                  }`}
                >
                  {connectedWalletName === 'metamask' && connectedAddress
                    ? 'Connected'
                    : 'Connect'}
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    open('https://metamask.io');
                  }}
                  className='flex w-full items-center justify-center gap-2 rounded bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200'
                >
                  <Download className='h-4 w-4' />
                  Install
                </button>
              )}
            </div>
          </button>

          {/* Station Wallet */}
          <button
            type='button'
            onClick={
              stationInstalled
                ? () => handleConnectWallet('station')
                : () => open('https://station.terra.money')
            }
            className={`rounded-xl border p-6 text-left transition-all hover:scale-[1.01] focus:outline-none focus:ring-2 ${connectedAddress && connectedWalletName === 'station' ? 'border-emerald-300 ring-emerald-300/50' : 'border-gray-100 focus:ring-purple-500'}`}
          >
            <div className='text-center'>
              <div className='mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-500'>
                <span className='text-lg font-bold text-white'>S</span>
              </div>
              <div className='mb-1 text-base font-semibold text-gray-800'>
                Station
              </div>
            </div>
            <ul className='mb-4 list-disc space-y-1 pl-5 text-xs text-gray-600'>
              <li>Terra ecosystem wallet</li>
              <li>Built-in DeFi features</li>
              <li>Governance ready</li>
            </ul>
            <div className='flex w-full gap-3'>
              {stationInstalled ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleConnectWallet('station');
                  }}
                  disabled={
                    isConnecting ||
                    (connectedWalletName === 'station' && !!connectedAddress)
                  }
                  className={`w-full rounded px-4 py-2 text-center text-sm ${
                    connectedWalletName === 'station' && connectedAddress
                      ? 'cursor-not-allowed bg-gray-300 text-gray-500'
                      : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                  }`}
                >
                  {connectedWalletName === 'station' && connectedAddress
                    ? 'Connected'
                    : 'Connect'}
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    open('https://station.terra.money');
                  }}
                  className='flex w-full items-center justify-center gap-2 rounded bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200'
                >
                  <Download className='h-4 w-4' />
                  Install
                </button>
              )}
            </div>
          </button>

          {/* XDEFI Wallet */}
          <button
            type='button'
            onClick={
              xdefiInstalled
                ? () => handleConnectWallet('xdefi')
                : () => open('https://xdefi.io')
            }
            className={`rounded-xl border p-6 text-left transition-all hover:scale-[1.01] focus:outline-none focus:ring-2 ${connectedAddress && connectedWalletName === 'xdefi' ? 'border-emerald-300 ring-emerald-300/50' : 'border-gray-100 focus:ring-purple-500'}`}
          >
            <div className='text-center'>
              <div className='mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500'>
                <span className='text-lg font-bold text-white'>X</span>
              </div>
              <div className='mb-1 text-base font-semibold text-gray-800'>
                XDEFI
              </div>
            </div>
            <ul className='mb-4 list-disc space-y-1 pl-5 text-xs text-gray-600'>
              <li>Cross-chain DeFi wallet</li>
              <li>Multi-chain support</li>
              <li>Advanced portfolio tracking</li>
            </ul>
            <div className='flex w-full gap-3'>
              {xdefiInstalled ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleConnectWallet('xdefi');
                  }}
                  disabled={
                    isConnecting ||
                    (connectedWalletName === 'xdefi' && !!connectedAddress)
                  }
                  className={`w-full rounded px-4 py-2 text-center text-sm ${
                    connectedWalletName === 'xdefi' && connectedAddress
                      ? 'cursor-not-allowed bg-gray-300 text-gray-500'
                      : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                  }`}
                >
                  {connectedWalletName === 'xdefi' && connectedAddress
                    ? 'Connected'
                    : 'Connect'}
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    open('https://xdefi.io');
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
        !leapInstalled &&
        !okxInstalled &&
        !metamaskInstalled &&
        !stationInstalled &&
        !xdefiInstalled && (
          <div className='rounded-lg bg-amber-50 p-4 text-amber-800'>
            No wallets detected. Please install a wallet extension to continue.
            We recommend starting with Keplr for the best Cosmos experience, or
            try our Quick Wallet for instant access.
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
