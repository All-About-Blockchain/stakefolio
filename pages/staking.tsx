import Head from 'next/head';
import { Staking } from '../app/components/Staking';

export default function StakingPage() {
  return (
    <>
      <Head>
        <title>Staking - Stakefolio</title>
        <meta
          name='description'
          content='Manage your staking positions and track rewards'
        />
      </Head>
      <div className='container mx-auto max-w-7xl px-6 py-8'>
        <Staking />
      </div>
    </>
  );
}
