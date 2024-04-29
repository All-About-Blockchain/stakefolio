import Link from 'next/link';
import React from 'react';

const index = () => {
  return (
    <div className='flex flex-col gap-8 p-8 px-12'>
      <div className='flex flex-col gap-2'>
        <Link target='_blank' href='/stakefolio_staking_walkthrough.pdf'>
          Staking Walkthrough
        </Link>
        <Link target='_blank' href='https://www.keplr.app/'>
          Keplr
        </Link>
        <Link target='_blank' href='https://www.leapwallet.io/'>
          Leap
        </Link>
        <Link target='_blank' href='https://www.kado.money/'>
          Kado
        </Link>
      </div>
    </div>
  );
};

export default index;
