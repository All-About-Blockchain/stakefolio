import AssetTable from '@/app/components/AssetTable';
import PortfolioCompositionChart from '@/app/components/PortfolioCompositionChart';
import Summary from '@/app/components/Summary';
import { useCrossReferencedAssets } from '@/app/hooks/apr';
import { Metadata } from 'next';
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

export const metadata: Metadata = {
  title: 'Stakefolio | Staking Balances and Rewards',
};

export default function Demo() {
  /*   const [aprData, setAprData] = useState([]); */
  const [coinMarketCapData, setCoinMarketCapData] = useState([]);

  /*   useEffect(() => {
    fetch('/api/stakingRewards')
      .then((response) => response.json())
      .then((data) => setAprData(data.data.assets));
  }, []); */

  useEffect(() => {
    fetch('/api/coinmarketcap')
      .then((response) => response.json())
      .then((data) => setCoinMarketCapData(data.data))
      .catch((error) => console.error('Error:', error));
  }, []);

  const assetsData = useCrossReferencedAssets(
    portfolioBalance,
    coinMarketCapData
  );

  console.log('crossReferencedAssets', assetsData);

  return (
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
  );
}
