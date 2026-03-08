import { useState } from 'react';
import { useToast } from '@/app/contexts/ToastContext';
import { useWallet } from '@/app/contexts/WalletContext';
import { useCosmosWalletDetection } from '@/app/hooks/useCosmosWalletDetection';
import { Download, Shield, ChevronDown } from 'lucide-react';

interface WalletSetupProps {
  onPrevious: () => void;
  onNext: () => void;
}

export function WalletSetup({ onPrevious, onNext }: WalletSetupProps) {
  const { addToast } = useToast();
  const {
    address,
    connectedWallet,
    connectPrivy,
    connectKeplr,
    connectCosmostation,
    connectLeap,
    connectOkx,
    disconnect,
  } = useWallet();
  const { isChecked, detectedWallets } = useCosmosWalletDetection();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const keplrInstalled = detectedWallets.includes('keplr');
  const cosmostationInstalled = detectedWallets.includes('cosmostation');
  const leapInstalled = detectedWallets.includes('leap');
  const okxInstalled = detectedWallets.includes('okx');

  const handleConnectExtension = async (
    walletType: 'keplr' | 'cosmostation' | 'leap' | 'okx'
  ) => {
    setIsConnecting(true);
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
      addToast(`${walletType} connected!`, 'success');
    } catch (error) {
      addToast(`Failed to connect ${walletType}`, 'error');
    } finally {
      setIsConnecting(false);
    }
  };

  const open = (url: string) => {
    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch {}
  };

  const continueWithWallet = () => {
    if (address) onNext();
    else addToast('Please connect a wallet to continue.', 'warning');
  };

  return (
    <div className='space-y-8 text-left'>
      <div>
        <h2 className='text-3xl font-bold text-gray-800'>Set Up Your Wallet</h2>
        <p className='mt-2 text-lg text-gray-600'>
          Connect in seconds with Privy, or use an extension wallet.
        </p>
      </div>

      <div className='glass-card luxury-shadow-light rounded-xl border-0 p-6'>
        {/* Primary: Privy */}
        <button
          onClick={connectPrivy}
          className='flex w-full items-center gap-4 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 p-6 text-left text-white transition-all hover:scale-[1.01] hover:shadow-lg'
        >
          <div className='flex h-14 w-14 items-center justify-center rounded-full bg-white/20'>
            <Shield className='h-7 w-7 text-white' />
          </div>
          <div>
            <p className='text-xl font-bold'>Get Started with Privy</p>
            <p className='mt-1 text-sm text-white/80'>
              Sign in with email, social account, or wallet — no extension
              needed
            </p>
          </div>
        </button>

        {/* Connected status */}
        {address && (
          <div className='mt-4 flex items-center justify-between rounded-lg bg-emerald-50 p-4'>
            <div className='flex items-center gap-3'>
              <div className='flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500'>
                <Shield className='h-4 w-4 text-white' />
              </div>
              <div>
                <p className='font-medium text-emerald-800'>
                  {connectedWallet === 'privy'
                    ? 'Privy Wallet'
                    : connectedWallet}{' '}
                  Connected
                </p>
                <p className='font-mono text-sm text-emerald-600'>
                  {address.slice(0, 8)}...{address.slice(-6)}
                </p>
              </div>
            </div>
            <button
              onClick={() => disconnect()}
              className='rounded-lg border border-emerald-300 px-3 py-1 text-sm text-emerald-700 hover:bg-emerald-100'
            >
              Disconnect
            </button>
          </div>
        )}

        {/* Advanced: Extension Wallets */}
        <div className='mt-6'>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className='flex w-full items-center justify-between rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-600 transition-all hover:bg-gray-50'
          >
            <span>Advanced: Connect Extension Wallet</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
            />
          </button>

          {showAdvanced && (
            <div className='mt-4 grid gap-4 md:grid-cols-2'>
              {/* Keplr */}
              <button
                onClick={
                  keplrInstalled
                    ? () => handleConnectExtension('keplr')
                    : () => open('https://keplr.app')
                }
                disabled={isConnecting}
                className='flex items-center gap-3 rounded-xl border border-gray-200 p-4 text-left transition-all hover:border-purple-300 hover:bg-purple-50'
              >
                <img
                  src='/wallet/keplr.png'
                  alt='Keplr'
                  className='h-10 w-10'
                />
                <div className='flex-1'>
                  <p className='font-semibold text-gray-800'>Keplr</p>
                  <p className='text-xs text-gray-500'>Cosmos ecosystem</p>
                </div>
                {keplrInstalled ? (
                  <span className='rounded bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700'>
                    Connect
                  </span>
                ) : (
                  <span className='flex items-center gap-1 text-xs text-gray-400'>
                    <Download className='h-3 w-3' />
                    Install
                  </span>
                )}
              </button>

              {/* Cosmostation */}
              <button
                onClick={
                  cosmostationInstalled
                    ? () => handleConnectExtension('cosmostation')
                    : () => open('https://cosmostation.io/wallet')
                }
                disabled={isConnecting}
                className='flex items-center gap-3 rounded-xl border border-gray-200 p-4 text-left transition-all hover:border-purple-300 hover:bg-purple-50'
              >
                <img
                  src='/wallet/cosmostation.png'
                  alt='Cosmostation'
                  className='h-10 w-10'
                />
                <div className='flex-1'>
                  <p className='font-semibold text-gray-800'>Cosmostation</p>
                  <p className='text-xs text-gray-500'>Mobile-first</p>
                </div>
                {cosmostationInstalled ? (
                  <span className='rounded bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700'>
                    Connect
                  </span>
                ) : (
                  <span className='flex items-center gap-1 text-xs text-gray-400'>
                    <Download className='h-3 w-3' />
                    Install
                  </span>
                )}
              </button>

              {/* Leap */}
              <button
                onClick={
                  leapInstalled
                    ? () => handleConnectExtension('leap')
                    : () => open('https://www.leapwallet.io/cosmos')
                }
                disabled={isConnecting}
                className='flex items-center gap-3 rounded-xl border border-gray-200 p-4 text-left transition-all hover:border-purple-300 hover:bg-purple-50'
              >
                <img src='/wallet/leap.png' alt='Leap' className='h-10 w-10' />
                <div className='flex-1'>
                  <p className='font-semibold text-gray-800'>Leap</p>
                  <p className='text-xs text-gray-500'>Modern Cosmos wallet</p>
                </div>
                {leapInstalled ? (
                  <span className='rounded bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700'>
                    Connect
                  </span>
                ) : (
                  <span className='flex items-center gap-1 text-xs text-gray-400'>
                    <Download className='h-3 w-3' />
                    Install
                  </span>
                )}
              </button>

              {/* OKX */}
              <button
                onClick={
                  okxInstalled
                    ? () => handleConnectExtension('okx')
                    : () => open('https://www.okx.com/web3')
                }
                disabled={isConnecting}
                className='flex items-center gap-3 rounded-xl border border-gray-200 p-4 text-left transition-all hover:border-purple-300 hover:bg-purple-50'
              >
                <img src='/wallet/okx.png' alt='OKX' className='h-10 w-10' />
                <div className='flex-1'>
                  <p className='font-semibold text-gray-800'>OKX Wallet</p>
                  <p className='text-xs text-gray-500'>Multi-chain DeFi</p>
                </div>
                {okxInstalled ? (
                  <span className='rounded bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700'>
                    Connect
                  </span>
                ) : (
                  <span className='flex items-center gap-1 text-xs text-gray-400'>
                    <Download className='h-3 w-3' />
                    Install
                  </span>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

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
            disabled={!address}
            className={`rounded-lg px-6 py-3 text-white ${address ? 'bg-gradient-to-r from-purple-500 to-blue-500' : 'cursor-not-allowed bg-gray-300'}`}
          >
            Continue with Wallet
          </button>
        </div>
      </div>
    </div>
  );
}
