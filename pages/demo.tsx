import AssetTable from '@/app/components/AssetTable';
import PortfolioCompositionChart from '@/app/components/PortfolioCompositionChart';
import Summary from '@/app/components/Summary';
import { useCrossReferencedAssets } from '@/app/hooks/apr';
import { Metadata } from 'next';
import { useEffect, useState } from 'react';

const portfolioValue = 100000;

export const portfolioBalance = [
  { symbol: 'ATOM', balance: 40, color: '#F2CC69' },
  { symbol: 'INJ', balance: 300, color: '#f97316' },
  { symbol: 'TIA', balance: 200, color: '#16f2df' },
];

export const metadata: Metadata = {
  title: 'Stakefolio | Staking Balances and Rewards',
};

export default function Demo() {
  const [aprData, setAprData] = useState([]);
  const [coinMarketCapData, setCoinMarketCapData] = useState([]);

  console.log('setAprData', setAprData);

  useEffect(() => {
    fetch('/api/stakingRewards')
      .then((response) => response.json())
      .then((data) => setAprData(data.data.assets));
  }, []);

  useEffect(() => {
    fetch('/api/coinmarketcap')
      .then((response) => response.json())
      .then((data) => setCoinMarketCapData(data.data))
      .catch((error) => console.error('Error:', error));
  }, []);

  const assetsData = useCrossReferencedAssets(
    portfolioBalance,
    aprData,
    coinMarketCapData
  );

  console.log('crossReferencedAssets', assetsData);

  return (
    <main className='min-h-90 grid w-full grid-cols-1 justify-between p-24'>
      <div>Summary</div>
      <Summary data={assetsData} />
      <div className='min-h-[400px] w-full'>
        <PortfolioCompositionChart data={portfolioBalance} />
      </div>
      <div>
        <AssetTable assets={assetsData} />
      </div>
    </main>
  );
}
