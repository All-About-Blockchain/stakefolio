import React, { useState, useEffect } from 'react';
import { useAllBalances } from '../hooks/useAllBalances';
import { usePrices } from '../hooks/usePrices';
import { LIQUID_STAKING_TOKENS } from '../config/chains';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import {
  Wallet,
  TrendingUp,
  Eye,
  EyeOff,
  BarChart3,
  Coins,
  Zap,
  Shield,
  ArrowRight,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function Portfolio() {
  const all = useAllBalances();
  const { prices, loading: pricesLoading } = usePrices();
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

  // Get CosmosHub balances when a Cosmos-style address is connected
  const cosmosHubData = all.assets.find(
    (chain) => chain.chainName === 'cosmoshub'
  );

  // Filter for liquid staking tokens and ATOM
  const liquidStakingAssets =
    cosmosHubData?.balances.filter((balance) => {
      const isATOM = balance.symbol === 'ATOM';
      const isLiquidStaking = Object.values(LIQUID_STAKING_TOKENS).some(
        (token) =>
          token.denom === balance.denom || token.symbol === balance.symbol
      );
      return isATOM || isLiquidStaking;
    }) || [];

  // Prepare chart data
  const chartData = liquidStakingAssets
    .filter((asset) => parseFloat(asset.displayAmount) > 0)
    .map((asset) => {
      const tokenInfo = Object.values(LIQUID_STAKING_TOKENS).find(
        (token) => token.denom === asset.denom || token.symbol === asset.symbol
      );

      return {
        name: asset.symbol,
        symbol: asset.symbol,
        amount: parseFloat(asset.displayAmount),
        price: asset.price,
        usdValue: asset.usdValue,
        hasPrice: asset.price > 0,
        apr: tokenInfo?.apr || 0,
        logo:
          tokenInfo?.logo || asset.symbol === 'ATOM'
            ? 'https://raw.githubusercontent.com/cosmos/chain-registry/master/cosmoshub/images/atom.png'
            : null,
        type: tokenInfo ? 'Liquid Staked' : 'Available',
      };
    });

  // Calculate totals
  const totalValue = chartData.reduce((sum, item) => sum + item.usdValue, 0);
  const totalStakedValue = chartData
    .filter((item) => item.type === 'Liquid Staked')
    .reduce((sum, item) => sum + item.usdValue, 0);
  const totalAvailableValue = totalValue - totalStakedValue;

  // Calculate weighted average APR
  const weightedAPR =
    chartData.length > 0
      ? chartData.reduce((sum, item) => sum + item.usdValue * item.apr, 0) /
        totalValue
      : 0;

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
              <Image
                src={data.logo}
                alt={data.symbol}
                width={24}
                height={24}
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
          {data.apr > 0 && (
            <p className='mt-1 text-xs text-emerald-600'>
              APR: {(data.apr * 100).toFixed(1)}%
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
              Liquid Staking Portfolio
            </h2>
            <p className='mt-2 text-lg text-gray-600'>
              Your liquid staking overview
            </p>
          </div>
          <div className='flex items-center gap-3'>
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
              <div className='text-sm text-gray-600'>Avg APR</div>
              <div className='text-xl font-bold text-gray-800'>
                {balanceVisible
                  ? `${(weightedAPR * 100).toFixed(1)}%`
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
          {chartData.length > 0 ? (
            <div className='h-80'>
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                  <Pie
                    data={chartData.filter((item) => item.hasPrice)}
                    cx='50%'
                    cy='50%'
                    innerRadius={60}
                    outerRadius={120}
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
          ) : (
            <div className='flex h-80 items-center justify-center'>
              <div className='text-center text-gray-500'>
                <Shield className='mx-auto mb-4 h-12 w-12' />
                <p>No liquid staking assets found</p>
                <p className='text-sm'>
                  Connect a Cosmos-compatible address to see on-chain positions
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className='bright-card ultra-soft-shadow rounded-xl border-0 p-6'>
          <h3 className='mb-6 flex items-center gap-2 text-xl font-semibold text-gray-800'>
            <Zap className='h-5 w-5 text-emerald-500' />
            Quick Actions
          </h3>
          <div className='space-y-4'>
            <Link
              href='/funding?tab=deposit'
              className='flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-all hover:border-purple-500 hover:shadow-md'
            >
              <div className='flex items-center gap-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500'>
                  <TrendingUp className='h-5 w-5 text-white' />
                </div>
                <div>
                  <div className='font-semibold text-gray-800'>
                    Fund ETH / BTC / SOL
                  </div>
                  <div className='text-sm text-gray-500'>
                    Deposit with wallet or bank
                  </div>
                </div>
              </div>
              <ArrowRight className='h-5 w-5 text-gray-400' />
            </Link>
            <Link
              href='/funding?tab=withdraw'
              className='flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-all hover:border-purple-500 hover:shadow-md'
            >
              <div className='flex items-center gap-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-gray-700 to-gray-900'>
                  <Wallet className='h-5 w-5 text-white' />
                </div>
                <div>
                  <div className='font-semibold text-gray-800'>Withdraw</div>
                  <div className='text-sm text-gray-500'>
                    Send on-chain or off-ramp to bank
                  </div>
                </div>
              </div>
              <ArrowRight className='h-5 w-5 text-gray-400' />
            </Link>
          </div>
        </div>
      </div>

      {/* Portfolio Breakdown by Tokens */}
      <div className='bright-card ultra-soft-shadow rounded-xl border-0 p-6'>
        <h3 className='mb-6 flex items-center gap-2 text-xl font-semibold text-gray-800'>
          <Coins className='h-5 w-5 text-amber-500' />
          Your Assets
        </h3>
        {chartData.length > 0 ? (
          <div className='space-y-3'>
            {chartData
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
                          <Image
                            src={token.logo}
                            alt={token.symbol}
                            width={32}
                            height={32}
                            className='h-8 w-8 rounded-full object-cover'
                          />
                        ) : (
                          <div
                            className='h-8 w-8 rounded-full shadow-sm'
                            style={{
                              backgroundColor: COLORS[index % COLORS.length],
                            }}
                          ></div>
                        )}
                        <div>
                          <div className='font-semibold text-gray-800'>
                            {token.symbol}
                            <span
                              className={`ml-2 rounded-full px-2 py-1 text-xs ${
                                token.type === 'Liquid Staked'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {token.type}
                            </span>
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
                        {token.apr > 0 && (
                          <div className='text-xs text-emerald-600'>
                            {(token.apr * 100).toFixed(1)}% APR
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <div className='py-8 text-center text-gray-500'>
            <Shield className='mx-auto mb-4 h-12 w-12' />
            <p>No assets found</p>
            <p className='text-sm'>Add funded assets to begin tracking yield</p>
          </div>
        )}
      </div>
    </div>
  );
}
