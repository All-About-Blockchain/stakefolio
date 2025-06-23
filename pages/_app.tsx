import type { AppProps } from 'next/app';
import '@/app/globals.css';
import '@interchain-ui/react/styles';

import { ChainProvider, InterchainWalletModal } from '@interchain-kit/react';
import { keplrWallet } from '@interchain-kit/keplr-extension';
import { leapWallet } from '@interchain-kit/leap-extension';
import { cosmostationWallet } from '@interchain-kit/cosmostation-extension';
import { chains, assetLists } from '@chain-registry/v2';
import { WCWallet } from '@interchain-kit/core';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

// Filter chains you want to support
const chainNames = [
  'cosmoshub',
  'osmosis',
  'juno',
  'stargaze',
  'akash',
  'axelar',
  'evmos',
  'crescent',
  'comdex',
  'chihuahua',
  'stride',
  'quicksilver',
  'kujira',
  'persistence',
  'regen',
  'bitsong',
  'gravitybridge',
  'umee',
  'desmos',
];
const filteredChains = chains.filter((c) => chainNames.includes(c.chainName));

const walletConnect = new WCWallet(undefined, {
  metadata: {
    name: 'Stakefolio',
    description: 'Your Cosmos staking portfolio',
    url: 'https://stakefol.io',
    icons: ['https://stakefol.io/icon.png'],
  },
});

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChainProvider
      chains={filteredChains}
      assetLists={assetLists}
      wallets={[keplrWallet, leapWallet, cosmostationWallet]}
      walletModal={InterchainWalletModal as any}
    >
      <Header />
      <Component {...pageProps} />
      <Footer />
    </ChainProvider>
  );
}
