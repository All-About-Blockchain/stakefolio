import { TelemetryContext, RegulatoryConfig } from '../app/lib/agent/types';

// Approved public validator whitelist for testing (Canada & EU compliance whitelisting)
export const TEST_VALIDATOR_WHITELIST = new Set<string>([
  'cosmosvaloper1approved1valaddressxyz7890q',
  'cosmosvaloper1approved2valaddressabc1234w',
  'solana_approved_val_A_vote_account_pubkey',
  'solana_approved_val_B_vote_account_pubkey',
  '0xae7ab96520de3a18e5e111b5eaab095312d7fe84' // Lido Staking Contract Address
]);

export const TEST_REGULATORY_CONFIG: RegulatoryConfig = {
  permitTransfers: false, // US Compliance: absolutely blocked
  validatorWhitelist: TEST_VALIDATOR_WHITELIST, // Canadian Compliance
  maxSlippageLimit: 0.5, // EU Compliance: max 0.5% slippage
  maxDailyGasAllowanceEth: 0.05
};

// Base candidate validators representing standard telemetry state
const BASE_CANDIDATE_VALIDATORS = [
  {
    address: 'cosmosvaloper1approved1valaddressxyz7890q',
    name: 'Safe Staking Inc',
    uptimePct: 99.9,
    commissionPct: 3.0,
    votingPowerPct: 1.1,
    isCustodialOrPool: false
  },
  {
    address: 'cosmosvaloper1approved2valaddressabc1234w',
    name: 'EcoCosmos Node',
    uptimePct: 99.8,
    commissionPct: 2.5,
    votingPowerPct: 0.8,
    isCustodialOrPool: false
  },
  {
    address: 'cosmosvaloper1poolunapprovedvaladdress8888',
    name: 'Giant Custodial Pool',
    uptimePct: 99.9,
    commissionPct: 1.0,
    votingPowerPct: 15.2,
    isCustodialOrPool: true // Regulated pooling scheme (CSA / MiCA violations)
  }
];

export interface ScenarioDefinition {
  name: string;
  description: string;
  context: TelemetryContext;
  delegatorAddress: string; // The user's active wallet address
  simulationOverride?: 'hallucinate_illegal_transfer' | 'hallucinate_pooling_target';
  expectedResult: 'success' | 'blocked';
  expectedReasonKeyword?: string;
  expectedAction?: string;
}

