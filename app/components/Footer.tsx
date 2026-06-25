import React from 'react';
import Link from 'next/link';
import { Shield, ExternalLink } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className='mt-24 border-t border-gray-100 bg-white'>
      <div className='mx-auto max-w-7xl px-6 py-16 lg:px-8'>
        <div className='grid gap-12 sm:grid-cols-2 lg:grid-cols-4'>
          {/* Brand */}
          <div className='sm:col-span-2 lg:col-span-1'>
            <span className='font-["Playfair_Display",_serif] text-2xl font-medium tracking-tight text-black'>
              Stakefolio
            </span>
            <p className='mt-4 max-w-xs text-sm leading-relaxed text-gray-500'>
              Earn staking rewards across top networks. Your keys, your assets,
              your rewards — we handle the complexity.
            </p>
            <div className='mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50/50 px-3 py-1.5 text-xs font-medium text-emerald-700'>
              <Shield className='h-3.5 w-3.5' />
              Non-custodial · Self-sovereign
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className='text-xs font-semibold uppercase tracking-wider text-gray-400'>
              Navigate
            </h3>
            <ul className='mt-4 space-y-3'>
              {[
                { href: '/', label: 'Dashboard' },
                { href: '/staking', label: 'Staking' },
                { href: '/agent', label: 'AI Agent' },
                { href: '/activity', label: 'Activity' },
                { href: '/prices', label: 'Prices' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className='text-sm text-gray-600 transition-colors hover:text-black'
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className='text-xs font-semibold uppercase tracking-wider text-gray-400'>
              Resources
            </h3>
            <ul className='mt-4 space-y-3'>
              {[
                { href: '/learn-staking', label: 'Learn Staking' },
                { href: '/funding?tab=deposit', label: 'Deposit Assets' },
                { href: '/funding?tab=withdraw', label: 'Withdraw Assets' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className='text-sm text-gray-600 transition-colors hover:text-black'
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Security */}
          <div>
            <h3 className='text-xs font-semibold uppercase tracking-wider text-gray-400'>
              How it works
            </h3>
            <ul className='mt-4 space-y-3 text-sm text-gray-500'>
              <li className='leading-relaxed'>
                You deposit and pick networks. Stakefolio builds the
                transactions — you approve and sign.
              </li>
              <li className='leading-relaxed'>
                All staking runs on-chain through direct delegation. No
                intermediaries hold your funds.
              </li>
              <li className='leading-relaxed'>
                Rewards accrue automatically. Withdraw at any time after the
                network unbonding period.
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-8 sm:flex-row'>
          <span className='text-sm text-gray-400'>
            © Stakefolio {year}. All rights reserved.
          </span>
          <p className='text-xs text-gray-400'>
            Stakefolio is open-source, non-custodial software. Not financial
            advice.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
