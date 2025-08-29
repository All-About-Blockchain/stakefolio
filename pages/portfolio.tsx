import Head from 'next/head';
import { Portfolio } from '../app/components/Portfolio';
import { Header } from '../app/components/Header';

export default function PortfolioPage() {
  return (
    <>
      <Head>
        <title>Portfolio - Stakefolio</title>
        <meta
          name='description'
          content='Your liquid staking portfolio on CosmosHub'
        />
      </Head>
      <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50'>
        <Header />
        <div className='container mx-auto max-w-7xl px-6 py-8'>
          <Portfolio />
        </div>
      </div>
    </>
  );
}
