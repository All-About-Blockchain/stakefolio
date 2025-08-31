import { useState } from 'react';
import {
  CreditCard,
  Zap,
  TrendingUp,
  Shield,
  ExternalLink,
} from 'lucide-react';
import { TransakModal } from './TransakModal';
import { useWallet } from '../../contexts/WalletContext';

interface OnRampWidgetProps {
  onComplete?: () => void;
  showProviderSelector?: boolean;
  rampChainName?: string;
  transakDefaultCryptoCurrency?: string;
  onOrderSuccessful?: (orderData: any, provider: 'ramp' | 'transak') => void;
  onWidgetClose?: (provider: 'ramp' | 'transak') => void;
}

export function OnRampWidget({
  onComplete,
  showProviderSelector = false,
  rampChainName = 'cosmoshub',
  transakDefaultCryptoCurrency = 'ATOM',
  onOrderSuccessful,
  onWidgetClose,
}: OnRampWidgetProps) {
  const { address } = useWallet();
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTransak, setShowTransak] = useState(false);
  const [step, setStep] = useState<'input' | 'processing' | 'complete'>(
    'input'
  );

  const handleBuyATOM = async () => {
    if (!address) {
      alert('Please connect your wallet first');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    // Open Transak modal
    setShowTransak(true);
  };

  const handleTransakOrderCreated = (orderData: any) => {
    console.log('Transak order created:', orderData);
    setIsProcessing(true);
    setStep('processing');
  };

  const handleTransakOrderSuccessful = (orderData: any) => {
    console.log('Transak order successful:', orderData);
    setShowTransak(false);
    setStep('complete');
    setIsProcessing(false);
  };

  const handleTransakError = (error: any) => {
    console.error('Transak error:', error);
    alert('Purchase failed. Please try again.');
    setShowTransak(false);
    setIsProcessing(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const estimatedATOM = amount ? parseFloat(amount) / 10 : 0; // Simplified price
  const estimatedRewards = estimatedATOM * 0.085; // 8.5% APR

  if (step === 'processing') {
    return (
      <div className='bright-card ultra-soft-shadow rounded-xl border-0 p-8 text-center'>
        <div className='mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500'>
          <Zap className='h-8 w-8 text-white' />
        </div>
        <h3 className='mb-4 text-2xl font-semibold text-gray-800'>
          Processing Your Purchase
        </h3>
        <p className='mb-6 text-gray-600'>
          We&apos;re buying ATOM and automatically staking it for you...
        </p>
        <div className='mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-purple-500'></div>
        <div className='mt-4 space-y-2 text-sm text-gray-500'>
          <p>✓ Payment processed via Transak</p>
          <p>✓ ATOM purchased successfully</p>
          <p>⏳ Converting to stATOM via Stride</p>
          <p>⏳ Adding to your wallet</p>
        </div>
      </div>
    );
  }

  if (step === 'complete') {
    return (
      <div className='bright-card ultra-soft-shadow rounded-xl border-0 p-8 text-center'>
        <div className='mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500'>
          <TrendingUp className='h-8 w-8 text-white' />
        </div>
        <h3 className='mb-4 text-2xl font-semibold text-gray-800'>
          Success! You&apos;re Now Earning Rewards
        </h3>
        <p className='mb-6 text-gray-600'>
          Your ATOM purchase via Transak has been completed and automatically
          staked. You&apos;re now earning 8.5% APR
        </p>
        <div className='mb-6 space-y-3 rounded-lg bg-emerald-50 p-4'>
          <div className='flex items-center justify-between'>
            <span className='text-gray-600'>ATOM Purchased:</span>
            <span className='font-semibold text-gray-800'>
              {estimatedATOM.toFixed(4)} ATOM
            </span>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-gray-600'>Staked as:</span>
            <span className='font-semibold text-gray-800'>
              {estimatedATOM.toFixed(4)} stATOM
            </span>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-gray-600'>Expected Annual Rewards:</span>
            <span className='font-semibold text-emerald-600'>
              {estimatedRewards.toFixed(4)} stATOM
            </span>
          </div>
        </div>
        <button
          onClick={onComplete}
          className='rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 px-8 py-3 text-white transition-all hover:scale-105 hover:shadow-lg'
        >
          View My Portfolio
        </button>
      </div>
    );
  }

  return (
    <div className='bright-card ultra-soft-shadow rounded-xl border-0 p-8'>
      <div className='mb-8 text-center'>
        <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500'>
          <CreditCard className='h-8 w-8 text-white' />
        </div>
        <h3 className='mb-2 text-2xl font-semibold text-gray-800'>
          Buy ATOM & Auto-Stake
        </h3>
        <p className='text-gray-600'>
          Purchase ATOM via Transak and automatically earn staking rewards
        </p>
        {!address && (
          <div className='mt-4 rounded-lg bg-amber-50 p-3'>
            <p className='text-sm text-amber-700'>
              <ExternalLink className='mr-1 inline h-4 w-4' />
              Please connect your wallet first to purchase ATOM
            </p>
            <p className='mt-2 text-xs text-amber-600'>
              You can create a quick wallet or connect an extension wallet
            </p>
          </div>
        )}
      </div>

      <div className='space-y-6'>
        {/* Amount Input */}
        <div>
          <label className='mb-2 block text-sm font-medium text-gray-700'>
            Amount to Invest (USD)
          </label>
          <input
            type='number'
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder='100.00'
            className='w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-purple-500 focus:outline-none'
          />
        </div>

        {/* Preview */}
        {amount && parseFloat(amount) > 0 && (
          <div className='space-y-3 rounded-lg bg-gray-50 p-4'>
            <div className='flex items-center justify-between'>
              <span className='text-gray-600'>You&apos;ll receive:</span>
              <span className='font-semibold text-gray-800'>
                {estimatedATOM.toFixed(4)} stATOM
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-gray-600'>Annual rewards:</span>
              <span className='font-semibold text-emerald-600'>
                {estimatedRewards.toFixed(4)} stATOM (8.5% APR)
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-gray-600'>Fee:</span>
              <span className='font-semibold text-gray-800'>0.3%</span>
            </div>
          </div>
        )}

        {/* Benefits */}
        <div className='space-y-3'>
          <div className='flex items-center gap-3 text-sm text-gray-600'>
            <Shield className='h-4 w-4 text-emerald-500' />
            <span>Automatically staked via Stride protocol</span>
          </div>
          <div className='flex items-center gap-3 text-sm text-gray-600'>
            <TrendingUp className='h-4 w-4 text-emerald-500' />
            <span>Earn 8.5% APR on your investment</span>
          </div>
          <div className='flex items-center gap-3 text-sm text-gray-600'>
            <Zap className='h-4 w-4 text-emerald-500' />
            <span>Liquid staking - use your stATOM in DeFi</span>
          </div>
        </div>

        {/* Buy Button */}
        <button
          onClick={handleBuyATOM}
          disabled={
            !address || !amount || parseFloat(amount) <= 0 || isProcessing
          }
          className={`w-full rounded-lg px-6 py-4 text-lg font-semibold text-white transition-all ${
            !address || !amount || parseFloat(amount) <= 0 || isProcessing
              ? 'cursor-not-allowed bg-gray-300'
              : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:scale-105 hover:shadow-lg'
          }`}
        >
          {!address
            ? 'Connect Wallet First'
            : isProcessing
              ? 'Processing...'
              : 'Buy & Auto-Stake ATOM'}
        </button>

        {!address && (
          <p className='text-center text-sm text-amber-600'>
            Please connect your wallet to purchase ATOM
          </p>
        )}

        <p className='text-center text-xs text-gray-500'>
          Powered by Transak • Secure payment processing
        </p>
      </div>

      {/* Transak Modal */}
      <TransakModal
        isOpen={showTransak}
        onClose={() => setShowTransak(false)}
        defaultCryptoCurrency='ATOM'
        defaultFiatCurrency='USD'
        walletAddress={address || undefined}
        cryptoCurrencyList={['ATOM']}
        onOrderCreated={handleTransakOrderCreated}
        onOrderSuccessful={handleTransakOrderSuccessful}
        onError={handleTransakError}
      />
    </div>
  );
}
