export type StakeMethod = {
  title: string;
  description: string;
};

export type StakingNetwork = {
  rank: number;
  name: string;
  symbol: string;
  /** Short label for the collapsed row */
  consensusModel: string;
  /** Deeper explanation when expanded */
  consensusDetail: string;
  /** One-line hook in the collapsed row */
  whyItMattersSummary: string;
  /** Room to explain significance, use cases, and tradeoffs */
  whyItMattersDetail: string;
  /** Staking APR / reward rate bounds (%), before inflation adjustment */
  nominalYieldMinPct: number | null;
  nominalYieldMaxPct: number | null;
  /**
   * Approximate annual change in liquid supply from protocol issuance/emission (%).
   * Can be negative when burns or fee destruction exceed minting (illustrative).
   * Used only for comparison: real yield ≈ nominal yield − inflation.
   */
  annualInflationPctApprox: number | null;
  /** Approximate share of supply staked, when meaningful */
  stakingParticipationApproxPct: number | null;
  /** Human-readable unbonding / unlock period */
  unbondingPeriod: string;
  liquidStakingAvailable: boolean;
  /** Extra facts for the metrics grid */
  extraMetrics: { label: string; value: string }[];
  /** Bottom-of-panel CTA: staking methods Stakefolio can execute after user deposit + selection */
  stakeCta: {
    headline: string;
    supportingLine: string;
    methods: StakeMethod[];
  };
};

