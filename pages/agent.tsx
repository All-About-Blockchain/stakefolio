import Head from 'next/head';
import AutonomousStakingAgentUi from '@/app/components/AutonomousStakingAgentUi';

export default function AgentPage() {
  return (
    <>
      <Head>
        <title>AI Staking Agent - Stakefolio</title>
        <meta
          name='description'
          content='Autonomous AI agent that optimizes your staking, maximizes airdrop eligibility, and handles governance voting — all on-device and non-custodial.'
        />
      </Head>
      <div className='min-h-screen bg-white font-sans text-gray-900'>
        <main className='mx-auto max-w-7xl px-6 py-16 sm:py-20 lg:px-8'>
          {/* Page Header */}
          <div className='mb-12'>
            <h1 className='font-["Playfair_Display",_serif] text-4xl font-light tracking-tight text-black sm:text-5xl'>
              AI Staking Agent
            </h1>
            <p className='mt-4 max-w-2xl text-lg font-light text-gray-500'>
              Set your preferences and let the on-device agent optimize your
              staking automatically — rebalancing yields, maximizing airdrop
              eligibility, and voting on governance proposals. Everything runs
              locally, non-custodially, on your device.
            </p>
          </div>

          {/* Agent Console */}
          <AutonomousStakingAgentUi />
        </main>
      </div>
    </>
  );
}
