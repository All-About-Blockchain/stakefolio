/**
 * Core type definitions for the Autonomous AI Staking Agent Prototype.
 */

export type StakingAction = 'redelegate' | 'harvest_compound' | 'hold';

export interface TelemetryContext {
  chain: 'cosmos' | 'solana' | 'ethereum';
  balances: {
    masterWallet: number;
    ephemeralGasWallet: number;
  };
  activeValidator: {
    address: string;
    name: string;
    uptimePct: number;
    commissionPct: number;
  };
  candidateValidators: Array<{
    address: string;
    name: string;
    uptimePct: number;
    commissionPct: number;
    votingPowerPct: number;
    isCustodialOrPool: boolean;
  }>;
  slippagePct: number; // Current DEX slippage for the targeted staking/LST path
  networkRules: {
    minUptimePct: number;
    maxCommissionPct: number;
  };
}

export interface StakingRecommendation {
  action: StakingAction;
  chain: 'cosmos' | 'solana' | 'ethereum';
  source_validator?: string;
  target_validator?: string;
  allocation_pct: number;
}

export interface RegulatoryConfig {
  permitTransfers: boolean; // US Compliance: strictly false (prevents MsgSend)
  validatorWhitelist: Set<String>; // Canadian/EU Compliance: only approved public non-custodial validators
  maxSlippageLimit: number; // EU Compliance: maximum slippage (e.g. 0.5%)
  maxDailyGasAllowanceEth: number; // System boundary limits
}

export interface StakingTransaction {
  chain: 'cosmos' | 'solana' | 'ethereum';
  unsignedBytesHex: string;
  description: string;
  signatory: 'ephemeral_hot_wallet' | 'master_secure_enclave';
  methods: string[];
}

export interface ComplianceAuditTrail {
  isApproved: boolean;
  blockedRules: string[];
  reasons: string[];
  jurisdictionsViolated: string[];
}