export const STAKING_NETWORKS_TOP_10: StakingNetwork[] = [
  {
    rank: 1,
    name: 'Ethereum',
    symbol: 'ETH',
    consensusModel: 'Gasper Proof-of-Stake',
    consensusDetail:
      'Ethereum secures the chain with validators who propose and attest blocks. Finality is economic: validators post ETH as collateral; misbehavior can be slashed. The design favors a large validator set and strong composability with rollups and DeFi built on top.',
    whyItMattersSummary:
      'Largest smart-contract stake base; default venue for institutional digital-native settlement.',
    whyItMattersDetail:
      'Depth of DeFi, LST/LRT markets, and rollup activity mean ETH staking sits at the center of on-chain finance. Yields are moderate but the asset doubles as collateral and a macro “internet bond” narrative for many portfolios.',
    nominalYieldMinPct: 3,
    nominalYieldMaxPct: 5,
    annualInflationPctApprox: 0.5,
    stakingParticipationApproxPct: 28,
    unbondingPeriod: '~4 epochs after exit queue (often days–weeks)',
    liquidStakingAvailable: true,
    extraMetrics: [
      {
        label: 'Slashing',
        value: 'Correlated penalties possible; operational risk matters',
      },
      {
        label: 'MEV',
        value: 'Validator income can include execution-layer rewards',
      },
    ],
    stakeCta: {
      headline: 'Add Ethereum staking to your portfolio',
      supportingLine:
        'Deposit ETH, then choose pooled native staking, liquid (LST / LRT) exposure, or a custodial program that fits your policy. Stakefolio assembles the contract calls, submits transactions from your connected portfolio, and tracks balances and rewards in one ledger.',
      methods: [
        {
          title: 'Native & pooled staking (portfolio-executed)',
          description:
            'Select a pooled or protocol-native ETH staking program inside Stakefolio. We handle bond, deposit, and withdrawal transactions you approve—no separate Launchpad workflow—while you monitor stake and rewards next to the rest of your book.',
        },
        {
          title: 'Liquid staking & restaking receipts',
          description:
            'Route principal into supported LST or LRT programs for DeFi-compatible yield. Stakefolio executes mint, swap, and unwrap steps you authorize and surfaces smart-contract and peg risk in the allocation view.',
        },
        {
          title: 'Custodial staking programs',
          description:
            'Where your mandate allows, choose an integrated custodial or prime-broker staking program. Stakefolio records the position and cash flows so reporting stays aligned even when keys sit with a qualified custodian.',
        },
        {
          title: 'Institutional validator & MEV policies',
          description:
            'For larger tickets, pick SLAs, reporting cadence, and MEV treatment with supported node operators. Stakefolio encodes your instructions and carries out the delegation lifecycle on chain as parameters change.',
        },
      ],
    },
  },
  {
    rank: 2,
    name: 'Solana',
    symbol: 'SOL',
    consensusModel: 'Tower BFT + Proof-of-History',
    consensusDetail:
      'Solana combines proof-of-stake with Proof-of-History to order transactions quickly. Validators produce blocks under tight timing; stake weights consensus. The model prioritizes throughput and low fees over maximal validator count.',
    whyItMattersSummary:
      'High-activity chain for payments, trading, and consumer apps.',
    whyItMattersDetail:
      'If you care about fee economics and user-visible latency, Solana is a major counterweight to EVM L1/L2s. Staking aligns with securing a network whose demand is tied to application volume rather than only DeFi TVL.',
    nominalYieldMinPct: 6,
    nominalYieldMaxPct: 9,
    annualInflationPctApprox: 5.5,
    stakingParticipationApproxPct: 68,
    unbondingPeriod: '~2–3 days typical unstake delay',
    liquidStakingAvailable: true,
    extraMetrics: [
      {
        label: 'Inflation schedule',
        value: 'Long-term disinflationary curve (check current params)',
      },
      {
        label: 'Hardware',
        value: 'Higher validator hardware bar vs many PoS chains',
      },
    ],
    stakeCta: {
      headline: 'Add Solana staking to your portfolio',
      supportingLine:
        'Fund SOL, choose native delegation to a curated validator set or a liquid staking route, and let Stakefolio submit stake, split, and unstake transactions you confirm. Cooldowns and rewards stay visible in the portfolio timeline.',
      methods: [
        {
          title: 'Native delegation (managed)',
          description:
            'Pick delegation targets and stake size in Stakefolio; the portfolio builds stake-account transactions, broadcasts them with your approval, and refreshes validator performance without juggling a separate wallet UI.',
        },
        {
          title: 'Liquid staking sleeve',
          description:
            'Allocate to supported liquid SOL receipts for tradable exposure while earning staking yield. Stakefolio runs the swaps and receipt mints you authorize and keeps the position marked alongside spot SOL.',
        },
        {
          title: 'Custodial SOL programs',
          description:
            'If policy requires a custodian, select an integrated staking program and map it into Stakefolio for a single balance and reward feed—even when settlement happens off your hot keys.',
        },
        {
          title: 'Validator rotation & rebalancing',
          description:
            'Set rules for how often to revisit validators or weights; Stakefolio prepares restake and redelegate transactions when you choose to act, so operational drift does not require manual block-explorer work.',
        },
      ],
    },
  },
  {
    rank: 3,
    name: 'BNB',
    symbol: 'BNB',
    consensusModel: 'BNB Smart Chain PoS',
    consensusDetail:
      'BNB Chain uses a delegated PoS model with a capped active validator set. Consensus is fast and EVM-compatible; security and decentralization tradeoffs are different from Ethereum’s broader validator set.',
    whyItMattersSummary:
      'Large retail and exchange-linked liquidity; strong EVM tooling overlap.',
    whyItMattersDetail:
      'BNB staking is often chosen for ecosystem access (DeFi, gaming) and tight integration with centralized exchange flows. Understand that validator set size and governance differ materially from fully open validator markets.',
    nominalYieldMinPct: 4,
    nominalYieldMaxPct: 7,
    annualInflationPctApprox: -1.5,
    stakingParticipationApproxPct: null,
    unbondingPeriod: '~7 days',
    liquidStakingAvailable: true,
    extraMetrics: [
      {
        label: 'Supply dynamics',
        value: 'Burn mechanics can make net inflation negative (illustrative)',
      },
      {
        label: 'Interop',
        value: 'EVM-compatible; bridges and CEX flows are central',
      },
    ],
    stakeCta: {
      headline: 'Add BNB Chain staking to your portfolio',
      supportingLine:
        'Deposit BNB, choose between on-chain delegation to the active validator set, custodial programs, or supported liquid wrappers. Stakefolio handles the BSC transactions you approve and reconciles rewards against your positions.',
      methods: [
        {
          title: 'On-chain delegation',
          description:
            'Select validators and amounts in Stakefolio; we construct delegate and claim transactions, submit them from your portfolio wallet, and respect the standard unbonding window when you exit.',
        },
        {
          title: 'Exchange-linked staking',
          description:
            'Connect supported custodial or exchange staking products so balances and yields roll into the same dashboard Stakefolio already uses for the rest of your book.',
        },
        {
          title: 'Liquid & vault exposure',
          description:
            'When available, route size through audited BSC vaults or liquid receipts for composability. Stakefolio executes deposits and withdrawals you sign off on and labels contract risk in the allocation.',
        },
        {
          title: 'Institutional rails',
          description:
            'Treasury policies that require prime brokers or qualified custodians can still be represented in Stakefolio—positions and accruals sync so governance and reporting stay centralized.',
        },
      ],
    },
  },
  {
    rank: 4,
    name: 'Cardano',
    symbol: 'ADA',
    consensusModel: 'Ouroboros Praos (PoS)',
    consensusDetail:
      'Ouroboros splits time into epochs; stake distribution determines slot leadership probabilities. The design emphasizes peer-reviewed foundations and a UTXO+extended model (eUTXO) rather than account-based execution.',
    whyItMattersSummary:
      'High participation staking culture; methodical consensus research lineage.',
    whyItMattersDetail:
      'Cardano appeals when you want a PoS network with a distinct execution model and emphasis on formal methods. Yields fluctuate with reserve drawdown and parameter updates; decentralization is often measured by pool count and pledge.',
    nominalYieldMinPct: 3,
    nominalYieldMaxPct: 7,
    annualInflationPctApprox: 4.5,
    stakingParticipationApproxPct: 65,
    unbondingPeriod:
      '~0 epochs after current epoch ends (no long lock by default)',
    liquidStakingAvailable: true,
    extraMetrics: [
      {
        label: 'Rewards driver',
        value: 'Treasury + fees vs reserve decay over time',
      },
      {
        label: 'Liquid staking',
        value: 'Multiple LST options; compare smart-contract risk',
      },
    ],
    stakeCta: {
      headline: 'Add Cardano staking to your portfolio',
      supportingLine:
        'Deposit ADA, choose a stake pool (or rotate later), and let Stakefolio submit registration and delegation certificates you authorize. Rewards and epoch transitions stay in sync with your portfolio view.',
      methods: [
        {
          title: 'Stake pool delegation',
          description:
            'Compare pledge, margin, and saturation in Stakefolio, then confirm a pool. The portfolio builds the stake registration and delegation transactions Cardano requires and updates balances each epoch.',
        },
        {
          title: 'Pool changes & re-delegation',
          description:
            'When you move pools, Stakefolio prepares the certificate updates—no manual cardano-cli steps—so redelegation stays auditable from the same interface.',
        },
        {
          title: 'Liquid ADA programs',
          description:
            'If your mandate allows wrapped or liquid ADA receipts, Stakefolio can execute the on-chain mint and redeem flows you approve while flagging smart-contract risk versus pure delegation.',
        },
        {
          title: 'Custodial ADA staking',
          description:
            'Map exchange or custodial ADA programs into Stakefolio so delegated balances and payouts appear beside self-custodied stake for consolidated reporting.',
        },
      ],
    },
  },
  {
    rank: 5,
    name: 'Polkadot',
    symbol: 'DOT',
    consensusModel: 'Nominated Proof-of-Stake (NPoS)',
    consensusDetail:
      'DOT holders nominate validators who secure the relay chain. Parachains lease slots and inherit shared security. Rewards incentivize both backing good validators and maintaining adequate stake across the active set.',
    whyItMattersSummary:
      'Shared security hub for many parachains; explicit reward/inflation tuning.',
    whyItMattersDetail:
      'Polkadot is relevant when you care about heterogeneous shards (parachains) under one security budget. Nomination requires periodic maintenance (validator performance, oversubscription). Compare headline staking yield against protocol inflation carefully.',
    nominalYieldMinPct: 10,
    nominalYieldMaxPct: 14,
    annualInflationPctApprox: 10,
    stakingParticipationApproxPct: 52,
    unbondingPeriod: '~28 days',
    liquidStakingAvailable: true,
    extraMetrics: [
      {
        label: 'Parachains',
        value: 'Slot auctions link ecosystem growth to locked DOT',
      },
      {
        label: 'Active set',
        value: 'Validator count fixed; nomination economics matter',
      },
    ],
    stakeCta: {
      headline: 'Add Polkadot staking to your portfolio',
      supportingLine:
        'Bond DOT, pick validators or nomination pools, and rely on Stakefolio for bond, nominate, chill, and unbond extrinsics you approve. The 28-day unbonding window and oversubscription rules surface directly in the allocation.',
      methods: [
        {
          title: 'Direct nomination',
          description:
            'Choose validators and bond size inside Stakefolio; we craft the Substrate extrinsics, submit them when you confirm, and monitor backing status so you are not stuck in oversubscribed sets unknowingly.',
        },
        {
          title: 'Nomination pools',
          description:
            'Below the direct nomination threshold, select a pool in the UI. Stakefolio handles join, extra bond, and unbond requests on chain while showing pool fees and performance.',
        },
        {
          title: 'Custodial DOT programs',
          description:
            'For mandates that require qualified custody, ingest exchange or custodian DOT staking so Stakefolio still gives you one place for balances, rewards, and policy checks.',
        },
        {
          title: 'Rebalancing & unbond workflows',
          description:
            'When you change strategy, Stakefolio sequences chill, unbond, and rebond steps with clear timing on the 28-day unlock—no manual extrinsic assembly.',
        },
      ],
    },
  },
  {
    rank: 6,
    name: 'Cosmos',
    symbol: 'ATOM',
    consensusModel: 'Tendermint BFT + PoS',
    consensusDetail:
      'The Cosmos Hub uses Tendermint consensus: fast finality once a block is committed. IBC connects it to other app-chains. ATOM staking secures the hub and participates in interchain security models as they evolve.',
    whyItMattersSummary:
      'IBC liquidity and interchain hub narrative; historically high nominal yields.',
    whyItMattersDetail:
      'ATOM often trades as a bet on the Cosmos ecosystem and replicated security. Staking yields can look attractive in nominal terms, but historically emission has been high—real returns after inflation are the better comparison metric.',
    nominalYieldMinPct: 12,
    nominalYieldMaxPct: 18,
    annualInflationPctApprox: 12,
    stakingParticipationApproxPct: 68,
    unbondingPeriod: '~21 days',
    liquidStakingAvailable: true,
    extraMetrics: [
      {
        label: 'IBC',
        value: 'Transfers and liquidity across Cosmos SDK chains',
      },
      {
        label: 'Governance',
        value: 'Parameter changes directly affect inflation and tax',
      },
    ],
    stakeCta: {
      headline: 'Add Cosmos Hub staking to your portfolio',
      supportingLine:
        'Deposit ATOM, delegate or redelegate to validators you select, and let Stakefolio broadcast MsgDelegate, withdrawal, and IBC transfers you authorize. Rewards accrue into the same portfolio you use for other chains.',
      methods: [
        {
          title: 'Native Hub delegation',
          description:
            'Pick validators and weights in Stakefolio; the portfolio signs and sends Cosmos SDK messages for delegate, redelegate, and undelegate, including the 21-day unbonding countdown in the UI.',
        },
        {
          title: 'Liquid ATOM receipts',
          description:
            'Choose supported liquid staking protocols when you want DeFi portability. Stakefolio executes mint and redeem flows on your instruction and keeps protocol slashing disclosures attached to the line item.',
        },
        {
          title: 'Custodial ATOM',
          description:
            'Pull exchange or custodian ATOM staking into Stakefolio feeds so treasury teams still see one staking ledger alongside self-custodied Hub positions.',
        },
        {
          title: 'IBC-aware funding',
          description:
            'When you move ATOM from other Cosmos chains first, Stakefolio can sequence IBC send and delegate steps you approve so capital lands staked without a separate wallet workflow.',
        },
      ],
    },
  },
  {
    rank: 7,
    name: 'Avalanche',
    symbol: 'AVAX',
    consensusModel: 'Snowman / Avalanche PoS',
    consensusDetail:
      'Avalanche family consensus provides probabilistic finality that tightens quickly; subnets allow different VM rules. The P-Chain coordinates staking; validators must meet minimum stake and hardware requirements.',
    whyItMattersSummary:
      'Subnet story for app-specific chains; strong DeFi presence on C-Chain.',
    whyItMattersDetail:
      'AVAX staking matters if you want exposure to a multi-chain architecture where enterprises might run subnets. Yield and inflation interact with fee burns—net issuance can be lower than gross staking rewards suggest.',
    nominalYieldMinPct: 8,
    nominalYieldMaxPct: 12,
    annualInflationPctApprox: 5,
    stakingParticipationApproxPct: 62,
    unbondingPeriod: '~14 days',
    liquidStakingAvailable: true,
    extraMetrics: [
      {
        label: 'Fee burn',
        value: 'Can offset issuance (check current burn vs mint)',
      },
      { label: 'Subnets', value: 'Separate staking rules possible per subnet' },
    ],
    stakeCta: {
      headline: 'Add Avalanche staking to your portfolio',
      supportingLine:
        'Fund AVAX, choose P-Chain delegation or a supported liquid program, and have Stakefolio submit add-delegator, claim, and unlock transactions you confirm. The 14-day staking unlock shows up as part of the position lifecycle.',
      methods: [
        {
          title: 'P-Chain delegation',
          description:
            'Select node IDs and stake amounts in Stakefolio; we construct the P-Chain UTXO transactions, broadcast them after your approval, and track validator health against your rewards.',
        },
        {
          title: 'Custody & air-gapped signing',
          description:
            'Where hardware or custodial signers are required, Stakefolio still prepares unsigned payloads and ingests signed results so operations stay policy-compliant without losing portfolio visibility.',
        },
        {
          title: 'Liquid AVAX strategies',
          description:
            'Route through supported C-Chain liquid programs when you need transferable exposure. Stakefolio handles deposits and withdrawals you authorize and labels basis risk versus native P-Chain staking.',
        },
        {
          title: 'Custodial AVAX staking',
          description:
            'Mirror exchange-staked AVAX inside Stakefolio for unified reporting while the venue runs validators on your behalf.',
        },
      ],
    },
  },
  {
    rank: 8,
    name: 'Algorand',
    symbol: 'ALGO',
    consensusModel: 'Pure Proof-of-Stake (PPoS)',
    consensusDetail:
      'Algorand rotates committee membership secretly per round; participants are chosen proportional to stake. The goal is fast finality with minimal fork probability and low operational friction for delegators.',
    whyItMattersSummary:
      'Simple participation rewards; friendly retail delegation experience.',
    whyItMattersDetail:
      'Algorand targets predictable block times and low barriers to earning participation rewards. Compare reward rate against ongoing ecosystem incentives and supply dynamics, which have shifted across governance upgrades.',
    nominalYieldMinPct: 5,
    nominalYieldMaxPct: 8,
    annualInflationPctApprox: 4,
    stakingParticipationApproxPct: null,
    unbondingPeriod:
      'Immediate liquidity when using protocol-native participation',
    liquidStakingAvailable: true,
    extraMetrics: [
      {
        label: 'Governance',
        value: 'Votes can alter reward and fee parameters',
      },
      {
        label: 'State proof roadmap',
        value: 'Light-client and bridge security angle',
      },
    ],
    stakeCta: {
      headline: 'Add Algorand participation to your portfolio',
      supportingLine:
        'Deposit ALGO, opt into online participation or governance commitments from Stakefolio, and let the portfolio submit the participation and voting transactions your policy allows—without operating your own node.',
      methods: [
        {
          title: 'Protocol participation (managed)',
          description:
            'Enable participation rewards in the UI; Stakefolio registers keys online per network rules, broadcasts the required transactions when you confirm, and accrues rewards into your consolidated balance.',
        },
        {
          title: 'Governance commitments',
          description:
            'During governance periods, choose measures and commitment size in Stakefolio. We prepare the governance transactions, remind you of windows, and record votes for audit trails.',
        },
        {
          title: 'DeFi & wrapped ALGO sleeves',
          description:
            'When supported, allocate through audited DeFi wrappers for additional yield. Stakefolio executes supply and withdraw steps you approve and separates protocol APY from base participation.',
        },
        {
          title: 'Custodial ALGO programs',
          description:
            'Ingest exchange participation products so rewards and balances still appear in Stakefolio even when a venue handles keys.',
        },
      ],
    },
  },
  {
    rank: 9,
    name: 'Tezos',
    symbol: 'XTZ',
    consensusModel: 'Liquid Proof-of-Stake (LPoS)',
    consensusDetail:
      'Tezos uses baking (block production) and endorsing with optional delegation. On-chain governance has been a flagship feature: protocol upgrades ship via stakeholder votes without hard forks in the traditional sense.',
    whyItMattersSummary:
      'Long-running on-chain governance culture; liquid delegation by design.',
    whyItMattersDetail:
      'Tezos remains relevant for institutional pilots that value formal upgrade processes and baking infrastructure. Yields depend on baker fees and network usage; inflation funds security and development incentives.',
    nominalYieldMinPct: 8,
    nominalYieldMaxPct: 10,
    annualInflationPctApprox: 4.5,
    stakingParticipationApproxPct: 72,
    unbondingPeriod: '~14 days (may vary by baker / protocol rules)',
    liquidStakingAvailable: true,
    extraMetrics: [
      {
        label: 'Baker fees',
        value: 'Delegators share rewards net of baker charges',
      },
      {
        label: 'Upgrades',
        value: 'Frequent protocol votes can change economics',
      },
    ],
    stakeCta: {
      headline: 'Add Tezos staking to your portfolio',
      supportingLine:
        'Fund XTZ, pick a baker and fee profile, and let Stakefolio issue delegation and reward-claim operations you approve. Baker performance and fee drag stay visible next to the rest of your staking book.',
      methods: [
        {
          title: 'Baker delegation',
          description:
            'Select from curated bakers inside Stakefolio; we build delegation and redelegation operations, submit them on your confirmation, and track payouts net of disclosed baker fees.',
        },
        {
          title: 'Hardware & custodial signing',
          description:
            'Stakefolio prepares payloads for Ledger or custodial HSM workflows, then ingests signed operations so policy-grade key control still feeds the same portfolio dashboard.',
        },
        {
          title: 'Institutional baker SLAs',
          description:
            'Treasury teams can tag allocations to bakers with reporting packages; Stakefolio encodes the relationship and automates recurring claim transactions when you enable them.',
        },
        {
          title: 'Custodial XTZ staking',
          description:
            'Connect exchange baking programs so pooled XTZ still rolls up into Stakefolio for a single staking P&L view.',
        },
      ],
    },
  },
  {
    rank: 10,
    name: 'NEAR Protocol',
    symbol: 'NEAR',
    consensusModel: 'Nightshade sharding + PoS',
    consensusDetail:
      'NEAR splits state into shards validated by a PoS set; Nightshade batches shard work into blocks. The model aims to scale throughput while keeping a single logical chain experience for users and contracts.',
    whyItMattersSummary:
      'User/account abstraction focus; growing L2 and data-availability adjacent narrative.',
    whyItMattersDetail:
      'NEAR is often chosen for consumer UX experiments and developer grants. Staking parameters and reward schedules are governance-driven; treat yields as variable and check current epoch rewards rather than static headlines.',
    nominalYieldMinPct: null,
    nominalYieldMaxPct: null,
    annualInflationPctApprox: 5,
    stakingParticipationApproxPct: null,
    unbondingPeriod: '~52–65 hours (3 epochs) typical',
    liquidStakingAvailable: true,
    extraMetrics: [
      {
        label: 'Sharding',
        value: 'Capacity scales with shard count and validator set',
      },
      {
        label: 'Rainbow bridge',
        value: 'Ethereum connectivity; bridge risk is a separate layer',
      },
    ],
    stakeCta: {
      headline: 'Add NEAR staking to your portfolio',
      supportingLine:
        'Deposit NEAR, choose validators or staking pools, and let Stakefolio handle stake, unstake, and claim transactions you approve. Epoch-based unlocks and reward accrual show up directly on the position.',
      methods: [
        {
          title: 'Validator delegation',
          description:
            'Pick validators and amounts in Stakefolio; the portfolio submits staking actions to the NEAR runtime when you confirm and counts down the typical three-epoch unstake before principal is liquid again.',
        },
        {
          title: 'Community pools & DAOs',
          description:
            'Allocate through supported on-chain pools when you want aggregated delegation with transparent fee splits—Stakefolio runs deposit and withdraw calls you authorize.',
        },
        {
          title: 'Liquid NEAR receipts',
          description:
            'Select liquid staking programs for DeFi-friendly exposure. Stakefolio executes mint and redeem flows on your instruction and surfaces redemption-queue risk in the allocation notes.',
        },
        {
          title: 'Custodial NEAR staking',
          description:
            'Map exchange or custodian NEAR programs into Stakefolio so staked balances and rewards reconcile with the rest of your portfolio even when someone else runs the validator keys.',
        },
      ],
    },
  },
];

/** Nominal staking return minus approximate supply inflation (% points). */
export function getRealYieldBounds(network: StakingNetwork): {
  min: number;
  max: number;
} | null {
  if (
    network.nominalYieldMinPct == null ||
    network.nominalYieldMaxPct == null ||
    network.annualInflationPctApprox == null
  ) {
    return null;
  }
  return {
    min: network.nominalYieldMinPct - network.annualInflationPctApprox,
    max: network.nominalYieldMaxPct - network.annualInflationPctApprox,
  };
}

export function formatPct(value: number, fractionDigits = 1): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(fractionDigits)}%`;
}

export function formatYieldRangeLabel(network: StakingNetwork): string {
  if (
    network.nominalYieldMinPct == null ||
    network.nominalYieldMaxPct == null
  ) {
    return 'Varies';
  }
  if (network.nominalYieldMinPct === network.nominalYieldMaxPct) {
    return `~${network.nominalYieldMinPct}%`;
  }
  return `~${network.nominalYieldMinPct}–${network.nominalYieldMaxPct}%`;
}
