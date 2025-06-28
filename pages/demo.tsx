import AssetTable from '@/app/components/AssetTable';
import PortfolioCompositionChart from '@/app/components/PortfolioCompositionChart';
import Summary from '@/app/components/Summary';
import { useCrossReferencedAssets } from '@/app/hooks/apr';
import Head from 'next/head';
import { useEffect, useState } from 'react';

const portfolioValue = 100000;

export const portfolioBalance = [
  {
    symbol: 'ATOM',
    balance: 8000,
    color: '#36374c',
    apr: 16.99,
    chain: 'Cosmos Hub',
  },
  {
    symbol: 'INJ',
    balance: 1200,
    color: '#54b0f5',
    apr: 15.31,
    chain: 'Injective',
  },
  {
    symbol: 'TIA',
    balance: 4000,
    color: '#7130f0',
    apr: 11.48,
    chain: 'Celestia',
  },
];

interface PriceData {
  symbol: string;
  quote: {
    USD: {
      price: number;
    };
  };
}

export default function Demo() {
  const [coinMarketCapData, setCoinMarketCapData] = useState<PriceData[]>([]);

  useEffect(() => {
    fetch('http://localhost:4000/prices')
      .then((response) => response.json())
      .then((data) => {
        // Adapt backend data to expected format
        const adapted = Object.entries(data).map(
          ([symbol, priceData]: [string, any]) => ({
            symbol: symbol.toUpperCase(),
            quote: { USD: { price: priceData.usd } },
          })
        );
        setCoinMarketCapData(adapted);
      })
      .catch((error) => console.error('Error:', error));
  }, []);

  const assetsData = useCrossReferencedAssets(
    portfolioBalance,
    coinMarketCapData
  );

  console.log('crossReferencedAssets', assetsData);

  return (
    <>
      <Head>
        <title>Stakefolio | Staking Balances and Rewards</title>
      </Head>
      <main className='min-h-90 grid w-full grid-cols-1 justify-between'>
        <div className='p-12'>
          <Summary data={assetsData} />
        </div>
        <div className='w-full'>
          <PortfolioCompositionChart data={assetsData} />
        </div>
        <div className='p-8'>
          <AssetTable assets={assetsData} />
        </div>
      </main>
    </>
  );
}
