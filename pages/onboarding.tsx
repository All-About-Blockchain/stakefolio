import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { WelcomeStep } from '../app/components/onboarding/WelcomeStep';
import { BlockchainEducationStep } from '../app/components/onboarding/BlockchainEducationStep';
import {
  OnboardingLayout,
  OnboardingStep,
} from '../app/components/onboarding/OnboardingLayout';
import { ArrowLeft } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [completedSteps, setCompletedSteps] = useState<Set<OnboardingStep>>(
    new Set()
  );

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

  const goToNextStep = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCompletedSteps((prev) => new Set([...prev, currentStep]));
      setCurrentStep(steps[nextIndex]);
    } else {
      // Onboarding complete, return to dashboard
      router.push('/');
      setCompletedSteps((prev) => new Set([...prev, currentStep]));
    }
  };

  const goToPreviousStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex]);
    }
  };

  const goToStep = (step: OnboardingStep) => {
    setCurrentStep(step);
  };

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
          <div className='space-y-6 text-center'>
            <h2 className='text-3xl font-bold text-gray-800'>
              Create Your Wallet
            </h2>
            <p className='text-gray-600'>
              This step will guide you through wallet creation...
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
      case 'fund-onramp':
        return (
          <div className='space-y-6 text-center'>
            <h2 className='text-3xl font-bold text-gray-800'>
              Fund Your Wallet
            </h2>
            <p className='text-gray-600'>
              Learn how to acquire tokens for staking...
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
      >
        {/* Back to Dashboard Button */}
        <div className='mb-4'>
          <button
            onClick={returnToDashboard}
            className='glass-button flex items-center gap-2 rounded-lg border-0 px-4 py-2'
          >
            <ArrowLeft className='h-4 w-4' />
            Back to Dashboard
          </button>
        </div>

        {renderCurrentStep()}
      </OnboardingLayout>
    </>
  );
}
