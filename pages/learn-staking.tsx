import Head from 'next/head';
import { useRouter } from 'next/router';
import { BookOpen, Play, Award, Users, Shield, Zap } from 'lucide-react';

export default function LearnStaking() {
  const router = useRouter();

  const startOnboarding = () => {
    router.push('/onboarding');
  };

  return (
    <>
      <Head>
        <title>Learn Staking - Stakefolio</title>
        <meta
          name='description'
          content='Learn about staking, earn rewards, and secure blockchain networks'
        />
      </Head>
      <div className='container mx-auto max-w-7xl px-6 py-8'>
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
              onClick={startOnboarding}
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
                Explore advanced staking concepts like slashing, unbonding
                periods, and governance participation.
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
                Learn essential security practices to protect your staked assets
                and avoid common pitfalls.
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
                  <h3 className='font-semibold text-gray-800'>
                    Create a Wallet
                  </h3>
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
                  <h3 className='font-semibold text-gray-800'>
                    Acquire Tokens
                  </h3>
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
                  <h3 className='font-semibold text-gray-800'>
                    Choose Validators
                  </h3>
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
      </div>
    </>
  );
}
