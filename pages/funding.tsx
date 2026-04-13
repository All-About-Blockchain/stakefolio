import Head from 'next/head';
import { useRouter } from 'next/router';
import FundingFlowShell from '@/app/components/funding/FundingFlowShell';

export default function FundingPage() {
  const router = useRouter();
  const tab = router.query.tab === 'withdraw' ? 'withdraw' : 'deposit';
  const initialChainId =
    typeof router.query.chain === 'string'
      ? router.query.chain
      : 'ethereum-mainnet';
  const initialAssetSymbol =
    typeof router.query.asset === 'string' ? router.query.asset : undefined;

  return (
    <>
      <Head>
        <title>Funding - Stakefolio</title>
      </Head>
      <div className='min-h-screen bg-gradient-to-br from-gray-50 to-white px-6 py-16'>
        <FundingFlowShell
          initialTab={tab}
          initialChainId={initialChainId}
          initialAssetSymbol={initialAssetSymbol}
        />
      </div>
    </>
  );
}
