import { useMemo, useState } from 'react';
import { useCosmosWalletDetection } from '@/app/hooks/useCosmosWalletDetection';
import { useToast } from '@/app/contexts/ToastContext';
import { Download } from 'lucide-react';
import { useChain } from '@interchain-kit/react';

interface WalletSetupProps {
  onPrevious: () => void;
  onNext: () => void;
}

export function WalletSetup({ onPrevious, onNext }: WalletSetupProps) {
  const { addToast } = useToast();
  const { isChecked, detectedWallets } = useCosmosWalletDetection();
  const [isConnecting, setIsConnecting] = useState(false);
  const DEFAULT_CHAIN = 'cosmoshub';
  const chainHook = useChain(DEFAULT_CHAIN);

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

  const connectKeplr = async () => {
    setIsConnecting(true);
    try {
      const w = window as any;
      if (!w.keplr) throw new Error('Keplr not detected');
      await w.keplr.enable(DEFAULT_CHAIN);
      addToast('Keplr connected', 'success');
      onNext();
    } catch (e: any) {
      addToast(e?.message || 'Failed to connect Keplr', 'error');
    } finally {
      setIsConnecting(false);
    }
  };

  const connectCosmostation = async () => {
    setIsConnecting(true);
    try {
      const w = window as any;
      if (!w.cosmostation?.cosmos) throw new Error('Cosmostation not detected');
      await w.cosmostation.cosmos.request({
        method: 'cos_requestAccount',
        params: { chainName: DEFAULT_CHAIN },
      });
      addToast('Cosmostation connected', 'success');
      onNext();
    } catch (e: any) {
      addToast(e?.message || 'Failed to connect Cosmostation', 'error');
    } finally {
      setIsConnecting(false);
    }
  };

  const connectLeap = async () => {
    setIsConnecting(true);
    try {
      const w = window as any;
      if (!w.leap) throw new Error('Leap not detected');
      await w.leap.enable(DEFAULT_CHAIN);
      addToast('Leap connected', 'success');
      onNext();
    } catch (e: any) {
      addToast(e?.message || 'Failed to connect Leap', 'error');
    } finally {
      setIsConnecting(false);
    }
  };

  const continueWithWallet = () => {
    if (chainHook?.address) onNext();
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
            className='rounded-xl border border-gray-100 p-6 text-left transition-all hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-purple-500'
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
            <div
              className={`w-full rounded px-4 py-2 text-center text-sm ${keplrInstalled ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' : 'glass-button'}`}
            >
              {keplrInstalled ? (
                'Connect'
              ) : (
                <span>
                  <Download className='mr-1 inline h-3 w-3' /> Install
                </span>
              )}
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
            className='rounded-xl border border-gray-100 p-6 text-left transition-all hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-purple-500'
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
            <div
              className={`w-full rounded px-4 py-2 text-center text-sm ${cosmostationInstalled ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' : 'glass-button'}`}
            >
              {cosmostationInstalled ? (
                'Connect'
              ) : (
                <span>
                  <Download className='mr-1 inline h-3 w-3' /> Install
                </span>
              )}
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
            className='rounded-xl border border-gray-100 p-6 text-left transition-all hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-purple-500'
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
            <div
              className={`w-full rounded px-4 py-2 text-center text-sm ${leapInstalled ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' : 'glass-button'}`}
            >
              {leapInstalled ? (
                'Connect'
              ) : (
                <span>
                  <Download className='mr-1 inline h-3 w-3' /> Install
                </span>
              )}
            </div>
          </button>
        </div>
        {chainHook?.address && (
          <div className='mt-4 text-center text-xs text-gray-600'>
            Connected: <span className='font-mono'>{chainHook.address}</span>
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
        <button
          onClick={continueWithWallet}
          disabled={!chainHook?.address}
          className={`rounded-lg px-6 py-3 text-white ${chainHook?.address ? 'bg-gradient-to-r from-purple-500 to-blue-500' : 'cursor-not-allowed bg-gray-300'}`}
        >
          Continue with Wallet
        </button>
      </div>
    </div>
  );
}
