import { TelemetryContext, StakingRecommendation } from './types';

/**
 * Simulates a local, quantized 3B LLM running inside the device's native runtime.
 * In a real mobile app, this calls llama.cpp or Android AICore. Here, it processes
 * the context to simulate exact GBNF-constrained JSON outputs.
 * 
 * Supports flag injection for simulating model failures, hallucinations, or attacks.
 */
export class MockLlmEngine {
  /**
   * Run local inference on device.
   */
  public static async executeLocalInference(
    context: TelemetryContext,
    simulationOverride?: 'hallucinate_illegal_transfer' | 'hallucinate_pooling_target'
  ): Promise<string> {
    // 1. Simulating logic matching the prompt builder expectations
    const active = context.activeValidator;
    const rules = context.networkRules;
    
    let recommendation: StakingRecommendation;

    if (simulationOverride === 'hallucinate_illegal_transfer') {
      // Simulate a compromised or hallucinating LLM that attempts to inject a wallet transfer
      return JSON.stringify({
        action: 'transfer_assets', // Illegal action
        chain: context.chain,
        target_validator: 'cosmos1attackerwalletaddress...', // Attacker address
        allocation_pct: 100
      });
    }

    if (simulationOverride === 'hallucinate_pooling_target') {
      // Simulate an LLM recommending a redelegation to an unapproved custodial pool contract
      const custodialPool = context.candidateValidators.find(v => v.isCustodialOrPool);
      recommendation = {
        action: 'redelegate',
        chain: context.chain,
        source_validator: active.address,
        target_validator: custodialPool ? custodialPool.address : 'invalid_pool',
        allocation_pct: 100
      };
      return JSON.stringify(recommendation);
    }

    // Standard business rules matching on-chain prompt policy
    const isUptimeViolation = active.uptimePct < rules.minUptimePct;
    const isCommissionViolation = active.commissionPct > rules.maxCommissionPct;

    if (isUptimeViolation || isCommissionViolation) {
      // Find the best non-custodial validator (lowest fee, highest uptime)
      const approvedCandidates = context.candidateValidators
        .filter(v => !v.isCustodialOrPool)
        .sort((a, b) => {
          if (a.commissionPct !== b.commissionPct) {
            return a.commissionPct - b.commissionPct; // Lower commission first
          }
          return b.uptimePct - a.uptimePct; // Higher uptime second
        });

      if (approvedCandidates.length > 0) {
        recommendation = {
          action: 'redelegate',
          chain: context.chain,
          source_validator: active.address,
          target_validator: approvedCandidates[0].address,
          allocation_pct: 100
        };
      } else {
        recommendation = { action: 'hold', chain: context.chain, allocation_pct: 0 };
      }
    } else {
      recommendation = {
        action: 'hold',
        chain: context.chain,
        allocation_pct: 0
      };
    }

    // Returns a raw string mimicking on-device Llama.cpp GBNF output
    return JSON.stringify(recommendation);
  }
}
