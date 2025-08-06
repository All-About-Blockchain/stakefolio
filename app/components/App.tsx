import React, { useState } from 'react';
import { Dashboard } from './Dashboard';
import { Portfolio } from './Portfolio';
import { Staking } from './Staking';
import { Activity } from './Activity';
import { WelcomeStep } from './onboarding/WelcomeStep';
import { BlockchainEducationStep } from './onboarding/BlockchainEducationStep';
import {
  OnboardingLayout,
  OnboardingStep,
} from './onboarding/OnboardingLayout';
import {
  ArrowLeft,
  BookOpen,
  Play,
  Award,
  Users,
  Shield,
  Zap,
} from 'lucide-react';

export type AppView =
  | 'learn-staking'
  | 'dashboard'
  | 'portfolio'
  | 'staking'
  | 'activity'
  | 'onboarding';

interface LearnStakingProps {
  onStartOnboarding: () => void;
}

function LearnStaking({ onStartOnboarding }: LearnStakingProps) {
  return (
    <div className='space-y-8'>
      {/* Hero Section */}
      <div className='bright-card ultra-soft-shadow rounded-xl border-0 p-8 text-center'>
        <div className='mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500'>
          <BookOpen className='h-10 w-10 text-white' />
        </div>
        <h1 className='mb-4 text-4xl font-bold text-gray-800'>
          Learn About Staking
        </h1>
        <p className='mb-8 text-xl text-gray-600'>
          Discover how staking works, earn rewards, and secure blockchain
          networks
        </p>
        <button
          onClick={onStartOnboarding}
          className='rounded-lg border-0 bg-gradient-to-r from-purple-500 to-blue-500 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl'
        >
          <Play className='mr-2 inline h-5 w-5' />
          Start Learning Journey
        </button>
      </div>

      {/* Learning Modules */}
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        <div className='bright-card ultra-soft-shadow rounded-xl border-0 p-6'>
          <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-500'>
            <Shield className='h-6 w-6 text-white' />
          </div>
          <h3 className='mb-3 text-xl font-semibold text-gray-800'>
            What is Staking?
          </h3>
          <p className='text-gray-600'>
            Learn the fundamentals of staking and how it secures blockchain
            networks while earning rewards.
          </p>
        </div>

        <div className='bright-card ultra-soft-shadow rounded-xl border-0 p-6'>
          <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-green-500'>
            <Award className='h-6 w-6 text-white' />
          </div>
          <h3 className='mb-3 text-xl font-semibold text-gray-800'>
            Earning Rewards
          </h3>
          <p className='text-gray-600'>
            Understand how staking rewards work and how to maximize your
            earnings through delegation.
          </p>
        </div>

        <div className='bright-card ultra-soft-shadow rounded-xl border-0 p-6'>
          <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500'>
            <Users className='h-6 w-6 text-white' />
          </div>
          <h3 className='mb-3 text-xl font-semibold text-gray-800'>
            Validator Selection
          </h3>
          <p className='text-gray-600'>
            Learn how to choose reliable validators and understand the
            importance of decentralization.
          </p>
        </div>

        <div className='bright-card ultra-soft-shadow rounded-xl border-0 p-6'>
          <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-500'>
            <Zap className='h-6 w-6 text-white' />
          </div>
          <h3 className='mb-3 text-xl font-semibold text-gray-800'>
            Getting Started
          </h3>
          <p className='text-gray-600'>
            Step-by-step guide to create a wallet, acquire tokens, and start
            your first delegation.
          </p>
        </div>

        <div className='bright-card ultra-soft-shadow rounded-xl border-0 p-6'>
          <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500'>
            <BookOpen className='h-6 w-6 text-white' />
          </div>
          <h3 className='mb-3 text-xl font-semibold text-gray-800'>
            Advanced Concepts
          </h3>
          <p className='text-gray-600'>
            Explore advanced staking concepts like slashing, unbonding periods,
            and governance participation.
          </p>
        </div>

        <div className='bright-card ultra-soft-shadow rounded-xl border-0 p-6'>
          <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500'>
            <Shield className='h-6 w-6 text-white' />
          </div>
          <h3 className='mb-3 text-xl font-semibold text-gray-800'>
            Security Best Practices
          </h3>
          <p className='text-gray-600'>
            Learn essential security practices to protect your staked assets and
            avoid common pitfalls.
          </p>
        </div>
      </div>

      {/* Quick Start Guide */}
      <div className='bright-card ultra-soft-shadow rounded-xl border-0 p-8'>
        <h2 className='mb-6 text-2xl font-bold text-gray-800'>
          Quick Start Guide
        </h2>
        <div className='space-y-4'>
          <div className='flex items-center gap-4'>
            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-purple-500 font-bold text-white'>
              1
            </div>
            <div>
              <h3 className='font-semibold text-gray-800'>Create a Wallet</h3>
              <p className='text-gray-600'>
                Set up a secure wallet to store your tokens
              </p>
            </div>
          </div>
          <div className='flex items-center gap-4'>
            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 font-bold text-white'>
              2
            </div>
            <div>
              <h3 className='font-semibold text-gray-800'>Acquire Tokens</h3>
              <p className='text-gray-600'>
                Purchase or receive tokens for staking
              </p>
            </div>
          </div>
          <div className='flex items-center gap-4'>
            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-green-500 font-bold text-white'>
              3
            </div>
            <div>
              <h3 className='font-semibold text-gray-800'>Choose Validators</h3>
              <p className='text-gray-600'>
                Research and select reliable validators
              </p>
            </div>
          </div>
          <div className='flex items-center gap-4'>
            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 font-bold text-white'>
              4
            </div>
            <div>
              <h3 className='font-semibold text-gray-800'>Start Staking</h3>
              <p className='text-gray-600'>
                Delegate your tokens and start earning rewards
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('learn-staking');
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

  const navigateTo = (view: AppView) => {
    setCurrentView(view);
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

  if (currentView === 'onboarding') {
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
    );
  }

  // Render main app with navigation
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
        <div
          className='gradient-cool floating-card absolute right-1/4 top-1/2 h-48 w-48 rounded-full opacity-30 blur-2xl'
          style={{ animationDelay: '6s' }}
        ></div>
        <div
          className='gradient-cosmic floating-card absolute left-1/2 top-10 h-40 w-40 rounded-full opacity-45 blur-2xl'
          style={{ animationDelay: '8s' }}
        ></div>
      </div>

      <div className='container relative z-10 mx-auto max-w-7xl px-6 py-8'>
        {/* Navigation Header */}
        <div className='mb-8'>
          <div className='flex items-center justify-between'>
            <div className='space-y-2'>
              <h1 className='bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-4xl font-bold text-transparent'>
                Cosmos Portfolio
              </h1>
              <p className='text-lg text-gray-600'>
                Track your assets, staking rewards, and DeFi positions
              </p>
            </div>
            <div className='flex items-center gap-4'>
              <button className='glass-button flex items-center gap-2 rounded-lg border-0 px-4 py-2'>
                <svg
                  className='h-4 w-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
                  />
                </svg>
                Refresh
              </button>
              <button className='glass-button flex items-center gap-2 rounded-lg border-0 px-4 py-2'>
                <svg
                  className='h-4 w-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
                  />
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                  />
                </svg>
                Settings
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className='mt-6'>
            <div className='flex gap-2'>
              <button
                onClick={() => navigateTo('learn-staking')}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  currentView === 'learn-staking'
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                    : 'glass-button border-0 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <svg
                  className='h-4 w-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
                  />
                </svg>
                Learn Staking
              </button>
              <button
                onClick={() => navigateTo('dashboard')}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  currentView === 'dashboard'
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                    : 'glass-button border-0 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <svg
                  className='h-4 w-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z'
                  />
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z'
                  />
                </svg>
                Overview
              </button>
              <button
                onClick={() => navigateTo('portfolio')}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  currentView === 'portfolio'
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                    : 'glass-button border-0 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <svg
                  className='h-4 w-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
                  />
                </svg>
                Portfolio
              </button>
              <button
                onClick={() => navigateTo('staking')}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  currentView === 'staking'
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                    : 'glass-button border-0 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <svg
                  className='h-4 w-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z'
                  />
                </svg>
                Staking
              </button>
              <button
                onClick={() => navigateTo('activity')}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  currentView === 'activity'
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                    : 'glass-button border-0 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <svg
                  className='h-4 w-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
                Activity
              </button>
            </div>
          </div>
        </div>

        {/* Render current view */}
        {currentView === 'learn-staking' && (
          <LearnStaking onStartOnboarding={startOnboarding} />
        )}
        {currentView === 'dashboard' && (
          <Dashboard onStartOnboarding={startOnboarding} />
        )}
        {currentView === 'portfolio' && <Portfolio />}
        {currentView === 'staking' && <Staking />}
        {currentView === 'activity' && <Activity />}
      </div>
    </div>
  );
}
