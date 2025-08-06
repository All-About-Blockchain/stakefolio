import React, { useState, useEffect } from 'react';
import { useAllBalances } from '../hooks/useAllBalances';
import { usePrices } from '../hooks/usePrices';
import { useDenomLogos } from '../hooks/useDenomLogos';
import {
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  Award,
  Eye,
  EyeOff,
  Clock,
  Filter,
  Search,
} from 'lucide-react';

export function Activity() {
  const all = useAllBalances();
  const { prices, loading: pricesLoading } = usePrices();
  const { getLogo: getDenomLogo } = useDenomLogos();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

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
          <p className='text-gray-600'>Loading your activity...</p>
        </div>
      </div>
    );
  }

  // Mock recent activity data
  const recentActivity = [
    {
      id: 1,
      type: 'stake',
      token: 'ATOM',
      amount: 25.0,
      value: 211.25,
      time: '2 hours ago',
      status: 'completed',
      chain: 'cosmoshub',
      txHash: '0x1234...5678',
    },
    {
      id: 2,
      type: 'reward',
      token: 'OSMO',
      amount: 5.2,
      value: 3.54,
      time: '1 day ago',
      status: 'completed',
      chain: 'osmosis',
      txHash: '0x8765...4321',
    },
    {
      id: 3,
      type: 'send',
      token: 'JUNO',
      amount: 100.0,
      value: 32.0,
      time: '2 days ago',
      status: 'completed',
      chain: 'juno',
      txHash: '0xabcd...efgh',
    },
    {
      id: 4,
      type: 'receive',
      token: 'ATOM',
      amount: 50.0,
      value: 422.5,
      time: '3 days ago',
      status: 'completed',
      chain: 'cosmoshub',
      txHash: '0x9876...5432',
    },
    {
      id: 5,
      type: 'unstake',
      token: 'OSMO',
      amount: 15.0,
      value: 10.2,
      time: '4 days ago',
      status: 'pending',
      chain: 'osmosis',
      txHash: '0x5678...1234',
    },
    {
      id: 6,
      type: 'swap',
      token: 'ATOM',
      amount: 10.0,
      value: 84.5,
      time: '5 days ago',
      status: 'completed',
      chain: 'osmosis',
      txHash: '0xdcba...hgfe',
    },
    {
      id: 7,
      type: 'reward',
      token: 'JUNO',
      amount: 2.5,
      value: 0.8,
      time: '1 week ago',
      status: 'completed',
      chain: 'juno',
      txHash: '0x4321...8765',
    },
    {
      id: 8,
      type: 'stake',
      token: 'OSMO',
      amount: 30.0,
      value: 20.4,
      time: '1 week ago',
      status: 'completed',
      chain: 'osmosis',
      txHash: '0xefgh...abcd',
    },
  ];

  // Filter activity based on selected filter and search term
  const filteredActivity = recentActivity.filter((activity) => {
    const matchesFilter =
      selectedFilter === 'all' || activity.type === selectedFilter;
    const matchesSearch =
      activity.token.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.chain.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'stake':
        return <TrendingUp className='h-6 w-6 text-white' />;
      case 'unstake':
        return <TrendingUp className='h-6 w-6 text-white' />;
      case 'reward':
        return <Award className='h-6 w-6 text-white' />;
      case 'send':
        return <ArrowUpRight className='h-6 w-6 text-white' />;
      case 'receive':
        return <ArrowDownLeft className='h-6 w-6 text-white' />;
      case 'swap':
        return <TrendingUp className='h-6 w-6 text-white' />;
      default:
        return <Clock className='h-6 w-6 text-white' />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'stake':
        return 'bg-gradient-to-r from-blue-500 to-purple-500';
      case 'unstake':
        return 'bg-gradient-to-r from-orange-500 to-red-500';
      case 'reward':
        return 'bg-gradient-to-r from-emerald-500 to-cyan-500';
      case 'send':
        return 'bg-gradient-to-r from-pink-500 to-rose-500';
      case 'receive':
        return 'bg-gradient-to-r from-amber-500 to-orange-500';
      case 'swap':
        return 'bg-gradient-to-r from-purple-500 to-pink-500';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-emerald-600 bg-emerald-100';
      case 'pending':
        return 'text-amber-600 bg-amber-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className='space-y-8'>
      {/* Activity Header */}
      <div className='bright-card ultra-soft-shadow rounded-xl border-0 p-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='flex items-center gap-3 text-2xl font-semibold text-gray-800'>
              <Calendar className='h-6 w-6 text-cyan-500' />
              Recent Activity
            </h2>
            <p className='mt-2 text-lg text-gray-600'>
              Your latest transactions and rewards
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

      {/* Filters and Search */}
      <div className='bright-card ultra-soft-shadow rounded-xl border-0 p-6'>
        <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
          <div className='flex items-center gap-2'>
            <Filter className='h-5 w-5 text-gray-500' />
            <span className='text-sm font-medium text-gray-700'>
              Filter by:
            </span>
            <div className='flex flex-wrap gap-2'>
              <button
                onClick={() => setSelectedFilter('all')}
                className={`rounded-lg px-3 py-1 text-sm font-medium transition-all duration-200 ${
                  selectedFilter === 'all'
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                    : 'glass-button border-0 text-gray-600 hover:bg-gray-100'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedFilter('stake')}
                className={`rounded-lg px-3 py-1 text-sm font-medium transition-all duration-200 ${
                  selectedFilter === 'stake'
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                    : 'glass-button border-0 text-gray-600 hover:bg-gray-100'
                }`}
              >
                Staking
              </button>
              <button
                onClick={() => setSelectedFilter('reward')}
                className={`rounded-lg px-3 py-1 text-sm font-medium transition-all duration-200 ${
                  selectedFilter === 'reward'
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                    : 'glass-button border-0 text-gray-600 hover:bg-gray-100'
                }`}
              >
                Rewards
              </button>
              <button
                onClick={() => setSelectedFilter('send')}
                className={`rounded-lg px-3 py-1 text-sm font-medium transition-all duration-200 ${
                  selectedFilter === 'send'
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                    : 'glass-button border-0 text-gray-600 hover:bg-gray-100'
                }`}
              >
                Transfers
              </button>
              <button
                onClick={() => setSelectedFilter('swap')}
                className={`rounded-lg px-3 py-1 text-sm font-medium transition-all duration-200 ${
                  selectedFilter === 'swap'
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                    : 'glass-button border-0 text-gray-600 hover:bg-gray-100'
                }`}
              >
                Swaps
              </button>
            </div>
          </div>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
            <input
              type='text'
              placeholder='Search by token or chain...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full rounded-lg border-0 bg-white/50 px-10 py-2 text-sm placeholder-gray-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500'
            />
          </div>
        </div>
      </div>

      {/* Activity Summary */}
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
        <div className='bright-card ultra-soft-shadow rounded-xl border-0 p-6'>
          <div className='flex items-center gap-3'>
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500'>
              <Calendar className='h-6 w-6 text-white' />
            </div>
            <div>
              <div className='text-sm text-gray-600'>Total Transactions</div>
              <div className='text-xl font-bold text-gray-800'>
                {recentActivity.length}
              </div>
            </div>
          </div>
        </div>

        <div className='bright-card ultra-soft-shadow rounded-xl border-0 p-6'>
          <div className='flex items-center gap-3'>
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500'>
              <Award className='h-6 w-6 text-white' />
            </div>
            <div>
              <div className='text-sm text-gray-600'>Total Rewards</div>
              <div className='text-xl font-bold text-gray-800'>
                {balanceVisible ? formatCurrency(4.34) : '••••••••'}
              </div>
            </div>
          </div>
        </div>

        <div className='bright-card ultra-soft-shadow rounded-xl border-0 p-6'>
          <div className='flex items-center gap-3'>
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-500'>
              <TrendingUp className='h-6 w-6 text-white' />
            </div>
            <div>
              <div className='text-sm text-gray-600'>Staking Actions</div>
              <div className='text-xl font-bold text-gray-800'>
                {
                  recentActivity.filter(
                    (a) => a.type === 'stake' || a.type === 'unstake'
                  ).length
                }
              </div>
            </div>
          </div>
        </div>

        <div className='bright-card ultra-soft-shadow rounded-xl border-0 p-6'>
          <div className='flex items-center gap-3'>
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500'>
              <Clock className='h-6 w-6 text-white' />
            </div>
            <div>
              <div className='text-sm text-gray-600'>Pending</div>
              <div className='text-xl font-bold text-gray-800'>
                {recentActivity.filter((a) => a.status === 'pending').length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity List */}
      <div className='bright-card ultra-soft-shadow rounded-xl border-0 p-6'>
        <h3 className='mb-6 flex items-center gap-2 text-xl font-semibold text-gray-800'>
          <Calendar className='h-5 w-5 text-cyan-500' />
          Transaction History
        </h3>

        {filteredActivity.length === 0 ? (
          <div className='glass-ultra-light rounded-xl p-8 text-center'>
            <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-gray-200 to-gray-300'>
              <Calendar className='h-8 w-8 text-gray-400' />
            </div>
            <h4 className='mb-2 text-lg font-semibold text-gray-700'>
              No Activity Found
            </h4>
            <p className='text-gray-500'>
              No transactions match your current filters.
            </p>
          </div>
        ) : (
          <div className='space-y-4'>
            {filteredActivity.map((activity) => (
              <div
                key={activity.id}
                className='glass-ultra-light flex items-center justify-between rounded-xl p-4 transition-all duration-300 hover:scale-[1.01]'
              >
                <div className='flex items-center gap-4'>
                  <div className='flex items-center gap-3'>
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full ${getActivityColor(activity.type)}`}
                    >
                      {getActivityIcon(activity.type)}
                    </div>

                    {/* Token Logo */}
                    {getDenomLogo(activity.token) && (
                      <img
                        src={getDenomLogo(activity.token)!}
                        alt={activity.token}
                        className='h-6 w-6 rounded-full object-cover'
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    )}
                  </div>
                  <div>
                    <div className='text-lg font-semibold capitalize text-gray-800'>
                      {activity.type} {activity.token}
                    </div>
                    <div className='flex items-center gap-2 text-sm text-gray-600'>
                      <span>{activity.time}</span>
                      <span>•</span>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(activity.status)}`}
                      >
                        {activity.status}
                      </span>
                    </div>
                    <div className='text-xs text-gray-500'>
                      {activity.chain.charAt(0).toUpperCase() +
                        activity.chain.slice(1)}{' '}
                      • {activity.txHash}
                    </div>
                  </div>
                </div>
                <div className='text-right'>
                  <div className='text-lg font-semibold text-gray-800'>
                    {activity.type === 'send' || activity.type === 'unstake'
                      ? '-'
                      : '+'}
                    {activity.amount} {activity.token}
                  </div>
                  <div className='text-gray-500'>
                    {balanceVisible ? formatCurrency(activity.value) : '••••••'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Activity Statistics */}
      <div className='bright-card ultra-soft-shadow rounded-xl border-0 p-6'>
        <h3 className='mb-6 flex items-center gap-2 text-xl font-semibold text-gray-800'>
          <TrendingUp className='h-5 w-5 text-emerald-500' />
          Activity Statistics
        </h3>
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
          <div className='glass-ultra-light rounded-xl p-4 text-center'>
            <div className='text-sm text-gray-600'>This Week</div>
            <div className='text-2xl font-bold text-emerald-600'>
              {
                recentActivity.filter(
                  (a) =>
                    a.time.includes('day') &&
                    parseInt(a.time.split(' ')[0]) <= 7
                ).length
              }
            </div>
            <div className='text-xs text-gray-500'>Transactions</div>
          </div>
          <div className='glass-ultra-light rounded-xl p-4 text-center'>
            <div className='text-sm text-gray-600'>This Month</div>
            <div className='text-2xl font-bold text-blue-600'>
              {recentActivity.length}
            </div>
            <div className='text-xs text-gray-500'>Transactions</div>
          </div>
          <div className='glass-ultra-light rounded-xl p-4 text-center'>
            <div className='text-sm text-gray-600'>Total Value</div>
            <div className='text-2xl font-bold text-purple-600'>
              {balanceVisible
                ? formatCurrency(
                    recentActivity.reduce((sum, a) => sum + a.value, 0)
                  )
                : '••••••••'}
            </div>
            <div className='text-xs text-gray-500'>Moved</div>
          </div>
          <div className='glass-ultra-light rounded-xl p-4 text-center'>
            <div className='text-sm text-gray-600'>Success Rate</div>
            <div className='text-2xl font-bold text-amber-600'>
              {Math.round(
                (recentActivity.filter((a) => a.status === 'completed').length /
                  recentActivity.length) *
                  100
              )}
              %
            </div>
            <div className='text-xs text-gray-500'>Completed</div>
          </div>
        </div>
      </div>
    </div>
  );
}
