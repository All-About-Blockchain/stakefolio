// Chain configuration - simplified to only support CosmosHub and Stride for liquid staking
export const CHAIN_CONFIG = [
  {
    chainName: 'cosmoshub',
    rpc: 'https://rpc.cosmos.network:26657',
    chainId: 'cosmoshub-4',
  },
  {
    chainName: 'stride',
    rpc: 'https://stride-rpc.polkachu.com:26657',
    chainId: 'stride-1',
  },
];

export type ChainConfig = (typeof CHAIN_CONFIG)[0];

// Liquid staking token configuration
export const LIQUID_STAKING_TOKENS = {
  stATOM: {
    symbol: 'stATOM',
    name: 'Stride Liquid Staked ATOM',
    denom: 'stuatom',
    baseToken: 'ATOM',
    baseDenom: 'uatom',
    chain: 'cosmoshub',
    logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/stride/images/statom.png',
    apr: 0.085, // 8.5% APR
  },
  stOSMO: {
    symbol: 'stOSMO',
    name: 'Stride Liquid Staked OSMO',
    denom: 'stuosmo',
    baseToken: 'OSMO',
    baseDenom: 'uosmo',
    chain: 'cosmoshub',
    logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/stride/images/stosmo.png',
    apr: 0.092, // 9.2% APR
  },
  stJUNO: {
    symbol: 'stJUNO',
    name: 'Stride Liquid Staked JUNO',
    denom: 'stujuno',
    baseToken: 'JUNO',
    baseDenom: 'ujuno',
    chain: 'cosmoshub',
    logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/stride/images/stjuno.png',
    apr: 0.078, // 7.8% APR
  },
  stSTARS: {
    symbol: 'stSTARS',
    name: 'Stride Liquid Staked STARS',
    denom: 'stustars',
    baseToken: 'STARS',
    baseDenom: 'ustars',
    chain: 'cosmoshub',
    logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/stride/images/ststars.png',
    apr: 0.082, // 8.2% APR
  },
  stSCRT: {
    symbol: 'stSCRT',
    name: 'Stride Liquid Staked SCRT',
    denom: 'stuscrt',
    baseToken: 'SCRT',
    baseDenom: 'uscrt',
    chain: 'cosmoshub',
    logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/stride/images/stscrt.png',
    apr: 0.075, // 7.5% APR
  },
};

export type LiquidStakingToken =
  (typeof LIQUID_STAKING_TOKENS)[keyof typeof LIQUID_STAKING_TOKENS];
