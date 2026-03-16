import Head from 'next/head';
import dynamic from 'next/dynamic';
import React, { useMemo } from 'react';
import { useLivePrices } from '@/app/hooks/useLivePrices';
import {
  getEnhancedMarketData,
  fallbackPrices,
} from '@/app/services/mockMarketData';

// Dynamically import chart to avoid SSR rehydration issues with Recharts
const MarketCapChart = dynamic(
  () =>
    import('@/app/components/dashboard/MarketCapChart').then(
      (mod) => mod.MarketCapChart
    ),
  {
    ssr: false,
    loading: () => (
      <div className='h-full w-full animate-pulse rounded-3xl bg-white/5'></div>
    ),
  }
);

import { MarketDataGrid } from '@/app/components/dashboard/MarketDataGrid';

export type SortField =
  | 'marketCap'
  | 'volume24h'
  | 'circulatingSupply'
  | 'stakingApy'
  | 'inflationRate'
  | 'netApy'
  | 'stakedUsd'
  | 'percentLocked';
export type SortDirection = 'asc' | 'desc';

export default function Home() {
  const [sortField, setSortField] = React.useState<SortField>('marketCap');
  const [sortDirection, setSortDirection] =
    React.useState<SortDirection>('desc');
  const { prices: livePrices, loading: pricesLoading } = useLivePrices();

  // Get dynamic enhanced data merging live prices with base tokenomics
  const currentData = useMemo(
    () => getEnhancedMarketData(livePrices),
    [livePrices]
  );

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc'); // Default to descending for new field
    }
  };

  return (
    <>
      <Head>
        <title>Stakefolio - Market Analysis</title>
        <meta
          name='description'
          content='The ultimate dashboard for the top stakable blockchains'
        />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <div className='relative min-h-screen bg-[#060818] py-24 sm:py-32'>
        {/* Abstract Background Enhancements */}
        <div className='absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]'>
          <div className='relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]'></div>
        </div>

        <div className='relative z-10 mx-auto w-full max-w-[1600px] px-6 lg:px-8'>
          <div className='mx-auto max-w-2xl lg:mx-0'>
            <h2 className='text-4xl font-bold tracking-tight text-white drop-shadow-md sm:text-6xl'>
              Stakable Market Intelligence
            </h2>
            <p className='mt-6 max-w-xl text-lg leading-8 text-gray-300'>
              Understand the landscape. Explore real-time metrics, market cap
              dominance, and staking ratios for the world's leading layer-1
              ecosystems.
            </p>
          </div>

          <div className='mt-16 w-full sm:mt-24'>
            <div className='grid w-full grid-cols-1 items-start gap-8 lg:grid-cols-12'>
              {/* Grid Section */}
              <div className='overflow-hidden lg:col-span-9'>
                <div className='mb-6 flex items-center justify-between'>
                  <h3 className='text-2xl font-bold tracking-wide text-white'>
                    Top Networks
                  </h3>
                  <div className='flex items-center gap-2 rounded-full border border-white/5 bg-white/10 px-4 py-1.5 backdrop-blur-md'>
                    {pricesLoading && (
                      <div className='h-2 w-2 animate-pulse rounded-full bg-purple-500'></div>
                    )}
                    <span className='text-sm font-semibold text-purple-300'>
                      {pricesLoading
                        ? 'Fetching Live Data...'
                        : 'Live Estimates'}
                    </span>
                  </div>
                </div>
                <MarketDataGrid
                  data={currentData}
                  livePrices={livePrices}
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={toggleSort}
                />
              </div>

              {/* Chart Section */}
              <div className='h-[650px] lg:col-span-3'>
                <MarketCapChart
                  data={currentData}
                  livePrices={livePrices}
                  sortField={sortField}
                  sortDirection={sortDirection}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
