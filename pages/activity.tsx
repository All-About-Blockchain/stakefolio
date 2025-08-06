import Head from 'next/head';
import { Activity } from '../app/components/Activity';

export default function ActivityPage() {
  return (
    <>
      <Head>
        <title>Activity - Stakefolio</title>
        <meta
          name='description'
          content='View your transaction history and recent activities'
        />
      </Head>
      <div className='container mx-auto max-w-7xl px-6 py-8'>
        <Activity />
      </div>
    </>
  );
}
