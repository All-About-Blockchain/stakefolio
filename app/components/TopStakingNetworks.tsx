'use client';

import Link from 'next/link';
import { useState, type ReactNode } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import {
  STAKING_NETWORKS_TOP_10,
  formatPct,
  formatYieldRangeLabel,
  getRealYieldBounds,
  type StakingNetwork,
} from '@/app/config/stakingNetworks';

function PanelSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <h3 className='mb-3 text-sm font-semibold tracking-tight text-gray-900'>
        {title}
      </h3>
      <div className='text-[15px] leading-[1.75] text-gray-600'>{children}</div>
    </div>
  );
}

function RealYieldBlock({ network }: { network: StakingNetwork }) {
  const real = getRealYieldBounds(network);
  const hasNominal =
    network.nominalYieldMinPct != null && network.nominalYieldMaxPct != null;
  const inflation = network.annualInflationPctApprox;

  return (
    <div className='rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7'>
      <h4 className='text-base font-semibold tracking-tight text-gray-900'>
        Yield vs inflation
      </h4>
      <p className='mt-3 max-w-2xl text-sm leading-relaxed text-gray-500'>
        <span className='font-medium text-gray-700'>Real yield</span> here means
        nominal staking rewards minus estimated annual supply inflation—both in
        percentage points. It is an approximation for comparing chains, not a
        personal tax or fiat inflation forecast.
      </p>
      <dl className='mt-6 space-y-4 text-sm'>
        <div className='flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6'>
          <dt className='shrink-0 text-gray-500'>
            Nominal staking (indicative)
          </dt>
          <dd className='text-right text-base font-semibold text-gray-900 sm:text-right'>
            {hasNominal ? formatYieldRangeLabel(network) : 'Varies with epoch'}
          </dd>
        </div>
        <div className='flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6'>
          <dt className='shrink-0 text-gray-500'>
            Est. chain inflation / emission
          </dt>
          <dd className='text-right text-base font-semibold text-gray-900'>
            {inflation == null
              ? '—'
              : inflation <= 0
                ? `${formatPct(inflation)} (net burn / deflationary)`
                : `~${inflation}%`}
          </dd>
        </div>
        <div className='border-t border-gray-200 pt-5'>
          <div className='flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6'>
            <dt className='shrink-0 font-medium text-gray-800'>
              Inflation-adjusted (real) yield
            </dt>
            <dd className='text-right text-lg font-semibold tracking-tight text-gray-900'>
              {real ? (
                <>
                  {real.min.toFixed(1)}% to {real.max.toFixed(1)}%
                </>
              ) : (
                <span className='text-base font-normal text-gray-500'>
                  Add current nominal rate to compare
                </span>
              )}
            </dd>
          </div>
        </div>
      </dl>
    </div>
  );
}

