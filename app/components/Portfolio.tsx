import React, { useState, useEffect } from 'react';
import { useAllBalances } from '../hooks/useAllBalances';
import { usePrices } from '../hooks/usePrices';
import { useDenomLogos } from '../hooks/useDenomLogos';
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
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import {
  Wallet,
  TrendingUp,
  Eye,
  EyeOff,
  BarChart3,
  Coins,
  Zap,
  Shield,
} from 'lucide-react';

export function Portfolio() {
  const all = useAllBalances();
  const { prices, loading: pricesLoading } = usePrices();
  const { getLogo: getDenomLogo } = useDenomLogos();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Prevent loading loop by only showing loading on initial load
  useEffect(() => {
    if (!all.loading && !pricesLoading && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [all.loading, pricesLoading, isInitialLoad]);

  // Show loading only on initial load
  if (isInitialLoad && (all.loading || pricesLoading)) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50'>
        <div className='text-center'>
          <div className='mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-purple-500'></div>
          <p className='text-gray-600'>Loading your portfolio...</p>
        </div>
      </div>
    );
  }

  // Prepare data for charts - aggregate by denom across all chains
  const chartData = all.assets.flatMap((chain) => {
    const balanceData = chain.balances
      .filter((b) => parseFloat(b.displayAmount) > 0)
      .map((b) => ({
        name: `${b.displayDenom} (${chain.chainName})`,
        symbol: b.displayDenom,
        chain: chain.chainName,
        amount: parseFloat(b.displayAmount),
        price: b.price,
        usdValue: b.usdValue,
        hasPrice: b.price > 0,
        type: 'Balance',
        fullName: `${b.displayName} on ${chain.chainName}`,
      }));

    const delegationData = chain.delegations
      .filter((d) => parseFloat(d.balance.displayAmount) > 0)
      .map((d) => ({
        name: `${d.balance.displayDenom} Staked (${chain.chainName})`,
        symbol: d.balance.displayDenom,
        chain: chain.chainName,
        amount: parseFloat(d.balance.displayAmount),
        price: d.balance.price,
        usdValue: d.balance.usdValue,
        hasPrice: d.balance.price > 0,
        type: 'Staked',
        fullName: `${d.balance.displayName} staked on ${chain.chainName}`,
      }));

    return [...balanceData, ...delegationData];
  });

  // Aggregate assets by denom across all chains
  const aggregatedAssets = chartData.reduce(
    (acc, item) => {
      const key = item.symbol;
      if (!acc[key]) {
        acc[key] = {
          symbol: item.symbol,
          totalAmount: 0,
          totalUsdValue: 0,
          chains: new Set<string>(),
          hasPrice: false,
          type: item.type,
          logo: getDenomLogo(item.symbol),
        };
      }
      acc[key].totalAmount += item.amount;
      acc[key].totalUsdValue += item.usdValue;
      acc[key].chains.add(item.chain);
      if (item.hasPrice) {
        acc[key].hasPrice = true;
      }
      return acc;
    },
    {} as Record<
      string,
      {
        symbol: string;
        totalAmount: number;
        totalUsdValue: number;
        chains: Set<string>;
        hasPrice: boolean;
        type: string;
        logo: string | null;
      }
    >
  );

  // Convert aggregated assets to array for display
  const aggregatedChartData = Object.values(aggregatedAssets).map((asset) => ({
    name: asset.symbol,
    symbol: asset.symbol,
    amount: asset.totalAmount,
    usdValue: asset.totalUsdValue,
    hasPrice: asset.hasPrice,
    type: asset.type,
    chains: Array.from(asset.chains),
    logo: asset.logo,
  }));

  // Calculate totals
  const totalValue = aggregatedChartData.reduce(
    (sum, item) => sum + item.usdValue,
    0
  );
  const totalStakedValue = all.assets
    .flatMap((chain) => chain.delegations)
    .reduce((sum, d) => sum + d.balance.usdValue, 0);
  const totalAvailableValue = totalValue - totalStakedValue;

  // Mock performance data
  const performanceData = [
    { date: 'Jan', value: 2100 },
    { date: 'Feb', value: 2250 },
    { date: 'Mar', value: 2180 },
    { date: 'Apr', value: 2380 },
    { date: 'May', value: 2420 },
    { date: 'Jun', value: 2459 },
  ];

  const COLORS = [
    '#8b5cf6',
    '#3b82f6',
    '#ec4899',
    '#10b981',
    '#f59e0b',
    '#06b6d4',
    '#84cc16',
    '#f97316',
    '#ef4444',
    '#8b5cf6',
  ];

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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className='bright-card rounded-xl border-0 p-4 shadow-2xl'>
          <div className='mb-2 flex items-center gap-2'>
            {data.logo && (
              <img
                src={data.logo}
                alt={data.symbol}
                className='h-6 w-6 rounded-full object-cover'
              />
            )}
            <p className='font-semibold text-gray-700'>{data.symbol}</p>
          </div>
          <p className='text-sm text-gray-600'>
            ${balanceVisible ? data.usdValue.toFixed(2) : '••••••'}
          </p>
          <p className='text-sm text-gray-500'>
            {balanceVisible ? data.amount.toFixed(2) : '••••••'} {data.symbol}
          </p>
          {data.chains && data.chains.length > 1 && (
            <p className='mt-1 text-xs text-blue-500'>
              Across {data.chains.length} chains
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className='space-y-8'>
      {/* Portfolio Header */}
      <div className='bright-card ultra-soft-shadow rounded-xl border-0 p-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='flex items-center gap-3 text-2xl font-semibold text-gray-800'>
              <BarChart3 className='h-6 w-6 text-purple-500' />
              Portfolio Breakdown
            </h2>
            <p className='mt-2 text-lg text-gray-600'>
              Detailed analysis of your cryptocurrency holdings
            </p>
          </div>
          <button
            onClick={() => setBalanceVisible(!balanceVisible)}
            className='glass-button flex items-center gap-2 rounded-lg border-0 px-4 py-2'
          >
            {balanceVisible ? (
              <EyeOff className='h-4 w-4' />
            ) : (
              <Eye className='h-4 w-4' />
            )}
            {balanceVisible ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
        <div className='bright-card ultra-soft-shadow rounded-xl border-0 p-6'>
          <div className='flex items-center gap-3'>
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500'>
              <Wallet className='h-6 w-6 text-white' />
            </div>
            <div>
              <div className='text-sm text-gray-600'>Total Value</div>
              <div className='text-xl font-bold text-gray-800'>
                {balanceVisible ? formatCurrency(totalValue) : '••••••••'}
              </div>
            </div>
          </div>
        </div>

        <div className='bright-card ultra-soft-shadow rounded-xl border-0 p-6'>
          <div className='flex items-center gap-3'>
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500'>
              <TrendingUp className='h-6 w-6 text-white' />
            </div>
            <div>
              <div className='text-sm text-gray-600'>Staked Value</div>
              <div className='text-xl font-bold text-gray-800'>
                {balanceVisible ? formatCurrency(totalStakedValue) : '••••••••'}
              </div>
            </div>
          </div>
        </div>

        <div className='bright-card ultra-soft-shadow rounded-xl border-0 p-6'>
          <div className='flex items-center gap-3'>
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-500'>
              <Coins className='h-6 w-6 text-white' />
            </div>
            <div>
              <div className='text-sm text-gray-600'>Available</div>
              <div className='text-xl font-bold text-gray-800'>
                {balanceVisible
                  ? formatCurrency(totalAvailableValue)
                  : '••••••••'}
              </div>
            </div>
          </div>
        </div>

        <div className='bright-card ultra-soft-shadow rounded-xl border-0 p-6'>
          <div className='flex items-center gap-3'>
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500'>
              <Zap className='h-6 w-6 text-white' />
            </div>
            <div>
              <div className='text-sm text-gray-600'>DeFi Value</div>
              <div className='text-xl font-bold text-gray-800'>
                {balanceVisible
                  ? formatCurrency(totalValue * 0.017)
                  : '••••••••'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Charts */}
      <div className='grid gap-8 lg:grid-cols-2'>
        {/* Asset Distribution Pie Chart */}
        <div className='bright-card ultra-soft-shadow rounded-xl border-0 p-6'>
          <h3 className='mb-6 flex items-center gap-2 text-xl font-semibold text-gray-800'>
            <PieChart className='h-5 w-5 text-purple-500' />
            Asset Distribution
          </h3>
          <div className='h-80'>
            <ResponsiveContainer width='100%' height='100%'>
              <PieChart>
                <Pie
                  data={aggregatedChartData.filter((item) => item.hasPrice)}
                  cx='50%'
                  cy='50%'
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={3}
                  dataKey='usdValue'
                >
                  {aggregatedChartData
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
        </div>

        {/* Performance Chart */}
        <div className='bright-card ultra-soft-shadow rounded-xl border-0 p-6'>
          <h3 className='mb-6 flex items-center gap-2 text-xl font-semibold text-gray-800'>
            <TrendingUp className='h-5 w-5 text-emerald-500' />
            Portfolio Performance
          </h3>
          <div className='h-80'>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart data={performanceData}>
                <Line
                  type='monotone'
                  dataKey='value'
                  stroke='url(#gradient)'
                  strokeWidth={3}
                  dot={false}
                />
                <defs>
                  <linearGradient id='gradient' x1='0' y1='0' x2='1' y2='0'>
                    <stop offset='0%' stopColor='#8B5CF6' />
                    <stop offset='100%' stopColor='#3B82F6' />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Asset Type Distribution per Chain */}
      <div className='bright-card ultra-soft-shadow rounded-xl border-0 p-6'>
        <h3 className='mb-6 flex items-center gap-2 text-xl font-semibold text-gray-800'>
          <Shield className='h-5 w-5 text-blue-500' />
          Asset Type Distribution per Chain
        </h3>
        <div className='space-y-3'>
          {all.assets
            .filter((chain) => {
              const chainTotal =
                chain.balances.reduce((sum, b) => sum + b.usdValue, 0) +
                chain.delegations.reduce(
                  (sum, d) => sum + d.balance.usdValue,
                  0
                );
              return chainTotal > 0;
            })
            .sort((a, b) => {
              const aTotal =
                a.balances.reduce((sum, b) => sum + b.usdValue, 0) +
                a.delegations.reduce((sum, d) => sum + d.balance.usdValue, 0);
              const bTotal =
                b.balances.reduce((sum, b) => sum + b.usdValue, 0) +
                b.delegations.reduce((sum, d) => sum + d.balance.usdValue, 0);
              return bTotal - aTotal;
            })
            .map((chain) => {
              const chainTotal =
                chain.balances.reduce((sum, b) => sum + b.usdValue, 0) +
                chain.delegations.reduce(
                  (sum, d) => sum + d.balance.usdValue,
                  0
                );
              const percentage =
                totalValue > 0 ? (chainTotal / totalValue) * 100 : 0;

              return (
                <div
                  key={chain.chainName}
                  className='glass-ultra-light rounded-xl p-4'
                >
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      {getDenomLogo(chain.chainName) ? (
                        <img
                          src={getDenomLogo(chain.chainName)!}
                          alt={chain.chainName}
                          className='h-8 w-8 rounded-full object-cover'
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback =
                              target.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-400 to-blue-400 text-sm font-bold text-white ${
                          getDenomLogo(chain.chainName) ? 'hidden' : 'flex'
                        }`}
                      >
                        {chain.chainName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className='font-semibold text-gray-800'>
                          {chain.chainName.charAt(0).toUpperCase() +
                            chain.chainName.slice(1)}
                        </div>
                        <div className='text-sm text-gray-600'>
                          {balanceVisible
                            ? formatCurrency(chainTotal)
                            : '••••••••'}
                        </div>
                      </div>
                    </div>
                    <div className='text-right'>
                      <div className='text-lg font-bold text-gray-800'>
                        {percentage.toFixed(2)}%
                      </div>
                      <div className='text-sm text-gray-600'>
                        {chain.balances.length + chain.delegations.length}{' '}
                        assets
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Portfolio Breakdown by Tokens */}
      <div className='bright-card ultra-soft-shadow rounded-xl border-0 p-6'>
        <h3 className='mb-6 flex items-center gap-2 text-xl font-semibold text-gray-800'>
          <Coins className='h-5 w-5 text-amber-500' />
          Portfolio Breakdown by Tokens
        </h3>
        <div className='space-y-3'>
          {aggregatedChartData
            .filter((item) => item.hasPrice && item.usdValue > 0)
            .sort((a, b) => b.usdValue - a.usdValue)
            .map((token, index) => {
              const percentage =
                totalValue > 0 ? (token.usdValue / totalValue) * 100 : 0;

              return (
                <div
                  key={token.symbol}
                  className='glass-ultra-light rounded-xl p-4'
                >
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      {token.logo ? (
                        <img
                          src={token.logo}
                          alt={token.symbol}
                          className='h-8 w-8 rounded-full object-cover'
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback =
                              target.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div
                        className={`h-8 w-8 rounded-full shadow-sm ${
                          token.logo ? 'hidden' : 'block'
                        }`}
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      ></div>
                      <div>
                        <div className='font-semibold text-gray-800'>
                          {token.symbol}
                          {token.chains.length > 1 && (
                            <span className='ml-2 text-sm text-gray-500'>
                              (Across {token.chains.length} chains)
                            </span>
                          )}
                        </div>
                        <div className='text-sm text-gray-600'>
                          {balanceVisible
                            ? formatCurrency(token.usdValue)
                            : '••••••••'}
                        </div>
                      </div>
                    </div>
                    <div className='text-right'>
                      <div className='text-lg font-bold text-gray-800'>
                        {percentage.toFixed(2)}%
                      </div>
                      <div className='text-sm text-gray-600'>
                        {formatNumber(token.amount)} {token.symbol}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
