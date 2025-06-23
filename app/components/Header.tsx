import Link from 'next/link';
import React from 'react';
import WalletConnectButton from './WalletConnectButton';

const Header = () => {
  return (
    <div className='flex h-[60px] justify-between px-5 py-4'>
      <div className='flex items-end'>
        <Link href='/'>
          <span className='text-2xl font-bold'>Stakefol.io</span>
        </Link>
        <div className='flex gap-4 px-4 pb-[1px]'>
          <Link href='/demo/'>Demo</Link>
        </div>
      </div>
      <WalletConnectButton />
    </div>
  );
};

export default Header;
