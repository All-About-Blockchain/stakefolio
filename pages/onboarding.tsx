import Head from 'next/head';
import { useState } from 'react';
import { WelcomeStep } from '../app/components/onboarding/WelcomeStep';
import { WalletSetup } from '../app/components/onboarding/WalletSetup';
import { OnRampWidget } from '../app/components/onboarding/OnRampWidget';
import { OnboardingLayout } from '../app/components/onboarding/OnboardingLayout';

type OnboardingStep = 'welcome' | 'wallet' | 'buy' | 'complete';

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');

  const handleNext = () => {
    switch (currentStep) {
      case 'welcome':
        setCurrentStep('wallet');
        break;
      case 'wallet':
        setCurrentStep('buy');
        break;
      case 'buy':
        setCurrentStep('complete');
        break;
      case 'complete':
        window.location.href = '/portfolio';
        break;
    }
  };

  const handlePrevious = () => {
    switch (currentStep) {
      case 'wallet':
        setCurrentStep('welcome');
        break;
      case 'buy':
        setCurrentStep('wallet');
        break;
      case 'complete':
        setCurrentStep('buy');
        break;
      default:
        break;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'welcome':
        return <WelcomeStep onNext={handleNext} />;
      case 'wallet':
        return <WalletSetup onPrevious={handlePrevious} onNext={handleNext} />;
      case 'buy':
        return <OnRampWidget onComplete={handleNext} />;
      case 'complete':
        return (
          <div className='space-y-8 text-center'>
            <div className='mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500'>
              <svg
                className='h-8 w-8 text-white'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M5 13l4 4L19 7'
                />
              </svg>
            </div>
            <h2 className='text-3xl font-bold text-gray-800'>
              Welcome to Stakefolio!
            </h2>
            <p className='text-lg text-gray-600'>
              You&apos;re all set up and ready to start earning staking rewards.
            </p>
            <div className='space-y-4'>
              <div className='flex items-center justify-center gap-3 text-sm text-gray-600'>
                <div className='flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100'>
                  <svg
                    className='h-4 w-4 text-emerald-600'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                </div>
                <span>Wallet connected to CosmosHub</span>
              </div>
              <div className='flex items-center justify-center gap-3 text-sm text-gray-600'>
                <div className='flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100'>
                  <svg
                    className='h-4 w-4 text-emerald-600'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                </div>
                <span>ATOM purchased and auto-staked</span>
              </div>
              <div className='flex items-center justify-center gap-3 text-sm text-gray-600'>
                <div className='flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100'>
                  <svg
                    className='h-4 w-4 text-emerald-600'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                </div>
                <span>Earning 8.5% APR on your investment</span>
              </div>
            </div>
            <button
              onClick={handleNext}
              className='rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 px-8 py-3 text-white transition-all hover:scale-105 hover:shadow-lg'
            >
              View My Portfolio
            </button>
          </div>
        );
      default:
        return <WelcomeStep onNext={handleNext} />;
    }
  };

  return (
    <>
      <Head>
        <title>Onboarding - Stakefolio</title>
        <meta
          name='description'
          content='Get started with liquid staking on CosmosHub'
        />
      </Head>
      <OnboardingLayout>
        <div className='mx-auto max-w-4xl'>
          {/* Progress Bar */}
          <div className='mb-8'>
            <div className='mb-2 flex items-center justify-between'>
              <span className='text-sm font-medium text-gray-700'>
                Step{' '}
                {currentStep === 'welcome'
                  ? 1
                  : currentStep === 'wallet'
                    ? 2
                    : currentStep === 'buy'
                      ? 3
                      : 4}{' '}
                of 4
              </span>
              <span className='text-sm text-gray-500'>
                {currentStep === 'welcome'
                  ? 'Welcome'
                  : currentStep === 'wallet'
                    ? 'Connect Wallet'
                    : currentStep === 'buy'
                      ? 'Buy & Stake'
                      : 'Complete'}
              </span>
            </div>
            <div className='h-2 w-full rounded-full bg-gray-200'>
              <div
                className='h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500'
                style={{
                  width:
                    currentStep === 'welcome'
                      ? '25%'
                      : currentStep === 'wallet'
                        ? '50%'
                        : currentStep === 'buy'
                          ? '75%'
                          : '100%',
                }}
              ></div>
            </div>
          </div>

          {/* Step Content */}
          {renderStep()}
        </div>
      </OnboardingLayout>
    </>
  );
}
