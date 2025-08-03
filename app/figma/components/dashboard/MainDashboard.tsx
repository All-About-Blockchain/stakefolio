import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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
} from 'lucide-react';

interface MainDashboardProps {
  onStartOnboarding: () => void;
}

export function MainDashboard({ onStartOnboarding }: MainDashboardProps) {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [rewardTimeframe, setRewardTimeframe] = useState<
    'week' | 'month' | 'year'
  >('month');

  // Mock portfolio data
  const portfolioData = [
    {
      name: 'ATOM',
      value: 1234.56,
      amount: 145.67,
      percentage: 50.2,
      color: '#8b5cf6',
    },
    {
      name: 'OSMO',
      value: 605.43,
      amount: 890.34,
      percentage: 24.6,
      color: '#3b82f6',
    },
    {
      name: 'JUNO',
      value: 416.79,
      amount: 1303.45,
      percentage: 17.0,
      color: '#ec4899',
    },
    {
      name: 'AKT',
      value: 128.5,
      amount: 60.05,
      percentage: 5.2,
      color: '#10b981',
    },
    {
      name: 'SCRT',
      value: 74.3,
      amount: 83.48,
      percentage: 3.0,
      color: '#f59e0b',
    },
  ];

  const totalPortfolioValue = portfolioData.reduce(
    (sum, token) => sum + token.value,
    0
  );

  const stakingPositions = [
    {
      validator: 'Cosmos Validator',
      network: 'Cosmos Hub',
      token: 'ATOM',
      stakedAmount: 120.5,
      stakedValue: 1018.24,
      rewards: 2.34,
      rewardsValue: 19.82,
      apy: 15.2,
      status: 'active',
      tokenPrice: 8.45,
    },
    {
      validator: 'Osmosis Validator',
      network: 'Osmosis',
      token: 'OSMO',
      stakedAmount: 500.0,
      stakedValue: 340.0,
      rewards: 12.45,
      rewardsValue: 8.47,
      apy: 18.5,
      status: 'active',
      tokenPrice: 0.68,
    },
    {
      validator: 'Juno Network',
      network: 'Juno',
      token: 'JUNO',
      stakedAmount: 800.0,
      stakedValue: 256.0,
      rewards: 8.67,
      rewardsValue: 2.77,
      apy: 12.8,
      status: 'active',
      tokenPrice: 0.32,
    },
  ];

  // Calculate projected rewards
  const calculateProjectedRewards = (
    position: (typeof stakingPositions)[0],
    timeframe: 'week' | 'month' | 'year'
  ) => {
    const annualReward = position.stakedAmount * (position.apy / 100);
    const multiplier =
      timeframe === 'week' ? 1 / 52 : timeframe === 'month' ? 1 / 12 : 1;
    const tokenReward = annualReward * multiplier;
    const dollarReward = tokenReward * position.tokenPrice;

    return {
      tokens: tokenReward,
      dollars: dollarReward,
    };
  };

  const totalStakedValue = stakingPositions.reduce(
    (sum, pos) => sum + pos.stakedValue,
    0
  );
  const totalRewards = stakingPositions.reduce(
    (sum, pos) => sum + pos.rewardsValue,
    0
  );
  const totalProjectedRewards = stakingPositions.reduce((sum, pos) => {
    const projected = calculateProjectedRewards(pos, rewardTimeframe);
    return sum + projected.dollars;
  }, 0);

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

  const performanceData = [
    { date: 'Jan', value: 2100 },
    { date: 'Feb', value: 2250 },
    { date: 'Mar', value: 2180 },
    { date: 'Apr', value: 2380 },
    { date: 'May', value: 2420 },
    { date: 'Jun', value: 2459 },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className='bright-card rounded-xl border-0 p-4 shadow-2xl'>
          <p className='font-semibold text-gray-700'>{data.name}</p>
          <p className='text-sm text-gray-600'>
            ${balanceVisible ? data.value.toFixed(2) : '••••••'} (
            {data.percentage}%)
          </p>
          <p className='text-sm text-gray-500'>
            {balanceVisible ? data.amount.toFixed(2) : '••••••'} {data.name}
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
            <Button
              variant='outline'
              size='sm'
              className='glass-button border-0'
            >
              <RefreshCw className='mr-2 h-4 w-4' />
              Refresh
            </Button>
            <Button
              variant='outline'
              size='sm'
              className='glass-button border-0'
            >
              <Settings className='mr-2 h-4 w-4' />
              Settings
            </Button>
          </div>
        </div>

        {/* Portfolio Overview */}
        <div className='mb-12 grid gap-8 lg:grid-cols-3'>
          <div className='lg:col-span-2'>
            <Card className='bright-card ultra-soft-shadow border-0'>
              <CardHeader className='pb-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='flex items-center gap-3 text-2xl text-gray-800'>
                      <div className='ethereal-glow h-3 w-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500'></div>
                      Portfolio Overview
                    </CardTitle>
                    <CardDescription className='mt-2 text-lg text-gray-600'>
                      Your total cryptocurrency holdings
                    </CardDescription>
                  </div>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => setBalanceVisible(!balanceVisible)}
                    className='glass-button border-0'
                  >
                    {balanceVisible ? (
                      <EyeOff className='mr-2 h-4 w-4' />
                    ) : (
                      <Eye className='mr-2 h-4 w-4' />
                    )}
                    {balanceVisible ? 'Hide' : 'Show'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className='mb-8 flex items-center justify-between'>
                  <div>
                    <div className='mb-2 text-4xl font-bold text-gray-800'>
                      {balanceVisible
                        ? `$${totalPortfolioValue.toLocaleString()}`
                        : '••••••••'}
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
                        ? `$${totalStakedValue.toLocaleString()}`
                        : '••••••'}
                    </div>
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-10'>
                  <div className='flex h-80 items-center justify-center'>
                    <ResponsiveContainer width='100%' height='100%'>
                      <PieChart>
                        <Pie
                          data={portfolioData}
                          cx='50%'
                          cy='50%'
                          innerRadius={80}
                          outerRadius={140}
                          paddingAngle={3}
                          dataKey='value'
                        >
                          {portfolioData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className='space-y-4'>
                    {portfolioData.map((token, index) => (
                      <div
                        key={token.name}
                        className='glass-ultra-light flex items-center justify-between rounded-xl p-4'
                      >
                        <div className='flex items-center gap-4'>
                          <div
                            className='h-4 w-4 rounded-full shadow-sm'
                            style={{ backgroundColor: token.color }}
                          ></div>
                          <div>
                            <div className='text-lg font-semibold text-gray-800'>
                              {token.name}
                            </div>
                            <div className='text-gray-500'>
                              {balanceVisible
                                ? `${token.amount.toFixed(2)} ${token.name}`
                                : '••••••'}
                            </div>
                          </div>
                        </div>
                        <div className='text-right'>
                          <div className='text-lg font-semibold text-gray-800'>
                            {balanceVisible
                              ? `$${token.value.toFixed(2)}`
                              : '••••••'}
                          </div>
                          <div className='text-gray-500'>
                            {token.percentage}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className='space-y-6'>
            {/* Quick Actions */}
            <Card className='bright-card ultra-soft-shadow border-0'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-xl text-gray-800'>
                  <Sparkles className='h-5 w-5 text-purple-500' />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                <Button className='ultra-soft-shadow w-full border-0 bg-gradient-to-r from-purple-500 to-blue-500 text-white transition-all duration-300 hover:scale-105'>
                  <Download className='mr-2 h-4 w-4' />
                  Receive
                </Button>
                <Button className='glass-button w-full border-0'>
                  <Send className='mr-2 h-4 w-4' />
                  Send
                </Button>
                <Button className='glass-button w-full border-0'>
                  <TrendingUp className='mr-2 h-4 w-4' />
                  Stake More
                </Button>
                <Button
                  onClick={onStartOnboarding}
                  className='glass-button w-full border-0'
                >
                  <Users className='mr-2 h-4 w-4' />
                  Learn Staking
                </Button>
              </CardContent>
            </Card>

            {/* Portfolio Performance */}
            <Card className='bright-card ultra-soft-shadow border-0'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-xl text-gray-800'>
                  <Zap className='h-5 w-5 text-amber-500' />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enhanced Staking Positions and Activity */}
        <div className='grid gap-8 lg:grid-cols-2'>
          {/* Enhanced Staking Positions */}
          <Card className='bright-card ultra-soft-shadow border-0'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='flex items-center gap-2 text-xl text-gray-800'>
                    <Award className='h-5 w-5 text-purple-500' />
                    Staking Positions
                  </CardTitle>
                  <CardDescription className='mt-1 text-lg text-gray-600'>
                    Your active staking delegations with projected rewards
                  </CardDescription>
                </div>
                <div className='flex items-center gap-2'>
                  <Badge className='border-0 bg-gradient-to-r from-cyan-500 to-blue-500 px-3 py-1 text-white'>
                    <Coins className='mr-1 h-3 w-3' />
                    {stakingPositions.length} active
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className='space-y-6'>
                {/* Reward Timeframe Selector */}
                <div className='flex items-center gap-4'>
                  <span className='text-sm font-medium text-gray-600'>
                    Projected Rewards:
                  </span>
                  <Tabs
                    value={rewardTimeframe}
                    onValueChange={(value) =>
                      setRewardTimeframe(value as 'week' | 'month' | 'year')
                    }
                  >
                    <TabsList className='border border-white/30 bg-white/50'>
                      <TabsTrigger value='week' className='text-xs'>
                        Week
                      </TabsTrigger>
                      <TabsTrigger value='month' className='text-xs'>
                        Month
                      </TabsTrigger>
                      <TabsTrigger value='year' className='text-xs'>
                        Year
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {/* Summary Cards */}
                <div className='grid grid-cols-4 gap-3'>
                  <div className='glass-ultra-light rounded-xl p-3 text-center'>
                    <div className='text-xs text-gray-600'>Total Staked</div>
                    <div className='text-sm font-semibold text-gray-800'>
                      {balanceVisible
                        ? `$${totalStakedValue.toLocaleString()}`
                        : '••••••'}
                    </div>
                  </div>
                  <div className='glass-ultra-light rounded-xl p-3 text-center'>
                    <div className='text-xs text-gray-600'>Pending</div>
                    <div className='text-sm font-semibold text-emerald-600'>
                      {balanceVisible
                        ? `$${totalRewards.toFixed(2)}`
                        : '••••••'}
                    </div>
                  </div>
                  <div className='glass-ultra-light rounded-xl p-3 text-center'>
                    <div className='text-xs text-gray-600'>Projected</div>
                    <div className='text-sm font-semibold text-blue-600'>
                      {balanceVisible
                        ? `$${totalProjectedRewards.toFixed(2)}`
                        : '••••••'}
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
                  {stakingPositions.map((position, index) => {
                    const weekProjected = calculateProjectedRewards(
                      position,
                      'week'
                    );
                    const monthProjected = calculateProjectedRewards(
                      position,
                      'month'
                    );
                    const yearProjected = calculateProjectedRewards(
                      position,
                      'year'
                    );
                    const currentProjected = calculateProjectedRewards(
                      position,
                      rewardTimeframe
                    );

                    return (
                      <div
                        key={index}
                        className='glass-ultra-light rounded-xl p-5 transition-all duration-300 hover:scale-[1.01]'
                      >
                        <div className='mb-4 flex items-center justify-between'>
                          <div>
                            <div className='text-lg font-semibold text-gray-800'>
                              {position.validator}
                            </div>
                            <div className='text-sm text-gray-600'>
                              {position.network}
                            </div>
                          </div>
                          <Badge className='border-0 bg-gradient-to-r from-pink-500 to-rose-500 text-white'>
                            {position.apy}% APY
                          </Badge>
                        </div>

                        {/* Current Holdings */}
                        <div className='mb-4 grid grid-cols-2 gap-4'>
                          <div>
                            <div className='flex items-center gap-1 text-sm text-gray-600'>
                              <Coins className='h-3 w-3' />
                              Staked
                            </div>
                            <div className='font-semibold text-gray-800'>
                              {balanceVisible
                                ? `${position.stakedAmount} ${position.token}`
                                : '••••••'}
                            </div>
                            <div className='text-xs text-gray-500'>
                              {balanceVisible
                                ? `$${position.stakedValue.toFixed(2)}`
                                : '••••••'}
                            </div>
                          </div>
                          <div>
                            <div className='flex items-center gap-1 text-sm text-gray-600'>
                              <Award className='h-3 w-3' />
                              Pending
                            </div>
                            <div className='font-semibold text-emerald-600'>
                              {balanceVisible
                                ? `${position.rewards} ${position.token}`
                                : '••••••'}
                            </div>
                            <div className='text-xs text-gray-500'>
                              {balanceVisible
                                ? `$${position.rewardsValue.toFixed(2)}`
                                : '••••••'}
                            </div>
                          </div>
                        </div>

                        {/* Projected Rewards */}
                        <div className='glass-ultra-light rounded-lg p-3'>
                          <div className='mb-2 flex items-center gap-1 text-sm text-gray-600'>
                            <Target className='h-3 w-3' />
                            Projected Rewards ({rewardTimeframe})
                          </div>
                          <div className='grid grid-cols-2 gap-4 text-xs'>
                            <div>
                              <div className='font-semibold text-blue-600'>
                                {balanceVisible
                                  ? `${currentProjected.tokens.toFixed(3)} ${position.token}`
                                  : '••••••'}
                              </div>
                              <div className='text-gray-500'>
                                {balanceVisible
                                  ? `$${currentProjected.dollars.toFixed(2)}`
                                  : '••••••'}
                              </div>
                            </div>
                            <div className='text-right'>
                              <div className='text-gray-500'>
                                Annual:{' '}
                                {balanceVisible
                                  ? `$${yearProjected.dollars.toFixed(0)}`
                                  : '••••••'}
                              </div>
                              <div className='text-xs text-gray-400'>
                                Monthly:{' '}
                                {balanceVisible
                                  ? `$${monthProjected.dollars.toFixed(0)}`
                                  : '••••••'}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Mini Progress Bar */}
                        <div className='mt-3'>
                          <div className='mb-1 flex justify-between text-xs text-gray-500'>
                            <span>Progress to next reward</span>
                            <span>78%</span>
                          </div>
                          <Progress value={78} className='h-2 bg-gray-100' />
                          <div className='mt-1 flex items-center gap-1 text-xs text-gray-400'>
                            <Clock className='h-3 w-3' />
                            Next reward in ~5 hours
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className='bright-card ultra-soft-shadow border-0'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-xl text-gray-800'>
                <Calendar className='h-5 w-5 text-cyan-500' />
                Recent Activity
              </CardTitle>
              <CardDescription className='mt-1 text-lg text-gray-600'>
                Your latest transactions and rewards
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                          ? `$${activity.value.toFixed(2)}`
                          : '••••••'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
