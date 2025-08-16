// Chain configuration - define RPC endpoints and chain IDs
export const CHAIN_CONFIG = [
  {
    chainName: 'cosmoshub',
    rpc: 'https://rpc.cosmos.network:26657',
    chainId: 'cosmoshub-4',
  },
  {
    chainName: 'osmosis',
    rpc: 'https://rpc.osmosis.zone:26657',
    chainId: 'osmosis-1',
  },
  {
    chainName: 'juno',
    rpc: 'https://rpc.juno.strange.love:26657',
    chainId: 'juno-1',
  },
  {
    chainName: 'stargaze',
    rpc: 'https://rpc.stargaze-apis.com:26657',
    chainId: 'stargaze-1',
  },
  {
    chainName: 'akash',
    rpc: 'https://rpc.akash.forbole.com:26657',
    chainId: 'akashnet-2',
  },
  {
    chainName: 'axelar',
    rpc: 'https://rpc-axelar.imperator.co:26657',
    chainId: 'axelar-dojo-1',
  },
  {
    chainName: 'evmos',
    rpc: 'https://tendermint.bd.evmos.org:26657',
    chainId: 'evmos_9001-2',
  },
  {
    chainName: 'crescent',
    rpc: 'https://mainnet.crescent.network:26657',
    chainId: 'crescent-1',
  },
  {
    chainName: 'comdex',
    rpc: 'https://rpc.comdex.one:26657',
    chainId: 'comdex-1',
  },
  {
    chainName: 'chihuahua',
    rpc: 'https://rpc.chihuahua.wtf:26657',
    chainId: 'chihuahua-1',
  },
  {
    chainName: 'stride',
    rpc: 'https://stride-rpc.polkachu.com:26657',
    chainId: 'stride-1',
  },
  {
    chainName: 'quicksilver',
    rpc: 'https://rpc.quicksilver.zone:26657',
    chainId: 'quicksilver-2',
  },
  {
    chainName: 'kujira',
    rpc: 'https://rpc.kaiyo.kujira.setten.io:26657',
    chainId: 'kaiyo-1',
  },
  {
    chainName: 'persistence',
    rpc: 'https://rpc.core.persistence.one:26657',
    chainId: 'core-1',
  },
  {
    chainName: 'regen',
    rpc: 'https://rpc.regen.network:26657',
    chainId: 'regen-1',
  },
  {
    chainName: 'bitsong',
    rpc: 'https://rpc-bitsong.itastakers.com:26657',
    chainId: 'bitsong-2b',
  },
  {
    chainName: 'gravitybridge',
    rpc: 'https://gravitychain.io:26657',
    chainId: 'gravity-bridge-3',
  },
  { chainName: 'umee', rpc: 'https://rpc.umee.cc:26657', chainId: 'umee-1' },
  {
    chainName: 'desmos',
    rpc: 'https://rpc.mainnet.desmos.network:26657',
    chainId: 'desmos-mainnet',
  },
];

export type ChainConfig = (typeof CHAIN_CONFIG)[0];
