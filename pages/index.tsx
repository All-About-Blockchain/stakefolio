import PortfolioCompositionChart from '@/app/components/PortfolioCompositionChart';
import { Metadata } from 'next';

const stakedAssets = [
  { name: 'Group A', value: 400, color: '#F2CC69' },
  { name: 'Group B', value: 300, color: '#f97316' },
  { name: 'Group C', value: 300, color: '#a1f216' },
  { name: 'Group D', value: 200, color: '#16f2df' },
  { name: 'Group E', value: 278, color: '#f216f2' },
  { name: 'Group F', value: 189, color: '#bada55' },
];

export const metadata: Metadata = {
  title: 'Stakefolio | Staking Balances and Rewards',
};

export default function Home() {
  return (
    <main className='min-h-90 flex flex-col justify-between p-24'>
      Hello World.
      <div className='min-h-[400px] w-full'>
        <PortfolioCompositionChart data={stakedAssets} />
      </div>
    </main>
  );
}
