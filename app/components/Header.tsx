import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  Layers,
  Activity,
  BarChart3,
  BookOpen,
  Bot,
  ArrowDownToLine,
  ArrowUpFromLine,
  Menu,
  X,
} from 'lucide-react';
import WalletConnectButton from './WalletConnectButton';

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/staking', label: 'Staking', icon: Layers },
  { href: '/agent', label: 'Agent', icon: Bot },
  { href: '/activity', label: 'Activity', icon: Activity },
  { href: '/prices', label: 'Prices', icon: BarChart3 },
  { href: '/learn-staking', label: 'Learn', icon: BookOpen },
];

const Header = () => {
  const router = useRouter();
  const currentPath = router.pathname;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [currentPath]);

  // Close mobile menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  const isActive = (path: string) => {
    if (path === '/' && currentPath === '/') return true;
    if (path !== '/' && currentPath.startsWith(path)) return true;
    return false;
  };

  const navLinkClass = (path: string) => {
    const active = isActive(path);
    return `flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
      active
        ? 'bg-black text-white shadow-sm'
        : 'text-gray-500 hover:bg-gray-100 hover:text-black'
    }`;
  };

  return (
    <>
      <div className='sticky top-0 z-40 border-b border-gray-100 bg-white/80 backdrop-blur-md'>
        <div className='mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6 lg:px-8'>
          {/* Left: Logo + Desktop Nav */}
          <div className='flex items-center gap-8'>
            <Link href='/' className='shrink-0'>
              <span className='font-["Playfair_Display",_serif] text-2xl font-medium tracking-tight text-black sm:text-3xl'>
                Stakefolio
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className='hidden items-center gap-1 lg:flex'>
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={navLinkClass(item.href)}
                >
                  <item.icon className='h-4 w-4' />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right: CTAs + Wallet + Mobile Toggle */}
          <div className='flex items-center gap-3'>
            {/* Desktop Funding CTAs */}
            <div className='hidden items-center gap-2 md:flex'>
              <Link
                href='/funding?tab=deposit'
                className='inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-black transition-all hover:border-black hover:shadow-sm'
              >
                <ArrowDownToLine className='h-3.5 w-3.5' />
                Deposit
              </Link>
              <Link
                href='/funding?tab=withdraw'
                className='inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition-all hover:border-gray-400 hover:text-black'
              >
                <ArrowUpFromLine className='h-3.5 w-3.5' />
                Withdraw
              </Link>
            </div>

            <WalletConnectButton />

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className='inline-flex items-center justify-center rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-black lg:hidden'
              aria-label='Toggle navigation menu'
            >
              {mobileMenuOpen ? (
                <X className='h-5 w-5' />
              ) : (
                <Menu className='h-5 w-5' />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <div className='fixed inset-0 z-50 bg-black/20 backdrop-blur-sm lg:hidden'>
          <div
            ref={menuRef}
            className='absolute right-0 top-0 h-full w-[300px] border-l border-gray-100 bg-white shadow-2xl'
          >
            {/* Mobile Menu Header */}
            <div className='flex items-center justify-between border-b border-gray-100 px-6 py-5'>
              <span className='font-["Playfair_Display",_serif] text-xl font-medium text-black'>
                Menu
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className='rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-black'
              >
                <X className='h-5 w-5' />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <nav className='flex flex-col gap-1 px-4 py-4'>
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                    isActive(item.href)
                      ? 'bg-black text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                  }`}
                >
                  <item.icon className='h-5 w-5' />
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Mobile Funding CTAs */}
            <div className='border-t border-gray-100 px-4 py-4'>
              <div className='flex flex-col gap-2'>
                <Link
                  href='/funding?tab=deposit'
                  className='flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800'
                >
                  <ArrowDownToLine className='h-4 w-4' />
                  Deposit Assets
                </Link>
                <Link
                  href='/funding?tab=withdraw'
                  className='flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50'
                >
                  <ArrowUpFromLine className='h-4 w-4' />
                  Withdraw Assets
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
