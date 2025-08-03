import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { CheckCircle, Circle, Sparkles } from 'lucide-react';
import { OnboardingStep } from '../../App';

interface OnboardingLayoutProps {
  children: React.ReactNode;
  currentStep: OnboardingStep;
  currentStepIndex: number;
  totalSteps: number;
  completedSteps: Set<OnboardingStep>;
  onStepClick: (step: OnboardingStep) => void;
}

export function OnboardingLayout({
  children,
  currentStep,
  currentStepIndex,
  totalSteps,
  completedSteps,
  onStepClick,
}: OnboardingLayoutProps) {
  const steps: { key: OnboardingStep; title: string; description: string }[] = [
    { key: 'welcome', title: 'Welcome', description: 'Getting started' },
    {
      key: 'blockchain-education',
      title: 'Learn',
      description: 'Blockchain basics',
    },
    {
      key: 'wallet-creation',
      title: 'Wallet',
      description: 'Setup your wallet',
    },
    { key: 'fund-onramp', title: 'Funding', description: 'Add funds' },
    {
      key: 'wallet-management',
      title: 'Management',
      description: 'Manage assets',
    },
    { key: 'swapping', title: 'Swapping', description: 'Exchange tokens' },
    {
      key: 'validator-selection',
      title: 'Validators',
      description: 'Choose validators',
    },
    { key: 'staking', title: 'Staking', description: 'Start earning' },
  ];

  const progressPercentage = ((currentStepIndex + 1) / totalSteps) * 100;

  return (
    <div className='relative min-h-screen overflow-hidden'>
      {/* Floating Background Elements */}
      <div className='pointer-events-none absolute inset-0 overflow-hidden'>
        <div className='gradient-primary floating-card absolute left-10 top-10 h-64 w-64 rounded-full opacity-40 blur-3xl'></div>
        <div
          className='gradient-accent floating-card absolute right-20 top-1/3 h-48 w-48 rounded-full opacity-30 blur-3xl'
          style={{ animationDelay: '2s' }}
        ></div>
        <div
          className='gradient-warm floating-card absolute bottom-20 left-1/4 h-56 w-56 rounded-full opacity-25 blur-3xl'
          style={{ animationDelay: '4s' }}
        ></div>
        <div
          className='gradient-cool floating-card absolute left-1/2 top-1/2 h-32 w-32 rounded-full opacity-35 blur-2xl'
          style={{ animationDelay: '6s' }}
        ></div>
      </div>

      <div className='container relative z-10 mx-auto max-w-7xl px-6 py-8'>
        {/* Header */}
        <div className='mb-12 text-center'>
          <h1 className='mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-4xl font-bold text-transparent'>
            Cosmos Staking Mastery
          </h1>
          <p className='text-xl text-gray-600'>
            Your journey to earning passive income through blockchain staking
          </p>
        </div>

        {/* Progress Overview */}
        <Card className='glass-card luxury-shadow-light mb-8 border-0'>
          <CardContent className='p-8'>
            <div className='mb-6 flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <Sparkles className='h-6 w-6 text-purple-500' />
                <div>
                  <h2 className='text-2xl font-semibold text-gray-800'>
                    Learning Progress
                  </h2>
                  <p className='text-gray-600'>
                    Step {currentStepIndex + 1} of {totalSteps}
                  </p>
                </div>
              </div>
              <Badge className='border-0 bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-lg text-white'>
                {Math.round(progressPercentage)}% Complete
              </Badge>
            </div>

            <div className='space-y-4'>
              <Progress
                value={progressPercentage}
                className='h-3 bg-gray-100'
              />

              {/* Step Indicators */}
              <div className='mt-8 grid grid-cols-4 gap-4 lg:grid-cols-8'>
                {steps.map((step, index) => (
                  <Button
                    key={step.key}
                    variant='ghost'
                    size='sm'
                    onClick={() => onStepClick(step.key)}
                    className={`glass-button h-auto flex-col gap-2 border-0 p-4 transition-all duration-300 ${
                      currentStep === step.key
                        ? 'pastel-glow scale-105'
                        : 'hover:scale-105'
                    }`}
                  >
                    <div className='flex items-center justify-center'>
                      {completedSteps.has(step.key) ? (
                        <CheckCircle className='h-6 w-6 text-emerald-500' />
                      ) : currentStep === step.key ? (
                        <div className='flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500'>
                          <div className='h-2 w-2 rounded-full bg-white'></div>
                        </div>
                      ) : (
                        <Circle className='h-6 w-6 text-gray-400' />
                      )}
                    </div>
                    <div className='text-center'>
                      <div
                        className={`text-sm font-medium ${
                          currentStep === step.key ||
                          completedSteps.has(step.key)
                            ? 'text-gray-800'
                            : 'text-gray-500'
                        }`}
                      >
                        {step.title}
                      </div>
                      <div className='text-xs text-gray-400'>
                        {step.description}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className='mx-auto max-w-6xl'>{children}</div>
      </div>
    </div>
  );
}
