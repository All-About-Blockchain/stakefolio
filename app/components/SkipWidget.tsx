import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  RefreshCw,
  Settings,
  Info,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useSkipProtocol } from '../hooks/useSkipProtocol';
import { useDenomLogos } from '../hooks/useDenomLogos';
import { useAllBalances } from '../hooks/useAllBalances';

export function SkipWidget() {
  const {
    isConnected,
    isLoading,
    quotes,
    selectedQuote,
    transactions,
    error,
    connectToSkip,
    getQuote,
    executeSwap,
    getTransactionStatus,
    getSupportedTokens,
    getTokenBalance,
    setSelectedQuote,
    clearError,
    disconnect,
    availableTokens,
  } = useSkipProtocol();

  const { getLogo: getDenomLogo } = useDenomLogos();
  const { assets: walletBalances } = useAllBalances();

  const [fromToken, setFromToken] = useState<any>(null);
  const [toToken, setToToken] = useState<any>(null);
  const [amount, setAmount] = useState('');

  // Get the first connected wallet address or use a placeholder
  const userAddress =
    walletBalances.length > 0 && walletBalances[0].address
      ? walletBalances[0].address
      : 'cosmos1example...';

  // Helper function to get token icon based on symbol
  const getTokenIcon = (symbol: string) => {
    // Use the same token icon system as the portfolio
    const logo = getDenomLogo(symbol);
    if (logo) {
      return logo;
    }

    // Fallback to hardcoded icons if not found in registry
    const fallbackIcons: { [key: string]: string } = {
      ATOM: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/cosmoshub/images/atom.png',
      OSMO: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/osmo.png',
      JUNO: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/juno/images/juno.png',
      STARS:
        'https://raw.githubusercontent.com/cosmos/chain-registry/master/stargaze/images/stars.png',
      SCRT: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/secret/images/scrt.png',
      AKT: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/akash/images/akt.png',
    };
    return fallbackIcons[symbol] || fallbackIcons['ATOM'];
  };

  const connectWallet = async () => {
    try {
      await connectToSkip();
    } catch (err) {
      console.error('Failed to connect:', err);
    }
  };

  const findRoutes = async () => {
    if (!fromToken || !toToken || !amount) return;

    try {
      await getQuote(fromToken, toToken, parseFloat(amount));
    } catch (err) {
      console.error('Failed to get quote:', err);
    }
  };

  const handleExecuteSwap = async () => {
    if (!selectedQuote) return;

    try {
      await executeSwap(selectedQuote, userAddress);
      // Reset form
      setAmount('');
      setFromToken(null);
      setToToken(null);
    } catch (err) {
      console.error('Failed to execute swap:', err);
    }
  };

  useEffect(() => {
    if (fromToken && toToken && amount) {
      findRoutes();
    }
  }, [fromToken, toToken, amount]);

  if (!isConnected) {
    return (
      <div className='glass-ultra-light rounded-xl p-6'>
        <div className='mb-4 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <div className='h-6 w-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500'></div>
            <span className='font-semibold text-gray-800'>Skip Protocol</span>
          </div>
          <span className='rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600'>
            Disconnected
          </span>
        </div>

        <div className='text-center'>
          <div className='mx-auto mb-4 h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500'></div>
          <h3 className='mb-2 text-lg font-semibold text-gray-800'>
            Skip Protocol Widget
          </h3>
          <p className='mb-4 text-sm text-gray-600'>
            {walletBalances.length === 0
              ? 'Connect your wallet first to use the Skip Protocol widget'
              : 'Connect to Skip Protocol to use cross-chain swaps'}
          </p>
          <button
            onClick={connectWallet}
            disabled={isLoading || walletBalances.length === 0}
            className='rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-2 text-white transition-all duration-200 hover:shadow-lg disabled:opacity-50'
          >
            {isLoading ? (
              <div className='flex items-center gap-2'>
                <RefreshCw className='h-4 w-4 animate-spin' />
                Connecting...
              </div>
            ) : walletBalances.length === 0 ? (
              'Connect Wallet First'
            ) : (
              'Connect to Skip'
            )}
          </button>
        </div>
      </div>
    );
  }

  // Show error if any
  if (error) {
    return (
      <div className='glass-ultra-light rounded-xl p-6'>
        <div className='mb-4 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <div className='h-6 w-6 rounded-full bg-gradient-to-r from-red-500 to-pink-500'></div>
            <span className='font-semibold text-gray-800'>Skip Protocol</span>
          </div>
          <span className='rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800'>
            Error
          </span>
        </div>

        <div className='text-center'>
          <AlertCircle className='mx-auto mb-4 h-12 w-12 text-red-500' />
          <h3 className='mb-2 text-lg font-semibold text-gray-800'>
            Connection Error
          </h3>
          <p className='mb-4 text-sm text-gray-600'>{error}</p>
          <button
            onClick={clearError}
            className='rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-2 text-white transition-all duration-200 hover:shadow-lg'
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='glass-ultra-light rounded-xl p-6'>
      <div className='mb-4 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <div className='h-6 w-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500'></div>
          <span className='font-semibold text-gray-800'>Skip Protocol</span>
        </div>
        <span className='rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800'>
          Connected
        </span>
      </div>

      {/* Token Selection */}
      <div className='space-y-4'>
        {/* From Token */}
        <div>
          <label className='mb-2 block text-sm font-medium text-gray-700'>
            From
          </label>
          <div className='flex items-center gap-3'>
            <div className='flex-1'>
              <input
                type='number'
                placeholder='0.0'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className='w-full rounded-lg border-0 bg-white/50 px-4 py-3 text-lg font-bold text-gray-800 outline-none placeholder:text-gray-400'
              />
            </div>
            <div className='flex items-center gap-2'>
              {fromToken && (
                <img
                  src={getTokenIcon(fromToken.symbol)}
                  alt={fromToken.symbol}
                  className='h-6 w-6 rounded-full object-cover'
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              )}
              <select
                value={fromToken?.symbol || ''}
                onChange={(e) => {
                  const token = availableTokens.find(
                    (t) => t.symbol === e.target.value
                  );
                  setFromToken(token || null);
                }}
                className='rounded-lg border-0 bg-white/50 px-4 py-3 text-lg font-semibold text-gray-800 outline-none'
              >
                <option value=''>Select Token</option>
                {availableTokens.map((token) => (
                  <option key={token.symbol} value={token.symbol}>
                    {token.symbol} - {token.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {fromToken && (
            <div className='mt-2 text-sm text-gray-500'>
              Balance:{' '}
              {(() => {
                const balance = walletBalances
                  .flatMap((chain) => chain.balances)
                  .find((b) => b.symbol.toUpperCase() === fromToken.symbol);
                return balance
                  ? `${parseFloat(balance.displayAmount).toFixed(2)} ${fromToken.symbol}`
                  : '0.00';
              })()}{' '}
              {fromToken.symbol}
            </div>
          )}
        </div>

        {/* Switch Button */}
        <div className='flex justify-center'>
          <button className='glass-button flex h-10 w-10 items-center justify-center rounded-full border-0'>
            <ArrowRight className='h-5 w-5' />
          </button>
        </div>

        {/* To Token */}
        <div>
          <label className='mb-2 block text-sm font-medium text-gray-700'>
            To
          </label>
          <div className='flex items-center gap-3'>
            <div className='flex-1'>
              <input
                type='number'
                placeholder='0.0'
                value={
                  selectedQuote
                    ? (
                        parseFloat(selectedQuote.estimatedAmountOut) / 1000000
                      ).toFixed(4)
                    : ''
                }
                readOnly
                className='w-full rounded-lg border-0 bg-white/50 px-4 py-3 text-lg font-bold text-gray-800 outline-none placeholder:text-gray-400'
              />
            </div>
            <div className='flex items-center gap-2'>
              {toToken && (
                <img
                  src={getTokenIcon(toToken.symbol)}
                  alt={toToken.symbol}
                  className='h-6 w-6 rounded-full object-cover'
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              )}
              <select
                value={toToken?.symbol || ''}
                onChange={(e) => {
                  const token = availableTokens.find(
                    (t) => t.symbol === e.target.value
                  );
                  setToToken(token || null);
                }}
                className='rounded-lg border-0 bg-white/50 px-4 py-3 text-lg font-semibold text-gray-800 outline-none'
              >
                <option value=''>Select Token</option>
                {availableTokens.map((token) => (
                  <option key={token.symbol} value={token.symbol}>
                    {token.symbol} - {token.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Routes */}
      {quotes.length > 0 && (
        <div className='mt-6'>
          <h4 className='mb-3 text-sm font-medium text-gray-700'>
            Available Routes
          </h4>
          <div className='space-y-2'>
            {quotes.map((quote, index) => (
              <div
                key={index}
                onClick={() => setSelectedQuote(quote)}
                className={`cursor-pointer rounded-lg border-2 p-3 transition-all duration-200 ${
                  selectedQuote === quote
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 bg-white/50 hover:border-gray-300'
                }`}
              >
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <div className='flex items-center gap-1'>
                      {quote.chainIDs.map(
                        (chain: string, chainIndex: number) => (
                          <div key={chainIndex} className='flex items-center'>
                            <span className='text-xs font-medium text-gray-600'>
                              {chain}
                            </span>
                            {chainIndex < quote.chainIDs.length - 1 && (
                              <ArrowRight className='mx-1 h-3 w-3 text-gray-400' />
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                  <div className='text-right'>
                    <div className='text-sm font-semibold text-gray-800'>
                      {(parseFloat(quote.estimatedAmountOut) / 1000000).toFixed(
                        4
                      )}{' '}
                      {toToken?.symbol}
                    </div>
                    <div className='text-xs text-gray-500'>
                      Fee: ${parseFloat(quote.estimatedGasUSD)} •{' '}
                      {quote.estimatedTime}s
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Swap Details */}
      {selectedQuote && (
        <div className='mt-6 space-y-3'>
          <div className='flex justify-between text-sm'>
            <span className='text-gray-600'>Exchange Rate</span>
            <span className='font-medium'>
              1 {fromToken?.symbol} ={' '}
              {(
                parseFloat(selectedQuote.estimatedAmountOut) /
                parseFloat(selectedQuote.amountIn)
              ).toFixed(4)}{' '}
              {toToken?.symbol}
            </span>
          </div>
          <div className='flex justify-between text-sm'>
            <span className='text-gray-600'>Network Fee</span>
            <span className='font-medium'>
              ${parseFloat(selectedQuote.estimatedGasUSD)}
            </span>
          </div>
          <div className='flex justify-between text-sm'>
            <span className='text-gray-600'>Estimated Time</span>
            <span className='font-medium'>
              {selectedQuote.estimatedTime} seconds
            </span>
          </div>
        </div>
      )}

      {/* Swap Button */}
      {selectedQuote && (
        <button
          onClick={handleExecuteSwap}
          disabled={isLoading}
          className='mt-6 w-full rounded-lg border-0 bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl disabled:opacity-50'
        >
          {isLoading ? (
            <div className='flex items-center justify-center gap-2'>
              <RefreshCw className='h-5 w-5 animate-spin' />
              Executing Swap...
            </div>
          ) : (
            'Execute Swap'
          )}
        </button>
      )}

      {/* Skip Protocol Info */}
      <div className='mt-6 space-y-2'>
        <div className='flex items-center gap-2 text-sm text-gray-600'>
          <CheckCircle className='h-4 w-4 text-green-500' />
          Best routes across 50+ chains
        </div>
        <div className='flex items-center gap-2 text-sm text-gray-600'>
          <CheckCircle className='h-4 w-4 text-green-500' />
          Lowest fees and slippage
        </div>
        <div className='flex items-center gap-2 text-sm text-gray-600'>
          <CheckCircle className='h-4 w-4 text-green-500' />
          Instant cross-chain transfers
        </div>
      </div>
    </div>
  );
}
