import Head from 'next/head';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useWallet } from '@/app/contexts/WalletContext';
import { usePortfolioAssets } from '@/app/hooks/usePortfolioAssets';
import AddAssetModal from '@/app/components/AddAssetModal';

// Dynamically import chart to avoid SSR issues
const PortfolioCompositionChart = dynamic(
  () => import('@/app/components/PortfolioCompositionChart'),
  {
    ssr: false,
    loading: () => (
      <div className='flex h-[400px] w-full animate-pulse items-center justify-center rounded-3xl border border-gray-100 bg-gray-50/50'></div>
    ),
  }
);

// Minimalist, high-contrast, clean aesthetic (tashinajackson.com influence)
export default function Home() {
  const { address } = useWallet();
  const [expandedPanel, setExpandedPanel] = useState<string | null>(null);
  const [addAssetModalType, setAddAssetModalType] = useState<
    'staking' | 'stablecoin' | null
  >(null);

  const togglePanel = (panelId: string) => {
    setExpandedPanel(expandedPanel === panelId ? null : panelId);
  };

  const {
    stablecoins,
    assets,
    availableAssets,
    availableStablecoins,
    chartData,
    saveAssets,
    saveStablecoins,
  } = usePortfolioAssets();

  return (
    <>
      <Head>
        <title>Stakefolio - Institutional Self-Custody</title>
        <meta
          name='description'
          content='Clean, sophisticated staking and wealth management.'
        />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>

      <div className='min-h-screen bg-white font-sans text-gray-900 selection:bg-black selection:text-white'>
        <main className='mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8'>
          {/* Header Section */}
          <div className='mb-20'>
            <h1 className='font-["Playfair_Display",_serif] text-5xl font-light tracking-tight text-black sm:text-6xl'>
              Portfolio Overview
            </h1>
            <p className='mt-4 max-w-2xl text-lg font-light text-gray-500'>
              Institutional grade self-custody. Manage, stake, and swap your
              digital assets with uncompromising security and refined precision.
            </p>
          </div>

          <div className='grid grid-cols-1 gap-16 lg:grid-cols-12'>
            {/* Left Column - Assets Panel */}
            <div className='flex flex-col gap-8 lg:col-span-7'>
              {/* Stablecoins Section */}
              <div>
                <h2 className='mb-4 border-b border-gray-100 pb-4 font-["Playfair_Display",_serif] text-2xl font-light text-black'>
                  Cash & Stablecoin Deposits
                </h2>
                <div className='flex flex-col gap-4'>
                  {stablecoins.map((coin) => (
                    <div
                      key={coin.id}
                      className={`overflow-hidden rounded-xl border border-gray-200 transition-all duration-300 ${
                        expandedPanel === coin.id
                          ? 'bg-gray-50 shadow-sm'
                          : 'cursor-pointer bg-white hover:border-gray-300 hover:shadow-sm'
                      }`}
                    >
                      {/* Asset Header ROW */}
                      <div
                        className='flex items-center justify-between p-6'
                        onClick={() => togglePanel(coin.id)}
                      >
                        <div className='flex items-center gap-4'>
                          <img
                            src={coin.iconUrl}
                            alt={coin.name}
                            className='h-10 w-10 rounded-full'
                          />
                          <div>
                            <h3 className='flex items-center gap-3 text-xl font-medium text-black'>
                              {coin.name}
                              {expandedPanel !== coin.id && (
                                <span className='rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-sm font-normal text-emerald-600'>
                                  {coin.yield} Yield
                                </span>
                              )}
                            </h3>
                            <span className='text-sm text-gray-500'>
                              {coin.symbol}
                            </span>
                          </div>
                        </div>
                        <div className='text-right'>
                          <div className='text-xl font-medium text-black'>
                            {coin.value}
                          </div>
                          <div className='text-sm text-gray-500'>
                            {coin.balance} {coin.symbol}
                          </div>
                        </div>
                      </div>

                      {/* Expanded Content / Deposit Options */}
                      <div
                        className={`grid transition-all duration-300 ease-in-out ${
                          expandedPanel === coin.id
                            ? 'grid-rows-[1fr] opacity-100'
                            : 'grid-rows-[0fr] opacity-0'
                        }`}
                      >
                        <div className='overflow-hidden'>
                          <div className='mt-2 flex flex-col gap-8 border-t border-gray-100 p-6 pt-0'>
                            <div>
                              <h4 className='mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400'>
                                Transaction Options
                              </h4>
                              <div
                                className={`grid gap-4 ${coin.options.length > 2 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}
                              >
                                {coin.options.map((option) => (
                                  <button
                                    key={option.id}
                                    className='group relative flex h-full flex-col items-start justify-between rounded-lg border border-gray-200 bg-white p-5 text-left transition-all hover:border-black hover:shadow-md'
                                  >
                                    <div>
                                      <div className='mb-1 flex w-full items-start justify-between'>
                                        <span className='text-base font-medium text-black'>
                                          {option.name}
                                        </span>
                                      </div>
                                      <span className='mb-6 line-clamp-2 block text-sm text-gray-500'>
                                        {option.description}
                                      </span>
                                    </div>
                                    <span className='mt-auto flex items-center gap-1 pt-2 text-sm font-medium text-black group-hover:underline'>
                                      {option.action}
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
                                          d='M14 5l7 7m0 0l-7 7m7-7H3'
                                        />
                                      </svg>
                                    </span>
                                  </button>
                                ))}
                              </div>
                            </div>

                            {coin.yieldOpportunities &&
                              coin.yieldOpportunities.length > 0 && (
                                <div>
                                  <h4 className='mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400'>
                                    Yield Opportunities
                                  </h4>
                                  <div
                                    className={`grid gap-4 ${coin.yieldOpportunities.length > 2 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}
                                  >
                                    {coin.yieldOpportunities.map((option) => (
                                      <button
                                        key={option.id}
                                        className='group relative flex h-full flex-col items-start justify-between rounded-lg border border-gray-200 bg-white p-5 text-left transition-all hover:border-black hover:shadow-md'
                                      >
                                        <div>
                                          <div className='mb-1 flex w-full items-start justify-between'>
                                            <span className='text-base font-medium text-black'>
                                              {option.name}
                                            </span>
                                            <span className='text-sm font-semibold text-emerald-600'>
                                              {option.yield}
                                            </span>
                                          </div>
                                          <span className='mb-6 line-clamp-2 block text-sm text-gray-500'>
                                            {option.description}
                                          </span>
                                        </div>
                                        <span className='mt-auto flex items-center gap-1 pt-2 text-sm font-medium text-black group-hover:underline'>
                                          {option.action}
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
                                              d='M14 5l7 7m0 0l-7 7m7-7H3'
                                            />
                                          </svg>
                                        </span>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Additional Stablecoins Button */}
                <button
                  onClick={() => setAddAssetModalType('stablecoin')}
                  className='mt-6 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 py-4 font-medium text-gray-500 transition-all hover:border-black hover:bg-gray-50 hover:text-black'
                >
                  <svg
                    className='h-5 w-5'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 4v16m8-8H4'
                    />
                  </svg>
                  Add Additional Stablecoins
                </button>
              </div>

              {/* Crypto Assets Section */}
              <div>
                <h2 className='mb-4 border-b border-gray-100 pb-4 font-["Playfair_Display",_serif] text-2xl font-light text-black'>
                  Digital Assets
                </h2>
                <div className='flex flex-col gap-4'>
                  {assets.map((asset) => (
                    <div
                      key={asset.id}
                      className={`overflow-hidden rounded-xl border border-gray-200 transition-all duration-300 ${
                        expandedPanel === asset.id
                          ? 'bg-gray-50 shadow-sm'
                          : 'cursor-pointer bg-white hover:border-gray-300 hover:shadow-sm'
                      }`}
                    >
                      {/* Asset Header ROW */}
                      <div
                        className='flex items-center justify-between p-6'
                        onClick={() => togglePanel(asset.id)}
                      >
                        <div className='flex items-center gap-4'>
                          <img
                            src={asset.iconUrl}
                            alt={asset.name}
                            className='h-10 w-10 rounded-full'
                          />
                          <div>
                            <h3 className='flex items-center gap-3 text-xl font-medium text-black'>
                              {asset.name}
                              {expandedPanel !== asset.id && (
                                <span className='rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-sm font-normal text-emerald-600'>
                                  Up to {asset.maxYield}
                                </span>
                              )}
                            </h3>
                            <span className='text-sm text-gray-500'>
                              {asset.symbol}
                            </span>
                          </div>
                        </div>
                        <div className='text-right'>
                          <div className='text-xl font-medium text-black'>
                            {asset.value}
                          </div>
                          <div className='text-sm text-gray-500'>
                            {asset.balance} {asset.symbol}
                          </div>
                        </div>
                      </div>

                      {/* Expanded Content / Deposit Options */}
                      <div
                        className={`grid transition-all duration-300 ease-in-out ${
                          expandedPanel === asset.id
                            ? 'grid-rows-[1fr] opacity-100'
                            : 'grid-rows-[0fr] opacity-0'
                        }`}
                      >
                        <div className='overflow-hidden'>
                          <div className='mt-2 flex flex-col gap-8 border-t border-gray-100 p-6 pt-0'>
                            {/* Breakdown Section */}
                            <div>
                              <h4 className='mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400'>
                                Current Holdings
                              </h4>
                              <div className='divide-y divide-gray-100 rounded-lg border border-gray-100 bg-white text-sm shadow-sm'>
                                {asset.holdings.map((holding, i) => (
                                  <div
                                    key={i}
                                    className='flex items-center justify-between p-4 transition-colors hover:bg-gray-50/50'
                                  >
                                    <div className='flex items-center gap-3'>
                                      <span className='font-medium text-black'>
                                        {holding.name}
                                      </span>
                                      <span className='rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500'>
                                        {holding.balance}
                                      </span>
                                    </div>
                                    <div className='flex items-center gap-6'>
                                      <span className='font-medium text-emerald-600'>
                                        {holding.yield !== '0.0%' ? (
                                          `${holding.yield} Yield`
                                        ) : (
                                          <span className='text-gray-400'>
                                            ---
                                          </span>
                                        )}
                                      </span>
                                      <span className='min-w-[80px] text-right font-medium text-gray-900'>
                                        {holding.value}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Yield Opportunities Section */}
                            <div>
                              <h4 className='mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400'>
                                Yield Opportunities
                              </h4>
                              <div
                                className={`grid gap-4 ${asset.options.length > 2 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}
                              >
                                {asset.options.map((option) => (
                                  <button
                                    key={option.id}
                                    className='group relative flex h-full flex-col items-start justify-between rounded-lg border border-gray-200 bg-white p-5 text-left transition-all hover:border-black hover:shadow-md'
                                  >
                                    <div>
                                      <div className='mb-1 flex w-full items-start justify-between'>
                                        <span className='text-base font-medium text-black'>
                                          {option.name}
                                        </span>
                                        <span className='text-sm font-semibold text-emerald-600'>
                                          {option.yield}
                                        </span>
                                      </div>
                                      <span className='mb-6 line-clamp-2 block text-sm text-gray-500'>
                                        {option.description}
                                      </span>
                                    </div>
                                    <span className='mt-auto flex items-center gap-1 pt-2 text-sm font-medium text-black group-hover:underline'>
                                      {option.action}
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
                                          d='M14 5l7 7m0 0l-7 7m7-7H3'
                                        />
                                      </svg>
                                    </span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Additional Assets Button */}
                <button
                  onClick={() => setAddAssetModalType('staking')}
                  className='mt-6 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 py-4 font-medium text-gray-500 transition-all hover:border-black hover:bg-gray-50 hover:text-black'
                >
                  <svg
                    className='h-5 w-5'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 4v16m8-8H4'
                    />
                  </svg>
                  Add Additional Staking Assets
                </button>
              </div>
            </div>

            {/* Right Column - Portfolio Composition */}
            <div className='flex flex-col gap-4 lg:col-span-5'>
              <h2 className='mb-4 border-b border-gray-100 pb-4 font-["Playfair_Display",_serif] text-2xl font-light text-black'>
                Composition
              </h2>
              <div className='flex h-full min-h-[500px] flex-col rounded-2xl border border-gray-100 bg-gray-50 p-8'>
                <div className='mb-8'>
                  <div className='text-sm font-semibold uppercase tracking-wider text-gray-500'>
                    Total Balance
                  </div>
                  <div className='text-5xl font-light tracking-tight text-black'>
                    $65,025.00
                  </div>
                </div>

                <div className='h-[400px] w-full flex-grow'>
                  <PortfolioCompositionChart data={chartData} />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <AddAssetModal
        isOpen={addAssetModalType !== null}
        title={
          addAssetModalType === 'stablecoin' ? 'Add Stablecoins' : 'Add Assets'
        }
        onClose={() => setAddAssetModalType(null)}
        availableAssets={
          addAssetModalType === 'stablecoin'
            ? availableStablecoins
            : availableAssets
        }
        onSave={(ids) => {
          if (addAssetModalType === 'stablecoin') {
            saveStablecoins(ids);
          } else {
            saveAssets(ids);
          }
        }}
      />
    </>
  );
}
