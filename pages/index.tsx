import Head from 'next/head';
import { Dashboard } from '../app/components/Dashboard';

export default function Home() {
  return (
    <>
      <Head>
        <title>Dashboard - Stakefolio</title>
        <meta
          name='description'
          content='Track your Cosmos portfolio and learn about staking'
        />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className='container mx-auto max-w-7xl px-6 py-8'>
        <Dashboard
          onStartOnboarding={() => (window.location.href = '/onboarding')}
        />
      </div>
    </>
  );
}
