import React, { useState, useEffect } from 'react';
import { useAllBalances } from '../hooks/useAllBalances';
import { usePrices } from '../hooks/usePrices';
import { useDenomLogos } from '../hooks/useDenomLogos';
import { useValidatorLogos } from '../hooks/useValidatorLogos';
import {
  Award,
  Coins,
  Shield,
  Clock,
  Target,
  TrendingUp,
  Eye,
  EyeOff,
  Users,
  Zap,
} from 'lucide-react';

export function Staking() {
  const all = useAllBalances();
  const { prices, loading: pricesLoading } = usePrices();
  const { getLogo: getDenomLogo } = useDenomLogos();
  const { getValidatorInfo, getValidatorLogo } = useValidatorLogos();
  const [balanceVisible, setBalanceVisible] = useState(true);
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
          <p className='text-gray-600'>Loading your staking positions...</p>
        </div>
      </div>
    );
  }

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

  // Calculate totals
  const totalStakedValue = stakingData.reduce(
    (sum, item) => sum + item.usdValue,
    0
  );
  const filteredStakedValue = filteredStakingData.reduce(
    (sum, item) => sum + item.usdValue,
    0
  );

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

  return (
    <div className='space-y-8'>
      {/* Staking Header */}
      <div className='bright-card ultra-soft-shadow rounded-xl border-0 p-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='flex items-center gap-3 text-2xl font-semibold text-gray-800'>
              <Award className='h-6 w-6 text-purple-500' />
              Staking Positions
            </h2>
            <p className='mt-2 text-lg text-gray-600'>
              Your active staking delegations with projected rewards
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
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500'>
              <TrendingUp className='h-6 w-6 text-white' />
            </div>
            <div>
              <div className='text-sm text-gray-600'>Total Staked</div>
              <div className='text-xl font-bold text-gray-800'>
                {balanceVisible ? formatCurrency(totalStakedValue) : '••••••••'}
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

        <div className='bright-card ultra-soft-shadow rounded-xl border-0 p-6'>
          <div className='flex items-center gap-3'>
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500'>
              <Shield className='h-6 w-6 text-white' />
            </div>
            <div>
              <div className='text-sm text-gray-600'>Chains</div>
              <div className='text-xl font-bold text-gray-800'>
                {new Set(stakingData.map((item) => item.chainName)).size}
              </div>
            </div>
          </div>
        </div>

        <div className='bright-card ultra-soft-shadow rounded-xl border-0 p-6'>
          <div className='flex items-center gap-3'>
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-500'>
              <Zap className='h-6 w-6 text-white' />
            </div>
            <div>
              <div className='text-sm text-gray-600'>Avg APY</div>
              <div className='text-xl font-bold text-gray-800'>15.5%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Rewards Summary */}
      <div className='bright-card ultra-soft-shadow rounded-xl border-0 p-6'>
        <h3 className='mb-6 flex items-center gap-2 text-xl font-semibold text-gray-800'>
          <Zap className='h-5 w-5 text-amber-500' />
          Rewards Summary
        </h3>
        <div className='grid gap-6 md:grid-cols-3'>
          <div className='glass-ultra-light rounded-xl p-4 text-center'>
            <div className='text-sm text-gray-600'>Monthly Rewards</div>
            <div className='text-2xl font-bold text-emerald-600'>
              {balanceVisible
                ? formatCurrency((totalStakedValue * 0.15) / 12)
                : '••••••••'}
            </div>
            <div className='text-xs text-gray-500'>Projected</div>
          </div>
          <div className='glass-ultra-light rounded-xl p-4 text-center'>
            <div className='text-sm text-gray-600'>Annual Rewards</div>
            <div className='text-2xl font-bold text-blue-600'>
              {balanceVisible
                ? formatCurrency(totalStakedValue * 0.15)
                : '••••••••'}
            </div>
            <div className='text-xs text-gray-500'>Projected</div>
          </div>
          <div className='glass-ultra-light rounded-xl p-4 text-center'>
            <div className='text-sm text-gray-600'>Total Earned</div>
            <div className='text-2xl font-bold text-purple-600'>
              {balanceVisible
                ? formatCurrency(totalStakedValue * 0.15 * 0.3)
                : '••••••••'}
            </div>
            <div className='text-xs text-gray-500'>This year</div>
          </div>
        </div>
      </div>

      {/* Chain Tabs */}
      {chainsWithStaking.length > 1 && (
        <div className='bright-card ultra-soft-shadow rounded-xl border-0 p-6'>
          <h3 className='mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800'>
            <Shield className='h-5 w-5 text-blue-500' />
            Filter by Chain
          </h3>
          <div className='flex flex-wrap gap-2'>
            <button
              onClick={() => setSelectedChain('all')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                selectedChain === 'all'
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                  : 'glass-button border-0 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Shield className='h-4 w-4' />
              All Chains
              <span className='ml-1 rounded-full bg-white/20 px-2 py-0.5 text-xs'>
                {stakingData.length}
              </span>
            </button>
            {chainsWithStaking.map((chainName) => {
              const chainStakingCount = stakingData.filter(
                (item) => item.chainName === chainName
              ).length;
              const chainStakingValue = stakingData
                .filter((item) => item.chainName === chainName)
                .reduce((sum, item) => sum + item.usdValue, 0);

              return (
                <button
                  key={chainName}
                  onClick={() => setSelectedChain(chainName)}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    selectedChain === chainName
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                      : 'glass-button border-0 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {getDenomLogo(chainName) ? (
                    <img
                      src={getDenomLogo(chainName)!}
                      alt={chainName}
                      className='h-4 w-4 rounded-full object-cover'
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback =
                          target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  ) : (
                    <div className='flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-purple-400 to-blue-400 text-xs font-bold text-white'>
                      {chainName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {chainName.charAt(0).toUpperCase() + chainName.slice(1)}
                  <span className='ml-1 rounded-full bg-white/20 px-2 py-0.5 text-xs'>
                    {chainStakingCount}
                  </span>
                  {balanceVisible && (
                    <span className='text-xs opacity-75'>
                      {formatCurrency(chainStakingValue)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Staking Positions */}
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
              {filteredStakingData.length} active
            </span>
          </div>
        </div>

        {/* Summary Cards */}
        <div className='mb-8 grid grid-cols-4 gap-3'>
          <div className='glass-ultra-light rounded-xl p-3 text-center'>
            <div className='text-xs text-gray-600'>Total Staked</div>
            <div className='text-sm font-semibold text-gray-800'>
              {balanceVisible ? formatCurrency(filteredStakedValue) : '••••••'}
            </div>
          </div>
          <div className='glass-ultra-light rounded-xl p-3 text-center'>
            <div className='text-xs text-gray-600'>Active</div>
            <div className='text-sm font-semibold text-emerald-600'>
              {filteredStakingData.length}
            </div>
          </div>
          <div className='glass-ultra-light rounded-xl p-3 text-center'>
            <div className='text-xs text-gray-600'>Chains</div>
            <div className='text-sm font-semibold text-blue-600'>
              {selectedChain === 'all'
                ? new Set(stakingData.map((item) => item.chainName)).size
                : 1}
            </div>
          </div>
          <div className='glass-ultra-light rounded-xl p-3 text-center'>
            <div className='text-xs text-gray-600'>Avg APY</div>
            <div className='text-sm font-semibold text-purple-600'>15.5%</div>
          </div>
        </div>

        {/* Individual Staking Positions */}
        <div className='space-y-4'>
          {filteredStakingData.length === 0 ? (
            <div className='glass-ultra-light rounded-xl p-8 text-center'>
              <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-gray-200 to-gray-300'>
                <Award className='h-8 w-8 text-gray-400' />
              </div>
              <h4 className='mb-2 text-lg font-semibold text-gray-700'>
                {selectedChain === 'all'
                  ? 'No Staking Positions'
                  : `No Staking Positions on ${selectedChain.charAt(0).toUpperCase() + selectedChain.slice(1)}`}
              </h4>
              <p className='text-gray-500'>
                {selectedChain === 'all'
                  ? "You don't have any active staking positions yet."
                  : `You don't have any staking positions on ${selectedChain.charAt(0).toUpperCase() + selectedChain.slice(1)} yet.`}
              </p>
              <button className='mt-4 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-2 text-white transition-all duration-200 hover:scale-105'>
                Start Staking
              </button>
            </div>
          ) : (
            filteredStakingData.map((position, index) => (
              <div
                key={index}
                className='glass-ultra-light rounded-xl p-5 transition-all duration-300 hover:scale-[1.01]'
              >
                <div className='mb-4 flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    {/* Validator Logo */}
                    <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-purple-100 to-blue-100'>
                      {getValidatorLogo(position.validatorAddress) ? (
                        <img
                          src={getValidatorLogo(position.validatorAddress)!}
                          alt={position.validatorName}
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
                      <div className='hidden h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white'>
                        <Shield className='h-4 w-4' />
                      </div>
                    </div>

                    <div>
                      <div className='text-lg font-semibold text-gray-800'>
                        {position.validatorName}
                      </div>
                      <div className='flex items-center gap-2 text-sm text-gray-600'>
                        {getDenomLogo(position.chainName) ? (
                          <img
                            src={getDenomLogo(position.chainName)!}
                            alt={position.chainName}
                            className='h-5 w-5 rounded-full object-cover'
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const fallback =
                                target.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className='hidden h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-purple-400 to-blue-400 text-xs font-bold text-white'>
                          {position.chainName.charAt(0).toUpperCase()}
                        </div>
                        {position.chainName.charAt(0).toUpperCase() +
                          position.chainName.slice(1)}
                      </div>
                    </div>
                  </div>
                  <div className='text-right'>
                    <span className='rounded-full border-0 bg-gradient-to-r from-pink-500 to-rose-500 px-3 py-1 text-sm text-white'>
                      15.2% APY
                    </span>
                    <div className='mt-1 text-xs text-gray-500'>
                      Commission: {position.validatorCommission}
                    </div>
                  </div>
                </div>

                <div className='mb-4 grid grid-cols-2 gap-4'>
                  <div>
                    <div className='flex items-center gap-1 text-sm text-gray-600'>
                      <Coins className='h-3 w-3' />
                      Staked
                    </div>
                    <div className='flex items-center gap-2'>
                      {getDenomLogo(position.symbol) && (
                        <img
                          src={getDenomLogo(position.symbol)!}
                          alt={position.symbol}
                          className='h-4 w-4 rounded-full object-cover'
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      )}
                      <div className='font-semibold text-gray-800'>
                        {balanceVisible
                          ? `${position.stakedAmount} ${position.symbol.toUpperCase()}`
                          : '••••••'}
                      </div>
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
                    <div className='text-xs text-gray-500'>Validator fee</div>
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
                          ? `${((position.stakedAmount * 0.15) / 12).toFixed(3)} ${position.symbol.toUpperCase()}`
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}
