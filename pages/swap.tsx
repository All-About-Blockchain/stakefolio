import Head from 'next/head';
import { useState, useEffect, useCallback } from 'react';
import {
  ArrowRight,
  RefreshCw,
  Settings,
  Info,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { LIQUID_STAKING_TOKENS } from '../app/config/chains';
import { useAllBalances } from '../app/hooks/useAllBalances';
import { usePrices } from '../app/hooks/usePrices';
import { useWallet } from '../app/contexts/WalletContext';

export default function SwapPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [fromToken, setFromToken] = useState('ATOM');
  const [toToken, setToToken] = useState('stATOM');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [slippage, setSlippage] = useState(0.5);

  const { address } = useWallet();
  const { assets: walletBalances } = useAllBalances();
  const { getUSDPrice } = usePrices();

  // Get available liquid staking tokens
  const availableTokens = Object.values(LIQUID_STAKING_TOKENS);

  // Calculate swap rate (simplified - in reality this would come from DEX)
  const calculateSwapRate = useCallback(
    (from: string, to: string, amount: number) => {
      if (!amount || amount <= 0) return 0;

      // Get token info
      const toTokenInfo = availableTokens.find((t) => t.symbol === to);

      if (!toTokenInfo) return 0;

      // Simple 1:1 conversion with small fee
      const fee = 0.003; // 0.3% fee
      return amount * (1 - fee);
    },
    [availableTokens]
  );

  // Update to amount when from amount changes
  useEffect(() => {
    if (fromAmount && parseFloat(fromAmount) > 0) {
      const rate = calculateSwapRate(
        fromToken,
        toToken,
        parseFloat(fromAmount)
      );
      setToAmount(rate.toFixed(6));
    } else {
      setToAmount('');
    }
  }, [calculateSwapRate, fromAmount, fromToken, toToken]);

  const handleSwap = async () => {
    if (!address) {
      alert('Please connect your wallet first');
      return;
    }

    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate swap process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In reality, this would:
      // 1. Check if user has enough ATOM
      // 2. Execute the swap through Stride protocol
      // 3. Update balances

      alert('Swap completed successfully!');
      setFromAmount('');
      setToAmount('');
    } catch (error) {
      alert('Swap failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchTokens = () => {
    const tempToken = fromToken;
    const tempAmount = fromAmount;
    setFromToken(toToken);
    setToToken(tempToken);
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };

  const getTokenLogo = (symbol: string) => {
    if (symbol === 'ATOM') {
      return 'https://raw.githubusercontent.com/cosmos/chain-registry/master/cosmoshub/images/atom.png';
    }
    const token = availableTokens.find((t) => t.symbol === symbol);
    return token?.logo || '';
  };

  const getTokenAPR = (symbol: string) => {
    if (symbol === 'ATOM') return 0;
    const token = availableTokens.find((t) => t.symbol === symbol);
    return token?.apr || 0;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <>
      <Head>
        <title>Swap - Stakefolio</title>
        <meta
          name='description'
          content='Swap between liquid staking tokens on CosmosHub'
        />
      </Head>
      <div className='container mx-auto max-w-4xl px-6 py-8'>
        <div className='space-y-8'>
          {/* Header */}
          <div className='text-center'>
            <h1 className='flex items-center justify-center gap-3 text-3xl font-bold text-gray-800'>
              <Zap className='h-8 w-8 text-purple-500' />
              Liquid Staking Swap
            </h1>
            <p className='mt-2 text-lg text-gray-600'>
              Swap between staked assets to optimize your portfolio returns
            </p>
          </div>

          {/* Swap Interface */}
          <div className='bright-card ultra-soft-shadow rounded-xl border-0 p-8'>
            {/* From Token */}
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <label className='text-sm font-medium text-gray-700'>
                  From
                </label>
                <div className='text-sm text-gray-500'>
                  Balance:{' '}
                  {walletBalances
                    .find((b) => b.chainName === 'cosmoshub')
                    ?.balances.find((b) => b.symbol === fromToken)
                    ?.displayAmount || '0'}{' '}
                  {fromToken}
                </div>
              </div>

              <div className='flex items-center gap-4 rounded-xl border border-gray-200 p-4'>
                <div className='flex items-center gap-3'>
                  <img
                    src={getTokenLogo(fromToken)}
                    alt={fromToken}
                    className='h-10 w-10 rounded-full'
                  />
                  <div>
                    <div className='font-semibold text-gray-800'>
                      {fromToken}
                    </div>
                    <div className='text-sm text-gray-500'>
                      {fromToken === 'ATOM' ? 'Cosmos Hub' : 'Liquid Staked'}
                    </div>
                  </div>
                </div>

                <select
                  value={fromToken}
                  onChange={(e) => setFromToken(e.target.value)}
                  className='ml-auto rounded-lg border border-gray-300 px-3 py-2 focus:border-purple-500 focus:outline-none'
                >
                  <option value='ATOM'>ATOM</option>
                  {availableTokens.map((token) => (
                    <option key={token.symbol} value={token.symbol}>
                      {token.symbol}
                    </option>
                  ))}
                </select>
              </div>

              <input
                type='number'
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                placeholder='0.0'
                className='w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-purple-500 focus:outline-none'
              />
            </div>

            {/* Switch Button */}
            <div className='flex justify-center py-4'>
              <button
                onClick={handleSwitchTokens}
                className='flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 hover:border-purple-500 hover:text-purple-500'
              >
                <ArrowRight className='h-5 w-5 rotate-90' />
              </button>
            </div>

            {/* To Token */}
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <label className='text-sm font-medium text-gray-700'>To</label>
                <div className='flex items-center gap-2 text-sm text-gray-500'>
                  <TrendingUp className='h-4 w-4' />
                  APR: {(getTokenAPR(toToken) * 100).toFixed(1)}%
                </div>
              </div>

              <div className='flex items-center gap-4 rounded-xl border border-gray-200 p-4'>
                <div className='flex items-center gap-3'>
                  <img
                    src={getTokenLogo(toToken)}
                    alt={toToken}
                    className='h-10 w-10 rounded-full'
                  />
                  <div>
                    <div className='font-semibold text-gray-800'>{toToken}</div>
                    <div className='text-sm text-gray-500'>
                      {toToken === 'ATOM' ? 'Cosmos Hub' : 'Liquid Staked'}
                    </div>
                  </div>
                </div>

                <select
                  value={toToken}
                  onChange={(e) => setToToken(e.target.value)}
                  className='ml-auto rounded-lg border border-gray-300 px-3 py-2 focus:border-purple-500 focus:outline-none'
                >
                  <option value='stATOM'>stATOM</option>
                  <option value='ATOM'>ATOM</option>
                  {availableTokens
                    .filter((t) => t.symbol !== 'stATOM')
                    .map((token) => (
                      <option key={token.symbol} value={token.symbol}>
                        {token.symbol}
                      </option>
                    ))}
                </select>
              </div>

              <input
                type='number'
                value={toAmount}
                onChange={(e) => setToAmount(e.target.value)}
                placeholder='0.0'
                className='w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-purple-500 focus:outline-none'
                readOnly
              />
            </div>

            {/* Swap Details */}
            {fromAmount && parseFloat(fromAmount) > 0 && (
              <div className='mt-6 space-y-3 rounded-lg bg-gray-50 p-4'>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-gray-600'>Rate</span>
                  <span className='font-medium'>
                    1 {fromToken} ={' '}
                    {(parseFloat(toAmount) / parseFloat(fromAmount)).toFixed(6)}{' '}
                    {toToken}
                  </span>
                </div>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-gray-600'>Fee</span>
                  <span className='font-medium'>0.3%</span>
                </div>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-gray-600'>Slippage</span>
                  <span className='font-medium'>{slippage}%</span>
                </div>
                {getTokenAPR(toToken) > 0 && (
                  <div className='flex items-center justify-between text-sm'>
                    <span className='text-gray-600'>Expected APR</span>
                    <span className='font-medium text-emerald-600'>
                      {(getTokenAPR(toToken) * 100).toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Swap Button */}
            <button
              onClick={handleSwap}
              disabled={
                isLoading ||
                !address ||
                !fromAmount ||
                parseFloat(fromAmount) <= 0
              }
              className={`mt-6 w-full rounded-lg px-6 py-4 text-lg font-semibold text-white transition-all ${
                isLoading ||
                !address ||
                !fromAmount ||
                parseFloat(fromAmount) <= 0
                  ? 'cursor-not-allowed bg-gray-300'
                  : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:scale-105 hover:shadow-lg'
              }`}
            >
              {isLoading ? (
                <div className='flex items-center justify-center gap-2'>
                  <RefreshCw className='h-5 w-5 animate-spin' />
                  Swapping...
                </div>
              ) : !address ? (
                'Connect Wallet'
              ) : (
                'Swap Tokens'
              )}
            </button>
          </div>

          {/* Available Assets */}
          <div className='bright-card ultra-soft-shadow rounded-xl border-0 p-6'>
            <h3 className='mb-4 text-xl font-semibold text-gray-800'>
              Available Liquid Staking Assets
            </h3>
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
              {availableTokens.map((token) => (
                <div
                  key={token.symbol}
                  className='flex items-center gap-3 rounded-lg border border-gray-200 p-4'
                >
                  <img
                    src={token.logo}
                    alt={token.symbol}
                    className='h-10 w-10 rounded-full'
                  />
                  <div className='flex-1'>
                    <div className='font-semibold text-gray-800'>
                      {token.symbol}
                    </div>
                    <div className='text-sm text-gray-500'>{token.name}</div>
                  </div>
                  <div className='text-right'>
                    <div className='text-sm font-medium text-emerald-600'>
                      {(token.apr * 100).toFixed(1)}% APR
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