function StakeCtaBlock({ network }: { network: StakingNetwork }) {
  const { stakeCta } = network;

  return (
    <div className='rounded-2xl bg-gray-950 px-6 py-8 text-gray-100 shadow-lg sm:px-9 sm:py-10'>
      <p className='text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-gray-500'>
        Your portfolio
      </p>
      <h3 className='mt-2 font-["Playfair_Display",_serif] text-2xl font-light tracking-tight text-white sm:text-[1.75rem]'>
        {stakeCta.headline}
      </h3>
      <p className='mt-4 max-w-2xl text-sm leading-relaxed text-gray-400'>
        {stakeCta.supportingLine}
      </p>

      <div className='mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center'>
        <Link
          href='/staking'
          className='inline-flex items-center justify-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-medium text-gray-950 transition-colors hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'
        >
          Configure staking
          <ArrowRight className='h-4 w-4' aria-hidden />
        </Link>
        <Link
          href='/funding?tab=deposit'
          className='inline-flex items-center justify-center rounded-md border border-white/25 bg-white/5 px-5 py-3 text-sm font-medium text-white transition-colors hover:border-white/40 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'
        >
          Deposit assets first
        </Link>
        <Link
          href='/learn-staking'
          className='inline-flex items-center justify-center px-2 py-3 text-sm font-medium text-gray-400 underline-offset-4 transition-colors hover:text-white hover:underline sm:ml-1'
        >
          How Stakefolio runs staking
        </Link>
      </div>

      <div className='mt-10 border-t border-white/10 pt-10'>
        <h4 className='text-sm font-semibold tracking-tight text-white'>
          Staking methods for {network.symbol}
        </h4>
        <p className='mt-2 max-w-2xl text-xs leading-relaxed text-gray-500'>
          Choose a route in Stakefolio—native delegation, liquid receipts, or a
          custodial program where your policy allows it. After you confirm, your
          portfolio builds, signs, and broadcasts the underlying transactions
          and keeps positions and rewards in one place.
        </p>
        <ul className='mt-6 grid gap-4 sm:grid-cols-2 lg:gap-5'>
          {stakeCta.methods.map((method) => (
            <li
              key={method.title}
              className='rounded-xl border border-white/10 bg-white/[0.04] p-4 sm:p-5'
            >
              <p className='text-sm font-semibold tracking-tight text-white'>
                {method.title}
              </p>
              <p className='mt-2 text-sm leading-relaxed text-gray-400'>
                {method.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

type TopStakingNetworksProps = {
  sectionId?: string;
};

export default function TopStakingNetworks({
  sectionId,
}: TopStakingNetworksProps) {
  const [openRank, setOpenRank] = useState<number | null>(null);

  return (
    <section id={sectionId} className='mt-16 scroll-mt-24 sm:mt-20'>
      <header className='mb-10 sm:mb-12'>
        <h2 className='font-["Playfair_Display",_serif] text-3xl font-light tracking-tight text-black sm:text-[2rem]'>
          Top 10 Staking Networks
        </h2>
        <div className='mt-5 h-px max-w-xs bg-gradient-to-r from-gray-900/20 to-transparent' />
        <p className='mt-6 max-w-2xl text-base leading-relaxed text-gray-600'>
          Explore consensus, portfolio context, and a rough{' '}
          <span className='font-medium text-gray-800'>real yield</span> view
          (staking reward minus illustrative supply inflation). When you are
          ready, deposit assets, pick networks, and select a staking method—{' '}
          <span className='font-medium text-gray-800'>
            Stakefolio handles the on-chain activity
          </span>{' '}
          from your portfolio.
        </p>
      </header>

      <div className='rounded-2xl border border-gray-200/80 bg-gray-50/90 p-3 shadow-sm sm:p-5'>
        <div className='space-y-3 sm:space-y-4'>
          {STAKING_NETWORKS_TOP_10.map((network) => {
            const isOpen = openRank === network.rank;
            return (
              <div
                key={network.rank}
                className={`overflow-hidden rounded-xl border bg-white transition-shadow ${
                  isOpen
                    ? 'border-gray-300 shadow-md ring-1 ring-gray-900/[0.04]'
                    : 'border-gray-200/90 shadow-sm hover:border-gray-300 hover:shadow'
                }`}
              >
                <button
                  type='button'
                  id={`staking-network-trigger-${network.rank}`}
                  aria-expanded={isOpen}
                  aria-controls={`staking-network-panel-${network.rank}`}
                  onClick={() => setOpenRank(isOpen ? null : network.rank)}
                  className='flex w-full items-center gap-4 px-5 py-5 text-left transition-colors hover:bg-gray-50/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black sm:gap-5 sm:px-7 sm:py-6'
                >
                  <span className='flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-800 ring-1 ring-inset ring-gray-200/80'>
                    {network.rank}
                  </span>
                  <div className='min-w-0 flex-1'>
                    <div className='text-lg font-semibold tracking-tight text-gray-900'>
                      {network.name}{' '}
                      <span className='font-normal text-gray-400'>
                        {network.symbol}
                      </span>
                    </div>
                    <p className='mt-2 text-sm leading-snug text-gray-500 sm:leading-relaxed'>
                      <span className='text-gray-600'>
                        {network.consensusModel}
                      </span>
                      <span className='mx-2 text-gray-300' aria-hidden>
                        ·
                      </span>
                      <span>{network.whyItMattersSummary}</span>
                    </p>
                  </div>
                  <div className='hidden shrink-0 text-right sm:block'>
                    <div className='text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-gray-400'>
                      Nominal yield
                    </div>
                    <div className='mt-1.5 text-lg font-semibold tabular-nums tracking-tight text-gray-900'>
                      {formatYieldRangeLabel(network)}
                    </div>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200 ease-out ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    aria-hidden
                  />
                </button>
                <div
                  id={`staking-network-panel-${network.rank}`}
                  role='region'
                  aria-labelledby={`staking-network-trigger-${network.rank}`}
                  hidden={!isOpen}
                  className={`border-t border-gray-100 bg-gradient-to-b from-gray-50/90 to-gray-50/40 ${
                    isOpen ? 'block' : 'hidden'
                  }`}
                >
                  <div className='space-y-10 px-5 py-8 sm:space-y-12 sm:px-9 sm:py-10'>
                    <div className='grid gap-10 lg:grid-cols-2 lg:gap-14'>
                      <PanelSection title='Why it matters'>
                        <p>{network.whyItMattersDetail}</p>
                      </PanelSection>
                      <PanelSection title='Consensus & security model'>
                        <p>{network.consensusDetail}</p>
                      </PanelSection>
                    </div>

                    <div className='border-t border-gray-200/80 pt-10 sm:pt-12'>
                      <h3 className='mb-5 text-sm font-semibold tracking-tight text-gray-900 sm:mb-6'>
                        Key metrics
                      </h3>
                      <dl className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5'>
                        <div className='rounded-xl border border-gray-200/80 bg-white p-4 shadow-sm sm:p-5'>
                          <dt className='text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-gray-400'>
                            Unbonding / exit
                          </dt>
                          <dd className='mt-2 text-sm font-medium leading-snug text-gray-900'>
                            {network.unbondingPeriod}
                          </dd>
                        </div>
                        <div className='rounded-xl border border-gray-200/80 bg-white p-4 shadow-sm sm:p-5'>
                          <dt className='text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-gray-400'>
                            Stake participation (approx.)
                          </dt>
                          <dd className='mt-2 text-sm font-medium text-gray-900'>
                            {network.stakingParticipationApproxPct != null
                              ? `~${network.stakingParticipationApproxPct}%`
                              : 'Varies / not emphasized'}
                          </dd>
                        </div>
                        <div className='rounded-xl border border-gray-200/80 bg-white p-4 shadow-sm sm:p-5'>
                          <dt className='text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-gray-400'>
                            Liquid staking
                          </dt>
                          <dd className='mt-2 text-sm font-medium leading-snug text-gray-900'>
                            {network.liquidStakingAvailable
                              ? 'Common LST / LRT options'
                              : 'Mostly native; check DeFi wrappers'}
                          </dd>
                        </div>
                        {network.extraMetrics.map((m) => (
                          <div
                            key={m.label}
                            className='rounded-xl border border-gray-200/80 bg-white p-4 shadow-sm sm:col-span-2 sm:p-5 lg:col-span-1'
                          >
                            <dt className='text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-gray-400'>
                              {m.label}
                            </dt>
                            <dd className='mt-2 text-sm leading-relaxed text-gray-700'>
                              {m.value}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>

                    <div className='border-t border-gray-200/80 pt-10 sm:pt-12'>
                      <RealYieldBlock network={network} />
                    </div>

                    <div className='border-t border-gray-200/80 pt-10 sm:pt-12'>
                      <StakeCtaBlock network={network} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className='mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-gray-500 sm:mt-10'>
        Figures are illustrative for comparison; live APR, inflation, and burns
        move with governance and on-chain conditions. Execution, rebalancing,
        and reporting for allocations you approve happen inside Stakefolio.
      </p>
    </section>
  );
}
