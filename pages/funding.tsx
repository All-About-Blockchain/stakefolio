import React, { useState } from 'react';
import Head from 'next/head';
import FundingTabs from '@/app/components/funding/FundingTabs';
import MoonPayWidget from '@/app/components/funding/MoonPayWidget';
import CoinbaseOnrampWidget from '@/app/components/funding/CoinbaseOnrampWidget';
import CryptoTransfer from '@/app/components/funding/CryptoTransfer';
import { useWallet } from '@/app/contexts/WalletContext';

type FundingMode = 'deposit' | 'withdraw';
type FundingMethod = 'crypto' | 'moonpay' | 'coinbase';

export default function FundingPage() {
  const [mode, setMode] = useState<FundingMode>('deposit');
  const [method, setMethod] = useState<FundingMethod>('moonpay');
  const { address } = useWallet();

  const renderContent = () => {
    switch (method) {
      case 'moonpay':
        return <MoonPayWidget mode={mode} />;
      case 'coinbase':
        return <CoinbaseOnrampWidget mode={mode} />;
      case 'crypto':
        return <CryptoTransfer mode={mode} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Head>
        <title>Deposit & Withdraw | Stakefolio</title>
      </Head>

      <main className='container mx-auto min-h-[calc(100vh-200px)] max-w-4xl px-4 py-8'>
        <div className='mb-10 text-center'>
          <h1 className='mb-4 text-4xl font-extrabold tracking-tight text-gray-900'>
            Funding Hub
          </h1>
          <p className='mx-auto max-w-xl text-lg text-gray-500'>
            Add funds to your wallet using traditional finance, cards, or native
            crypto transfers.
          </p>
        </div>

        <FundingTabs
          mode={mode}
          setMode={setMode}
          method={method}
          setMethod={setMethod}
        />

        <div className='mt-8 transition-all duration-300 ease-in-out'>
          {renderContent()}
        </div>

        {!address && (
          <div className='mx-auto mt-12 max-w-2xl rounded-xl border border-orange-100 bg-orange-50 p-6 text-center'>
            <h3 className='mb-2 font-semibold text-orange-800'>
              Connect Your Wallet First
            </h3>
            <p className='text-sm text-orange-600'>
              To ensure funds are routed correctly to your account, please
              connect your wallet before initiating a deposit or withdrawal.
            </p>
          </div>
        )}
      </main>
    </>
  );
}
