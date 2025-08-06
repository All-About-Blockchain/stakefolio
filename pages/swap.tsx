import Head from 'next/head';
import { useState } from 'react';
import { ArrowRight, RefreshCw, Settings, Info } from 'lucide-react';
import { SkipWidget } from '../app/components/SkipWidget';
import { useDenomLogos } from '../app/hooks/useDenomLogos';
import { useAllBalances } from '../app/hooks/useAllBalances';

export default function SwapPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [fromToken, setFromToken] = useState('ATOM');
  const [toToken, setToToken] = useState('OSMO');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');

  const { getLogo: getDenomLogo } = useDenomLogos();
  const { assets: walletBalances } = useAllBalances();

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

  const handleSwap = () => {
    setIsLoading(true);
    // Simulate swap process
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const handleSwitchTokens = () => {
    const tempToken = fromToken;
    const tempAmount = fromAmount;
    setFromToken(toToken);
    setToToken(tempToken);
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };

  return (
    <>
      <Head>
        <title>Swap - Stakefolio</title>
        <meta
          name='description'
          content='Swap tokens across Cosmos chains with Skip Protocol'
        />
      </Head>
      <div className='container mx-auto max-w-7xl px-6 py-8'>
        <div className='space-y-8'>
          {/* Swap Header */}
          <div className='bright-card ultra-soft-shadow rounded-xl border-0 p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <h1 className='flex items-center gap-3 text-3xl font-bold text-gray-800'>
                  <ArrowRight className='h-8 w-8 text-purple-500' />
                  Swap Tokens
                </h1>
                <p className='mt-2 text-lg text-gray-600'>
                  Swap tokens across Cosmos chains with Skip Protocol
                </p>
              </div>
              <div className='flex items-center gap-3'>
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
          </div>

          {/* Swap Interface */}
          <div className='grid gap-8 lg:grid-cols-2'>
            {/* Manual Swap Interface */}
            <div className='bright-card ultra-soft-shadow rounded-xl border-0 p-6'>
              <h2 className='mb-6 flex items-center gap-2 text-xl font-semibold text-gray-800'>
                <ArrowRight className='h-5 w-5 text-purple-500' />
                Manual Swap
              </h2>

              {/* From Token */}
              <div className='mb-6'>
                <label className='mb-2 block text-sm font-medium text-gray-700'>
                  From
                </label>
                <div className='glass-ultra-light rounded-xl p-4'>
                  <div className='flex items-center justify-between'>
                    <input
                      type='number'
                      placeholder='0.0'
                      value={fromAmount}
                      onChange={(e) => setFromAmount(e.target.value)}
                      className='flex-1 bg-transparent text-2xl font-bold text-gray-800 outline-none placeholder:text-gray-400'
                    />
                    <div className='flex items-center gap-2'>
                      <img
                        src={getTokenIcon(fromToken)}
                        alt={fromToken}
                        className='h-8 w-8 rounded-full object-cover'
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback =
                            target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                      <div className='flex hidden h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500'>
                        <span className='text-sm font-bold text-white'>
                          {fromToken.charAt(0)}
                        </span>
                      </div>
                      <select
                        value={fromToken}
                        onChange={(e) => setFromToken(e.target.value)}
                        className='bg-transparent text-lg font-semibold text-gray-800 outline-none'
                      >
                        <option value='ATOM'>ATOM</option>
                        <option value='OSMO'>OSMO</option>
                        <option value='JUNO'>JUNO</option>
                        <option value='STARS'>STARS</option>
                        <option value='SCRT'>SCRT</option>
                        <option value='AKT'>AKT</option>
                      </select>
                    </div>
                  </div>
                  <div className='mt-2 text-sm text-gray-500'>
                    Balance:{' '}
                    {(() => {
                      const balance = walletBalances
                        .flatMap((chain) => chain.balances)
                        .find((b) => b.symbol.toUpperCase() === fromToken);
                      return balance
                        ? `${parseFloat(balance.displayAmount).toFixed(2)} ${fromToken}`
                        : '0.00 ATOM';
                    })()}
                  </div>
                </div>
              </div>

              {/* Switch Button */}
              <div className='mb-6 flex justify-center'>
                <button
                  onClick={handleSwitchTokens}
                  className='glass-button flex h-10 w-10 items-center justify-center rounded-full border-0'
                >
                  <ArrowRight className='h-5 w-5' />
                </button>
              </div>

              {/* To Token */}
              <div className='mb-6'>
                <label className='mb-2 block text-sm font-medium text-gray-700'>
                  To
                </label>
                <div className='glass-ultra-light rounded-xl p-4'>
                  <div className='flex items-center justify-between'>
                    <input
                      type='number'
                      placeholder='0.0'
                      value={toAmount}
                      onChange={(e) => setToAmount(e.target.value)}
                      className='flex-1 bg-transparent text-2xl font-bold text-gray-800 outline-none placeholder:text-gray-400'
                    />
                    <div className='flex items-center gap-2'>
                      <img
                        src={getTokenIcon(toToken)}
                        alt={toToken}
                        className='h-8 w-8 rounded-full object-cover'
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback =
                            target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                      <div className='flex hidden h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500'>
                        <span className='text-sm font-bold text-white'>
                          {toToken.charAt(0)}
                        </span>
                      </div>
                      <select
                        value={toToken}
                        onChange={(e) => setToToken(e.target.value)}
                        className='bg-transparent text-lg font-semibold text-gray-800 outline-none'
                      >
                        <option value='OSMO'>OSMO</option>
                        <option value='ATOM'>ATOM</option>
                        <option value='JUNO'>JUNO</option>
                        <option value='STARS'>STARS</option>
                        <option value='SCRT'>SCRT</option>
                        <option value='AKT'>AKT</option>
                      </select>
                    </div>
                  </div>
                  <div className='mt-2 text-sm text-gray-500'>
                    You will receive: ~
                    {(() => {
                      const balance = walletBalances
                        .flatMap((chain) => chain.balances)
                        .find((b) => b.symbol.toUpperCase() === toToken);
                      return balance
                        ? `${parseFloat(balance.displayAmount).toFixed(2)} ${toToken}`
                        : '0.00 OSMO';
                    })()}
                  </div>
                </div>
              </div>

              {/* Swap Details */}
              <div className='mb-6 space-y-3'>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-600'>Exchange Rate</span>
                  <span className='font-medium'>1 ATOM = 1.234 OSMO</span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-600'>Slippage</span>
                  <span className='font-medium'>0.5%</span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-600'>Network Fee</span>
                  <span className='font-medium'>~$0.50</span>
                </div>
              </div>

              {/* Swap Button */}
              <button
                onClick={handleSwap}
                disabled={isLoading || !fromAmount || !toAmount}
                className='w-full rounded-lg border-0 bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50'
              >
                {isLoading ? (
                  <div className='flex items-center justify-center gap-2'>
                    <RefreshCw className='h-5 w-5 animate-spin' />
                    Swapping...
                  </div>
                ) : (
                  'Swap Tokens'
                )}
              </button>
            </div>

            {/* Skip.go Widget Integration */}
            <div className='bright-card ultra-soft-shadow rounded-xl border-0 p-6'>
              <h2 className='mb-6 flex items-center gap-2 text-xl font-semibold text-gray-800'>
                <Info className='h-5 w-5 text-blue-500' />
                Skip Protocol Widget
              </h2>

              <div className='mb-4'>
                <p className='text-gray-600'>
                  Use Skip Protocol for seamless cross-chain swaps with the best
                  routes and lowest fees.
                </p>
              </div>

              {/* Skip Widget Component */}
              <SkipWidget />
            </div>
          </div>

          {/* Recent Swaps */}
          <div className='bright-card ultra-soft-shadow rounded-xl border-0 p-6'>
            <h2 className='mb-6 flex items-center gap-2 text-xl font-semibold text-gray-800'>
              <RefreshCw className='h-5 w-5 text-gray-500' />
              Recent Swaps
            </h2>

            <div className='space-y-3'>
              <div className='glass-ultra-light rounded-lg p-4'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className='flex items-center gap-2'>
                      <div className='flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500'>
                        <span className='text-sm font-bold text-white'>A</span>
                      </div>
                      <ArrowRight className='h-4 w-4 text-gray-400' />
                      <div className='flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500'>
                        <span className='text-sm font-bold text-white'>O</span>
                      </div>
                    </div>
                    <div>
                      <div className='font-semibold text-gray-800'>
                        ATOM → OSMO
                      </div>
                      <div className='text-sm text-gray-500'>2 hours ago</div>
                    </div>
                  </div>
                  <div className='text-right'>
                    <div className='font-semibold text-gray-800'>
                      +1,234.56 OSMO
                    </div>
                    <div className='text-sm text-green-600'>Completed</div>
                  </div>
                </div>
              </div>

              <div className='glass-ultra-light rounded-lg p-4'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className='flex items-center gap-2'>
                      <div className='flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500'>
                        <span className='text-sm font-bold text-white'>O</span>
                      </div>
                      <ArrowRight className='h-4 w-4 text-gray-400' />
                      <div className='flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-500'>
                        <span className='text-sm font-bold text-white'>J</span>
                      </div>
                    </div>
                    <div>
                      <div className='font-semibold text-gray-800'>
                        OSMO → JUNO
                      </div>
                      <div className='text-sm text-gray-500'>1 day ago</div>
                    </div>
                  </div>
                  <div className='text-right'>
                    <div className='font-semibold text-gray-800'>
                      +567.89 JUNO
                    </div>
                    <div className='text-sm text-green-600'>Completed</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
