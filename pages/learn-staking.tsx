import Head from 'next/head';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import TopStakingNetworks from '@/app/components/TopStakingNetworks';

export default function LearnStaking() {
  return (
    <>
      <Head>
        <title>Learn Staking - Stakefolio</title>
        <meta
          name='description'
          content='Learn how staking works, compare top networks, and start earning rewards.'
        />
      </Head>

      <div className='min-h-screen bg-white font-sans text-gray-900'>
        <main className='mx-auto max-w-7xl px-6 py-16 sm:py-20 lg:px-8'>
          {/* Hero */}
          <div className='mb-16'>
            <h1 className='font-["Playfair_Display",_serif] text-4xl font-light tracking-tight text-black sm:text-5xl'>
              How Staking Works
            </h1>
            <p className='mt-5 max-w-2xl text-lg font-light leading-relaxed text-gray-500'>
              Staking secures blockchain networks and earns you rewards. Learn
              the basics, compare networks, and find the right fit for your
              goals.
            </p>
          </div>

          {/* Quick Start Steps */}
          <div className='mb-20 rounded-2xl border border-gray-200 bg-gray-50/50 p-8 sm:p-10'>
            <h2 className='mb-8 font-["Playfair_Display",_serif] text-2xl font-light text-black'>
              Get Started in 4 Steps
            </h2>
            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
              {[
                {
                  step: '1',
                  title: 'Connect Wallet',
                  description:
                    'Sign in with email, social, or an existing wallet. Stakefolio creates a secure wallet for you automatically.',
                  color: 'bg-black',
                },
                {
                  step: '2',
                  title: 'Deposit Assets',
                  description:
                    'Add funds via bank transfer, card, or by sending crypto from another wallet.',
                  color: 'bg-gray-700',
                },
                {
                  step: '3',
                  title: 'Choose Networks',
                  description:
                    'Pick the networks you want to stake on. Compare yields, risks, and unbonding periods below.',
                  color: 'bg-gray-600',
                },
                {
                  step: '4',
                  title: 'Start Earning',
                  description:
                    'Rewards accrue automatically. Stakefolio handles compounding, rebalancing, and governance.',
                  color: 'bg-emerald-600',
                },
              ].map((item) => (
                <div key={item.step} className='flex flex-col gap-3'>
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.color} text-sm font-bold text-white`}
                  >
                    {item.step}
                  </div>
                  <h3 className='text-base font-semibold text-black'>
                    {item.title}
                  </h3>
                  <p className='text-sm leading-relaxed text-gray-500'>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            <div className='mt-8 flex flex-wrap gap-3'>
              <Link
                href='/funding?tab=deposit'
                className='inline-flex items-center gap-2 rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800'
              >
                Deposit Assets
                <ArrowRight className='h-4 w-4' />
              </Link>
              <Link
                href='/staking'
                className='inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition-colors hover:border-black hover:text-black'
              >
                Go to Staking
              </Link>
            </div>
          </div>

          {/* Key Concepts */}
          <div className='mb-20'>
            <h2 className='mb-8 font-["Playfair_Display",_serif] text-2xl font-light text-black'>
              Key Concepts
            </h2>
            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
              {[
                {
                  title: 'Staking Rewards',
                  description:
                    'When you stake, you help validate transactions on the network. In return, you earn a percentage yield on your staked amount — similar to interest in traditional finance.',
                },
                {
                  title: 'Validators',
                  description:
                    'Validators are nodes that process transactions. You delegate your tokens to a validator, and they share the rewards. Choose validators with high uptime and fair commission.',
                },
                {
                  title: 'Unbonding Period',
                  description:
                    'When you unstake, there\'s a waiting period (varies by network) before you can access your tokens. During this time, you don\'t earn rewards.',
                },
                {
                  title: 'Slashing Risk',
                  description:
                    'If a validator misbehaves, a portion of staked tokens can be penalized. This is rare with reputable validators, and Stakefolio monitors validator health.',
                },
                {
                  title: 'Liquid Staking',
                  description:
                    'Some networks offer liquid staking tokens (like stATOM) that represent your staked position. These can be used in DeFi while still earning rewards.',
                },
                {
                  title: 'Governance',
                  description:
                    'Many networks let stakers vote on protocol upgrades. Active participation can improve airdrop eligibility. Stakefolio can vote on your behalf.',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className='rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-gray-300 hover:shadow-sm'
                >
                  <h3 className='mb-3 text-base font-semibold text-black'>
                    {item.title}
                  </h3>
                  <p className='text-sm leading-relaxed text-gray-500'>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Top 10 Networks Reference */}
          <TopStakingNetworks sectionId='networks' />
        </main>
      </div>
    </>
  );
}
