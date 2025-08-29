import { ArrowRight, Zap, Shield, TrendingUp } from 'lucide-react';

interface WelcomeStepProps {
  onNext: () => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className='space-y-8 text-center'>
      <div>
        <h1 className='text-4xl font-bold text-gray-800'>
          Welcome to Stakefolio
        </h1>
        <p className='mt-4 text-xl text-gray-600'>
          The simplest way to earn staking rewards across the Cosmos ecosystem
        </p>
      </div>

      <div className='grid gap-6 md:grid-cols-3'>
        <div className='bright-card ultra-soft-shadow rounded-xl border-0 p-6'>
          <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500'>
            <Zap className='h-8 w-8 text-white' />
          </div>
          <h3 className='mb-2 text-lg font-semibold text-gray-800'>
            Buy & Auto-Stake
          </h3>
          <p className='text-gray-600'>
            Purchase ATOM and automatically earn staking rewards without
            managing validators
          </p>
        </div>

        <div className='bright-card ultra-soft-shadow rounded-xl border-0 p-6'>
          <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500'>
            <TrendingUp className='h-8 w-8 text-white' />
          </div>
          <h3 className='mb-2 text-lg font-semibold text-gray-800'>
            Diversify Portfolio
          </h3>
          <p className='text-gray-600'>
            Easily swap between different staked assets to optimize your returns
          </p>
        </div>

        <div className='bright-card ultra-soft-shadow rounded-xl border-0 p-6'>
          <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-500'>
            <Shield className='h-8 w-8 text-white' />
          </div>
          <h3 className='mb-2 text-lg font-semibold text-gray-800'>
            Liquid Staking
          </h3>
          <p className='text-gray-600'>
            Your staked assets remain liquid and can be used in DeFi protocols
          </p>
        </div>
      </div>

      <div className='bright-card ultra-soft-shadow rounded-xl border-0 p-8'>
        <h2 className='mb-4 text-2xl font-semibold text-gray-800'>
          How It Works
        </h2>
        <div className='space-y-4 text-left'>
          <div className='flex items-start gap-4'>
            <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-600'>
              1
            </div>
            <div>
              <h4 className='font-semibold text-gray-800'>Buy ATOM</h4>
              <p className='text-gray-600'>
                Purchase ATOM using fiat through our secure on-ramp integration
              </p>
            </div>
          </div>
          <div className='flex items-start gap-4'>
            <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-600'>
              2
            </div>
            <div>
              <h4 className='font-semibold text-gray-800'>Auto-Stake</h4>
              <p className='text-gray-600'>
                Your ATOM is automatically converted to stATOM and starts
                earning rewards
              </p>
            </div>
          </div>
          <div className='flex items-start gap-4'>
            <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-600'>
              3
            </div>
            <div>
              <h4 className='font-semibold text-gray-800'>Diversify</h4>
              <p className='text-gray-600'>
                Swap between different staked assets to optimize your portfolio
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className='flex justify-center'>
        <button
          onClick={onNext}
          className='flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 px-8 py-4 text-lg font-semibold text-white transition-all hover:scale-105 hover:shadow-lg'
        >
          Get Started
          <ArrowRight className='h-5 w-5' />
        </button>
      </div>
    </div>
  );
}
