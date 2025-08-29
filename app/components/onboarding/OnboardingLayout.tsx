import React from 'react';

interface OnboardingLayoutProps {
  children: React.ReactNode;
}

export function OnboardingLayout({ children }: OnboardingLayoutProps) {
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
        {/* Header */}
        <div className='mb-8 text-center'>
          <h1 className='bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text py-4 text-3xl font-bold text-transparent'>
            Stakefolio
          </h1>
          <p className='text-lg text-gray-600'>
            The simplest way to earn staking rewards
          </p>
        </div>

        {/* Content */}
        <div className='glass-card luxury-shadow-light rounded-xl border-0 p-8'>
          {children}
        </div>
      </div>
    </div>
  );
}
