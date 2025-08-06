import React, { useState, useEffect } from 'react';
import { useAllBalances } from '../hooks/useAllBalances';
import { usePrices } from '../hooks/usePrices';
import { useDenomLogos } from '../hooks/useDenomLogos';
import { useValidatorLogos } from '../hooks/useValidatorLogos';
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
  LineChart,
  Line,
} from 'recharts';
import {
  Wallet,
  TrendingUp,
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownLeft,
  Users,
  DollarSign,
  Coins,
  Calendar,
  Award,
  Settings,
  Send,
  Download,
  RefreshCw,
  Sparkles,
  Zap,
  Clock,
  Target,
  TrendingDown,
  ChevronRight,
  Star,
  Shield,
  BarChart3,
} from 'lucide-react';

interface DashboardProps {
  onStartOnboarding?: () => void;
}

export function Dashboard({ onStartOnboarding }: DashboardProps) {
  const all = useAllBalances();
  const { prices, loading: pricesLoading } = usePrices();
  const { getLogo: getDenomLogo } = useDenomLogos();
  const { getValidatorInfo, getValidatorLogo } = useValidatorLogos();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [rewardTimeframe, setRewardTimeframe] = useState<
    'week' | 'month' | 'year'
  >('month');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [selectedChain, setSelectedChain] = useState<string>('all');

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
        validatorName: '',
        validatorCommission: '',
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
        validatorName: d.validatorName,
        validatorCommission: d.validatorCommission,
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
          hasPrice: false, // Will be set to true if any item has a price
          type: item.type,
          logo: getDenomLogo(item.symbol),
        };
      }
      acc[key].totalAmount += item.amount;
      acc[key].totalUsdValue += item.usdValue;
      acc[key].chains.add(item.chain);
      // If any item has a price, mark the aggregated asset as having a price
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

  // Separate staking data with chain filtering
  const stakingData = all.assets.flatMap((chain) =>
    chain.delegations
      .filter((d) => parseFloat(d.balance.displayAmount) > 0)
      .map((d) => ({
        chainName: chain.chainName,
        validatorName: d.validatorName || 'Unknown Validator',
        validatorAddress: d.validatorAddress,
        validatorCommission: d.validatorCommission || '0%',
        stakedAmount: parseFloat(d.balance.displayAmount),
        symbol: d.balance.displayDenom,
        usdValue: d.balance.usdValue,
        hasPrice: d.balance.price > 0,
      }))
  );

  // Filter staking data based on selected chain
  const filteredStakingData =
    selectedChain === 'all'
      ? stakingData
      : stakingData.filter((item) => item.chainName === selectedChain);

  // Get unique chains with staking positions
  const chainsWithStaking = [
    ...new Set(stakingData.map((item) => item.chainName)),
  ];

  // Calculate totals including all assets (with and without prices)
  const totalValue = aggregatedChartData.reduce(
    (sum, item) => sum + item.usdValue,
    0
  );
  const totalStakedValue = stakingData.reduce(
    (sum, item) => sum + item.usdValue,
    0
  );
  const filteredStakedValue = filteredStakingData.reduce(
    (sum, item) => sum + item.usdValue,
    0
  );
  const assetsWithPrices = aggregatedChartData.filter(
    (item) => item.hasPrice
  ).length;

  // Calculate available value (total - staked)
  const totalAvailableValue = totalValue - totalStakedValue;

  // Debug logging for calculations
  console.log('=== Portfolio Calculation Debug ===');
  console.log('Total Value:', totalValue);
  console.log('Total Staked Value:', totalStakedValue);
  console.log('Total Available Value:', totalAvailableValue);
  console.log('Assets with prices:', assetsWithPrices);
  console.log('Total assets:', aggregatedChartData.length);
  console.log('Staking positions:', stakingData.length);
  console.log(
    'Aggregated chart data:',
    aggregatedChartData.map((item) => ({
      symbol: item.symbol,
      usdValue: item.usdValue,
      hasPrice: item.hasPrice,
    }))
  );

  // Mock performance data
  const performanceData = [
    { date: 'Jan', value: 2100 },
    { date: 'Feb', value: 2250 },
    { date: 'Mar', value: 2180 },
    { date: 'Apr', value: 2380 },
    { date: 'May', value: 2420 },
    { date: 'Jun', value: 2459 },
  ];

  // Mock recent activity
  const recentActivity = [
    {
      type: 'stake',
      token: 'ATOM',
      amount: 25.0,
      value: 211.25,
      time: '2 hours ago',
    },
    {
      type: 'reward',
      token: 'OSMO',
      amount: 5.2,
      value: 3.54,
      time: '1 day ago',
    },
    {
      type: 'send',
      token: 'JUNO',
      amount: 100.0,
      value: 32.0,
      time: '2 days ago',
    },
    {
      type: 'receive',
      token: 'ATOM',
      amount: 50.0,
      value: 422.5,
      time: '3 days ago',
    },
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
      {/* Portfolio Overview */}
      <div className='grid gap-8 lg:grid-cols-3'>
        <div className='lg:col-span-2'>
          <div className='bright-card ultra-soft-shadow rounded-xl border-0 p-6'>
            <div className='mb-6 flex items-center justify-between'>
              <div>
                <h2 className='flex items-center gap-3 text-2xl font-semibold text-gray-800'>
                  <div className='ethereal-glow h-3 w-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500'></div>
                  Portfolio Overview
                </h2>
                <p className='mt-2 text-lg text-gray-600'>
                  Your total cryptocurrency holdings
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

            <div className='mb-8 flex items-center justify-between'>
              <div>
                <div className='mb-2 text-4xl font-bold text-gray-800'>
                  {balanceVisible ? formatCurrency(totalValue) : '••••••••'}
                </div>
                <div className='flex items-center gap-2 text-lg'>
                  <TrendingUp className='h-5 w-5 text-emerald-500' />
                  <span className='font-semibold text-emerald-600'>
                    +5.2% (24h)
                  </span>
                </div>
              </div>
              <div className='text-right'>
                <div className='text-lg text-gray-600'>Staked Value</div>
                <div className='text-2xl font-semibold text-gray-800'>
                  {balanceVisible ? formatCurrency(totalStakedValue) : '••••••'}
                </div>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-10'>
              <div className='flex h-80 items-center justify-center'>
                <ResponsiveContainer width='100%' height='100%'>
                  <PieChart>
                    <Pie
                      data={aggregatedChartData.filter((item) => item.hasPrice)}
                      cx='50%'
                      cy='50%'
                      innerRadius={80}
                      outerRadius={140}
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

              <div className='space-y-4'>
                {aggregatedChartData
                  .filter((item) => item.hasPrice)
                  .slice(0, 5)
                  .map((token, index) => (
                    <div
                      key={token.name}
                      className='glass-ultra-light flex items-center justify-between rounded-xl p-4'
                    >
                      <div className='flex items-center gap-4'>
                        {token.logo ? (
                          <img
                            src={token.logo}
                            alt={token.symbol}
                            className='h-6 w-6 rounded-full object-cover shadow-sm'
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const fallback =
                                target.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'block';
                            }}
                          />
                        ) : null}
                        <div
                          className={`h-4 w-4 rounded-full shadow-sm ${
                            token.logo ? 'hidden' : 'block'
                          }`}
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        ></div>
                        <div>
                          <div className='text-lg font-semibold text-gray-800'>
                            {token.symbol}
                          </div>
                          <div className='text-gray-500'>
                            {balanceVisible
                              ? `${token.amount.toFixed(2)} ${token.symbol}`
                              : '••••••'}
                            {token.chains.length > 1 && (
                              <span className='ml-2 text-xs text-blue-500'>
                                ({token.chains.length} chains)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className='text-right'>
                        <div className='text-lg font-semibold text-gray-800'>
                          {balanceVisible
                            ? formatCurrency(token.usdValue)
                            : '••••••'}
                        </div>
                        <div className='text-gray-500'>
                          {((token.usdValue / totalValue) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        <div className='space-y-6'>
          {/* Quick Actions */}
          <div className='bright-card ultra-soft-shadow rounded-xl border-0 p-6'>
            <h3 className='mb-4 flex items-center gap-2 text-xl font-semibold text-gray-800'>
              <Sparkles className='h-5 w-5 text-purple-500' />
              Quick Actions
            </h3>
            <div className='space-y-3'>
              <button className='ultra-soft-shadow flex w-full items-center justify-center gap-2 rounded-lg border-0 bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-3 text-white transition-all duration-300 hover:scale-105'>
                <Download className='h-4 w-4' />
                Receive
              </button>
              <button className='glass-button flex w-full items-center justify-center gap-2 rounded-lg border-0 px-4 py-3'>
                <Send className='h-4 w-4' />
                Send
              </button>
              <button className='glass-button flex w-full items-center justify-center gap-2 rounded-lg border-0 px-4 py-3'>
                <TrendingUp className='h-4 w-4' />
                Stake More
              </button>
              <button
                onClick={() => (window.location.href = '/learn-staking')}
                className='glass-button flex w-full items-center justify-center gap-2 rounded-lg border-0 px-4 py-3'
              >
                <Users className='h-4 w-4' />
                Learn Staking
              </button>
            </div>
          </div>

          {/* Portfolio Performance */}
          <div className='bright-card ultra-soft-shadow rounded-xl border-0 p-6'>
            <h3 className='mb-4 flex items-center gap-2 text-xl font-semibold text-gray-800'>
              <Zap className='h-5 w-5 text-amber-500' />
              Performance
            </h3>
            <div className='space-y-6'>
              <div className='grid grid-cols-2 gap-4'>
                <div className='glass-ultra-light rounded-lg p-4'>
                  <div className='text-sm text-gray-600'>24h Change</div>
                  <div className='text-lg font-semibold text-emerald-600'>
                    +$127.50
                  </div>
                </div>
                <div className='glass-ultra-light rounded-lg p-4'>
                  <div className='text-sm text-gray-600'>7d Change</div>
                  <div className='text-lg font-semibold text-emerald-600'>
                    +$345.20
                  </div>
                </div>
              </div>
              <div className='h-32'>
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
              <Award className='h-6 w-6 text-white' />
            </div>
            <div>
              <div className='text-sm text-gray-600'>Active Positions</div>
              <div className='text-xl font-bold text-gray-800'>
                {stakingData.length}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
