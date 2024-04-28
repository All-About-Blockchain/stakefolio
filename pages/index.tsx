import AssetTable from '@/app/components/AssetTable';
import PortfolioCompositionChart from '@/app/components/PortfolioCompositionChart';
import { useCrossReferencedAssets } from '@/app/hooks/apr';
import { Asset } from '@/app/types';
import { Metadata } from 'next';
import { useEffect, useState } from 'react';

const portfolioBalance = [
  { symbol: 'ATOM', balance: 40, color: '#F2CC69' },
  { symbol: 'INJ', balance: 300, color: '#f97316' },
  { symbol: 'OSMO', balance: 600, color: '#a1f216' },
  { symbol: 'TIA', balance: 200, color: '#16f2df' },
  { symbol: 'JUNO', balance: 278, color: '#f216f2' },
  { symbol: 'DYM', balance: 189, color: '#bada55' },
];

export const metadata: Metadata = {
  title: 'Stakefolio | Staking Balances and Rewards',
};

export default function Home() {
  const [aprData, setAprData] = useState([]);
  const [oracleData, setOracleData] = useState([]);

  useEffect(() => {
    fetch('/api/stakingRewards')
      .then((response) => response.json())
      .then((data) => setAprData(data.data.assets));
  }, []);

  console.log('aprData', aprData);

  const crossReferencedAssets = useCrossReferencedAssets(
    portfolioBalance,
    aprData
  );

  console.log('crossReferencedAssets', crossReferencedAssets);

  useEffect(() => {
    fetch('/api/pyth')
      .then((response) => response.json())
      .then((data) => setOracleData(data));
  }, []);

  console.log('oracleData', oracleData);

  return (
    <main className='min-h-90 grid w-full grid-cols-2 justify-between p-24'>
      <div>Summary</div>
      <div className='min-h-[400px] w-full'>
        <PortfolioCompositionChart data={portfolioBalance} />
      </div>
      <div>
        <AssetTable assets={crossReferencedAssets} />
      </div>
    </main>
  );
}
