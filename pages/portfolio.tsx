import Head from 'next/head';
import { Portfolio } from '../app/components/Portfolio';

export default function PortfolioPage() {
  return (
    <>
      <Head>
        <title>Portfolio - Stakefolio</title>
        <meta
          name='description'
          content='Detailed analysis of your cryptocurrency holdings'
        />
      </Head>
      <div className='container mx-auto max-w-7xl px-6 py-8'>
        <Portfolio />
      </div>
    </>
  );
}
