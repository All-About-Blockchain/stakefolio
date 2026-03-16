import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import WalletConnectButton from './WalletConnectButton';

const Header = () => {
  const router = useRouter();
  const currentPath = router.pathname;

  const isActive = (path: string) => {
    if (path === '/' && currentPath === '/') return true;
    if (path !== '/' && currentPath.startsWith(path)) return true;
    return false;
  };

  const navLinkClass = (path: string) => {
    const active = isActive(path);
    return `flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
      active
        ? 'bg-black text-white shadow-md'
        : 'text-gray-500 hover:bg-gray-100 hover:text-black'
    }`;
  };

  return (
    <div className='sticky top-0 z-40 flex h-[80px] items-center justify-between border-b border-gray-100 bg-white/80 px-8 backdrop-blur-md'>
      <div className='flex items-center'>
        <Link href='/'>
          <span className='font-["Playfair_Display",_serif] text-3xl font-medium tracking-tight text-black'>
            Stakefolio
          </span>
        </Link>
        <div className='ml-12 flex gap-2'>
          <Link href='/' className={navLinkClass('/')}>
            <svg
              className='h-4 w-4'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
              />
            </svg>
            Portfolio
          </Link>
          <Link href='/funding' className={navLinkClass('/funding')}>
            <svg
              className='h-4 w-4'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
              />
            </svg>
            Funding
          </Link>
          <Link
            href='/market-analysis'
            className={navLinkClass('/market-analysis')}
          >
            <svg
              className='h-4 w-4'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
              />
            </svg>
            Market
          </Link>
          <Link href='/swap' className={navLinkClass('/swap')}>
            <svg
              className='h-4 w-4'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4'
              />
            </svg>
            Swap
          </Link>
        </div>
      </div>
      <WalletConnectButton />
    </div>
  );
};

export default Header;
