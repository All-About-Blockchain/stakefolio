import React from 'react';
import { Check, Circle } from 'lucide-react';

export type OnboardingStep =
  | 'welcome'
  | 'blockchain-education'
  | 'wallet-creation'
  | 'fund-onramp'
  | 'wallet-management'
  | 'swapping'
  | 'validator-selection'
  | 'staking';

interface OnboardingLayoutProps {
  children: React.ReactNode;
  currentStep: OnboardingStep;
  currentStepIndex: number;
  totalSteps: number;
  completedSteps: Set<OnboardingStep>;
  onStepClick: (step: OnboardingStep) => void;
  connectedAddress?: string | null;
  isTransitioning?: boolean;
}

const stepLabels: Record<OnboardingStep, string> = {
  welcome: 'Welcome',
  'blockchain-education': 'Learn',
  'wallet-creation': 'Wallet',
  'fund-onramp': 'Fund',
  'wallet-management': 'Manage',
  swapping: 'Swap',
  'validator-selection': 'Validators',
  staking: 'Stake',
};

export function OnboardingLayout({
  children,
  currentStep,
  currentStepIndex,
  totalSteps,
  completedSteps,
  onStepClick,
  connectedAddress,
  isTransitioning = false,
}: OnboardingLayoutProps) {
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

  return (
    <div className='relative min-h-screen overflow-hidden'>
      {/* Floating Background Elements */}
      <div className='pointer-events-none absolute inset-0 overflow-hidden'>
        <div className='gradient-primary floating-card absolute left-10 top-20 h-80 w-80 rounded-full opacity-50 blur-3xl'></div>
        <div
          className='gradient-accent floating-card absolute right-20 top-40 h-60 w-60 rounded-full opacity-40 blur-3xl'
          style={{ animationDelay: '2s' }}
        ></div>
        <div
          className='gradient-warm floating-card absolute bottom-20 left-1/3 h-72 w-72 rounded-full opacity-35 blur-3xl'
          style={{ animationDelay: '4s' }}
        ></div>
      </div>

      <div className='container relative z-10 mx-auto max-w-6xl px-6 py-8'>
        {/* Progress Header */}
        <div className='mb-8'>
          <div className='mb-6 flex items-center justify-between'>
            <h1 className='bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text py-4 text-3xl font-bold text-transparent'>
              Cosmos Staking Guide
            </h1>
            <div className='flex items-center gap-4'>
              {connectedAddress && (
                <div className='rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700'>
                  {connectedAddress}
                </div>
              )}
              <div className='text-sm text-gray-600'>
                Step {currentStepIndex + 1} of {totalSteps}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className='mb-6 h-2 w-full rounded-full bg-gray-200'>
            <div
              className='h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500'
              style={{
                width: `${((currentStepIndex + 1) / totalSteps) * 100}%`,
              }}
            ></div>
          </div>

          {/* Step Navigation */}
          <div className='mb-8 flex items-center justify-between'>
            {steps.map((step, index) => {
              const isCompleted = completedSteps.has(step);
              const isCurrent = step === currentStep;
              const isClickable = index <= currentStepIndex + 1;

              return (
                <button
                  key={step}
                  onClick={() =>
                    isClickable && !isTransitioning && onStepClick(step)
                  }
                  disabled={!isClickable || isTransitioning}
                  className={`flex flex-col items-center gap-2 transition-all duration-300 ${
                    isClickable && !isTransitioning
                      ? 'cursor-pointer hover:scale-105'
                      : 'cursor-not-allowed opacity-50'
                  } ${isTransitioning ? 'pointer-events-none' : ''}`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      isCompleted
                        ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white'
                        : isCurrent
                          ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                          : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className='h-5 w-5' />
                    ) : (
                      <span className='text-sm font-semibold'>{index + 1}</span>
                    )}
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      isCurrent
                        ? 'text-purple-600'
                        : isCompleted
                          ? 'text-emerald-600'
                          : 'text-gray-500'
                    }`}
                  >
                    {stepLabels[step]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div
          className={`glass-card luxury-shadow-light rounded-xl border-0 p-8 transition-opacity duration-300 ${
            isTransitioning ? 'opacity-75' : 'opacity-100'
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
