import { useEffect, useState } from 'react';
import Head from 'next/head';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface PriceDataPoint {
  usd: number;
  cad: number;
  eur: number;
  usd_market_cap: number;
  usd_24h_vol: number;
  usd_24h_change: number;
  last_updated_at: number;
  timestamp: string;
}

interface PriceData {
  [symbol: string]: PriceDataPoint[];
}

export default function PriceHistoryPage() {
  const [historicalData, setHistoricalData] = useState<PriceData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('cosmos');
  const [timeRange, setTimeRange] = useState<number>(24);

  useEffect(() => {
    fetch(`http://localhost:4000/prices/history?hours=${timeRange}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setHistoricalData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching historical data:', error);
        setError(error.message);
        setLoading(false);
      });
  }, [timeRange]);

  const formatCurrency = (value: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const prepareChartData = (data: PriceDataPoint[]) => {
    return data.map((point) => ({
      time: formatDate(point.timestamp),
      usd: point.usd,
      cad: point.cad,
      eur: point.eur,
      marketCap: point.usd_market_cap / 1e9, // Convert to billions
      volume: point.usd_24h_vol / 1e6, // Convert to millions
    }));
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>Stakefolio | Price History</title>
        </Head>
        <div className='flex min-h-screen items-center justify-center'>
          <div className='text-xl'>Loading historical data...</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Head>
          <title>Stakefolio | Price History</title>
        </Head>
        <div className='flex min-h-screen items-center justify-center'>
          <div className='text-xl text-red-600'>Error: {error}</div>
        </div>
      </>
    );
  }

  const symbols = Object.keys(historicalData);
  const selectedData = historicalData[selectedSymbol] || [];
  const chartData = prepareChartData(selectedData);

  return (
    <>
      <Head>
        <title>Stakefolio | Price History</title>
      </Head>
      <div className='min-h-screen bg-gray-50 py-8'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='mb-6 flex items-center justify-between'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>
                Price History
              </h1>
              <p className='mt-1 text-gray-600'>
                Historical price data from CoinGecko API
              </p>
            </div>

            <div className='flex items-center space-x-4'>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(parseInt(e.target.value))}
                className='rounded-md border border-gray-300 px-3 py-2'
              >
                <option value={1}>Last Hour</option>
                <option value={6}>Last 6 Hours</option>
                <option value={24}>Last 24 Hours</option>
                <option value={168}>Last Week</option>
              </select>

              <select
                value={selectedSymbol}
                onChange={(e) => setSelectedSymbol(e.target.value)}
                className='rounded-md border border-gray-300 px-3 py-2'
              >
                {symbols.map((symbol) => (
                  <option key={symbol} value={symbol}>
                    {symbol.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedData.length > 0 ? (
            <div className='space-y-6'>
              {/* Price Chart */}
              <div className='overflow-hidden rounded-lg bg-white shadow-lg'>
                <div className='border-b border-gray-200 px-6 py-4'>
                  <h2 className='text-xl font-semibold text-gray-900'>
                    {selectedSymbol.toUpperCase()} Price History
                  </h2>
                </div>
                <div className='p-6'>
                  <ResponsiveContainer width='100%' height={400}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray='3 3' />
                      <XAxis dataKey='time' />
                      <YAxis />
                      <Tooltip
                        formatter={(value: any, name: any) => [
                          formatCurrency(value, name.toUpperCase()),
                          name.toUpperCase(),
                        ]}
                      />
                      <Legend />
                      <Line
                        type='monotone'
                        dataKey='usd'
                        stroke='#8884d8'
                        name='USD'
                      />
                      <Line
                        type='monotone'
                        dataKey='cad'
                        stroke='#82ca9d'
                        name='CAD'
                      />
                      <Line
                        type='monotone'
                        dataKey='eur'
                        stroke='#ffc658'
                        name='EUR'
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Market Data Chart */}
              <div className='overflow-hidden rounded-lg bg-white shadow-lg'>
                <div className='border-b border-gray-200 px-6 py-4'>
                  <h2 className='text-xl font-semibold text-gray-900'>
                    Market Data History
                  </h2>
                </div>
                <div className='p-6'>
                  <ResponsiveContainer width='100%' height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray='3 3' />
                      <XAxis dataKey='time' />
                      <YAxis />
                      <Tooltip
                        formatter={(value: any, name: any) => [
                          name === 'marketCap'
                            ? `$${value.toFixed(2)}B`
                            : `$${value.toFixed(2)}M`,
                          name === 'marketCap' ? 'Market Cap' : 'Volume',
                        ]}
                      />
                      <Legend />
                      <Line
                        type='monotone'
                        dataKey='marketCap'
                        stroke='#8884d8'
                        name='Market Cap'
                      />
                      <Line
                        type='monotone'
                        dataKey='volume'
                        stroke='#82ca9d'
                        name='Volume'
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Data Table */}
              <div className='overflow-hidden rounded-lg bg-white shadow-lg'>
                <div className='border-b border-gray-200 px-6 py-4'>
                  <h2 className='text-xl font-semibold text-gray-900'>
                    Historical Data Points
                  </h2>
                </div>
                <div className='overflow-x-auto'>
                  <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-50'>
                      <tr>
                        <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                          Time
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                          USD
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                          CAD
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                          EUR
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                          Market Cap
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                          Volume
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                          24h Change
                        </th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-200 bg-white'>
                      {selectedData.slice(0, 10).map((point, index) => (
                        <tr key={index} className='hover:bg-gray-50'>
                          <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-900'>
                            {formatDate(point.timestamp)}
                          </td>
                          <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-900'>
                            {formatCurrency(point.usd, 'USD')}
                          </td>
                          <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-900'>
                            {formatCurrency(point.cad, 'CAD')}
                          </td>
                          <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-900'>
                            {formatCurrency(point.eur, 'EUR')}
                          </td>
                          <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-900'>
                            ${(point.usd_market_cap / 1e9).toFixed(2)}B
                          </td>
                          <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-900'>
                            ${(point.usd_24h_vol / 1e6).toFixed(2)}M
                          </td>
                          <td className='whitespace-nowrap px-6 py-4 text-sm'>
                            <span
                              className={
                                point.usd_24h_change >= 0
                                  ? 'text-green-600'
                                  : 'text-red-600'
                              }
                            >
                              {point.usd_24h_change >= 0 ? '+' : ''}
                              {point.usd_24h_change.toFixed(2)}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className='rounded-lg bg-white p-8 text-center shadow-lg'>
              <p className='text-gray-500'>
                No historical data available for the selected time range.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
