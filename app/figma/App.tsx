import React, { useState } from 'react';
import { WelcomeStep } from './components/onboarding/WelcomeStep';
import { BlockchainEducationStep } from './components/onboarding/BlockchainEducationStep';
import { WalletCreationStep } from './components/onboarding/WalletCreationStep';
import { FundOnrampStep } from './components/onboarding/FundOnrampStep';
import { WalletManagementStep } from './components/onboarding/WalletManagementStep';
import { SwappingStep } from './components/onboarding/SwappingStep';
import { ValidatorSelectionStep } from './components/onboarding/ValidatorSelectionStep';
import { StakingStep } from './components/onboarding/StakingStep';
import { OnboardingLayout } from './components/layout/OnboardingLayout';
import { MainDashboard } from './components/dashboard/MainDashboard';
import { Button } from './components/ui/button';
import { Card, CardContent } from './components/ui/card';
import { ArrowLeft, Home } from 'lucide-react';

export type OnboardingStep =
  | 'welcome'
  | 'blockchain-education'
  | 'wallet-creation'
  | 'fund-onramp'
  | 'wallet-management'
  | 'swapping'
  | 'validator-selection'
  | 'staking';

export type AppView = 'dashboard' | 'onboarding';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
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
      setCurrentView('dashboard');
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

  const startOnboarding = () => {
    setCurrentView('onboarding');
    setCurrentStep('welcome');
  };

  const returnToDashboard = () => {
    setCurrentView('dashboard');
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
          <WalletCreationStep
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        );
      case 'fund-onramp':
        return (
          <FundOnrampStep onNext={goToNextStep} onPrevious={goToPreviousStep} />
        );
      case 'wallet-management':
        return (
          <WalletManagementStep
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        );
      case 'swapping':
        return (
          <SwappingStep onNext={goToNextStep} onPrevious={goToPreviousStep} />
        );
      case 'validator-selection':
        return (
          <ValidatorSelectionStep
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        );
      case 'staking':
        return (
          <StakingStep onPrevious={goToPreviousStep} onNext={goToNextStep} />
        );
      default:
        return <WelcomeStep onNext={goToNextStep} />;
    }
  };

  if (currentView === 'dashboard') {
    return <MainDashboard onStartOnboarding={startOnboarding} />;
  }

  return (
    <OnboardingLayout
      currentStep={currentStep}
      currentStepIndex={currentStepIndex}
      totalSteps={steps.length}
      completedSteps={completedSteps}
      onStepClick={goToStep}
    >
      {/* Back to Dashboard Button */}
      <div className='mb-4'>
        <Button
          variant='outline'
          size='sm'
          onClick={returnToDashboard}
          className='flex items-center gap-2'
        >
          <ArrowLeft className='h-4 w-4' />
          Back to Dashboard
        </Button>
      </div>

      {renderCurrentStep()}
    </OnboardingLayout>
  );
}
