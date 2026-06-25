import { useEffect, useState } from 'react';
import Head from 'next/head';
import { RefreshCw, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';

interface PriceData {
  usd: number;
  cad: number;
  eur: number;
  usd_market_cap: number;
  usd_24h_vol: number;
  usd_24h_change: number;
  last_updated_at: number;
}

interface PricesResponse {
  [symbol: string]: PriceData;
}

const SYMBOL_NAMES: Record<string, string> = {
  bitcoin: 'Bitcoin',
  ethereum: 'Ethereum',
  cosmos: 'Cosmos',
  solana: 'Solana',
  polkadot: 'Polkadot',
  cardano: 'Cardano',
  avalanche: 'Avalanche',
  near: 'NEAR',
  sui: 'Sui',
  celestia: 'Celestia',
};

export default function PricesPage() {
  const [prices, setPrices] = useState<PricesResponse>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrices = () => {
    setLoading(true);
    setError(null);
    fetch('http://localhost:4000/prices')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Unable to fetch prices (HTTP ${response.status})`);
        }
        return response.json();
      })
      .then((data) => {
        setPrices(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching prices:', err);
        setError(
          'Unable to load price data. Make sure the backend server is running.'
        );
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  const formatCurrency = (value: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
    return formatCurrency(value);
  };

  return (
    <>
      <Head>
        <title>Prices - Stakefolio</title>
        <meta
          name='description'
          content='Live cryptocurrency prices and market data for top staking networks.'
        />
      </Head>

      <div className='min-h-screen bg-white font-sans text-gray-900'>
        <main className='mx-auto max-w-7xl px-6 py-16 sm:py-20 lg:px-8'>
          {/* Header */}
          <div className='mb-12'>
            <h1 className='font-["Playfair_Display",_serif] text-4xl font-light tracking-tight text-black sm:text-5xl'>
              Prices
            </h1>
            <p className='mt-4 max-w-xl text-lg font-light text-gray-500'>
              Live prices for top staking networks. Data refreshes
              automatically.
            </p>
          </div>

          {/* Error State */}
          {error && (
            <div className='mb-8 flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 p-6'>
              <div className='flex items-center gap-3'>
                <AlertCircle className='h-5 w-5 shrink-0 text-amber-600' />
                <div>
                  <p className='text-sm font-medium text-amber-900'>{error}</p>
                  <p className='mt-1 text-xs text-amber-700'>
                    Try starting the backend with{' '}
                    <code className='rounded bg-amber-100 px-1 py-0.5 font-mono'>
                      npm run dev
                    </code>{' '}
                    in the backend directory.
                  </p>
                </div>
              </div>
              <button
                onClick={fetchPrices}
                className='inline-flex shrink-0 items-center gap-2 rounded-lg border border-amber-300 bg-white px-4 py-2 text-sm font-medium text-amber-900 transition-colors hover:bg-amber-50'
              >
                <RefreshCw className='h-4 w-4' />
                Retry
              </button>
            </div>
          )}

          {/* Loading Skeleton */}
          {loading && !error && (
            <div className='space-y-4'>
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className='flex items-center justify-between rounded-xl border border-gray-100 bg-white p-5'
                >
                  <div className='flex items-center gap-4'>
                    <div className='h-10 w-10 animate-pulse rounded-full bg-gray-100'></div>
                    <div className='space-y-2'>
                      <div className='h-4 w-24 animate-pulse rounded bg-gray-100'></div>
                      <div className='h-3 w-16 animate-pulse rounded bg-gray-100'></div>
                    </div>
                  </div>
                  <div className='flex items-center gap-8'>
                    <div className='h-5 w-20 animate-pulse rounded bg-gray-100'></div>
                    <div className='h-4 w-16 animate-pulse rounded bg-gray-100'></div>
                    <div className='h-4 w-24 animate-pulse rounded bg-gray-100'></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Price Cards */}
          {!loading && !error && Object.keys(prices).length > 0 && (
            <div className='space-y-3'>
              {Object.entries(prices).map(([symbol, data]) => {
                const isPositive = data.usd_24h_change >= 0;
                const displayName =
                  SYMBOL_NAMES[symbol] || symbol.charAt(0).toUpperCase() + symbol.slice(1);

                return (
                  <div
                    key={symbol}
                    className='flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-gray-300 hover:shadow-sm sm:flex-row sm:items-center sm:justify-between'
                  >
                    {/* Left: Name */}
                    <div className='flex items-center gap-4'>
                      <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-600'>
                        {symbol.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className='text-base font-semibold text-black'>
                          {displayName}
                        </h3>
                        <span className='text-sm text-gray-400'>
                          {symbol.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Right: Price data */}
                    <div className='flex flex-wrap items-center gap-6 sm:gap-8'>
                      <div>
                        <div className='text-xs font-semibold uppercase tracking-wider text-gray-400'>
                          Price
                        </div>
                        <div className='mt-1 text-lg font-medium text-black'>
                          {formatCurrency(data.usd)}
                        </div>
                      </div>

                      <div>
                        <div className='text-xs font-semibold uppercase tracking-wider text-gray-400'>
                          24h Change
                        </div>
                        <div
                          className={`mt-1 flex items-center gap-1 text-base font-semibold ${
                            isPositive ? 'text-emerald-600' : 'text-red-500'
                          }`}
                        >
                          {isPositive ? (
                            <TrendingUp className='h-4 w-4' />
                          ) : (
                            <TrendingDown className='h-4 w-4' />
                          )}
                          {isPositive ? '+' : ''}
                          {data.usd_24h_change.toFixed(2)}%
                        </div>
                      </div>

                      <div className='hidden sm:block'>
                        <div className='text-xs font-semibold uppercase tracking-wider text-gray-400'>
                          Market Cap
                        </div>
                        <div className='mt-1 text-sm font-medium text-gray-700'>
                          {formatNumber(data.usd_market_cap)}
                        </div>
                      </div>

                      <div className='hidden md:block'>
                        <div className='text-xs font-semibold uppercase tracking-wider text-gray-400'>
                          24h Volume
                        </div>
                        <div className='mt-1 text-sm font-medium text-gray-700'>
                          {formatNumber(data.usd_24h_vol)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && Object.keys(prices).length === 0 && (
            <div className='rounded-2xl border border-gray-200 bg-gray-50/50 p-12 text-center'>
              <p className='text-base text-gray-500'>
                No price data available yet. The backend may still be fetching
                data.
              </p>
              <button
                onClick={fetchPrices}
                className='mt-4 inline-flex items-center gap-2 rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800'
              >
                <RefreshCw className='h-4 w-4' />
                Refresh
              </button>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
