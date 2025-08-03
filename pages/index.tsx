import Head from 'next/head';
import App from '../app/components/App';

export default function Home() {
  return (
    <>
      <Head>
        <title>Stakefolio - Cosmos Portfolio & Staking Guide</title>
        <meta
          name='description'
          content='Track your Cosmos portfolio and learn about staking'
        />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <App />
    </>
  );
}
