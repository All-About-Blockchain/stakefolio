import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useCosmosWalletDetection } from '@/app/hooks/useCosmosWalletDetection';
import { useWallet } from '@/app/contexts/WalletContext';
import { WelcomeStep } from '../app/components/onboarding/WelcomeStep';
import { BlockchainEducationStep } from '../app/components/onboarding/BlockchainEducationStep';
import { WalletSetup } from '../app/components/onboarding/WalletSetup';
import { OnRampWidget } from '../app/components/onboarding/OnRampWidget';
import {
  OnboardingLayout,
  OnboardingStep,
} from '../app/components/onboarding/OnboardingLayout';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/app/contexts/ToastContext';
import { TransakModal } from '@/app/components/onboarding/TransakModal';

// ATOM Balance Display Component
function ATOMBalanceDisplay({ address }: { address: string | null }) {
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address) {
      setBalance(null);
      setError(null);
      return;
    }

    const fetchATOMBalance = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log('Fetching ATOM balance for address:', address);

        // Use our server-side API route to avoid CORS issues
        const response = await fetch(
          `/api/atom-balance?address=${encodeURIComponent(address)}`
        );

        console.log('API response status:', response.status);
        console.log('API response ok:', response.ok);

        if (response.ok) {
          const data = await response.json();
          console.log('API response data:', data);

          if (data.balance) {
            console.log('ATOM balance:', data.balance);
            setBalance(data.balance);
          } else {
            console.log('No ATOM balance found, setting to 0');
            setBalance('0.0000');
          }
        } else {
          // Fallback: show 0 balance if API fails
          console.log('API failed, showing 0 balance');
          setBalance('0.0000');
        }
      } catch (err) {
        console.error('Error fetching ATOM balance:', err);
        // Don't show error, just show 0 balance
        setBalance('0.0000');
      } finally {
        setLoading(false);
      }
    };

    fetchATOMBalance();
  }, [address]);

  if (!address) {
    return (
      <div className='py-4 text-center'>
        <p className='text-gray-500'>
          Please connect your wallet to view your ATOM balance
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className='py-4 text-center'>
        <div className='mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-green-600'></div>
        <p className='mt-2 text-gray-500'>Loading your balance...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='py-4 text-center'>
        <div className='rounded-lg border border-red-300 bg-red-100 p-4'>
          <p className='font-medium text-red-800'>Unable to load balance</p>
          <p className='mt-1 text-sm text-red-700'>
            Please try refreshing the page
          </p>
        </div>
      </div>
    );
  }

  const hasATOM = balance && parseFloat(balance) > 0;

  if (!hasATOM) {
    return (
      <div className='py-4 text-center'>
        <div className='rounded-lg border border-yellow-300 bg-yellow-100 p-4'>
          <p className='font-medium text-yellow-800'>
            No ATOM found in your wallet
          </p>
          <p className='mt-1 text-sm text-yellow-700'>
            Purchase ATOM below to get started with staking
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='text-center'>
      <div className='rounded-lg border border-green-200 bg-white p-4'>
        <div className='text-2xl font-bold text-green-600'>{balance} ATOM</div>
        <div className='mt-1 text-sm text-gray-600'>Available for staking</div>
        <div className='mt-2 text-xs text-gray-500'>
          Address: {address.slice(0, 10)}...{address.slice(-8)}
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const { hasAnyWallet } = useCosmosWalletDetection();
  const { address: connectedAddress } = useWallet();
  const { addToast } = useToast();

  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [completedSteps, setCompletedSteps] = useState<Set<OnboardingStep>>(
    new Set()
  );
  const [showTransakModal, setShowTransakModal] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleOrderSuccessful = (
    orderData: any,
    provider: 'ramp' | 'transak'
  ) => {
    console.log(`${provider} order successful:`, orderData);
    alert(`${provider} order completed successfully!`);
  };

  const handleWidgetClose = (provider: 'ramp' | 'transak') => {
    console.log(`${provider} widget closed`);
    setShowTransakModal(false);
  };

  const steps: OnboardingStep[] = [
    'welcome',
    'blockchain-education',
    'wallet-creation',
    'fund-onramp',
    'wallet-management',
    'swapping',
    'validator-selection',
    'staking',
  ];

  const currentStepIndex = steps.indexOf(currentStep);

  // Update URL when step changes
  const updateStepInURL = (step: OnboardingStep) => {
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, step },
      },
      undefined,
      { shallow: true }
    );
  };

  const goToNextStep = () => {
    if (isTransitioning) return; // Prevent multiple rapid clicks

    const nextIndex = currentStepIndex + 1;
    const walletGateIndex = steps.indexOf('fund-onramp');
    if (!hasAnyWallet && nextIndex >= walletGateIndex) {
      addToast('Please connect or install a wallet to continue.', 'warning');
      return;
    }
    if (nextIndex < steps.length) {
      const nextStep = steps[nextIndex];
      setIsTransitioning(true);
      // Update state and URL together to prevent flicker
      setCurrentStep(nextStep);
      setCompletedSteps((prev) => new Set([...prev, currentStep]));
      // Use setTimeout to ensure state updates first
      setTimeout(() => {
        updateStepInURL(nextStep);
        setIsTransitioning(false);
      }, 0);
    } else {
      // Onboarding complete, return to dashboard
      setIsTransitioning(true);
      setCompletedSteps((prev) => new Set([...prev, currentStep]));
      router.push('/');
    }
  };

  const goToPreviousStep = () => {
    if (isTransitioning) return; // Prevent multiple rapid clicks

    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      const prevStep = steps[prevIndex];
      setIsTransitioning(true);
      // Update state and URL together to prevent flicker
      setCurrentStep(prevStep);
      // Use setTimeout to ensure state updates first
      setTimeout(() => {
        updateStepInURL(prevStep);
        setIsTransitioning(false);
      }, 0);
    }
  };

  const goToStep = (step: OnboardingStep) => {
    if (isTransitioning) return; // Prevent multiple rapid clicks

    const walletGateIndex = steps.indexOf('fund-onramp');
    const targetIndex = steps.indexOf(step);
    if (!hasAnyWallet && targetIndex >= walletGateIndex) {
      addToast('Please connect or install a wallet to continue.', 'warning');
      return;
    }
    setIsTransitioning(true);
    // Update state and URL together to prevent flicker
    setCurrentStep(step);
    // Use setTimeout to ensure state updates first
    setTimeout(() => {
      updateStepInURL(step);
      setIsTransitioning(false);
    }, 0);
  };

  // Handle URL changes when router query changes
  useEffect(() => {
    if (
      router.isReady &&
      router.query.step &&
      typeof router.query.step === 'string'
    ) {
      const step = router.query.step as OnboardingStep;
      if (steps.includes(step) && step !== currentStep) {
        setCurrentStep(step);
      }
    }
  }, [router.isReady, router.query.step]);

  const returnToDashboard = () => {
    router.push('/');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'welcome':
        return <WelcomeStep onNext={goToNextStep} />;
      case 'blockchain-education':
        return (
          <BlockchainEducationStep
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        );
      case 'wallet-creation':
        return (
          <WalletSetup onPrevious={goToPreviousStep} onNext={goToNextStep} />
        );
      case 'fund-onramp':
        return (
          <div className='space-y-8'>
            <div className='text-center'>
              <h2 className='text-3xl font-bold text-gray-800'>
                Fund Your Wallet with ATOM
              </h2>
              <p className='mt-2 text-gray-600'>
                Purchase ATOM tokens to start your staking journey
              </p>
            </div>

            {/* Educational Content */}
            <div className='space-y-4 rounded-lg bg-blue-50 p-6'>
              <h3 className='text-lg font-semibold text-blue-800'>
                🎯 What is ATOM and Why Do You Need It?
              </h3>
              <div className='space-y-3 text-sm text-blue-700'>
                <p>
                  <strong>ATOM</strong> is the native cryptocurrency of the
                  Cosmos Hub, the central blockchain in the Cosmos ecosystem.
                  It&apos;s what you&apos;ll use to participate in staking and
                  earn rewards.
                </p>
                <p>
                  <strong>Staking</strong> means you&apos;re helping secure the
                  Cosmos network by delegating your ATOM to validators (network
                  participants who verify transactions). In return, you earn
                  rewards in the form of more ATOM.
                </p>
                <p>
                  <strong>Minimum Requirements:</strong> You&apos;ll need at
                  least 1 ATOM to start staking, but we recommend starting with
                  5-10 ATOM for a meaningful experience.
                </p>
              </div>
            </div>

            {/* Current ATOM Balance */}
            <div className='rounded-lg bg-green-50 p-6'>
              <h3 className='mb-4 text-lg font-semibold text-green-800'>
                💰 Your Current ATOM Balance
              </h3>
              <ATOMBalanceDisplay address={connectedAddress} />
            </div>

            {/* How to Buy ATOM */}
            <div className='space-y-4 rounded-lg bg-purple-50 p-6'>
              <h3 className='text-lg font-semibold text-purple-800'>
                🛒 How to Buy ATOM
              </h3>
              <div className='space-y-3 text-sm text-purple-700'>
                <div className='flex items-start space-x-3'>
                  <span className='mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-200 text-xs font-bold text-purple-800'>
                    1
                  </span>
                  <p>
                    <strong>Click &quot;Buy ATOM&quot; below</strong> - This
                    opens Transak, a secure crypto purchase platform
                  </p>
                </div>
                <div className='flex items-start space-x-3'>
                  <span className='mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-200 text-xs font-bold text-purple-800'>
                    2
                  </span>
                  <p>
                    <strong>Enter the amount</strong> - Choose how much ATOM you
                    want to buy (we recommend starting with $50-100 worth)
                  </p>
                </div>
                <div className='flex items-start space-x-3'>
                  <span className='mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-200 text-xs font-bold text-purple-800'>
                    3
                  </span>
                  <p>
                    <strong>Complete payment</strong> - Use your credit card,
                    debit card, or bank transfer
                  </p>
                </div>
                <div className='flex items-start space-x-3'>
                  <span className='mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-200 text-xs font-bold text-purple-800'>
                    4
                  </span>
                  <p>
                    <strong>ATOM arrives in your wallet</strong> - Usually
                    within 10-30 minutes, ready for staking!
                  </p>
                </div>
              </div>
            </div>

            {/* Security Tips */}
            <div className='space-y-3 rounded-lg bg-yellow-50 p-6'>
              <h3 className='text-lg font-semibold text-yellow-800'>
                🔒 Security Tips
              </h3>
              <ul className='space-y-2 text-sm text-yellow-700'>
                <li>
                  •{' '}
                  <strong>
                    Never share your wallet&apos;s private key or seed phrase
                  </strong>{' '}
                  - Keep it safe and offline
                </li>
                <li>
                  • <strong>Start small</strong> - Begin with a small amount to
                  get comfortable with the process
                </li>
                <li>
                  • <strong>Use trusted platforms</strong> - Transak is a
                  verified and secure crypto purchase platform
                </li>
              </ul>
            </div>

            {/* Buy Button */}
            <div className='text-center'>
              <button
                onClick={() => setShowTransakModal(true)}
                className='rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:scale-105 hover:from-green-600 hover:to-emerald-700'
              >
                🛒 Buy ATOM Now
              </button>
              <p className='mt-2 text-sm text-gray-500'>
                Powered by Transak - Secure, fast, and reliable
              </p>
            </div>

            <div className='flex justify-between pt-8'>
              <button
                onClick={goToPreviousStep}
                className='glass-button rounded-lg border-0 px-6 py-3'
              >
                Previous
              </button>
              <button
                onClick={goToNextStep}
                className='rounded-lg border-0 bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-3 text-white'
              >
                Next
              </button>
            </div>
          </div>
        );
      case 'wallet-management':
        return (
          <div className='space-y-6 text-center'>
            <h2 className='text-3xl font-bold text-gray-800'>
              Manage Your Wallet
            </h2>
            <p className='text-gray-600'>
              Learn about wallet security and management...
            </p>
            <div className='flex justify-between pt-8'>
              <button
                onClick={goToPreviousStep}
                className='glass-button rounded-lg border-0 px-6 py-3'
              >
                Previous
              </button>
              <button
                onClick={goToNextStep}
                className='rounded-lg border-0 bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-3 text-white'
              >
                Next
              </button>
            </div>
          </div>
        );
      case 'swapping':
        return (
          <div className='space-y-6 text-center'>
            <h2 className='text-3xl font-bold text-gray-800'>Swap Tokens</h2>
            <p className='text-gray-600'>
              Learn how to swap tokens for staking...
            </p>
            <div className='flex justify-between pt-8'>
              <button
                onClick={goToPreviousStep}
                className='glass-button rounded-lg border-0 px-6 py-3'
              >
                Previous
              </button>
              <button
                onClick={goToNextStep}
                className='rounded-lg border-0 bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-3 text-white'
              >
                Next
              </button>
            </div>
          </div>
        );
      case 'validator-selection':
        return (
          <div className='space-y-6 text-center'>
            <h2 className='text-3xl font-bold text-gray-800'>
              Choose Validators
            </h2>
            <p className='text-gray-600'>
              Learn how to select the right validators...
            </p>
            <div className='flex justify-between pt-8'>
              <button
                onClick={goToPreviousStep}
                className='glass-button rounded-lg border-0 px-6 py-3'
              >
                Previous
              </button>
              <button
                onClick={goToNextStep}
                className='rounded-lg border-0 bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-3 text-white'
              >
                Next
              </button>
            </div>
          </div>
        );
      case 'staking':
        return (
          <div className='space-y-6 text-center'>
            <h2 className='text-3xl font-bold text-gray-800'>Start Staking</h2>
            <p className='text-gray-600'>
              Learn how to delegate your tokens and start earning...
            </p>
            <div className='flex justify-between pt-8'>
              <button
                onClick={goToPreviousStep}
                className='glass-button rounded-lg border-0 px-6 py-3'
              >
                Previous
              </button>
              <button
                onClick={goToNextStep}
                className='rounded-lg border-0 bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-3 text-white'
              >
                Complete
              </button>
            </div>
          </div>
        );
      default:
        return <WelcomeStep onNext={goToNextStep} />;
    }
  };

  return (
    <>
      <Head>
        <title>Onboarding - Stakefolio</title>
        <meta name='description' content='Learn about staking step by step' />
      </Head>
      <OnboardingLayout
        currentStep={currentStep}
        currentStepIndex={currentStepIndex}
        totalSteps={steps.length}
        completedSteps={completedSteps}
        onStepClick={goToStep}
        connectedAddress={connectedAddress}
        isTransitioning={isTransitioning}
      >
        {renderCurrentStep()}
      </OnboardingLayout>

      {/* Transak Modal */}
      <TransakModal
        isOpen={showTransakModal}
        onClose={() => setShowTransakModal(false)}
        defaultCryptoCurrency='ATOM'
        defaultFiatCurrency='USD'
        walletAddress={connectedAddress || undefined}
        cryptoCurrencyList={['ATOM']}
        fiatCurrencyList={['USD', 'CAD', 'EUR', 'GBP']}
        onOrderSuccessful={(orderData) => {
          handleOrderSuccessful(orderData, 'transak');
          // Refresh balance after successful purchase
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }}
        onWidgetClose={() => handleWidgetClose('transak')}
      />
    </>
  );
}
