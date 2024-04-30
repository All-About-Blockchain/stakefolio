import Link from 'next/link';
import React from 'react';

const Header = () => {
  return (
    <div className='flex h-[60px] items-end px-5 py-4'>
      <Link href='/'>
        <span className='text-2xl font-bold'>Stakefol.io</span>
      </Link>
      <div className='flex gap-4 px-4 pb-[1px]'>
        <Link href='/demo/'>Demo</Link>
      </div>
    </div>
  );
};

export default Header;
