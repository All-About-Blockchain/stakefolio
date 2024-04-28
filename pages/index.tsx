import AssetTable from '@/app/components/AssetTable';
import PortfolioCompositionChart from '@/app/components/PortfolioCompositionChart';
import { useCrossReferencedAssets } from '@/app/hooks/apr';
import { Metadata } from 'next';
import { useEffect, useState } from 'react';

export const portfolioBalance = [
  { symbol: 'ATOM', balance: 40, color: '#F2CC69' },
  { symbol: 'INJ', balance: 300, color: '#f97316' },
  { symbol: 'TIA', balance: 200, color: '#16f2df' },
];

export const metadata: Metadata = {
  title: 'Stakefolio | Staking Balances and Rewards',
};

export default function Index() {
  const [aprData, setAprData] = useState([]);
  const [coinMarketCapData, setCoinMarketCapData] = useState([]);

  useEffect(() => {
    fetch('/api/stakingRewards')
      .then((response) => response.json())
      .then((data) => setAprData(data.data.assets));
  }, []);

  console.log('aprData', aprData);

  useEffect(() => {
    fetch('/api/coinmarketcap')
      .then((response) => response.json())
      .then((data) => setCoinMarketCapData(data.data))
      .catch((error) => console.error('Error:', error));
  }, []);

  console.log('coinMarketCapData', coinMarketCapData);

  const assetData = useCrossReferencedAssets(
    portfolioBalance,
    aprData,
    coinMarketCapData
  );

  console.log('crossReferencedAssets', assetData);

  return (
    <main className='min-h-90 grid w-full grid-cols-2 justify-between p-24'>
      <div>Summary</div>
      <div className='min-h-[400px] w-full'>
        <PortfolioCompositionChart data={portfolioBalance} />
      </div>
      <div>
        <AssetTable assets={assetData} />
      </div>
    </main>
  );
}
