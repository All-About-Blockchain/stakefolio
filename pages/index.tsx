import { AllBalancesList } from '@/app/components/AllBalancesList';
import Head from 'next/head';

const index = () => {
  return (
    <>
      <Head>
        <title>Stakefolio | Portfolio Dashboard</title>
      </Head>
      <div className='flex flex-col gap-8 p-8 px-12'>
        <AllBalancesList />
      </div>
    </>
  );
};

export default index;