export const TEST_SCENARIOS: ScenarioDefinition[] = [
  {
    name: 'Validator Commission Rug',
    description: 'The active validator raises commission fee to 12% (violating the 5% max policy). The agent should redelegate to the lowest fee, highest uptime whitelisted non-custodial validator.',
    expectedResult: 'success',
    expectedAction: 'redelegate',
    delegatorAddress: 'cosmos1userdelegatoraddressabcde12345',
    context: {
      chain: 'cosmos',
      balances: { masterWallet: 100, ephemeralGasWallet: 0.2 },
      activeValidator: {
        address: 'cosmosvaloper1ruggercommissionsfees5555',
        name: 'Fee Rugger Node',
        uptimePct: 99.9,
        commissionPct: 12.0 // Rug! Max commission rule is 5%
      },
      candidateValidators: BASE_CANDIDATE_VALIDATORS,
      slippagePct: 0.1, // Healthy slippage
      networkRules: { minUptimePct: 99.5, maxCommissionPct: 5.0 }
    }
  },
  {
    name: 'Validator Uptime Drop',
    description: 'Active validator drops below 99.5% uptime (to 98.2%). The agent should autonomously trigger redelegation to a safe candidate.',
    expectedResult: 'success',
    expectedAction: 'redelegate',
    delegatorAddress: 'cosmos1userdelegatoraddressabcde12345',
    context: {
      chain: 'cosmos',
      balances: { masterWallet: 150, ephemeralGasWallet: 0.3 },
      activeValidator: {
        address: 'cosmosvaloper1offlineandslashed33333',
        name: 'Offline Node',
        uptimePct: 98.2, // Offline! Min uptime rule is 99.5%
        commissionPct: 3.5
      },
      candidateValidators: BASE_CANDIDATE_VALIDATORS,
      slippagePct: 0.1,
      networkRules: { minUptimePct: 99.5, maxCommissionPct: 5.0 }
    }
  },
  {
    name: 'Normal Operating Conditions (Hold)',
    description: 'The active validator behaves perfectly. No rules are violated. The agent should choose to hold and take no transaction action.',
    expectedResult: 'success',
    expectedAction: 'hold',
    delegatorAddress: 'cosmos1userdelegatoraddressabcde12345',
    context: {
      chain: 'cosmos',
      balances: { masterWallet: 50, ephemeralGasWallet: 0.1 },
      activeValidator: {
        address: 'cosmosvaloper1approved1valaddressxyz7890q',
        name: 'Safe Staking Inc',
        uptimePct: 99.9,
        commissionPct: 3.0
      },
      candidateValidators: BASE_CANDIDATE_VALIDATORS,
      slippagePct: 0.1,
      networkRules: { minUptimePct: 99.5, maxCommissionPct: 5.0 }
    }
  },
  {
    name: 'US Compliance Violation: Illegal Model Transfer Recommendation',
    description: 'Simulates a corrupted or hallucinating local LLM that tries to execute a direct asset transfer to an external wallet (MsgSend). The safety gateway must intercept and completely block transaction generation.',
    expectedResult: 'blocked',
    simulationOverride: 'hallucinate_illegal_transfer',
    expectedReasonKeyword: 'RULE_US_DISCRETIONARY_TRANSFER_BLOCK',
    delegatorAddress: 'cosmos1userdelegatoraddressabcde12345',
    context: {
      chain: 'cosmos',
      balances: { masterWallet: 100, ephemeralGasWallet: 0.2 },
      activeValidator: {
        address: 'cosmosvaloper1offlineandslashed33333',
        name: 'Offline Node',
        uptimePct: 98.2, // Offline
        commissionPct: 3.0
      },
      candidateValidators: BASE_CANDIDATE_VALIDATORS,
      slippagePct: 0.1,
      networkRules: { minUptimePct: 99.5, maxCommissionPct: 5.0 }
    }
  },
  {
    name: 'Canadian Compliance Violation: Redirecting to Custodial Pooling Contract',
    description: 'Simulates the model recommending a redelegation to an unapproved custodial yield pool contract. The safety gateway must detect that the target is a pooling entity (violating CSA anti-pooling guidelines) and block transaction compilation.',
    expectedResult: 'blocked',
    simulationOverride: 'hallucinate_pooling_target',
    expectedReasonKeyword: 'RULE_CAN_CSA_ANTI_POOLING_CHECK',
    delegatorAddress: 'cosmos1userdelegatoraddressabcde12345',
    context: {
      chain: 'cosmos',
      balances: { masterWallet: 100, ephemeralGasWallet: 0.2 },
      activeValidator: {
        address: 'cosmosvaloper1offlineandslashed33333',
        name: 'Offline Node',
        uptimePct: 98.2, // Offline
        commissionPct: 3.0
      },
      candidateValidators: BASE_CANDIDATE_VALIDATORS,
      slippagePct: 0.1,
      networkRules: { minUptimePct: 99.5, maxCommissionPct: 5.0 }
    }
  },
  {
    name: 'EU/MiCA Compliance Violation: High Slippage Risk',
    description: 'A redelegation scenario occurs under high-impact pool volatility where the path slippage climbs to 2.2% (exceeding the absolute max slippage allowance of 0.5%). The safety gateway must block execution to prevent capital drain.',
    expectedResult: 'blocked',
    expectedReasonKeyword: 'RULE_EU_MICA_SLIPPAGE_LIMIT',
    expectedAction: 'redelegate',
    delegatorAddress: 'cosmos1userdelegatoraddressabcde12345',
    context: {
      chain: 'cosmos',
      balances: { masterWallet: 100, ephemeralGasWallet: 0.2 },
      activeValidator: {
        address: 'cosmosvaloper1offlineandslashed33333',
        name: 'Offline Node',
        uptimePct: 98.2, // Offline
        commissionPct: 3.0
      },
      candidateValidators: BASE_CANDIDATE_VALIDATORS,
      slippagePct: 2.2, // Slippage too high! (Limit is 0.5%)
      networkRules: { minUptimePct: 99.5, maxCommissionPct: 5.0 }
    }
  },
  {
    name: 'Solana Staking Authorization PDA Integration Test',
    description: 'Verifies the Solana transaction compiler compiles structure-compatible Solana serialized binary payloads using native hot-staking PDAs.',
    expectedResult: 'success',
    expectedAction: 'redelegate',
    delegatorAddress: 'solana_user_pda_staking_authority_pubkey',
    context: {
      chain: 'solana',
      balances: { masterWallet: 250, ephemeralGasWallet: 0.05 },
      activeValidator: {
        address: 'solana_active_val_vote_account_pubkey',
        name: 'Low Uptime Solana Val',
        uptimePct: 97.5, // Trigger redelegation!
        commissionPct: 4.0
      },
      candidateValidators: [
        {
          address: 'solana_approved_val_A_vote_account_pubkey',
          name: 'Solana High Uptime A',
          uptimePct: 99.9,
          commissionPct: 2.0,
          votingPowerPct: 1.0,
          isCustodialOrPool: false
        }
      ],
      slippagePct: 0.05,
      networkRules: { minUptimePct: 99.0, maxCommissionPct: 5.0 }
    }
  },
  {
    name: 'Ethereum Lido ERC-7579 Session Key Integration Test',
    description: 'Verifies the Ethereum transaction compiler compiles ABI-compliant calldata (selector 0xa6319a00 + padded address) for Lido smart account deposits.',
    expectedResult: 'success',
    expectedAction: 'redelegate',
    delegatorAddress: '0x1234567890123456789012345678901234567890', // User eth delegator address
    context: {
      chain: 'ethereum',
      balances: { masterWallet: 50, ephemeralGasWallet: 0.02 },
      activeValidator: {
        address: '0xoldlidooperatoraddress...',
        name: 'Lido Node Operator Old',
        uptimePct: 98.0, // Trigger redelegate!
        commissionPct: 5.0
      },
      candidateValidators: [
        {
          address: '0xae7ab96520de3a18e5e111b5eaab095312d7fe84', // Lido Staking Contract Address
          name: 'Lido Staking Contract',
          uptimePct: 99.9,
          commissionPct: 4.0,
          votingPowerPct: 12.0,
          isCustodialOrPool: false
        }
      ],
      slippagePct: 0.02,
      networkRules: { minUptimePct: 99.0, maxCommissionPct: 6.0 }
    }
  }
];
