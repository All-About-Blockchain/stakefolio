import { useEffect, useState } from 'react';
import Head from 'next/head';

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

export default function PricesPage() {
  const [prices, setPrices] = useState<PricesResponse>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:4000/prices')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setPrices(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching prices:', error);
        setError(error.message);
        setLoading(false);
      });
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
    if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(2)}B`;
    } else if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(2)}M`;
    } else if (value >= 1e3) {
      return `$${(value / 1e3).toFixed(2)}K`;
    }
    return formatCurrency(value);
  };

  const formatPercentage = (value: number) => {
    const color = value >= 0 ? 'text-green-600' : 'text-red-600';
    const sign = value >= 0 ? '+' : '';
    return (
      <span className={color}>
        {sign}
        {value.toFixed(2)}%
      </span>
    );
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>Stakefolio | Price Data</title>
        </Head>
        <div className='flex min-h-screen items-center justify-center'>
          <div className='text-xl'>Loading price data...</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Head>
          <title>Stakefolio | Price Data</title>
        </Head>
        <div className='flex min-h-screen items-center justify-center'>
          <div className='text-xl text-red-600'>Error: {error}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Stakefolio | Price Data</title>
      </Head>
      <div className='min-h-screen bg-gray-50 py-8'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='overflow-hidden rounded-lg bg-white shadow-lg'>
            <div className='border-b border-gray-200 px-6 py-4'>
              <h1 className='text-2xl font-bold text-gray-900'>
                Crypto Price Data
              </h1>
              <p className='mt-1 text-gray-600'>
                Live prices from CoinGecko API
              </p>
            </div>

            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                      Symbol
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                      USD Price
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                      CAD Price
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                      EUR Price
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                      Market Cap
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                      24h Volume
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                      24h Change
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                      Last Updated
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200 bg-white'>
                  {Object.entries(prices).map(([symbol, data]) => (
                    <tr key={symbol} className='hover:bg-gray-50'>
                      <td className='whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900'>
                        {symbol.toUpperCase()}
                      </td>
                      <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-900'>
                        {formatCurrency(data.usd, 'USD')}
                      </td>
                      <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-900'>
                        {formatCurrency(data.cad, 'CAD')}
                      </td>
                      <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-900'>
                        {formatCurrency(data.eur, 'EUR')}
                      </td>
                      <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-900'>
                        {formatNumber(data.usd_market_cap)}
                      </td>
                      <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-900'>
                        {formatNumber(data.usd_24h_vol)}
                      </td>
                      <td className='whitespace-nowrap px-6 py-4 text-sm'>
                        {formatPercentage(data.usd_24h_change)}
                      </td>
                      <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-500'>
                        {formatDate(data.last_updated_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {Object.keys(prices).length === 0 && (
              <div className='px-6 py-8 text-center text-gray-500'>
                No price data available. The backend may still be fetching data.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
