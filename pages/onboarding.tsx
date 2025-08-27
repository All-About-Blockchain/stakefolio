import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useCosmosWalletDetection } from '@/app/hooks/useCosmosWalletDetection';
import { useWallet } from '@/app/contexts/WalletContext';
import { WelcomeStep } from '../app/components/onboarding/WelcomeStep';
import { BlockchainEducationStep } from '../app/components/onboarding/BlockchainEducationStep';
import { WalletSetup } from '../app/components/onboarding/WalletSetup';
import {
  OnboardingLayout,
  OnboardingStep,
} from '../app/components/onboarding/OnboardingLayout';
import { useToast } from '@/app/contexts/ToastContext';
import { TransakModal } from '@/app/components/onboarding/TransakModal';
import { SkipGoWidget } from '@/app/components/SkipGoWidget';

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const steps: OnboardingStep[] = [
    'welcome',
    'blockchain-education',
    'wallet-creation',
    'fund-onramp',
    'validator-selection',
    'swapping',
    'staking',
    'wallet-management',
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
  }, [currentStep, router.isReady, router.query.step, steps]);

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
          <div className='space-y-8'>
            <div className='text-center'>
              <h2 className='text-3xl font-bold text-gray-800'>
                Manage Your Wallet & Assets
              </h2>
              <p className='mt-2 text-gray-600'>
                Learn how to securely manage your wallet, track your assets, and
                monitor your stakes
              </p>
            </div>

            {/* Wallet Security Fundamentals */}
            <div className='glass-card space-y-4 rounded-lg p-6'>
              <h3 className='text-lg font-semibold text-gray-800'>
                🔒 Wallet Security Fundamentals
              </h3>
              <div className='space-y-3 text-sm text-gray-700'>
                <div className='flex items-start space-x-3'>
                  <span className='mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-orange-400 to-red-500 text-xs font-bold text-white'>
                    🔑
                  </span>
                  <p>
                    <strong>Seed Phrase (Mnemonic):</strong> This is your
                    wallet&apos;s master key - 12-24 words that can restore your
                    entire wallet. Write it down on paper and store it securely
                    offline.
                  </p>
                </div>
                <div className='flex items-start space-x-3'>
                  <span className='mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-orange-400 to-red-500 text-xs font-bold text-white'>
                    🚫
                  </span>
                  <p>
                    <strong>Never share your seed phrase</strong> with anyone,
                    including support staff, websites, or apps. Legitimate
                    services will never ask for it.
                  </p>
                </div>
                <div className='flex items-start space-x-3'>
                  <span className='mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-orange-400 to-red-500 text-xs font-bold text-white'>
                    💻
                  </span>
                  <p>
                    <strong>Use hardware wallets</strong> for large amounts -
                    devices like Ledger provide an extra layer of security by
                    keeping private keys offline.
                  </p>
                </div>
                <div className='flex items-start space-x-3'>
                  <span className='mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-orange-400 to-red-500 text-xs font-bold text-white'>
                    🔄
                  </span>
                  <p>
                    <strong>Regular backups</strong> - Keep multiple secure
                    copies of your seed phrase in different locations.
                  </p>
                </div>
              </div>
            </div>

            {/* Asset Management */}
            <div className='glass-card space-y-4 rounded-lg p-6'>
              <h3 className='text-lg font-semibold text-gray-800'>
                💰 Asset Management
              </h3>
              <div className='space-y-3 text-sm text-gray-700'>
                <div className='space-y-2'>
                  <h4 className='font-semibold text-gray-800'>
                    📊 Portfolio Tracking
                  </h4>
                  <p>
                    Use portfolio trackers like Stakefolio, Mintscan, or
                    Cosmostation to monitor your assets across multiple Cosmos
                    chains. Track your:
                  </p>
                  <ul className='ml-4 space-y-1'>
                    <li>• Total portfolio value in USD</li>
                    <li>• Individual token balances</li>
                    <li>• Staking rewards and APY</li>
                    <li>• Transaction history</li>
                    <li>• Performance over time</li>
                  </ul>
                </div>
                <div className='space-y-2'>
                  <h4 className='font-semibold text-gray-800'>
                    🎯 Diversification Strategy
                  </h4>
                  <p>
                    Don&apos;t put all your eggs in one basket. Consider
                    diversifying across:
                  </p>
                  <ul className='ml-4 space-y-1'>
                    <li>• Multiple Cosmos chains (ATOM, OSMO, JUNO, etc.)</li>
                    <li>• Different validators for staking</li>
                    <li>• Various DeFi protocols</li>
                    <li>• Traditional assets outside crypto</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Staking Management */}
            <div className='glass-card space-y-4 rounded-lg p-6'>
              <h3 className='text-lg font-semibold text-gray-800'>
                🏛️ Staking Management
              </h3>
              <div className='space-y-3 text-sm text-gray-700'>
                <div className='space-y-2'>
                  <h4 className='font-semibold text-gray-800'>
                    📈 Monitoring Your Stakes
                  </h4>
                  <p>
                    Regularly check your staking positions to ensure optimal
                    performance:
                  </p>
                  <ul className='ml-4 space-y-1'>
                    <li>
                      • <strong>Reward accumulation</strong> - Check how much
                      you&apos;ve earned
                    </li>
                    <li>
                      • <strong>Validator performance</strong> - Monitor uptime
                      and commission changes
                    </li>
                    <li>
                      • <strong>Unbonding status</strong> - Track any tokens in
                      the unbonding process
                    </li>
                    <li>
                      • <strong>Redelegation opportunities</strong> - Consider
                      moving to better validators
                    </li>
                  </ul>
                </div>
                <div className='space-y-2'>
                  <h4 className='font-semibold text-gray-800'>
                    🔄 Active Management Strategies
                  </h4>
                  <p>
                    <strong>Claim rewards regularly</strong> - Don&apos;t let
                    them sit unclaimed. Consider:
                  </p>
                  <ul className='ml-4 space-y-1'>
                    <li>
                      • <strong>Reinvesting</strong> - Add rewards back to
                      staking for compound growth
                    </li>
                    <li>
                      • <strong>Diversifying</strong> - Use rewards to buy other
                      tokens
                    </li>
                    <li>
                      • <strong>Taking profits</strong> - Convert some rewards
                      to stablecoins
                    </li>
                  </ul>
                </div>
                <div className='space-y-2'>
                  <h4 className='font-semibold text-gray-800'>
                    ⚡ Redelegation Tips
                  </h4>
                  <p>
                    You can redelegate your ATOM to different validators without
                    going through the unbonding period:
                  </p>
                  <ul className='ml-4 space-y-1'>
                    <li>
                      • <strong>No downtime</strong> - Your tokens stay staked
                      during the process
                    </li>
                    <li>
                      • <strong>Immediate effect</strong> - New validator starts
                      earning rewards right away
                    </li>
                    <li>
                      • <strong>Strategic moves</strong> - Respond to validator
                      performance changes
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Transaction Management */}
            <div className='glass-card space-y-4 rounded-lg p-6'>
              <h3 className='text-lg font-semibold text-gray-800'>
                📝 Transaction Management
              </h3>
              <div className='space-y-3 text-sm text-gray-700'>
                <div className='space-y-2'>
                  <h4 className='font-semibold text-gray-800'>
                    🔍 Transaction Monitoring
                  </h4>
                  <p>
                    Keep track of all your transactions for security and tax
                    purposes:
                  </p>
                  <ul className='ml-4 space-y-1'>
                    <li>
                      • <strong>Use block explorers</strong> - Mintscan,
                      Cosmoscan, or Big Dipper
                    </li>
                    <li>
                      • <strong>Export transaction history</strong> for tax
                      reporting
                    </li>
                    <li>
                      • <strong>Verify transaction details</strong> before
                      confirming
                    </li>
                    <li>
                      • <strong>Set up notifications</strong> for large
                      transactions
                    </li>
                  </ul>
                </div>
                <div className='space-y-2'>
                  <h4 className='font-semibold text-gray-800'>
                    💰 Fee Management
                  </h4>
                  <p>
                    Cosmos transactions require fees paid in the native token:
                  </p>
                  <ul className='ml-4 space-y-1'>
                    <li>
                      • <strong>Keep sufficient balance</strong> for transaction
                      fees
                    </li>
                    <li>
                      • <strong>Adjust gas settings</strong> for faster/slower
                      transactions
                    </li>
                    <li>
                      • <strong>Batch transactions</strong> when possible to
                      save fees
                    </li>
                    <li>
                      • <strong>Monitor fee trends</strong> during network
                      congestion
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Risk Management */}
            <div className='glass-card space-y-4 rounded-lg p-6'>
              <h3 className='text-lg font-semibold text-gray-800'>
                ⚠️ Risk Management
              </h3>
              <div className='space-y-3 text-sm text-gray-700'>
                <div className='space-y-2'>
                  <h4 className='font-semibold text-gray-800'>
                    🛡️ Security Best Practices
                  </h4>
                  <ul className='ml-4 space-y-1'>
                    <li>
                      • <strong>Use different wallets</strong> for different
                      purposes (hot vs cold storage)
                    </li>
                    <li>
                      • <strong>Enable 2FA</strong> on all exchange accounts
                    </li>
                    <li>
                      • <strong>Verify URLs</strong> - Always check you&apos;re
                      on the correct website
                    </li>
                    <li>
                      • <strong>Keep software updated</strong> - Regularly
                      update wallet apps
                    </li>
                    <li>
                      • <strong>Test small amounts</strong> before large
                      transactions
                    </li>
                  </ul>
                </div>
                <div className='space-y-2'>
                  <h4 className='font-semibold text-gray-800'>
                    📊 Portfolio Risk Assessment
                  </h4>
                  <ul className='ml-4 space-y-1'>
                    <li>
                      •{' '}
                      <strong>
                        Don&apos;t invest more than you can afford to lose
                      </strong>
                    </li>
                    <li>
                      •{' '}
                      <strong>Diversify across different asset classes</strong>
                    </li>
                    <li>
                      • <strong>Consider market volatility</strong> in your
                      investment timeline
                    </li>
                    <li>
                      • <strong>Have an emergency fund</strong> outside of
                      crypto
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Tools and Resources */}
            <div className='glass-card space-y-4 rounded-lg p-6'>
              <h3 className='text-lg font-semibold text-gray-800'>
                🛠️ Essential Tools & Resources
              </h3>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div className='space-y-2'>
                  <h4 className='font-semibold text-gray-800'>
                    🔍 Block Explorers
                  </h4>
                  <ul className='space-y-1 text-sm text-gray-600'>
                    <li>• Mintscan (Cosmos Hub)</li>
                    <li>• Cosmoscan</li>
                    <li>• Big Dipper</li>
                  </ul>
                </div>
                <div className='space-y-2'>
                  <h4 className='font-semibold text-gray-800'>
                    📊 Portfolio Trackers
                  </h4>
                  <ul className='space-y-1 text-sm text-gray-600'>
                    <li>• Stakefolio</li>
                    <li>• Cosmostation</li>
                    <li>• Keplr Dashboard</li>
                  </ul>
                </div>
                <div className='space-y-2'>
                  <h4 className='font-semibold text-gray-800'>
                    🏛️ Validator Tools
                  </h4>
                  <ul className='space-y-1 text-sm text-gray-600'>
                    <li>• Validator Analytics</li>
                    <li>• Commission Trackers</li>
                    <li>• Performance Metrics</li>
                  </ul>
                </div>
                <div className='space-y-2'>
                  <h4 className='font-semibold text-gray-800'>
                    📰 Information Sources
                  </h4>
                  <ul className='space-y-1 text-sm text-gray-600'>
                    <li>• Cosmos Blog</li>
                    <li>• Validator Websites</li>
                    <li>• Community Forums</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Congratulations */}
            <div className='glass-card space-y-4 rounded-lg p-6'>
              <h3 className='text-lg font-semibold text-gray-800'>
                🎉 Congratulations! You&apos;re Ready to Stake
              </h3>
              <div className='space-y-3 text-sm text-gray-700'>
                <p>
                  You&apos;ve completed the comprehensive Cosmos staking guide!
                  You now have the knowledge to:
                </p>
                <ul className='ml-4 space-y-1'>
                  <li>• Securely manage your Cosmos wallet</li>
                  <li>• Choose the right validators for staking</li>
                  <li>• Swap tokens across the Cosmos ecosystem</li>
                  <li>• Monitor and optimize your staking portfolio</li>
                  <li>• Practice proper security measures</li>
                </ul>
                <p className='mt-4 font-semibold'>
                  Ready to start earning staking rewards? Head to the main
                  dashboard to begin your staking journey!
                </p>
              </div>
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
                className='rounded-lg border-0 bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-3 text-white'
              >
                Complete Onboarding
              </button>
            </div>
          </div>
        );
      case 'swapping':
        return (
          <div className='space-y-8'>
            <div className='text-center'>
              <h2 className='text-3xl font-bold text-gray-800'>
                Token Swapping in Cosmos
              </h2>
              <p className='mt-2 text-gray-600'>
                Learn how to exchange tokens and manage your portfolio
              </p>
            </div>

            {/* What is Token Swapping */}
            <div className='glass-card space-y-4 rounded-lg p-6'>
              <h3 className='text-lg font-semibold text-gray-800'>
                🔄 What is Token Swapping?
              </h3>
              <div className='space-y-3 text-sm text-gray-700'>
                <p>
                  <strong>Token swapping</strong> allows you to exchange one
                  cryptocurrency for another without using traditional
                  exchanges. In the Cosmos ecosystem, this is done through
                  decentralized exchanges (DEXs) and cross-chain bridges.
                </p>
                <p>
                  Think of it like exchanging currency at an airport, but for
                  digital assets - fast, secure, and without intermediaries.
                </p>
              </div>
            </div>

            {/* Popular Cosmos DEXs */}
            <div className='glass-card space-y-4 rounded-lg p-6'>
              <h3 className='text-lg font-semibold text-gray-800'>
                🏪 Popular Cosmos DEXs
              </h3>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div className='glass-subtle space-y-2 rounded-lg p-4'>
                  <h4 className='font-semibold text-gray-800'>🦄 Osmosis</h4>
                  <p className='text-sm text-gray-600'>
                    The largest DEX in Cosmos, offering advanced trading
                    features, liquidity pools, and cross-chain swaps
                  </p>
                </div>
                <div className='glass-subtle space-y-2 rounded-lg p-4'>
                  <h4 className='font-semibold text-gray-800'>🌊 Crescent</h4>
                  <p className='text-sm text-gray-600'>
                    AMM-based DEX with order book functionality and advanced
                    trading tools
                  </p>
                </div>
                <div className='glass-subtle space-y-2 rounded-lg p-4'>
                  <h4 className='font-semibold text-gray-800'>⚡ JunoSwap</h4>
                  <p className='text-sm text-gray-600'>
                    Simple and user-friendly DEX built on the Juno network
                  </p>
                </div>
                <div className='glass-subtle space-y-2 rounded-lg p-4'>
                  <h4 className='font-semibold text-gray-800'>
                    🔗 Skip Protocol
                  </h4>
                  <p className='text-sm text-gray-600'>
                    Cross-chain aggregator that finds the best swap routes
                    across multiple DEXs
                  </p>
                </div>
              </div>
            </div>

            {/* How to Swap Tokens */}
            <div className='glass-card space-y-4 rounded-lg p-6'>
              <h3 className='text-lg font-semibold text-gray-800'>
                📋 How to Swap Tokens
              </h3>
              <div className='space-y-3 text-sm text-gray-700'>
                <div className='flex items-start space-x-3'>
                  <span className='mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-xs font-bold text-white'>
                    1
                  </span>
                  <p>
                    <strong>Connect your wallet</strong> - Use Keplr,
                    Cosmostation, or another Cosmos wallet
                  </p>
                </div>
                <div className='flex items-start space-x-3'>
                  <span className='mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-xs font-bold text-white'>
                    2
                  </span>
                  <p>
                    <strong>Select tokens</strong> - Choose the token you want
                    to swap from and the token you want to swap to
                  </p>
                </div>
                <div className='flex items-start space-x-3'>
                  <span className='mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-xs font-bold text-white'>
                    3
                  </span>
                  <p>
                    <strong>Review the swap</strong> - Check the exchange rate,
                    fees, and slippage tolerance
                  </p>
                </div>
                <div className='flex items-start space-x-3'>
                  <span className='mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-xs font-bold text-white'>
                    4
                  </span>
                  <p>
                    <strong>Confirm the transaction</strong> - Approve the swap
                    in your wallet
                  </p>
                </div>
              </div>
            </div>

            {/* Try It: Skip Protocol (Go) Widget */}
            <div className='glass-card space-y-4 rounded-lg p-6'>
              <h3 className='text-lg font-semibold text-gray-800'>
                🚀 Try It: Swap with Skip Protocol
              </h3>
              <p className='text-sm text-gray-700'>
                Use the embedded Skip Go widget to explore real cross-chain swap routes.
                Connect your wallet to simulate or perform a small test swap.
              </p>
              <div className='mt-2'>
                <SkipGoWidget />
              </div>
            </div>

            {/* Common Swap Scenarios */}
            <div className='glass-card space-y-4 rounded-lg p-6'>
              <h3 className='text-lg font-semibold text-gray-800'>
                💡 Common Swap Scenarios
              </h3>
              <div className='space-y-3 text-sm text-gray-700'>
                <div className='space-y-2'>
                  <h4 className='font-semibold text-gray-800'>
                    🔄 Converting Rewards
                  </h4>
                  <p>
                    Swap your staking rewards (ATOM) for other tokens to
                    diversify your portfolio or use in DeFi protocols.
                  </p>
                </div>
                <div className='space-y-2'>
                  <h4 className='font-semibold text-gray-800'>
                    📈 Buying More ATOM
                  </h4>
                  <p>
                    Use other tokens to buy more ATOM for additional staking or
                    to increase your delegation.
                  </p>
                </div>
                <div className='space-y-2'>
                  <h4 className='font-semibold text-gray-800'>
                    🌉 Cross-Chain Swaps
                  </h4>
                  <p>
                    Exchange tokens from other blockchains (like Ethereum,
                    Bitcoin) for Cosmos tokens using bridges.
                  </p>
                </div>
                <div className='space-y-2'>
                  <h4 className='font-semibold text-gray-800'>
                    💎 Yield Farming
                  </h4>
                  <p>
                    Swap tokens to participate in liquidity pools and earn
                    additional rewards beyond staking.
                  </p>
                </div>
              </div>
            </div>

            {/* Important Considerations */}
            <div className='glass-card space-y-4 rounded-lg p-6'>
              <h3 className='text-lg font-semibold text-gray-800'>
                ⚠️ Important Considerations
              </h3>
              <div className='space-y-3 text-sm text-gray-700'>
                <div className='flex items-start space-x-3'>
                  <span className='mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-orange-400 to-red-500 text-xs font-bold text-white'>
                    💸
                  </span>
                  <p>
                    <strong>Fees:</strong> Each swap incurs network fees and
                    potentially DEX fees. These can add up quickly for small
                    amounts.
                  </p>
                </div>
                <div className='flex items-start space-x-3'>
                  <span className='mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-orange-400 to-red-500 text-xs font-bold text-white'>
                    📉
                  </span>
                  <p>
                    <strong>Slippage:</strong> Large trades can experience price
                    slippage, meaning you get fewer tokens than expected.
                  </p>
                </div>
                <div className='flex items-start space-x-3'>
                  <span className='mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-orange-400 to-red-500 text-xs font-bold text-white'>
                    🔍
                  </span>
                  <p>
                    <strong>Liquidity:</strong> Some token pairs may have low
                    liquidity, making swaps difficult or expensive.
                  </p>
                </div>
                <div className='flex items-start space-x-3'>
                  <span className='mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-orange-400 to-red-500 text-xs font-bold text-white'>
                    ⏰
                  </span>
                  <p>
                    <strong>Transaction Time:</strong> Cross-chain swaps can
                    take several minutes to complete.
                  </p>
                </div>
              </div>
            </div>

            {/* Best Practices */}
            <div className='glass-card space-y-4 rounded-lg p-6'>
              <h3 className='text-lg font-semibold text-gray-800'>
                🎯 Best Practices for Swapping
              </h3>
              <div className='space-y-3 text-sm text-gray-700'>
                <ul className='ml-4 space-y-2'>
                  <li>
                    • <strong>Start small</strong> - Test with small amounts
                    before making large swaps
                  </li>
                  <li>
                    • <strong>Check liquidity</strong> - Ensure there&apos;s
                    enough liquidity for your desired trade
                  </li>
                  <li>
                    • <strong>Compare rates</strong> - Use aggregators like Skip
                    Protocol to find the best prices
                  </li>
                  <li>
                    • <strong>Set slippage tolerance</strong> - Higher tolerance
                    means faster execution but potentially worse prices
                  </li>
                  <li>
                    • <strong>Keep some ATOM</strong> - Always maintain some
                    ATOM for transaction fees
                  </li>
                  <li>
                    • <strong>Double-check addresses</strong> - Verify
                    you&apos;re swapping the correct tokens
                  </li>
                </ul>
              </div>
            </div>

            {/* Next Steps */}
            <div className='glass-card space-y-4 rounded-lg p-6'>
              <h3 className='text-lg font-semibold text-gray-800'>
                🚀 Ready to Manage Your Portfolio?
              </h3>
              <div className='space-y-3 text-sm text-gray-700'>
                <p>
                  In the final step, you&apos;ll learn about wallet management -
                  how to securely store, track, and manage your assets and
                  stakes.
                </p>
                <p>
                  We&apos;ll cover security best practices, portfolio tracking,
                  and ongoing management strategies.
                </p>
              </div>
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
                Next: Wallet Management
              </button>
            </div>
          </div>
        );
      case 'validator-selection':
        return (
          <div className='space-y-8'>
            <div className='text-center'>
              <h2 className='text-3xl font-bold text-gray-800'>
                Choose Your Validators
              </h2>
              <p className='mt-2 text-gray-600'>
                Learn how to select the right validators for optimal staking
                rewards
              </p>
            </div>

            {/* What are Validators */}
            <div className='glass-card space-y-4 rounded-lg p-6'>
              <h3 className='text-lg font-semibold text-gray-800'>
                🏛️ What are Validators?
              </h3>
              <div className='space-y-3 text-sm text-gray-700'>
                <p>
                  <strong>Validators</strong> are network participants who run
                  specialized software to verify transactions and maintain the
                  Cosmos blockchain. They&apos;re like the &quot;bank
                  tellers&quot; of the network.
                </p>
                <p>
                  When you stake ATOM, you&apos;re delegating your tokens to
                  these validators, who then use your stake (along with others)
                  to participate in consensus and earn rewards for the network.
                </p>
              </div>
            </div>

            {/* Key Factors to Consider */}
            <div className='glass-card space-y-4 rounded-lg p-6'>
              <h3 className='text-lg font-semibold text-gray-800'>
                🔍 Key Factors When Choosing Validators
              </h3>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div className='glass-subtle space-y-2 rounded-lg p-3'>
                  <h4 className='font-semibold text-gray-800'>
                    📊 Commission Rate
                  </h4>
                  <p className='text-sm text-gray-600'>
                    The percentage of rewards the validator keeps (typically
                    5-10%). Lower isn&apos;t always better!
                  </p>
                </div>
                <div className='glass-subtle space-y-2 rounded-lg p-3'>
                  <h4 className='font-semibold text-gray-800'>⚡ Uptime</h4>
                  <p className='text-sm text-gray-600'>
                    How often the validator is online and participating in
                    consensus
                  </p>
                </div>
                <div className='glass-subtle space-y-2 rounded-lg p-3'>
                  <h4 className='font-semibold text-gray-800'>
                    💰 Total Stake
                  </h4>
                  <p className='text-sm text-gray-600'>
                    Amount of ATOM delegated to this validator (indicates trust)
                  </p>
                </div>
                <div className='glass-subtle space-y-2 rounded-lg p-3'>
                  <h4 className='font-semibold text-gray-800'>
                    🏆 Performance
                  </h4>
                  <p className='text-sm text-gray-600'>
                    Historical track record of earning rewards and avoiding
                    slashing
                  </p>
                </div>
              </div>
            </div>

            {/* Commission Rates Explained */}
            <div className='glass-card space-y-4 rounded-lg p-6'>
              <h3 className='text-lg font-semibold text-gray-800'>
                💸 Understanding Commission Rates
              </h3>
              <div className='space-y-3 text-sm text-gray-700'>
                <div className='flex items-start space-x-3'>
                  <span className='mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-xs font-bold text-white'>
                    💡
                  </span>
                  <p>
                    <strong>Commission</strong> is the percentage of rewards
                    that validators keep for their services. This helps them
                    cover operational costs and maintain quality infrastructure.
                  </p>
                </div>
                <div className='grid grid-cols-1 gap-3 md:grid-cols-3'>
                  <div className='glass-subtle rounded-lg p-3'>
                    <h4 className='font-semibold text-gray-800'>
                      Low Commission (0-5%)
                    </h4>
                    <p className='text-xs text-gray-600'>
                      Often newer validators trying to attract delegators
                    </p>
                  </div>
                  <div className='glass-subtle rounded-lg p-3'>
                    <h4 className='font-semibold text-gray-800'>
                      Medium Commission (5-10%)
                    </h4>
                    <p className='text-xs text-gray-600'>
                      Balanced approach, most common range
                    </p>
                  </div>
                  <div className='glass-subtle rounded-lg p-3'>
                    <h4 className='font-semibold text-gray-800'>
                      High Commission (10%+)
                    </h4>
                    <p className='text-xs text-gray-600'>
                      Established validators with proven track records
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Diversification Strategy */}
            <div className='glass-card space-y-4 rounded-lg p-6'>
              <h3 className='text-lg font-semibold text-gray-800'>
                🎯 Diversification Strategy
              </h3>
              <div className='space-y-3 text-sm text-gray-700'>
                <p>
                  <strong>Don&apos;t put all your eggs in one basket!</strong>{' '}
                  It&apos;s recommended to delegate to multiple validators to
                  reduce risk.
                </p>
                <div className='space-y-2'>
                  <h4 className='font-semibold text-gray-800'>
                    Recommended Approach:
                  </h4>
                  <ul className='ml-4 space-y-1'>
                    <li>
                      • <strong>50%</strong> to top 10 validators (proven track
                      record)
                    </li>
                    <li>
                      • <strong>30%</strong> to medium-sized validators (good
                      performance)
                    </li>
                    <li>
                      • <strong>20%</strong> to smaller validators (support
                      decentralization)
                    </li>
                  </ul>
                </div>
                <div className='glass-subtle mt-4 rounded-lg p-3'>
                  <p className='text-xs'>
                    <strong>Pro Tip:</strong> Avoid delegating more than 10% of
                    your stake to any single validator to minimize risk.
                  </p>
                </div>
              </div>
            </div>

            {/* Security Considerations */}
            <div className='glass-card space-y-4 rounded-lg p-6'>
              <h3 className='text-lg font-semibold text-gray-800'>
                🔒 Security Considerations
              </h3>
              <div className='space-y-3 text-sm text-gray-700'>
                <div className='flex items-start space-x-3'>
                  <span className='mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-orange-400 to-red-500 text-xs font-bold text-white'>
                    ⚠️
                  </span>
                  <p>
                    <strong>Slashing Risk:</strong> If a validator misbehaves
                    (double-signing, downtime), they and their delegators can
                    lose a portion of their stake.
                  </p>
                </div>
                <div className='flex items-start space-x-3'>
                  <span className='mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-orange-400 to-red-500 text-xs font-bold text-white'>
                    🛡️
                  </span>
                  <p>
                    <strong>Choose Wisely:</strong> Look for validators with
                    zero slashing history and high uptime percentages.
                  </p>
                </div>
                <div className='flex items-start space-x-3'>
                  <span className='mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-orange-400 to-red-500 text-xs font-bold text-white'>
                    🔍
                  </span>
                  <p>
                    <strong>Research:</strong> Check validator websites, social
                    media, and community reputation before delegating.
                  </p>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className='glass-card space-y-4 rounded-lg p-6'>
              <h3 className='text-lg font-semibold text-gray-800'>
                🚀 Ready to Choose Your Validators?
              </h3>
              <div className='space-y-3 text-sm text-gray-700'>
                <p>
                  In the next step, you&apos;ll learn about token swapping - how
                  to exchange other cryptocurrencies for ATOM or vice versa.
                </p>
                <p>This is useful if you want to:</p>
                <ul className='ml-4 space-y-1'>
                  <li>• Convert other tokens to ATOM for staking</li>
                  <li>
                    • Trade your staking rewards for other cryptocurrencies
                  </li>
                  <li>• Diversify your portfolio</li>
                </ul>
              </div>
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
                Next: Token Swapping
              </button>
            </div>
          </div>
        );
      case 'staking':
        return (
          <div className='space-y-8'>
            <div className='text-center'>
              <h2 className='text-3xl font-bold text-gray-800'>
                Start Staking Your ATOM
              </h2>
              <p className='mt-2 text-gray-600'>
                Learn how to delegate your tokens and start earning rewards
              </p>
            </div>

            {/* What is Staking */}
            <div className='glass-card space-y-4 rounded-lg p-6'>
              <h3 className='text-lg font-semibold text-gray-800'>
                🎯 What is Staking?
              </h3>
              <div className='space-y-3 text-sm text-gray-700'>
                <p>
                  <strong>Staking</strong> is the process of delegating your
                  ATOM tokens to validators who help secure the Cosmos network.
                  In return, you earn rewards in the form of additional ATOM
                  tokens.
                </p>
                <p>
                  Think of it like earning interest on your savings account, but
                  instead of a bank, you&apos;re helping secure a blockchain
                  network and earning cryptocurrency rewards.
                </p>
              </div>
            </div>

            {/* How Staking Works */}
            <div className='glass-card space-y-4 rounded-lg p-6'>
              <h3 className='text-lg font-semibold text-gray-800'>
                ⚙️ How Staking Works
              </h3>
              <div className='space-y-3 text-sm text-gray-700'>
                <div className='flex items-start space-x-3'>
                  <span className='mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-xs font-bold text-white'>
                    1
                  </span>
                  <p>
                    <strong>Delegate your ATOM</strong> - Choose validators to
                    delegate your tokens to
                  </p>
                </div>
                <div className='flex items-start space-x-3'>
                  <span className='mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-xs font-bold text-white'>
                    2
                  </span>
                  <p>
                    <strong>Validators secure the network</strong> - They verify
                    transactions and maintain the blockchain
                  </p>
                </div>
                <div className='flex items-start space-x-3'>
                  <span className='mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-xs font-bold text-white'>
                    3
                  </span>
                  <p>
                    <strong>Earn rewards</strong> - Receive ATOM rewards based
                    on your delegation amount and validator performance
                  </p>
                </div>
              </div>
            </div>

            {/* Staking Benefits */}
            <div className='glass-card space-y-4 rounded-lg p-6'>
              <h3 className='text-lg font-semibold text-gray-800'>
                💰 Benefits of Staking
              </h3>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div className='glass-subtle space-y-2 rounded-lg p-3'>
                  <h4 className='font-semibold text-gray-800'>
                    📈 Earn Rewards
                  </h4>
                  <p className='text-sm text-gray-600'>
                    Currently earn ~7-10% APY on your staked ATOM
                  </p>
                </div>
                <div className='glass-subtle space-y-2 rounded-lg p-3'>
                  <h4 className='font-semibold text-gray-800'>
                    🔒 Network Security
                  </h4>
                  <p className='text-sm text-gray-600'>
                    Help secure the Cosmos ecosystem
                  </p>
                </div>
                <div className='glass-subtle space-y-2 rounded-lg p-3'>
                  <h4 className='font-semibold text-gray-800'>
                    🎯 Governance Rights
                  </h4>
                  <p className='text-sm text-gray-600'>
                    Vote on network proposals and upgrades
                  </p>
                </div>
                <div className='glass-subtle space-y-2 rounded-lg p-3'>
                  <h4 className='font-semibold text-gray-800'>
                    💎 Compound Growth
                  </h4>
                  <p className='text-sm text-gray-600'>
                    Reinvest rewards for exponential growth
                  </p>
                </div>
              </div>
            </div>

            {/* Staking Requirements */}
            <div className='glass-card space-y-4 rounded-lg p-6'>
              <h3 className='text-lg font-semibold text-gray-800'>
                ⚠️ Important Staking Requirements
              </h3>
              <div className='space-y-3 text-sm text-gray-700'>
                <div className='flex items-start space-x-3'>
                  <span className='mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-orange-400 to-red-500 text-xs font-bold text-white'>
                    ⏰
                  </span>
                  <p>
                    <strong>Unbonding Period:</strong> When you want to unstake,
                    there&apos;s a 21-day unbonding period before you can
                    transfer your ATOM
                  </p>
                </div>
                <div className='flex items-start space-x-3'>
                  <span className='mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-orange-400 to-red-500 text-xs font-bold text-white'>
                    💸
                  </span>
                  <p>
                    <strong>Minimum Amount:</strong> You need at least 1 ATOM to
                    start staking
                  </p>
                </div>
                <div className='flex items-start space-x-3'>
                  <span className='mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-orange-400 to-red-500 text-xs font-bold text-white'>
                    🏦
                  </span>
                  <p>
                    <strong>Validator Commission:</strong> Validators take a
                    small commission (usually 5-10%) from your rewards
                  </p>
                </div>
              </div>
            </div>

            {/* Current Balance Check */}
            <div className='glass-card rounded-lg p-6'>
              <h3 className='mb-4 text-lg font-semibold text-gray-800'>
                💰 Your Available ATOM for Staking
              </h3>
              <ATOMBalanceDisplay address={connectedAddress} />
            </div>

            {/* Next Steps */}
            <div className='glass-card space-y-4 rounded-lg p-6'>
              <h3 className='text-lg font-semibold text-gray-800'>
                🚀 Ready to Start Staking?
              </h3>
              <div className='space-y-3 text-sm text-gray-700'>
                <p>
                  In the next step, you&apos;ll learn how to choose the right
                  validators for your staking strategy. We&apos;ll cover:
                </p>
                <ul className='ml-4 space-y-1'>
                  <li>• How to evaluate validator performance</li>
                  <li>• Commission rates and their impact</li>
                  <li>• Diversification strategies</li>
                  <li>• Security considerations</li>
                </ul>
              </div>
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
                Next: Choose Validators
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
