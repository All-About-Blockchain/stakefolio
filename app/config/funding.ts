export type ChainFamily = 'evm' | 'bitcoin' | 'solana';

export type SupportedChain = {
  id: string;
  family: ChainFamily;
  name: string;
  networkLabel: string;
  explorerTxBaseUrl: string;
  rampAssetCodes: string[];
};

export type SupportedAsset = {
  id: string;
  symbol: string;
  name: string;
  chainId: string;
  isStakingDerivative: boolean;
  stakingContext?: string;
  /** Ramp crypto asset key (e.g. ETH_ETH). Null = use chain default from `rampAssetCodes`. */
  rampCryptoAssetKey: string | null;
};

export const SUPPORTED_CHAINS: SupportedChain[] = [
  {
    id: 'ethereum-mainnet',
    family: 'evm',
    name: 'Ethereum',
    networkLabel: 'Mainnet',
    explorerTxBaseUrl: 'https://etherscan.io/tx/',
    rampAssetCodes: ['ETH_ETH', 'ETH_USDC', 'ETH_USDT'],
  },
  {
    id: 'bitcoin-mainnet',
    family: 'bitcoin',
    name: 'Bitcoin',
    networkLabel: 'Mainnet',
    explorerTxBaseUrl: 'https://mempool.space/tx/',
    rampAssetCodes: ['BTC_BTC'],
  },
  {
    id: 'solana-mainnet',
    family: 'solana',
    name: 'Solana',
    networkLabel: 'Mainnet',
    explorerTxBaseUrl: 'https://solscan.io/tx/',
    rampAssetCodes: ['SOL_SOL'],
  },
];

export const SUPPORTED_ASSETS: SupportedAsset[] = [
  {
    id: 'eth',
    symbol: 'ETH',
    name: 'Ether',
    chainId: 'ethereum-mainnet',
    isStakingDerivative: false,
    stakingContext: 'Native Ethereum staking',
    rampCryptoAssetKey: 'ETH_ETH',
  },
  {
    id: 'steth',
    symbol: 'stETH',
    name: 'Lido stETH',
    chainId: 'ethereum-mainnet',
    isStakingDerivative: true,
    stakingContext: 'Liquid staking derivative',
    rampCryptoAssetKey: 'ETH_ETH',
  },
  {
    id: 'eeth',
    symbol: 'eETH',
    name: 'Ether.fi eETH',
    chainId: 'ethereum-mainnet',
    isStakingDerivative: true,
    stakingContext: 'Restaking-aligned derivative',
    rampCryptoAssetKey: 'ETH_ETH',
  },
  {
    id: 'btc',
    symbol: 'BTC',
    name: 'Bitcoin',
    chainId: 'bitcoin-mainnet',
    isStakingDerivative: false,
    stakingContext: 'Base BTC custody',
    rampCryptoAssetKey: 'BTC_BTC',
  },
  {
    id: 'cbbtc',
    symbol: 'cbBTC',
    name: 'Coinbase Wrapped BTC',
    chainId: 'ethereum-mainnet',
    isStakingDerivative: true,
    stakingContext: 'BTC derivative for DeFi',
    rampCryptoAssetKey: 'ETH_ETH',
  },
  {
    id: 'sol',
    symbol: 'SOL',
    name: 'Solana',
    chainId: 'solana-mainnet',
    isStakingDerivative: false,
    stakingContext: 'Native Solana staking',
    rampCryptoAssetKey: 'SOL_SOL',
  },
  {
    id: 'jitosol',
    symbol: 'JitoSOL',
    name: 'JitoSOL',
    chainId: 'solana-mainnet',
    isStakingDerivative: true,
    stakingContext: 'Liquid staking derivative',
    rampCryptoAssetKey: 'SOL_SOL',
  },
];

export const getChainById = (chainId: string) =>
  SUPPORTED_CHAINS.find((chain) => chain.id === chainId) || null;

export const getAssetsForChain = (chainId: string) =>
  SUPPORTED_ASSETS.filter((asset) => asset.chainId === chainId);

/** Ramp unified params for the selected chain + asset (see Ramp `enabledCryptoAssets` / `inAsset` / `outAsset`). */
export function getRampAssetParams(chainId: string, assetSymbol: string) {
  const chain = getChainById(chainId);
  const asset = SUPPORTED_ASSETS.find(
    (a) => a.chainId === chainId && a.symbol === assetSymbol
  );
  const enabled = chain?.rampAssetCodes?.length
    ? chain.rampAssetCodes.join(',')
    : 'ETH_ETH';
  const primary =
    asset?.rampCryptoAssetKey ?? chain?.rampAssetCodes?.[0] ?? 'ETH_ETH';
  return {
    enabledCryptoAssets: enabled,
    onrampOutAsset: primary,
    offrampInAsset: primary,
  };
}

/** Only pre-fill `userAddress` when the connected wallet plausibly matches the chain family. */
export function rampUserAddressForChainFamily(
  family: ChainFamily,
  walletAddress: string | null | undefined
): string | undefined {
  if (!walletAddress) return undefined;
  if (family === 'evm' && /^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
    return walletAddress;
  }
  return undefined;
}
