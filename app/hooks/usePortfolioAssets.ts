import { useMemo, useState } from 'react';
import { useWallet } from '@/app/contexts/WalletContext';

export interface YieldOption {
  id: string;
  name: string;
  description: string;
  yield: string;
  action: string;
}

export interface AssetHolding {
  name: string;
  balance: string;
  value: string;
  yield: string;
}

export interface Asset {
  id: string;
  name: string;
  symbol: string;
  balance: string;
  value: string;
  iconUrl: string;
  maxYield: string;
  holdings: AssetHolding[];
  options: YieldOption[];
}

export interface Stablecoin {
  id: string;
  name: string;
  symbol: string;
  balance: string;
  value: string;
  iconUrl: string;
  yield: string;
  options: YieldOption[];
  yieldOpportunities: YieldOption[];
}

export interface AvailableAsset {
  id: string;
  name: string;
  symbol: string;
  iconUrl: string;
  isOwned?: boolean;
  hasBalance?: boolean;
}

export interface ChartData {
  symbol: string;
  balance: number;
  price: number;
  color: string;
  chain: string;
}

export function usePortfolioAssets() {
  const { address } = useWallet();

  const [activeStablecoinIds, setActiveStablecoinIds] = useState<string[]>([
    'usdc',
  ]);
  const [activeAssetIds, setActiveAssetIds] = useState<string[]>([
    'bitcoin',
    'ethereum',
    'solana',
  ]);

  const allStablecoins: Stablecoin[] = useMemo(
    () => [
      {
        id: 'usdc',
        name: 'USD Coin',
        symbol: 'USDC',
        balance: '12,050.50',
        value: '$12,050.50',
        iconUrl:
          'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
        yield: '4.2%',
        options: [
          {
            id: 'deposit',
            name: 'Deposit USDC',
            description:
              'Transfer USDC from a centralized exchange or another wallet.',
            yield: '---',
            action: 'Deposit',
          },
          {
            id: 'withdraw',
            name: 'Withdraw USDC',
            description:
              'Transfer USDC to external wallets or off-ramp to fiat.',
            yield: '---',
            action: 'Withdraw',
          },
        ],
        yieldOpportunities: [
          {
            id: 'aave',
            name: 'Aave V3 Lending',
            description: 'Earn interest by lending USDC on Aave.',
            yield: '4.2%',
            action: 'Lend USDC',
          },
          {
            id: 'compound',
            name: 'Compound V3',
            description: 'Supply USDC as collateral to earn yield.',
            yield: '3.9%',
            action: 'Supply USDC',
          },
        ],
      },
      {
        id: 'usdt',
        name: 'Tether USD',
        symbol: 'USDT',
        balance: '0.00',
        value: '$0.00',
        iconUrl:
          'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
        yield: '3.8%',
        options: [
          {
            id: 'deposit',
            name: 'Deposit USDT',
            description:
              'Transfer USDT from a centralized exchange or another wallet.',
            yield: '---',
            action: 'Deposit',
          },
          {
            id: 'withdraw',
            name: 'Withdraw USDT',
            description:
              'Transfer USDT to external wallets or off-ramp to fiat.',
            yield: '---',
            action: 'Withdraw',
          },
        ],
        yieldOpportunities: [
          {
            id: 'aave',
            name: 'Aave V3 Lending',
            description: 'Earn interest by lending USDT on Aave.',
            yield: '3.8%',
            action: 'Lend USDT',
          },
        ],
      },
    ],
    []
  );

  const allAssets: Asset[] = useMemo(
    () => [
      {
        id: 'bitcoin',
        name: 'Bitcoin',
        symbol: 'BTC',
        balance: '0.45',
        value: '$31,500.00',
        iconUrl:
          'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png',
        maxYield: '4.5%',
        holdings: [
          {
            name: 'Native BTC',
            balance: '0.25 BTC',
            value: '$17,500.00',
            yield: '0.0%',
          },
          {
            name: 'Babylon Staked BTC',
            balance: '0.10 BTC',
            value: '$7,000.00',
            yield: '4.5%',
          },
          {
            name: 'cbBTC',
            balance: '0.10 BTC',
            value: '$7,000.00',
            yield: '3.2%',
          },
        ],
        options: [
          {
            id: 'babylon',
            name: 'Babylon Staking',
            description: 'Trustless native Bitcoin staking.',
            yield: '4.5%',
            action: 'Stake Now',
          },
          {
            id: 'cbbtc',
            name: 'Swap for cbBTC',
            description: 'Coinbase wrapped Bitcoin for DeFi yield.',
            yield: '3.2%',
            action: 'Swap Assets',
          },
        ],
      },
      {
        id: 'ethereum',
        name: 'Ethereum',
        symbol: 'ETH',
        balance: '4.2',
        value: '$14,700.00',
        iconUrl:
          'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
        maxYield: '3.8%',
        holdings: [
          {
            name: 'Native ETH',
            balance: '2.0 ETH',
            value: '$7,000.00',
            yield: '0.0%',
          },
          {
            name: 'Native Staked ETH',
            balance: '1.2 ETH',
            value: '$4,200.00',
            yield: '3.3%',
          },
          {
            name: 'Lido (stETH)',
            balance: '0.5 ETH',
            value: '$1,750.00',
            yield: '3.1%',
          },
          {
            name: 'Ether.fi (eETH)',
            balance: '0.5 ETH',
            value: '$1,750.00',
            yield: '3.8%',
          },
        ],
        options: [
          {
            id: 'lido',
            name: 'Lido (stETH)',
            description: 'The premier liquid staking solution.',
            yield: '3.1%',
            action: 'Swap Assets',
          },
          {
            id: 'etherfi',
            name: 'Ether.fi (eETH)',
            description: 'Native restaking liquid token.',
            yield: '3.8%',
            action: 'Swap Assets',
          },
          {
            id: 'native',
            name: 'Native Staking',
            description: 'Stake directly with validators.',
            yield: '3.3%',
            action: 'Stake Now',
          },
        ],
      },
      {
        id: 'solana',
        name: 'Solana',
        symbol: 'SOL',
        balance: '125.5',
        value: '$18,825.00',
        iconUrl:
          'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png',
        maxYield: '7.4%',
        holdings: [
          {
            name: 'Native SOL',
            balance: '25.5 SOL',
            value: '$3,825.00',
            yield: '0.0%',
          },
          {
            name: 'Native Staked SOL',
            balance: '50.0 SOL',
            value: '$7,500.00',
            yield: '6.8%',
          },
          {
            name: 'Jito (JitoSOL)',
            balance: '50.0 SOL',
            value: '$7,500.00',
            yield: '7.4%',
          },
        ],
        options: [
          {
            id: 'jito',
            name: 'Jito (JitoSOL)',
            description: 'MEV-boosted liquid staking.',
            yield: '7.4%',
            action: 'Swap Assets',
          },
          {
            id: 'native',
            name: 'Native Staking',
            description: 'Stake directly with high-performance validators.',
            yield: '6.8%',
            action: 'Stake Now',
          },
        ],
      },
      {
        id: 'cosmos',
        name: 'Cosmos Hub',
        symbol: 'ATOM',
        balance: '0.0',
        value: '$0.00',
        iconUrl:
          'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/cosmos/info/logo.png',
        maxYield: '14.2%',
        holdings: [],
        options: [
          {
            id: 'native',
            name: 'Native Staking',
            description: 'Stake to secure the Cosmos Hub.',
            yield: '14.2%',
            action: 'Stake Now',
          },
        ],
      },
      {
        id: 'osmosis',
        name: 'Osmosis',
        symbol: 'OSMO',
        balance: '0.0',
        value: '$0.00',
        iconUrl:
          'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/osmosis/info/logo.png',
        maxYield: '8.4%',
        holdings: [],
        options: [
          {
            id: 'native',
            name: 'Native Staking',
            description: 'Stake to the decentralized interchain exchange.',
            yield: '8.4%',
            action: 'Stake Now',
          },
        ],
      },
      {
        id: 'injective',
        name: 'Injective',
        symbol: 'INJ',
        balance: '0.0',
        value: '$0.00',
        iconUrl:
          'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/injective/info/logo.png',
        maxYield: '15.6%',
        holdings: [],
        options: [
          {
            id: 'native',
            name: 'Native Staking',
            description: 'Stake to the fastest L1 blockchain for finance.',
            yield: '15.6%',
            action: 'Stake Now',
          },
        ],
      },
      {
        id: 'avalanche',
        name: 'Avalanche',
        symbol: 'AVAX',
        balance: '0.0',
        value: '$0.00',
        iconUrl:
          'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/avalanchec/info/logo.png',
        maxYield: '6.8%',
        holdings: [],
        options: [
          {
            id: 'native',
            name: 'Native Staking',
            description: 'Stake directly to the Avalanche network.',
            yield: '6.8%',
            action: 'Stake Now',
          },
        ],
      },
      {
        id: 'polygon',
        name: 'Polygon',
        symbol: 'MATIC',
        balance: '0.0',
        value: '$0.00',
        iconUrl:
          'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png',
        maxYield: '5.2%',
        holdings: [],
        options: [
          {
            id: 'native',
            name: 'Native Staking',
            description: 'Stake to secure the Polygon PoS network.',
            yield: '5.2%',
            action: 'Stake Now',
          },
        ],
      },
    ],
    []
  );

  const availableAssets: AvailableAsset[] = useMemo(() => {
    return allAssets.map((asset) => ({
      id: asset.id,
      name: asset.name,
      symbol: asset.symbol,
      iconUrl: asset.iconUrl,
      isOwned: activeAssetIds.includes(asset.id),
      hasBalance: parseFloat(asset.balance.replace(/,/g, '')) > 0,
    }));
  }, [allAssets, activeAssetIds]);

  const availableStablecoins: AvailableAsset[] = useMemo(() => {
    return allStablecoins.map((asset) => ({
      id: asset.id,
      name: asset.name,
      symbol: asset.symbol,
      iconUrl: asset.iconUrl,
      isOwned: activeStablecoinIds.includes(asset.id),
      hasBalance: parseFloat(asset.balance.replace(/,/g, '')) > 0,
    }));
  }, [allStablecoins, activeStablecoinIds]);

  const chartData: ChartData[] = useMemo(
    () => [
      {
        symbol: 'USDC',
        balance: 12050,
        price: 1,
        color: '#2775CA',
        chain: 'Ethereum',
      },
      {
        symbol: 'BTC',
        balance: 0.45,
        price: 70000,
        color: '#F7931A',
        chain: 'Bitcoin',
      },
      {
        symbol: 'ETH',
        balance: 4.2,
        price: 3500,
        color: '#627EEA',
        chain: 'Ethereum',
      },
      {
        symbol: 'SOL',
        balance: 125.5,
        price: 150,
        color: '#14F195',
        chain: 'Solana',
      },
    ],
    [address]
  );

  const stablecoins = useMemo(
    () => allStablecoins.filter((c) => activeStablecoinIds.includes(c.id)),
    [allStablecoins, activeStablecoinIds]
  );

  const assets = useMemo(
    () => allAssets.filter((c) => activeAssetIds.includes(c.id)),
    [allAssets, activeAssetIds]
  );

  const saveAssets = (ids: string[]) => setActiveAssetIds(ids);
  const saveStablecoins = (ids: string[]) => setActiveStablecoinIds(ids);

  return {
    stablecoins,
    assets,
    availableAssets,
    availableStablecoins,
    chartData,
    saveAssets,
    saveStablecoins,
  };
}
