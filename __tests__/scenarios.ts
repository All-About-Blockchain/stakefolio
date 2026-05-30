import { TelemetryContext, RegulatoryConfig } from '../app/lib/agent/types';

// Approved public validator whitelist for testing (Canada & EU compliance whitelisting)
export const TEST_VALIDATOR_WHITELIST = new Set<string>([
  'cosmosvaloper_approved_1',
  'cosmosvaloper_approved_2',
  'solana_approved_val_A',
  'solana_approved_val_B',
  'eth_approved_LST_contract'
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
    address: 'cosmosvaloper_approved_1',
    name: 'Safe Staking Inc',
    uptimePct: 99.9,
    commissionPct: 3.0,
    votingPowerPct: 1.1,
    isCustodialOrPool: false
  },
  {
    address: 'cosmosvaloper_approved_2',
    name: 'EcoCosmos Node',
    uptimePct: 99.8,
    commissionPct: 2.5,
    votingPowerPct: 0.8,
    isCustodialOrPool: false
  },
  {
    address: 'cosmosvaloper_pool_unapproved',
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
    context: {
      chain: 'cosmos',
      balances: { masterWallet: 100, ephemeralGasWallet: 0.2 },
      activeValidator: {
        address: 'cosmosvaloper_rugger',
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
    context: {
      chain: 'cosmos',
      balances: { masterWallet: 150, ephemeralGasWallet: 0.3 },
      activeValidator: {
        address: 'cosmosvaloper_offline',
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
    context: {
      chain: 'cosmos',
      balances: { masterWallet: 50, ephemeralGasWallet: 0.1 },
      activeValidator: {
        address: 'cosmosvaloper_approved_1',
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
    context: {
      chain: 'cosmos',
      balances: { masterWallet: 100, ephemeralGasWallet: 0.2 },
      activeValidator: {
        address: 'cosmosvaloper_offline',
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
    context: {
      chain: 'cosmos',
      balances: { masterWallet: 100, ephemeralGasWallet: 0.2 },
      activeValidator: {
        address: 'cosmosvaloper_offline',
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
    context: {
      chain: 'cosmos',
      balances: { masterWallet: 100, ephemeralGasWallet: 0.2 },
      activeValidator: {
        address: 'cosmosvaloper_offline',
        name: 'Offline Node',
        uptimePct: 98.2, // Offline
        commissionPct: 3.0
      },
      candidateValidators: BASE_CANDIDATE_VALIDATORS,
      slippagePct: 2.2, // Slippage too high! (Limit is 0.5%)
      networkRules: { minUptimePct: 99.5, maxCommissionPct: 5.0 }
    }
  }
];
