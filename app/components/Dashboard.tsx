import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';

interface DashboardProps {
  onStartOnboarding: () => void;
}

export function Dashboard({ onStartOnboarding }: DashboardProps) {
  const all = useAllBalances();
  const { prices, loading: pricesLoading } = usePrices();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [rewardTimeframe, setRewardTimeframe] = useState<
    'week' | 'month' | 'year'
  >('month');
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

  // Prepare data for charts
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

  // Separate staking data
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

  const totalValue = chartData.reduce((sum, item) => sum + item.usdValue, 0);
  const totalStakedValue = stakingData.reduce(
    (sum, item) => sum + item.usdValue,
    0
  );
  const assetsWithPrices = chartData.filter((item) => item.hasPrice).length;

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
          <p className='font-semibold text-gray-700'>{data.name}</p>
          <p className='text-sm text-gray-600'>
            ${balanceVisible ? data.usdValue.toFixed(2) : '••••••'}
          </p>
          <p className='text-sm text-gray-500'>
            {balanceVisible ? data.amount.toFixed(2) : '••••••'} {data.symbol}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className='relative min-h-screen overflow-hidden'>
      {/* Floating Background Elements */}
      <div className='pointer-events-none absolute inset-0 overflow-hidden'>
        <div className='gradient-primary floating-card absolute left-10 top-20 h-80 w-80 rounded-full opacity-50 blur-3xl'></div>
        <div
          className='gradient-accent floating-card absolute right-20 top-40 h-60 w-60 rounded-full opacity-40 blur-3xl'
          style={{ animationDelay: '2s' }}
        ></div>
        <div
          className='gradient-warm floating-card absolute bottom-20 left-1/3 h-72 w-72 rounded-full opacity-35 blur-3xl'
          style={{ animationDelay: '4s' }}
        ></div>
        <div
          className='gradient-cool floating-card absolute right-1/4 top-1/2 h-48 w-48 rounded-full opacity-30 blur-2xl'
          style={{ animationDelay: '6s' }}
        ></div>
        <div
          className='gradient-cosmic floating-card absolute left-1/2 top-10 h-40 w-40 rounded-full opacity-45 blur-2xl'
          style={{ animationDelay: '8s' }}
        ></div>
      </div>

      <div className='container relative z-10 mx-auto max-w-7xl px-6 py-8'>
        {/* Header */}
        <div className='mb-12 flex items-center justify-between'>
          <div className='space-y-2'>
            <h1 className='bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-4xl font-bold text-transparent'>
              Cosmos Portfolio
            </h1>
            <p className='text-lg text-gray-600'>
              Track your assets, staking rewards, and DeFi positions
            </p>
          </div>
          <div className='flex items-center gap-4'>
            <button className='glass-button flex items-center gap-2 rounded-lg border-0 px-4 py-2'>
              <RefreshCw className='h-4 w-4' />
              Refresh
            </button>
            <button className='glass-button flex items-center gap-2 rounded-lg border-0 px-4 py-2'>
              <Settings className='h-4 w-4' />
              Settings
            </button>
          </div>
        </div>

        {/* Portfolio Overview */}
        <div className='mb-12 grid gap-8 lg:grid-cols-3'>
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
                    {balanceVisible
                      ? formatCurrency(totalStakedValue)
                      : '••••••'}
                  </div>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-10'>
                <div className='flex h-80 items-center justify-center'>
                  <ResponsiveContainer width='100%' height='100%'>
                    <PieChart>
                      <Pie
                        data={chartData.filter((item) => item.hasPrice)}
                        cx='50%'
                        cy='50%'
                        innerRadius={80}
                        outerRadius={140}
                        paddingAngle={3}
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

                <div className='space-y-4'>
                  {chartData.slice(0, 5).map((token, index) => (
                    <div
                      key={token.name}
                      className='glass-ultra-light flex items-center justify-between rounded-xl p-4'
                    >
                      <div className='flex items-center gap-4'>
                        <div
                          className='h-4 w-4 rounded-full shadow-sm'
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
                  onClick={onStartOnboarding}
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
                        <linearGradient
                          id='gradient'
                          x1='0'
                          y1='0'
                          x2='1'
                          y2='0'
                        >
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

        {/* Enhanced Staking Positions and Activity */}
        <div className='grid gap-8 lg:grid-cols-2'>
          {/* Enhanced Staking Positions */}
          <div className='bright-card ultra-soft-shadow rounded-xl border-0 p-6'>
            <div className='mb-6 flex items-center justify-between'>
              <div>
                <h3 className='flex items-center gap-2 text-xl font-semibold text-gray-800'>
                  <Award className='h-5 w-5 text-purple-500' />
                  Staking Positions
                </h3>
                <p className='mt-1 text-lg text-gray-600'>
                  Your active staking delegations with projected rewards
                </p>
              </div>
              <div className='flex items-center gap-2'>
                <span className='flex items-center gap-1 rounded-full border-0 bg-gradient-to-r from-cyan-500 to-blue-500 px-3 py-1 text-sm text-white'>
                  <Coins className='h-3 w-3' />
                  {stakingData.length} active
                </span>
              </div>
            </div>

            <div className='space-y-6'>
              {/* Summary Cards */}
              <div className='grid grid-cols-4 gap-3'>
                <div className='glass-ultra-light rounded-xl p-3 text-center'>
                  <div className='text-xs text-gray-600'>Total Staked</div>
                  <div className='text-sm font-semibold text-gray-800'>
                    {balanceVisible
                      ? formatCurrency(totalStakedValue)
                      : '••••••'}
                  </div>
                </div>
                <div className='glass-ultra-light rounded-xl p-3 text-center'>
                  <div className='text-xs text-gray-600'>Active</div>
                  <div className='text-sm font-semibold text-emerald-600'>
                    {stakingData.length}
                  </div>
                </div>
                <div className='glass-ultra-light rounded-xl p-3 text-center'>
                  <div className='text-xs text-gray-600'>Chains</div>
                  <div className='text-sm font-semibold text-blue-600'>
                    {new Set(stakingData.map((item) => item.chainName)).size}
                  </div>
                </div>
                <div className='glass-ultra-light rounded-xl p-3 text-center'>
                  <div className='text-xs text-gray-600'>Avg APY</div>
                  <div className='text-sm font-semibold text-purple-600'>
                    15.5%
                  </div>
                </div>
              </div>

              {/* Individual Staking Positions */}
              <div className='space-y-4'>
                {stakingData.map((position, index) => (
                  <div
                    key={index}
                    className='glass-ultra-light rounded-xl p-5 transition-all duration-300 hover:scale-[1.01]'
                  >
                    <div className='mb-4 flex items-center justify-between'>
                      <div>
                        <div className='text-lg font-semibold text-gray-800'>
                          {position.validatorName}
                        </div>
                        <div className='text-sm text-gray-600'>
                          {position.chainName}
                        </div>
                      </div>
                      <span className='rounded-full border-0 bg-gradient-to-r from-pink-500 to-rose-500 px-3 py-1 text-sm text-white'>
                        15.2% APY
                      </span>
                    </div>

                    <div className='mb-4 grid grid-cols-2 gap-4'>
                      <div>
                        <div className='flex items-center gap-1 text-sm text-gray-600'>
                          <Coins className='h-3 w-3' />
                          Staked
                        </div>
                        <div className='font-semibold text-gray-800'>
                          {balanceVisible
                            ? `${position.stakedAmount} ${position.symbol}`
                            : '••••••'}
                        </div>
                        <div className='text-xs text-gray-500'>
                          {balanceVisible
                            ? formatCurrency(position.usdValue)
                            : '••••••'}
                        </div>
                      </div>
                      <div>
                        <div className='flex items-center gap-1 text-sm text-gray-600'>
                          <Award className='h-3 w-3' />
                          Commission
                        </div>
                        <div className='font-semibold text-emerald-600'>
                          {position.validatorCommission}
                        </div>
                        <div className='text-xs text-gray-500'>
                          Validator fee
                        </div>
                      </div>
                    </div>

                    <div className='glass-ultra-light rounded-lg p-3'>
                      <div className='mb-2 flex items-center gap-1 text-sm text-gray-600'>
                        <Target className='h-3 w-3' />
                        Projected Rewards (month)
                      </div>
                      <div className='grid grid-cols-2 gap-4 text-xs'>
                        <div>
                          <div className='font-semibold text-blue-600'>
                            {balanceVisible
                              ? `${((position.stakedAmount * 0.15) / 12).toFixed(3)} ${position.symbol}`
                              : '••••••'}
                          </div>
                          <div className='text-gray-500'>
                            {balanceVisible
                              ? formatCurrency(
                                  ((position.stakedAmount * 0.15) / 12) *
                                    (position.usdValue / position.stakedAmount)
                                )
                              : '••••••'}
                          </div>
                        </div>
                        <div className='text-right'>
                          <div className='text-gray-500'>
                            Annual:{' '}
                            {balanceVisible
                              ? formatCurrency(position.usdValue * 0.15)
                              : '••••••'}
                          </div>
                          <div className='text-xs text-gray-400'>
                            Monthly:{' '}
                            {balanceVisible
                              ? formatCurrency((position.usdValue * 0.15) / 12)
                              : '••••••'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className='mt-3'>
                      <div className='mb-1 flex justify-between text-xs text-gray-500'>
                        <span>Progress to next reward</span>
                        <span>78%</span>
                      </div>
                      <div className='h-2 w-full rounded-full bg-gray-100'>
                        <div
                          className='h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500'
                          style={{ width: '78%' }}
                        ></div>
                      </div>
                      <div className='mt-1 flex items-center gap-1 text-xs text-gray-400'>
                        <Clock className='h-3 w-3' />
                        Next reward in ~5 hours
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className='bright-card ultra-soft-shadow rounded-xl border-0 p-6'>
            <h3 className='mb-4 flex items-center gap-2 text-xl font-semibold text-gray-800'>
              <Calendar className='h-5 w-5 text-cyan-500' />
              Recent Activity
            </h3>
            <p className='mb-6 text-lg text-gray-600'>
              Your latest transactions and rewards
            </p>

            <div className='space-y-4'>
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className='glass-ultra-light flex items-center justify-between rounded-xl p-4 transition-all duration-300 hover:scale-[1.01]'
                >
                  <div className='flex items-center gap-4'>
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full ${
                        activity.type === 'stake'
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                          : activity.type === 'reward'
                            ? 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                            : activity.type === 'send'
                              ? 'bg-gradient-to-r from-pink-500 to-rose-500'
                              : 'bg-gradient-to-r from-amber-500 to-orange-500'
                      }`}
                    >
                      {activity.type === 'stake' ? (
                        <TrendingUp className='h-6 w-6 text-white' />
                      ) : activity.type === 'reward' ? (
                        <Award className='h-6 w-6 text-white' />
                      ) : activity.type === 'send' ? (
                        <ArrowUpRight className='h-6 w-6 text-white' />
                      ) : (
                        <ArrowDownLeft className='h-6 w-6 text-white' />
                      )}
                    </div>
                    <div>
                      <div className='text-lg font-semibold capitalize text-gray-800'>
                        {activity.type} {activity.token}
                      </div>
                      <div className='text-gray-600'>{activity.time}</div>
                    </div>
                  </div>
                  <div className='text-right'>
                    <div className='text-lg font-semibold text-gray-800'>
                      {activity.type === 'send' ? '-' : '+'}
                      {activity.amount} {activity.token}
                    </div>
                    <div className='text-gray-500'>
                      {balanceVisible
                        ? formatCurrency(activity.value)
                        : '••••••'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
