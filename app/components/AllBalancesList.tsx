import { useAllBalances } from '../hooks/useAllBalances';
import { usePrices } from '../hooks/usePrices';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useState, useEffect } from 'react';

export function AllBalancesList() {
  const all = useAllBalances();
  const { prices, loading: pricesLoading } = usePrices();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(value);
  };

  // Prepare data for charts - show all balances, not just those with prices
  const chartData = all.assets.flatMap((chain) => {
    const balanceData = chain.balances
      .filter((b) => parseFloat(b.displayAmount) > 0) // Show all non-zero balances
      .map((b) => ({
        name: `${b.displayDenom} (${chain.chainName})`,
        symbol: b.displayDenom,
        chain: chain.chainName,
        amount: parseFloat(b.displayAmount),
        usdValue: b.usdValue,
        price: b.price,
        type: 'Balance',
        fullName: `${b.displayName} on ${chain.chainName}`,
        hasPrice: b.price > 0,
      }));

    const delegationData = chain.delegations
      .filter((d) => parseFloat(d.balance.displayAmount) > 0) // Show all non-zero delegations
      .map((d) => ({
        name: `${d.balance.displayDenom} Staked (${chain.chainName})`,
        symbol: d.balance.displayDenom,
        chain: chain.chainName,
        amount: parseFloat(d.balance.displayAmount),
        usdValue: d.balance.usdValue,
        price: d.balance.price,
        type: 'Delegation',
        fullName: `${d.balance.displayName} Staked on ${chain.chainName}`,
        hasPrice: d.balance.price > 0,
      }));

    return [...balanceData, ...delegationData];
  });

  // Debug logging
  console.log('Available prices:', Object.keys(prices));
  console.log('Chart data:', chartData);
  console.log(
    'Assets with prices:',
    chartData.filter((item) => item.hasPrice).length
  );
  console.log(
    'Assets without prices:',
    chartData.filter((item) => !item.hasPrice).length
  );

  // Colors for different assets
  const COLORS = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#8884D8',
    '#82CA9D',
    '#FFC658',
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className='rounded-lg border border-gray-200 bg-white p-3 shadow-lg'>
          <p className='font-semibold'>{data.fullName}</p>
          <p className='text-sm text-gray-600'>Type: {data.type}</p>
          <p className='text-sm'>
            Amount: {formatNumber(data.amount)} {data.symbol}
          </p>
          {data.hasPrice ? (
            <>
              <p className='text-sm'>Price: {formatCurrency(data.price)}</p>
              <p className='text-sm font-semibold text-green-600'>
                Value: {formatCurrency(data.usdValue)}
              </p>
            </>
          ) : (
            <p className='text-sm text-gray-500'>Price data not available</p>
          )}
        </div>
      );
    }
    return null;
  };

  // Only show loading on initial load, not on subsequent data updates
  useEffect(() => {
    if (!all.loading && !pricesLoading && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [all.loading, pricesLoading, isInitialLoad]);

  if (isInitialLoad && (all.loading || pricesLoading)) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='text-xl'>Loading portfolio data...</div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='text-xl text-gray-500'>No balances found</div>
        <div className='mt-2 text-sm text-gray-400'>
          Total assets: {all.assets.length} | Total balances:{' '}
          {all.assets.reduce((sum, chain) => sum + chain.balances.length, 0)} |
          Total delegations:{' '}
          {all.assets.reduce((sum, chain) => sum + chain.delegations.length, 0)}
        </div>
      </div>
    );
  }

  const totalValue = chartData.reduce((sum, item) => sum + item.usdValue, 0);
  const assetsWithPrices = chartData.filter((item) => item.hasPrice).length;

  return (
    <div className='space-y-8'>
      {/* Portfolio Summary */}
      <div className='rounded-lg bg-white p-6 shadow-lg'>
        <h2 className='mb-4 text-2xl font-bold text-gray-900'>
          Portfolio Overview
        </h2>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
          <div className='rounded-lg bg-blue-50 p-4'>
            <div className='text-sm font-medium text-blue-600'>Total Value</div>
            <div className='text-2xl font-bold text-blue-900'>
              {formatCurrency(totalValue)}
            </div>
          </div>
          <div className='rounded-lg bg-green-50 p-4'>
            <div className='text-sm font-medium text-green-600'>
              Total Assets
            </div>
            <div className='text-2xl font-bold text-green-900'>
              {chartData.length}
            </div>
          </div>
          <div className='rounded-lg bg-purple-50 p-4'>
            <div className='text-sm font-medium text-purple-600'>Chains</div>
            <div className='text-2xl font-bold text-purple-900'>
              {new Set(chartData.map((item) => item.chain)).size}
            </div>
          </div>
          <div className='rounded-lg bg-orange-50 p-4'>
            <div className='text-sm font-medium text-orange-600'>
              With Prices
            </div>
            <div className='text-2xl font-bold text-orange-900'>
              {assetsWithPrices}
            </div>
          </div>
        </div>
      </div>

      {/* Pie Chart - Portfolio Distribution (only assets with prices) */}
      {assetsWithPrices > 0 && (
        <div className='rounded-lg bg-white p-6 shadow-lg'>
          <h3 className='mb-4 text-xl font-semibold text-gray-900'>
            Portfolio Distribution (With Prices)
          </h3>
          <ResponsiveContainer width='100%' height={400}>
            <PieChart>
              <Pie
                data={chartData.filter((item) => item.hasPrice)}
                cx='50%'
                cy='50%'
                labelLine={false}
                label={({ name, usdValue }) =>
                  `${name}: ${formatCurrency(usdValue)}`
                }
                outerRadius={120}
                fill='#8884d8'
                dataKey='usdValue'
              >
                {chartData
                  .filter((item) => item.hasPrice)
                  .map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Bar Chart - Asset Values */}
      <div className='rounded-lg bg-white p-6 shadow-lg'>
        <h3 className='mb-4 text-xl font-semibold text-gray-900'>
          Asset Values (USD)
        </h3>
        <ResponsiveContainer width='100%' height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis
              dataKey='name'
              angle={-45}
              textAnchor='end'
              height={100}
              interval={0}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey='usdValue' fill='#8884d8' />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Table */}
      <div className='overflow-hidden rounded-lg bg-white shadow-lg'>
        <div className='border-b border-gray-200 px-6 py-4'>
          <h3 className='text-xl font-semibold text-gray-900'>
            Detailed Holdings
          </h3>
        </div>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                  Asset
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                  Chain
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                  Type
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                  Amount
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                  Price
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                  Value
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200 bg-white'>
              {chartData.map((item, index) => (
                <tr key={index} className='hover:bg-gray-50'>
                  <td className='whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900'>
                    {item.symbol}
                  </td>
                  <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-900'>
                    {item.chain}
                  </td>
                  <td className='whitespace-nowrap px-6 py-4 text-sm'>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        item.type === 'Balance'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {item.type}
                    </span>
                  </td>
                  <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-900'>
                    {formatNumber(item.amount)} {item.symbol}
                  </td>
                  <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-900'>
                    {item.hasPrice ? formatCurrency(item.price) : 'N/A'}
                  </td>
                  <td className='whitespace-nowrap px-6 py-4 text-sm font-semibold text-green-600'>
                    {item.hasPrice ? formatCurrency(item.usdValue) : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
