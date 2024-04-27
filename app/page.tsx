import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Stakefolio | Staking Balances and Rewards',
};

export default function Home() {
  return (
    <main className='min-h-100 flex flex-col justify-between p-24'>
      <span>Hello world.</span>
    </main>
  );
}
