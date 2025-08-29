import Head from 'next/head';
import { useState } from 'react';
import { ArrowRight, RefreshCw, Settings, Info } from 'lucide-react';
import { SkipGoWidget } from '../app/components/SkipGoWidget';
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
          {/* Swap Interface */}
          <div className='grid gap-8'>
            {/* Skip Go Widget Integration */}
            <div className='bright-card ultra-soft-shadow m-auto mt-20 rounded-xl border-0 p-6'>
              <h1 className='flex items-center gap-3 text-3xl font-bold text-gray-800'>
                <ArrowRight className='h-8 w-8 text-purple-500' />
                Swap Tokens
              </h1>
              <p className='mt-2 text-lg text-gray-600'>
                Swap tokens across Cosmos chains with Skip Protocol
              </p>

              {/* Skip Widget Component */}
              <SkipGoWidget />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
