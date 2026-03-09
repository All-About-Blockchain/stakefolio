import React from 'react';
import { MoonPayBuyWidget, MoonPaySellWidget } from '@moonpay/moonpay-react';
import { useWallet } from '@/app/contexts/WalletContext';

interface MoonPayWidgetProps {
  mode: 'deposit' | 'withdraw';
}

export default function MoonPayWidget({ mode }: MoonPayWidgetProps) {
  const { address } = useWallet();

  // We use placeholder/public test keys when not defined
  const isTestMode = true;

  return (
    <div className='mx-auto max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl'>
      {mode === 'deposit' ? (
        <MoonPayBuyWidget
          variant='embedded'
          baseCurrencyCode='usd'
          baseCurrencyAmount='100'
          defaultCurrencyCode='usdc'
          walletAddress={address || undefined}
          colorCode='#8B5CF6'
          // Note for production: This requires a publishable API key
        />
      ) : (
        <MoonPaySellWidget
          variant='embedded'
          baseCurrencyCode='usd'
          quoteCurrencyCode='usdc'
          walletAddress={address || undefined}
          colorCode='#8B5CF6'
        />
      )}
    </div>
  );
}
