import { TelemetryContext } from './types';

/**
 * Compiles telemetry metrics into a highly constrained Markdown block
 * to feed into the local, quantized on-device LLM model.
 */
export function compilePromptContext(context: TelemetryContext): string {
  const candidatesStr = context.candidateValidators
    .map(
      (v) =>
        `- Name: ${v.name} | Address: ${v.address} | Uptime: ${v.uptimePct}% | Commission: ${v.commissionPct}% | VP: ${v.votingPowerPct}% | Pool/Custodial: ${v.isCustodialOrPool ? 'YES' : 'NO'}`
    )
    .join('\n');

  return `
# TELEMETRY CONTEXT
- Chain: ${context.chain.toUpperCase()}
- Current Slippage: ${context.slippagePct}%
- Balances:
  * Master Wallet: ${context.balances.masterWallet} units
  * Ephemeral Gas Wallet: ${context.balances.ephemeralGasWallet} units
- Active Staked Validator:
  * Name: ${context.activeValidator.name}
  * Address: ${context.activeValidator.address}
  * Uptime: ${context.activeValidator.uptimePct}%
  * Commission: ${context.activeValidator.commissionPct}%
- Active Staking Policies:
  * Trigger redelegation if active validator uptime < ${context.networkRules.minUptimePct}%
  * Trigger redelegation if active validator commission > ${context.networkRules.maxCommissionPct}%

# CANDIDATE VALIDATORS FOR DELEGATION
${candidatesStr}
`.trim();
}

/**
 * Builds the hardened system instruction that locks the model into an
 * analytical JSON compiler role.
 */
export function compileSystemInstructions(): string {
  return `
You are a deterministic, localized AI asset optimizer. Your sole function is to read the provided TELEMETRY CONTEXT and candidate validator lists, and output a single JSON block representing the optimal staking action.

Guidelines:
1. Compare the Active Staked Validator metrics against the Staking Policies.
2. If policies are violated, redelegate to the candidate validator with the lowest commission and highest uptime that is NOT a pool or custodial entity (Pool/Custodial: NO).
3. If no policies are violated, return action "hold".
4. You must output strictly a JSON block. No introductions, no markdown styling, no conversational filler, and no explanations.

Expected Output Schema:
{
  "action": "redelegate" | "harvest_compound" | "hold",
  "chain": "cosmos" | "solana" | "ethereum",
  "source_validator": string (address of current active validator),
  "target_validator": string (address of target validator if redelegating, else null),
  "allocation_pct": number (0 to 100)
}
`.trim();
}
