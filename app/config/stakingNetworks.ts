export type StakingNetwork = {
  rank: number;
  name: string;
  symbol: string;
  consensusModel: string;
  description: string;
  indicativeYieldRange: string | null;
};

export const STAKING_NETWORKS_TOP_10: StakingNetwork[] = [
  {
    rank: 1,
    name: 'Ethereum',
    symbol: 'ETH',
    consensusModel: 'Proof-of-Stake base layer',
    description:
      'Largest PoS network by TVL & validators; institutional adoption.',
    indicativeYieldRange: '~3–5%',
  },
  {
    rank: 2,
    name: 'Solana',
    symbol: 'SOL',
    consensusModel: 'Delegated PoS',
    description: 'High activity, fast throughput; strong developer base.',
    indicativeYieldRange: '~6–9%',
  },
  {
    rank: 3,
    name: 'BNB',
    symbol: 'BNB',
    consensusModel: 'BNB Chain PoS',
    description: 'Large eco-system token from Binance; broad usage.',
    indicativeYieldRange: '~4–7%',
  },
  {
    rank: 4,
    name: 'Cardano',
    symbol: 'ADA',
    consensusModel: 'Ouroboros PoS',
    description: 'High stake participation; relatively stable yields.',
    indicativeYieldRange: '~3–7%',
  },
  {
    rank: 5,
    name: 'Polkadot',
    symbol: 'DOT',
    consensusModel: 'Nominated PoS',
    description: 'Cross-chain ecosystem; strong rewards.',
    indicativeYieldRange: '~10–14%',
  },
  {
    rank: 6,
    name: 'Cosmos',
    symbol: 'ATOM',
    consensusModel: 'PoS + IBC',
    description: 'High staking ratio and strong yield appeal.',
    indicativeYieldRange: '~12–18%',
  },
  {
    rank: 7,
    name: 'Avalanche',
    symbol: 'AVAX',
    consensusModel: 'PoS',
    description: 'Multi-subnet architecture supporting DeFi & apps.',
    indicativeYieldRange: '~8–12%',
  },
  {
    rank: 8,
    name: 'Algorand',
    symbol: 'ALGO',
    consensusModel: 'Pure PoS',
    description: 'Low-risk, easy delegation.',
    indicativeYieldRange: '~5–8%',
  },
  {
    rank: 9,
    name: 'Tezos',
    symbol: 'XTZ',
    consensusModel: 'Liquid Proof-of-Stake',
    description: 'History of stable validator participation.',
    indicativeYieldRange: '~8–10%',
  },
  {
    rank: 10,
    name: 'NEAR Protocol',
    symbol: 'NEAR',
    consensusModel: 'Nightshade PoS',
    description: 'Growing ecosystem with delegation options.',
    indicativeYieldRange: null,
  },
];
