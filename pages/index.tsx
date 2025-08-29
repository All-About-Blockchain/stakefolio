import Head from 'next/head';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to portfolio page by default
    router.push('/portfolio');
  }, [router]);

  return (
    <>
      <Head>
        <title>Stakefolio - Liquid Staking Made Simple</title>
        <meta
          name='description'
          content='The simplest way to earn staking rewards across the Cosmos ecosystem'
        />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50'>
        <div className='text-center'>
          <div className='mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-purple-500'></div>
          <p className='text-gray-600'>Loading Stakefolio...</p>
        </div>
      </div>
    </>
  );
}
